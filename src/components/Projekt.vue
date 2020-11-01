<template>
  <v-card>
    <v-card-title class="headline"
      >Projekt: {{ projekt.projektname }}</v-card-title
    >
    <DescriptionTable
      :item="projekt"
      :props="[
        { prop: 'status' },
        { prop: 'beschreibung' },
        {
          prop: 'verantwortliche_person_betrieb',
          person: true,
        },
        {
          prop: 'auftraggeber',
          title: 'Kontakt Auftraggeber',
          person: true
        },
        { prop: 'ressort_betrieb' },
        { prop: 'beginn_nutzung' },
        { prop: 'ende_nutzung' },

        { prop: 'beginn_nutzung_zeit', default_hide: true},
        { prop: 'ende_nutzung_zeit', default_hide: true},
        { prop: 'abnahmeart', default_hide: true },
        { prop: 'abnahmedatum', default_hide: true },
      ]"
    >
      <template v-slot:prop.avanti_seite="{ item }">
        <AvantiLink :item="item" />
      </template>
      <template v-slot:prop.ressort_betrieb="{ item }">
        {{ item.ressort_name }}
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
