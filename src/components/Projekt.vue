<template>
  <v-card>
    <v-card-title class="headline"
      >Projekt: {{ projekt.projektname }}</v-card-title
    >
    <DescriptionTable
      :item="projekt"
      :props="[
        { prop: 'beschreibung' },
        {
          prop: 'auftraggeber',
          title: 'Kontakt Auftraggeber',
          person: true,
        },
        {
          prop: 'verantwortliche_person_betrieb',
          person: true,
        },
        { prop: 'beginn_nutzung' },
        { prop: 'ende_nutzung' },
        { prop: 'abnahmeart' },
        { prop: 'abnahmedatum' },
        { prop: 'ressort_betrieb' },
        { prop: 'beginn_nutzung_zeit' },
        { prop: 'ende_nutzung_zeit' },
      ]"
    >
      <template v-slot:prop.avanti_seite="{ item }">
        <AvantiLink :item="item" />
      </template>
    </DescriptionTable>
  </v-card>
</template>

<script>
import DescriptionTable from "@/components/DescriptionTable";

export default {
  name: "Projekt",
  props: {
    projekt: Object,
  },
  components: { DescriptionTable },
};
</script>
