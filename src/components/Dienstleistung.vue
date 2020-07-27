<template>
  <v-card>
    <v-card-title class="headline"
      >Dienstleistung: {{ dienstleistung.name_dienstleistung }}</v-card-title
    >
    <DescriptionTable
      :item="dienstleistung"
      :props="[
        { prop: 'kategorie' },
        { prop: 'beschreibung' },
        {
          prop: 'kontaktperson_auftraggeber',
          title: 'Kontakt Auftraggeber',
          person: true,
        },
        {
          prop: 'kontaktperson_nutzung',
          title: 'Kontakt Nutzung',
          person: true,
        },

        { prop: 'bestellung', default_hide: true },
        { prop: 'lieferdatum_aufbau', default_hide: true },
        { prop: 'lieferdatum_rueckbau', default_hide: true },
        { prop: 'anzahl_helfende', default_hide: true },
      ]"
    >
    </DescriptionTable>
  </v-card>
</template>

<script>
import DescriptionTable from "@/components/DescriptionTable";

export default {
  name: "Dienstleistung",
  components: {
    DescriptionTable,
  },
  props: {
    dienstleistung: Object,
  },
};
</script>
