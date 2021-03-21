<template>
  <div class="pa-4 pb-0">
    <portal to="topnav-title">Anlagen / {{ anlage.anlagenname }}</portal>

    <portal to="sidenav-extended">
      <v-divider />

      <v-list dense>
        <v-list-item
          ripple
          style="cursor: pointer"
          @click="scrollTo('top')"
          class="v-list-item--active"
        >
          <v-list-item-icon>
            <v-icon>mdi-castle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              Anlage: {{ anlage.anlagenname }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-for="projekt in projekte"
          :key="projekt.id"
          ripple
          style="cursor: pointer"
          @click="scrollTo(`projekt-${projekt.id}`)"
        >
          <v-list-item-icon>
            <v-icon>mdi-home-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              Projekt: {{ stripAnlageFromTitle(projekt.projektname) }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </portal>

    <!-- Anlage -->
    <v-card elevation="6" class="mb-4">
      <v-card-title class="primary darken-1 white--text"
        >Anlage: {{ anlage.anlagenname }}
      </v-card-title>
      <DescriptionTable
        :item="anlage"
        :props="[
          { prop: 'anlagen_id' },
          {
            prop: 'kontaktperson',
            person: true,
          },
          { prop: 'beschreibung' },
          { prop: 'standort' },
          { prop: 'standortcode' },
          { prop: 'avanti_link', title: 'Link zu Avanti' },
        ]"
      >
        <template v-slot:prop.avanti_link="{ item }">
          <AvantiLink :item="item" />
        </template>
      </DescriptionTable>
    </v-card>

    <!-- Loading Spinner -->
    <v-layout justify-center v-if="!loaded" class="ma-4">
      <br />
      <br />
      <v-progress-circular indeterminate size="64" />
    </v-layout>

    <!-- Projekte -->
    <v-card
      v-for="projekt in projekte"
      v-bind:key="projekt.id"
      :ref="`projekt-${projekt.id}`"
      elevation="6"
      class="mb-4"
    >
      <!-- Projekt -->
      <Projekt
        :projekt="projekt"
        :title="stripAnlageFromTitle(projekt.projektname)"
      />
      <v-divider />

      <!-- Objekte -->
      <v-card-text>
        <v-data-iterator
          :items="filterByProp(objekte, 'projekt', projekt.id)"
          :disable-pagination="true"
          hide-default-footer
        >
          <template v-slot:no-data>
            <v-alert type="warning">Keine Objekte im Projekt</v-alert>
          </template>
          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="objekt in props.items"
                :key="objekt.id"
                cols="12"
                sm="12"
                md="6"
                lg="6"
              >
                <Objekt :objekt="objekt" />
              </v-col>
              <template v-for="objekt in props.items">
                <v-col
                  v-for="dienstleistung in filterByProp(
                    dienstleistungen,
                    'objekt',
                    objekt.id
                  )"
                  :key="dienstleistung.id"
                  cols="12"
                  sm="12"
                  md="6"
                  lg="6"
                >
                  <Dienstleistung :dienstleistung="dienstleistung" />
                </v-col>
              </template>
            </v-row>
          </template>
        </v-data-iterator>
      </v-card-text>
      <v-divider />

      <!-- Dienstleistungen -->
      <v-card-text
        v-if="filterByProp(dienstleistungen, 'projekt', projekt.id).length > 0"
      >
        <v-data-iterator
          :items="filterByProp(dienstleistungen, 'projekt', projekt.id)"
          :disable-pagination="true"
          hide-default-footer
        >
          <template v-slot:no-data>
            <div />
          </template>
          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="item in props.items"
                :key="item.id_"
                cols="12"
                sm="12"
                md="6"
                lg="6"
              >
                <Dienstleistung :dienstleistung="item" />
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Dienstleistung from "@/components/anlagen/Dienstleistung";
import DescriptionTable from "@/components/DescriptionTable";
import Objekt from "@/components/anlagen/Objekt";
import Projekt from "@/components/anlagen/Projekt";
import AvantiLink from "@/components/anlagen/AvantiLink";

import { ApiError } from "@/lib/api";
import { mapState } from "vuex";
import { loadAnlageData } from "@/lib/anlage";
import { stripTitle } from "@/lib/util";

export default {
  name: "AnlageDetail",
  components: {
    Dienstleistung,
    Projekt,
    DescriptionTable,
    Objekt,
    AvantiLink,
  },
  computed: {
    ...mapState({
      anlagen: "anlagen",
      users: "users",
      fields: "fields",
    }),
  },
  data: () => ({
    objekte: [],
    projekte: [],
    dienstleistungen: [],
    anlage: {},
    loaded: false,
  }),
  methods: {
    stripAnlageFromTitle(title) {
      return stripTitle(title, this.anlage.anlagenname);
    },
    scrollTo(selector) {
      const target = this.$refs[selector];
      if (Array.isArray(target)) {
        this.$vuetify.goTo(target[0], { duration: 0 });
      } else {
        this.$vuetify.goTo(target, { duration: 0 });
      }
    },
    filterByProp: (objects, propName, propValue) =>
      objects.filter((obj) => obj[propName] === propValue),
  },
  async created() {
    // find anlage
    this.anlage = this.anlagen.find(
      (anlage) => anlage.anlagen_id === this.$route.params.id
    );

    // get data
    try {
      const { projekte, objekte, dienstleistungen } = await loadAnlageData(
        this.anlage.id,
        this.users,
        this.fields
      );
      this.projekte = projekte;
      this.objekte = objekte;
      this.dienstleistungen = dienstleistungen;
    } catch (err) {
      if (err instanceof ApiError) {
        this.$emit("api-error", err.userMessage());
      } else {
        throw err;
      }
    }

    this.loaded = true;
  },
};
</script>
