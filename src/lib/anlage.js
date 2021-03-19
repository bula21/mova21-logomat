import { apiAuthenticated, filter } from "@/lib/api";
import { joinInPlace } from "@/lib/join";

function addFieldsInPlace(items, collectionName, fields) {
  for (const item of items) {
    for (const [fieldName, fieldValue] of Object.entries(item)) {
      if (fieldValue === null) {
        continue;
      }
      const choices = fields[collectionName][fieldName]?.options?.choices;
      if (choices !== undefined && choices[fieldValue] !== undefined) {
        item[fieldName] = choices[fieldValue];
      }
    }
  }
}

function addVariadicIdsInPlace(collections) {
  for (const name of Object.keys(collections)) {
    for (const item of collections[name]) {
      item["id_"] = `${name}:${item.id}`;
    }
  }
}

async function loadDienstleistungen(filterQuery, fields) {
  const [
    abfallentsorgung,
    abwasser,
    strom,
    telekom,
    wasser,
  ] = await Promise.all([
    apiAuthenticated("/items/abfallentsorgung", filterQuery),
    apiAuthenticated("/items/abwasser", filterQuery),
    apiAuthenticated("/items/strom", filterQuery),
    apiAuthenticated("/items/telekom", filterQuery),
    apiAuthenticated("/items/wasser", filterQuery),
  ]);

  addFieldsInPlace(abfallentsorgung, "abfallentsorgung", fields);
  addFieldsInPlace(abwasser, "abwasser", fields);
  addFieldsInPlace(strom, "strom", fields);
  addFieldsInPlace(telekom, "telekom", fields);
  addFieldsInPlace(wasser, "wasser", fields);

  addVariadicIdsInPlace({ abfallentsorgung, abwasser, strom, telekom, wasser });

  return abfallentsorgung.concat(abwasser, strom, telekom, wasser);
}

export async function loadAnlageData(anlageId, users, fields) {
  // ressorts, projekte
  const [ressorts, projekte] = await Promise.all([
    apiAuthenticated("/items/ressort"),
    apiAuthenticated("/items/projekt", filter("anlage", "=", anlageId)),
  ]);
  joinInPlace(projekte, ressorts, "ressort_betrieb");
  joinInPlace(projekte, users, "auftraggeber");
  joinInPlace(projekte, users, "verantwortliche_person_betrieb");
  addFieldsInPlace(projekte, "projekt", fields);

  const projekteIds = projekte.map((p) => p.id);

  // objekte
  const objekte = await apiAuthenticated(
    "/items/objekt",
    filter("projekt", "in", projekteIds)
  );
  joinInPlace(objekte, users, "kontaktperson_nutzung");
  joinInPlace(objekte, users, "kontaktperson_auftraggeber");
  joinInPlace(objekte, users, "planung");
  addFieldsInPlace(objekte, "objekt", fields);

  // dienstleistungen
  const objektIds = objekte.map((o) => o.id);
  const dienstleistungenObjekte = await loadDienstleistungen(
    filter("objekt", "in", objektIds),
    fields
  );
  const dienstleistungenProjekte = await loadDienstleistungen(
    filter("projekt", "in", projekteIds),
    fields
  );

  // merge dienstleistungen from projekte
  const dienstleistungenProjekteids = dienstleistungenProjekte.map(
    (p) => p.id_
  );
  for (const d of dienstleistungenObjekte) {
    if (dienstleistungenProjekteids.indexOf(d.id_) === -1) {
      dienstleistungenProjekte.push(d);
    }
  }

  joinInPlace(dienstleistungenProjekte, users, "kontaktperson_nutzung");
  joinInPlace(dienstleistungenProjekte, users, "kontaktperson_auftraggeber");

  return {
    objekte: Object.freeze(objekte),
    projekte: Object.freeze(projekte),
    dienstleistungen: Object.freeze(dienstleistungenProjekte),
  };
}
