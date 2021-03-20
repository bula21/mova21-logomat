<template>
  <v-card>
    <v-card-title class="headline"
      >Dienstleistung: {{ capitalCase(dienstleistung.type_) }} #{{
        dienstleistung.id
      }}</v-card-title
    >
    <DescriptionTable
      :item="dienstleistung"
      :props="colsForType(dienstleistung.type_)"
    >
    </DescriptionTable>
  </v-card>
</template>

<script>
import DescriptionTable from "@/components/DescriptionTable";
import { capitalCase } from "capital-case";

export default {
  name: "Dienstleistung",
  components: {
    DescriptionTable,
  },
  data: () => ({
    commonCols: Object.freeze([
      // { prop: 'id' },
      // { prop: 'id_' },
      // { prop: 'type_' },
      { prop: "owner", title: "Besitzer", person: true },
      { prop: "created_on", title: "Erstellt", default_hide: true },
      { prop: "status" },
      { prop: "benoetigt_von", title: "Benötigt von" },
      { prop: "benoetigt_bis", title: "Benötigt bis" },
      { prop: "bemerkung_bestellung" },
      { prop: "bemerkungen_lieferung" },
      { prop: "location", title: "Ort" },
      { prop: "planraster" },
      { prop: "kontakt" },
      { prop: "bestellung_id", title: "Bestellung", default_hide: true },
      { prop: "projekt", default_hide: true },
      { prop: "objekt", default_hide: true },
    ]),
    abfallentsorgungCols: Object.freeze([
      { prop: "pet" },
      { prop: "glas" },
      { prop: "begruendung_entsorgung" },
      { prop: "bemerkung_abfall" },
      { prop: "holz" },
      { prop: "anderer_abfall" },
      { prop: "bioabfaelle" },
      { prop: "karton_papier" },
      { prop: "hauskehrricht" },
    ]),
    abwasserCols: Object.freeze([
      { prop: "schmutzwasser" },
      { prop: "bemerkung_abfall" },
      { prop: "geraete" },
      { prop: "begruendung_entsorgung" },
    ]),
    stromCols: Object.freeze([
      { prop: "gesamtleistung" },
      { prop: "leistung_l2" },
      { prop: "leistung_l3" },
      { prop: "geraete" },
      { prop: "verteilernummer" },
      { prop: "zusaetzliches_material" },
      { prop: "stromherkunft" },
      { prop: "anschlusstyp" },
      { prop: "leistung_l1" },
      { prop: "verteilertyp" },
    ]),
    telekomCols: Object.freeze([
      { prop: "bemerkung_switch" },
      { prop: "geraete" },
      { prop: "switch" },
      { prop: "drucker" },
      { prop: "netzwerkstandort" },
      { prop: "epo_1gbps_poe" },
      { prop: "bemerkung_drucker" },
      { prop: "bemerkung_epo_1gbps_poe" },
      { prop: "natel" },
      { prop: "bemerkung_epo_1gbps_no_poe" },
      { prop: "bemerkung_epo_1gbps_wlan" },
      { prop: "epo_10gbps_no_poe" },
      { prop: "bemerkung_epo_1gbps_poe_phone" },
      { prop: "bemerkung_4g_hotspot" },
      { prop: "bemerkung_10gbps_no_poe" },
      { prop: "bemerkung_natel" },
      { prop: "epo_1gbps_no_poe" },
      { prop: "epo_1gbps_poe_wlan" },
      { prop: "epo_1gbps_poe_phone" },
      { prop: "4g_hotspot" },
    ]),
    wasserCols: Object.freeze([{ prop: "geraete" }]),
  }),
  props: {
    dienstleistung: Object,
  },
  methods: {
    capitalCase,
    colsForType(type) {
      const key = `${type}Cols`;
      return this.commonCols.concat(this[key]);
    },
  },
};
</script>
