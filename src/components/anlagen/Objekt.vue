<template>
  <v-card>
    <v-card-title class="headline"
      >Objekt: {{ objekt.objektname }}</v-card-title
    >
    <DescriptionTable
      :item="objekt"
      :props="[
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

        { prop: 'planung', default_hide: true },

        { prop: 'bau_durch', default_hide: true },
        { prop: 'zelt_boden', default_hide: true },
        { prop: 'zelt_rampe', default_hide: true },
        { prop: 'buehne_typ', title: 'Bühne Type', default_hide: true },
        { prop: 'zaun_typ', default_hide: true },
        { prop: 'bodenschutz_typ', default_hide: true },

        { prop: 'benoetigt_von', default_hide: true },
        { prop: 'datum_aufbau', default_hide: true },
        { prop: 'startzeitpunkt_aufbau', default_hide: true },
        { prop: 'stunden_aufbau', default_hide: true },
        { prop: 'anzahl_helfende_aufbau', default_hide: true },

        { prop: 'benoetigt_bis', default_hide: true },
        { prop: 'datum_rueckbau', default_hide: true },
        { prop: 'startzeitpunkt_abbau', default_hide: true },
        { prop: 'stunden_abbau', default_hide: true },
        { prop: 'anzahl_helfende_abbau', default_hide: true },

        { prop: 'name_lieferant', default_hide: true },
        { prop: 'kontakt_lieferant', default_hide: true },

        { prop: 'vum', default_hide: true },

        { prop: 'preis', default_hide: true },
        { prop: 'kostenstelle', default_hide: true },
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
};
</script>
