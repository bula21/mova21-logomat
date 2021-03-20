<template>
  <v-card>
    <v-card-title class="headline"
      >Dienstleistung: {{ capitalCase(dienstleistung.type_) }}</v-card-title
    >
    <DescriptionTable
      :item="dienstleistung"
      :props="[
        // { prop: 'id' },
        // { prop: 'id_' },
        // { prop: 'type_' },
        { prop: 'owner', title: 'Besitzer', person: true },
        { prop: 'created_on', title: 'Erstellt', default_hide: true },
        { prop: 'status' },
        { prop: 'benoetigt_von', title: 'Benötigt von' },
        { prop: 'benoetigt_bis', title: 'Benötigt bis' },
        { prop: 'bemerkung_bestellung' },
        { prop: 'bemerkungen_lieferung' },
        { prop: 'location', title: 'Ort' },
        { prop: 'planraster' },
        { prop: 'kontakt' },
        { prop: 'bestellung_id', title: 'Bestellung', default_hide: true },
        { prop: 'projekt', default_hide: true },
        { prop: 'objekt', default_hide: true },
      ]"
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
  props: {
    dienstleistung: Object,
  },
  methods: {
    capitalCase,
  },
};
</script>
