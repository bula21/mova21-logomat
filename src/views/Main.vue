<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <v-list-item
          @click="activeTab = null"
          :class="{ 'v-list-item--active': activeTab === null }"
          link
        >
          <v-list-item-action>
            <v-icon>mdi-format-list-bulleted-type</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Alle Anlagen
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <Export :users="users" />
      </v-list>

      <v-divider v-if="haveTabs"></v-divider>
      <v-subheader v-if="haveTabs">Anlagen</v-subheader>

      <v-list dense>
        <v-list-item-group v-model="activeTab">
          <v-list-item v-for="item in tabs" :key="item.id">
            <v-list-item-avatar>
              <v-icon>mdi-castle</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.anlagenname"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1" v-on:click="closeTab(item)">
                  mdi-close-circle
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue-grey darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-avatar :tile="true" width="140px">
        <img :src="require('@/assets/logo.svg')" alt="mova Logo" />
      </v-avatar>
      <v-avatar :tile="true">
        <img :src="require('@/assets/logomat-logo.svg')" alt="LOGomat Logo" />
      </v-avatar>
      <v-toolbar-title style="width: 300px;" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">LOGomat</span>
        <span v-if="activeTab !== null" class="hidden-sm-and-down"
          >: {{ tabs[activeTab].anlagenname }}</span
        >
      </v-toolbar-title>
      <v-text-field
        v-if="activeTab === null"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Suche Anlagen oder Projekte"
        class="hidden-sm-and-down"
        v-model="searchText"
      ></v-text-field>
      <v-checkbox
        v-if="activeTab === null"
        v-model="searchOnlyMine"
        flat
        solo-inverted
        hide-details
        label="Nur meine Anlagen"
      />
      <v-spacer></v-spacer>
      <v-btn
        icon
        title="Service Desk"
        target="_blank"
        href="https://voila.bula21.ch/servicedesk/customer/portal/8"
      >
        <v-icon>mdi-face-agent</v-icon>
      </v-btn>
      <v-btn
        icon
        title="Bestellformular Dienstleistungen"
        target="_blank"
        href="https://limesurvey.bula21.ch/index.php/141511?newtest=Y&lang=de-informal"
      >
        <v-icon>mdi-cart</v-icon>
      </v-btn>
      <Settings />
      <Info />
      <v-btn
        icon
        title="Quellcode anschauen"
        target="_blank"
        href="https://github.com/jo-m/logomat-frontend"
      >
        <v-icon>mdi-github</v-icon>
      </v-btn>
      <v-btn icon v-on:click="logout" :title="`Log out ${user.email}`">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <AnlagenDataTable
        :filterText="searchText"
        :filterOnlyMine="searchOnlyMine"
        :items="anlagen"
        v-on:item-clicked="openTab"
        v-if="activeTab === null"
      />
      <template v-for="(item, i) in tabs">
        <Anlage
          v-bind:key="item.id"
          :hidden="activeTab !== i"
          :anlage="item"
          :fields="fields"
          :users="users"
          v-on:api-error="showError"
        />
      </template>
    </v-main>
    <v-snackbar :value="errorText.length > 0" color="error" :timeout="-1">
      {{ errorText }}

      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" @click="dismissError()">
          Schliessen
        </v-btn>
      </template>
    </v-snackbar>
    <Clippy :showProbability="0.15" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Clippy from "@/components/Clippy";
import AnlagenDataTable from "@/components/AnlagenDataTable";
import Settings from "@/components/Settings";
import Export from "@/components/Export";
import Anlage from "@/components/Anlage";
import Info from "@/components/Info";
import { apiAuthenticated, ApiError } from "@/lib/api.js";
import { joinInPlace } from "@/lib/join.js";

export default {
  name: "Main",
  components: {
    Clippy,
    AnlagenDataTable,
    Anlage,
    Settings,
    Export,
    Info,
  },
  computed: {
    ...mapState({
      user: "user",
    }),
    haveTabs() {
      return Object.keys(this.tabs).length > 0;
    },
  },
  data: () => ({
    anlagen: [],
    users: [],
    fields: {},
    searchText: "",
    searchOnlyMine: false,
    errorText: "",
    drawer: null,
    tabs: [],
    activeTab: null,
  }),
  created() {
    this.fetchData();
  },
  methods: {
    dismissError() {
      this.errorText = "";
    },
    showError(message) {
      this.errorText = message;
    },
    logout() {
      this.$store.commit("logOut");
      this.$router.push({ path: "/login" });
    },
    async fetchFields() {
      const fields = await apiAuthenticated("/fields");
      const fieldsByCollection = fields.reduce((obj, field) => {
        if (field.collection.startsWith("directus_")) {
          return obj;
        }
        if (obj[field.collection] === undefined) {
          obj[field.collection] = {};
        }
        obj[field.collection][field.field] = field;
        return obj;
      }, {});
      this.fields = Object.freeze(fieldsByCollection);
    },
    addProjektNamesToAnlagen(anlagen, projekte) {
      const anlagenById = anlagen.reduce((obj, anlage) => {
        obj[anlage.id] = anlage;
        return obj;
      }, {});
      for (const projekt of projekte) {
        const anlage = anlagenById[projekt.anlage];
        if (anlage === undefined) {
          continue;
        }
        if (anlage._projektnamen === undefined) {
          anlage._projektnamen = projekt.projektname;
        } else {
          anlage._projektnamen += `, ${projekt.projektname}`;
        }
      }
    },
    async fetchData() {
      try {
        const [anlagen, users, projekte] = await Promise.all([
          apiAuthenticated("/items/anlage"),
          apiAuthenticated("/users"),
          apiAuthenticated("/items/projekt"),
        ]);
        joinInPlace(anlagen, users, "kontaktperson");
        this.users = Object.freeze(users);
        this.addProjektNamesToAnlagen(anlagen, projekte);
        this.anlagen = Object.freeze(anlagen);

        await this.fetchFields();
      } catch (err) {
        if (err instanceof ApiError) {
          this.showError(err.userMessage());
        } else {
          throw err;
        }
      }
    },
    openTab(anlage) {
      const currentIx = this.tabs.findIndex((tab) => tab.id === anlage.id);
      if (currentIx < 0) {
        this.tabs.push(anlage);
        this.activeTab = this.tabs.length - 1;
      } else {
        this.activeTab = currentIx;
      }
    },
    closeTab(anlage) {
      const currentIx = this.tabs.findIndex((tab) => tab.id === anlage.id);
      this.$delete(this.tabs, currentIx);
      this.activeTab = null;
    },
  },
};
</script>
