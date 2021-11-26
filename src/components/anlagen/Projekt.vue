<template>
  <div>
    <v-card-title class="secondary">
      Projekt: {{ title }}
      <v-spacer />
      <v-btn icon v-bind="attrs" @click="genereateLOGdbLink(projekt.id)">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
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
        { prop: 'beginn_nutzung' },
        { prop: 'ende_nutzung' },

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

export default {
  name: "Projekt",
  props: {
    projekt: Object,
    id: Number,
    title: String,
  },
  components: { DescriptionTable, AvantiLink, OrdnerLink },
  methods: {
    genereateLOGdbLink(id) {
      const linkToLOGdb =
        "https://log.bula21.ch/admin/#/_/collections/projekt/";
      let link;
      link = linkToLOGdb + id;
      window.open(link);
    },
  },
};
</script>
