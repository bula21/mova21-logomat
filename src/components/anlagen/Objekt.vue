<template>
  <v-card>
    <v-card-title class="primary white--text">
      Objekt: {{ objekt.objektname }}
      <v-spacer />
      <v-btn icon v-bind="attrs" @click="genereateLOGdbLink(objekt.id)">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-card-title>

    <DescriptionTable
      :item="objekt"
      :props="[
        { prop: 'id' },
        { prop: 'objektstatus' },
        { prop: 'typisierung', title: 'Typ' },
        { prop: 'masse', title: 'Masse' },
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
        { prop: 'preis', default_hide: true },

        { prop: 'bau_durch', default_hide: true },
        { prop: 'zelt_boden', default_hide: true },
        { prop: 'zelt_rampe', default_hide: true },
        { prop: 'buehne_typ', title: 'Bühne Type', default_hide: true },
        { prop: 'zaun_typ', default_hide: true },
        { prop: 'bodenschutz_typ', default_hide: true },

        { prop: 'benoetigt_von', default_hide: true },
        { prop: 'benoetigt_bis', default_hide: true },

        { prop: 'vum', default_hide: true },

        { prop: 'licht', default_hide: true },

        { prop: 'avanti_seite', default_hide: true },
      ]"
    >
      <template v-slot:prop.avanti_seite="{ item }">
        <AvantiLink :item="item" />
      </template>
    </DescriptionTable>
  </v-card>
</template>

<script>
import AvantiLink from "@/components/anlagen/AvantiLink";
import DescriptionTable from "@/components/DescriptionTable";

export default {
  name: "Objekt",
  props: {
    objekt: Object,
  },
  components: {
    AvantiLink,
    DescriptionTable,
  },
  methods: {
    genereateLOGdbLink(id) {
      const linkToLOGdb = "https://log.bula21.ch/admin/#/_/collections/objekt/";
      let link;
      link = linkToLOGdb + id;
      window.open(link);
    },
  },
};
</script>
