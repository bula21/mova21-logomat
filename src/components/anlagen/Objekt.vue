<template>
  <v-card>
    <v-card-title class="primary white--text">
      Objekt: {{ objekt.objektname }}
      <v-spacer />
      <DirectusAdminLink :id="objekt.id" type="objekt" />
    </v-card-title>

    <DescriptionTable
      :item="objekt"
      :props="[
        { prop: 'objekt_id' },
        { prop: 'objektstatus' },
        { prop: 'typisierung', title: 'Typ' },
        { prop: 'masse', title: 'Masse [m x m]' },
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
        { prop: 'preis', title: 'Preisschätzung' },
        { prop: 'konto', default_hide: true },
        { prop: 'konto_bemerkung', default_hide: true },

        { prop: 'bau_durch', default_hide: true },
        { prop: 'zelt_boden', default_hide: true },
        {
          prop: 'zelt_boden_masse',
          default_hide: true,
          title: 'Zelt Boden Masse [m x m]',
        },
        { prop: 'zelt_rampe', default_hide: true },
        { prop: 'buehne_typ', title: 'Bühne Type', default_hide: true },
        { prop: 'zaun_typ', default_hide: true },
        { prop: 'bodenschutz_typ', default_hide: true },

        { prop: 'benoetigt_von', default_hide: true },
        { prop: 'benoetigt_bis', default_hide: true },

        { prop: 'licht', default_hide: true },
        { prop: 'stunden_aufbau', default_hide: true },
        { prop: 'anzahl_helfende_aufbau', default_hide: true },
        { prop: 'stunden_abbau', default_hide: true },
        { prop: 'anzahl_helfende_abbau', default_hide: true },
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
import DirectusAdminLink from "@/components/DirectusAdminLink";

export default {
  name: "Objekt",
  props: {
    objekt: Object,
  },
  components: {
    AvantiLink,
    DescriptionTable,
    DirectusAdminLink,
  },
};
</script>
