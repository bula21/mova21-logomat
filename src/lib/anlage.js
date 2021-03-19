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

  // const objektIds = objekte.map((o) => o.id);

  // // dienstleistungen
  // const dienstleistungenProjekte = await apiAuthenticated(
  //   "/items/dienstleistung",
  //   filter("projekte", "in", projekteIds)
  // );
  // const dienstleistungenObjekte = await apiAuthenticated(
  //   "/items/dienstleistung",
  //   filter("objekte", "in", objektIds)
  // );
  // const dienstleistungenProjekteids = dienstleistungenProjekte.map(
  //   (p) => p.id
  // );
  // // merge dienstleistungen from projekte
  // for (const d of dienstleistungenObjekte) {
  //   if (dienstleistungenProjekteids.indexOf(d.id) === -1) {
  //     dienstleistungenProjekte.push(d);
  //   }
  // }
  // joinInPlace(
  //   dienstleistungenProjekte,
  //   this.users,
  //   "kontaktperson_nutzung"
  // );
  // joinInPlace(
  //   dienstleistungenProjekte,
  //   this.users,
  //   "kontaktperson_auftraggeber"
  // );
  // this.addFieldsInPlace(dienstleistungenProjekte, "dienstleistung");
  // this.dienstleistungen = Object.freeze(dienstleistungenProjekte);

  return {
    objekte: Object.freeze(objekte),
    projekte: Object.freeze(projekte),
    dienstleistungen: [],
  };
}
