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
        { prop: 'bestellung' },
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
        { prop: 'lieferdatum_aufbau' },
        { prop: 'lieferdatum_rueckbau' },
        { prop: 'anzahl_helfende' },
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
