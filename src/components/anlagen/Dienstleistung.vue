<template>
  <v-card>
    <v-card-title class="headline"
      >Dienstleistung: {{ nicifyTitle(dienstleistung.type_) }}
      </v-card-title
    >
    <DescriptionTable
      :item="dienstleistung"
      :props="colsForType(dienstleistung.type_)"
    >
      <template v-slot:prop.geraete="{ item }">
        <Geraet :geraete="item" />
      </template>

      <template v-slot:prop.zusaetzliches_material="{ item }">
        <ZusaetzlichesMaterial :zusaetzliches_material="item" />
      </template>
    </DescriptionTable>
  </v-card>
</template>

<script>
import DescriptionTable from "@/components/DescriptionTable";
import { nicifyTitle } from "@/lib/util";
import Geraet from "@/components/anlagen/Geraet";
import ZusaetzlichesMaterial from "@/components/anlagen/ZusaetzlichesMaterial";

export default {
  name: "Dienstleistung",
  components: {
    Geraet,
    DescriptionTable,
    ZusaetzlichesMaterial,
  },
  data: () => ({
    commonCols: Object.freeze([
      { prop: 'id' , title: "Bestellung ID"},
      // { prop: 'id_' },
      // { prop: 'type_' },
      // { prop: "owner", title: "Besitzer", person: true },
      // { prop: "created_on", title: "Erstellt", default_hide: true },
      { prop: "status" },
      // { prop: "benoetigt_von" },
      // { prop: "benoetigt_bis" },
      // { prop: "bemerkung_bestellung" },
      { prop: "bemerkungen_lieferung" },
    ]),
    abfallentsorgungCols: Object.freeze([
      // { prop: "pet" },
      // { prop: "glas" },
      // { prop: "begruendung_entsorgung" },
      // { prop: "bemerkung_abfall" },
      // { prop: "holz" },
      // { prop: "anderer_abfall" },
      // { prop: "bioabfaelle" },
      // { prop: "karton_papier" },
      // { prop: "hauskehrricht" },
    ]),
    abwasserCols: Object.freeze([
      { prop: "geraete", default_hide: true },
      // { prop: "schmutzwasser" },
      // { prop: "bemerkung_abfall" },
      // { prop: "geraete" },
      // { prop: "begruendung_entsorgung" },
    ]),
    stromCols: Object.freeze([
      { prop: "gesamtleistung" },
      { prop: "stromherkunft", default_hide: true },
      { prop: "anschlusstyp", default_hide: true },
      { prop: "verteilertyp", default_hide: true },
      { prop: "zusaetzliches_material", default_hide: true },
      { prop: "geraete", default_hide: true },
    ]),
    telekomCols: Object.freeze([
      { prop: "netzwerkstandort" },
      { prop: "epo_1gbps_no_poe", default_hide: true },
      { prop: "epo_1gbps_poe", default_hide: true },
      { prop: "epo_1gbps_poe_wlan", default_hide: true },
      { prop: "epo_1gbps_poe_phone", default_hide: true },
      { prop: "10gbps_no_poe", default_hide: true },
      { prop: "drucker", default_hide: true },
      { prop: "switch", default_hide: true },
      { prop: "natel", default_hide: true },
      { prop: "4g_hotspot", default_hide: true },
      { prop: "geraete", default_hide: true },
    ]),
    wasserCols: Object.freeze([{ prop: "geraete" }]),
  }),
  props: {
    dienstleistung: Object,
  },
  methods: {
    nicifyTitle,
    colsForType(type) {
      const key = `${type}Cols`;
      return this.commonCols.concat(this[key]);
    },
  },
};
</script>
