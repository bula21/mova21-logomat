<template>
  <div>
    <v-card-title class="secondary">
      Projekt: {{ title }}
      <v-spacer />
      <DirectusAdminLink :id="projekt.id" type="projekt" />
    </v-card-title>
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
          person: true,
        },
        { prop: 'ressort_betrieb' },
        { prop: 'ordner_link' },

        { prop: 'prioritaet' },
      ]"
    >
      <template v-slot:prop.avanti_seite="{ item }">
        <AvantiLink :item="item" />
      </template>
      <template v-slot:prop.ordner_link="{ item }">
        <OrdnerLink :item="item" />
      </template>
      <template v-slot:prop.ressort_betrieb="{ item }">
        {{ item.ressort_name }}
      </template>
    </DescriptionTable>
  </div>
</template>

<script>
import DescriptionTable from "@/components/DescriptionTable";
import AvantiLink from "@/components/anlagen/AvantiLink";
import OrdnerLink from "@/components/anlagen/OrdnerLink";
import DirectusAdminLink from "@/components/DirectusAdminLink";

export default {
  name: "Projekt",
  props: {
    projekt: Object,
    id: Number,
    title: String,
  },
  components: { DescriptionTable, AvantiLink, OrdnerLink, DirectusAdminLink },
};
</script>
