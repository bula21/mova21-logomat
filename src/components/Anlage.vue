<style>
#container {
  padding-top: 0;
}

.content.large {
  margin-left: 30%;
  padding-top: 20px;
}

.overview.large {
  border-right: solid 1px #ccc;
  height: 100%;
  position: fixed;
  width: 30%;
}
</style>

<template>
  <v-container fluid id="container">
    <v-row>
      <v-col
        :cols="12"
        lg="3"
        :class="{ large: $vuetify.breakpoint.lg, overview: true }"
      >
        <v-list dense>
          <v-list-item ripple style="cursor: pointer;" @click="scrollTo('top')">
            <v-list-item-icon>
              <v-icon>mdi-castle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                v-text="anlage.anlagenname"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-for="projekt in projekte"
            :key="projekt.id"
            ripple
            style="cursor: pointer;"
            @click="scrollTo(`projekt-${projekt.id}`)"
          >
            <v-list-item-icon>
              <v-icon>mdi-home-group</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                v-text="projekt.projektname"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col
        :cols="12"
        lg="9"
        :class="{ large: $vuetify.breakpoint.lg, content: true }"
      >
        <v-card ref="top">
          <DescriptionTable
            :item="anlage"
            :props="[
              {
                prop: 'kontaktperson',
                person: true,
              },
              { prop: 'beschreibung' },
            ]"
          >
          </DescriptionTable>
        </v-card>

        <br />
        <hr />
        <br />

        <div
          v-for="projekt in projekte"
          v-bind:key="projekt.id"
          :ref="`projekt-${projekt.id}`"
        >
          <Projekt :projekt="projekt"></Projekt>

          <br />

          <v-data-iterator
            :items="filterByProp(objekte, 'projekt', projekt.id)"
            hide-default-footer
          >
            <template v-slot:no-data>
              <v-alert color="#ffbbbb">
                Keine Objekte
              </v-alert>
            </template>
            <template v-slot:default="props">
              <v-row>
                <v-col
                  v-for="item in props.items"
                  :key="item.id"
                  cols="12"
                  sm="12"
                  md="6"
                  lg="6"
                >
                  <Objekt :objekt="item"></Objekt>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>

          <v-data-iterator
            :items="filterByProp(dienstleistungen, 'projekte', projekt.id)"
            hide-default-footer
          >
            <template v-slot:no-data
              ><v-alert color="#ffbbbb">
                Keine Dienstleistungen
              </v-alert></template
            >
            <template v-slot:default="props">
              <v-row>
                <v-col
                  v-for="item in props.items"
                  :key="item.id"
                  cols="12"
                  sm="12"
                  md="6"
                  lg="6"
                >
                  <Dienstleistung :dienstleistung="item"></Dienstleistung>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>

          <hr />
          <br />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { apiAuthenticated, ApiError, filter } from "@/lib/api.js";
import { joinInPlace } from "@/lib/join.js";
import Dienstleistung from "@/components/Dienstleistung";
import DescriptionTable from "@/components/DescriptionTable";
import Objekt from "@/components/Objekt";
import Projekt from "@/components/Projekt";

export default {
  name: "Anlage",
  components: {
    Dienstleistung,
    Projekt,
    DescriptionTable,
    Objekt,
  },
  props: {
    anlage: Object,
    users: Array,
  },
  data: () => ({
    objekte: [],
    projekte: [],
    dienstleistungen: [],
  }),
  methods: {
    scrollTo(selector) {
      const target = this.$refs[selector];
      if (Array.isArray(target)) {
        this.$vuetify.goTo(target[0]);
      } else {
        this.$vuetify.goTo(target);
      }
    },
    filterByProp: (objects, propName, propValue) =>
      objects.filter((obj) => obj[propName] === propValue),
    async fetchData() {
      try {
        const projekte = await apiAuthenticated(
          "/items/projekt",
          filter("anlage", "=", this.anlage.id)
        );
        joinInPlace(projekte, this.users, "auftraggeber");
        joinInPlace(projekte, this.users, "verantwortliche_person_betrieb");
        this.projekte = Object.freeze(projekte);

        const projekteIds = projekte.map((p) => p.id);

        const objekte = await apiAuthenticated(
          "/items/objekt",
          filter("projekt", "in", projekteIds)
        );
        joinInPlace(objekte, this.users, "kontaktperson_nutzung");
        joinInPlace(objekte, this.users, "kontaktperson_auftraggeber");
        joinInPlace(objekte, this.users, "planung");
        this.objekte = Object.freeze(objekte);

        const dienstleistungen = await apiAuthenticated(
          "/items/dienstleistung",
          filter("projekte", "in", projekteIds)
        );
        joinInPlace(dienstleistungen, this.users, "kontaktperson_nutzung");
        joinInPlace(dienstleistungen, this.users, "kontaktperson_auftraggeber");
        this.dienstleistungen = Object.freeze(dienstleistungen);
      } catch (err) {
        if (err instanceof ApiError) {
          this.$emit("api-error", err.userMessage());
        } else {
          throw err;
        }
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
