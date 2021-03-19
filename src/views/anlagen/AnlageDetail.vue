<template>
  <v-container fluid>
    <portal to="topnav-title">Anlagen / {{ anlage.anlagenname }}</portal>

    <portal to="sidenav-extended">
      <v-divider></v-divider>

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
            <v-list-item-title
              >Anlage: {{ anlage.anlagenname }}</v-list-item-title
            >
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
            <v-list-item-title
              v-text="stripProjektTitle(projekt.projektname)"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </portal>

    <v-card ref="top">
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
        :disable-pagination="true"
        hide-default-footer
      >
        <template v-slot:no-data>
          <v-alert type="info"> Keine Objekte im Projekt </v-alert>
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
              <Objekt :objekt="objekt"></Objekt>
            </v-col>
            <template v-for="objekt in props.items">
              <v-col
                v-for="dienstleistung in filterByProp(
                  dienstleistungen,
                  'objekte',
                  objekt.id
                )"
                :key="dienstleistung.id"
                cols="12"
                sm="12"
                md="6"
                lg="6"
              >
                <Dienstleistung
                  :dienstleistung="dienstleistung"
                ></Dienstleistung>
              </v-col>
            </template>
          </v-row>
        </template>
      </v-data-iterator>

      <v-data-iterator
        :items="filterByProp(dienstleistungen, 'projekte', projekt.id)"
        :disable-pagination="true"
        hide-default-footer
      >
        <template v-slot:no-data>
          <div></div>
          <!--              <v-alert type="info">-->
          <!--                Keine Dienstleistungen im Projekt.-->
          <!--                <a-->
          <!--                  href="https://limesurvey.bula21.ch/index.php/141511?newtest=Y&lang=de-informal"-->
          <!--                  target="_blank"-->
          <!--                  style="color: white"-->
          <!--                >-->
          <!--                  <v-icon>mdi-cart</v-icon>-->
          <!--                  Dienstleistung bestellen-->
          <!--                </a>-->
          <!--              </v-alert>-->
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
              <Dienstleistung :dienstleistung="item"></Dienstleistung>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>

      <hr />
      <br />
    </div>
  </v-container>
</template>

<script>
import { ApiError } from "@/lib/api";
import Dienstleistung from "@/components/anlagen/Dienstleistung";
import DescriptionTable from "@/components/DescriptionTable";
import Objekt from "@/components/anlagen/Objekt";
import Projekt from "@/components/anlagen/Projekt";
import AvantiLink from "@/components/anlagen/AvantiLink";
import { loadAnlageData } from "@/lib/anlage";

export default {
  name: "AnlageDetail",
  components: {
    Dienstleistung,
    Projekt,
    DescriptionTable,
    Objekt,
    AvantiLink,
  },
  data: () => ({
    objekte: [],
    projekte: [],
    dienstleistungen: [],
    anlage: {},
  }),
  methods: {
    stripProjektTitle(name) {
      const postFix = ` - ${this.anlage.anlagenname}`;
      return name.replace(postFix, "");
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
    async fetchData() {
      try {
        const { projekte, objekte, dienstleistungen } = loadAnlageData(
          this.anlage.id,
          this.$store.users,
          this.$store.fields
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
    },
  },
  created() {
    this.anlage = this.anlagen.find(
      (anlage) => anlage.anlagen_id === this.$route.params.id
    );
    this.fetchData();
  },
};
</script>
