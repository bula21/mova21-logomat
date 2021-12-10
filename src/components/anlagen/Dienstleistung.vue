<template>
  <v-card>
    <v-card-title class="accent white--text"
      >Dienstleistung: {{ nicifyTitle(dienstleistung.type_) }}
    </v-card-title>
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
import Geraet from "@/components/anlagen/Geraet";
import ZusaetzlichesMaterial from "@/components/anlagen/ZusaetzlichesMaterial";
import { nicifyTitle } from "@/lib/util";

export default {
  name: "Dienstleistung",
  components: {
    Geraet,
    DescriptionTable,
    ZusaetzlichesMaterial,
  },
  data: () => ({
    commonCols: Object.freeze([
      { prop: "id", title: "Bestellung ID" },
      { prop: "bemerkungen_lieferung" },
      { prop: "kontakt", title: "Besteller:in", default_hide: true },
      { prop: "location", default_hide: true },
      { prop: "preis", default_hide: true },
      { prop: "preis_bemerkung", default_hide: true },
    ]),
    abfallentsorgungCols: Object.freeze([]),
    abwasserCols: Object.freeze([{ prop: "geraete", default_hide: true }]),
    stromCols: Object.freeze([
      { prop: "gesamtleistung" },
      { prop: "anschlusstyp", default_hide: true },
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
