<template>
  <v-card>
    <v-card-title class="headline"
      >Objekt: {{ objekt.objektname }}</v-card-title
    >
    <DescriptionTable
      :item="objekt"
      :props="[
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
        { prop: 'planung' },

        { prop: 'typisierung', title: 'Typ' },
        { prop: 'bau_durch' },
        { prop: 'zelt_boden' },
        { prop: 'masse' },
        { prop: 'zelt_rampe' },
        { prop: 'buehne_typ', title: 'Bühne Type' },
        { prop: 'zaun_typ' },
        { prop: 'bodenschutz_typ' },
        { prop: 'objektstatus' },

        { prop: 'datum_aufbau' },
        { prop: 'startzeitpunkt_aufbau' },
        { prop: 'stunden_aufbau' },
        { prop: 'anzahl_helfende_aufbau' },

        { prop: 'datum_rueckbau' },
        { prop: 'startzeitpunkt_abbau' },
        { prop: 'stunden_abbau' },
        { prop: 'anzahl_helfende_abbau' },

        { prop: 'name_lieferant' },
        { prop: 'kontakt_lieferant' },

        { prop: 'vum' },

        { prop: 'avanti_seite' },
      ]"
    >
      <template v-slot:prop.avanti_seite="{ item }">
        <AvantiLink :item="item" />
      </template>
    </DescriptionTable>
  </v-card>
</template>

<script>
import AvantiLink from "@/components/AvantiLink";
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
