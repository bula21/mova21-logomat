<template>
  <div>
    <!-- Side Nav -->
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <v-list-item link :to="{ name: 'logomatAnlageList' }">
          <v-list-item-action>
            <v-icon>mdi-castle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Anlagen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <Export :users="users" />

        <v-list-item link :to="{ name: 'materialDashboard' }">
          <v-list-item-action>
            <v-icon>mdi-death-star-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Material</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <portal-target name="sidenav-extended" />
    </v-navigation-drawer>

    <!-- Top Bar -->
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      dark
      class="primary"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <router-link
        :to="{ name: 'logomatAnlageList' }"
        class="hidden-sm-and-down mr-4"
      >
        <v-avatar :tile="true" width="110px">
          <MovaLogo alt="mova Logo" />
        </v-avatar>
      </router-link>
      <router-link :to="{ name: 'logomatAnlageList' }">
        <v-avatar :tile="true">
          <LogomatLogo alt="LOGomat Logo" />
        </v-avatar>
      </router-link>

      <v-toolbar-title style="width: 500px" class="ml-0 pl-4">
        <portal-target
          tag="span"
          class="hidden-sm-and-down"
          name="topnav-title"
        />
      </v-toolbar-title>

      <v-spacer />

      <v-btn
        icon
        title="Transporte"
        target="_blank"
        href="https://tramat.mova.ch/"
        class="hidden-xs-only"
      >
        <v-icon>mdi-truck-fast</v-icon>
      </v-btn>
      <v-btn
        icon
        title="Service Desk"
        target="_blank"
        href="https://voila.bula21.ch/servicedesk/customer/portal/8"
      >
        <v-icon>mdi-face-agent</v-icon>
      </v-btn>
      <Settings />
      <Info />
      <v-btn
        icon
        title="Quellcode anschauen"
        class="hidden-xs-only"
        target="_blank"
        href="https://github.com/bula21/mova21-logomat"
      >
        <v-icon>mdi-github</v-icon>
      </v-btn>
      <v-btn icon v-on:click="logout" :title="`Log out ${user.email}`">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <DarkModeSwitch v-model="$vuetify.theme.dark" />
    </v-app-bar>

    <!-- Content -->
    <v-main>
      <v-container fluid class="pa-0">
        <router-view v-on:api-error="showError" v-if="globalDataLoaded" />
        <v-skeleton-loader v-else class="ma-4" type="table" />
      </v-container>
    </v-main>

    <!-- Error Display -->
    <v-snackbar :value="errorText.length > 0" color="error" :timeout="-1">
      {{ errorText }}
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" @click="dismissError()"> Schliessen </v-btn>
      </template>
    </v-snackbar>
    <Clippy :showProbability="0.15" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { apiAuthenticated, ApiError, limit } from "@/lib/api.js";
import { joinInPlace } from "@/lib/join.js";

import Clippy from "@/components/Clippy";
import Settings from "@/components/Settings";
import Export from "@/components/anlagen/Export";
import Info from "@/components/Info";
import MovaLogo from "@/assets/mova-logo-white.svg";
import LogomatLogo from "@/assets/logomat-logo.svg";
import DarkModeSwitch from "@/components/DarkModeSwitch";

export default {
  name: "Main",
  components: {
    DarkModeSwitch,
    Clippy,
    Settings,
    Export,
    Info,
    MovaLogo,
    LogomatLogo,
  },
  computed: {
    ...mapState({
      user: "user",
      users: "users",
      globalDataLoaded: "globalDataLoaded",
    }),
  },
  data: () => ({
    errorText: "",
    drawer: null,
  }),
  created() {
    this.fetchGlobalData();
  },
  mounted() {
    const theme = localStorage.getItem("globalDarkMode");
    if (theme) {
      this.$vuetify.theme.dark = theme === "true";
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.$vuetify.theme.dark = true;
      localStorage.setItem("dark_theme", this.$vuetify.theme.dark.toString());
    }
  },
  methods: {
    dismissError() {
      this.errorText = "";
    },
    showError(message) {
      this.errorText = `${message} - Neu laden oder Einloggen?`;
    },
    logout() {
      this.$store.commit("logOut");
      this.$router.push({ name: "login" });
    },
    addProjektNamesToAnlagen(anlagen, projekte, objekte) {
      const projekteById = projekte.reduce((obj, projekt) => {
        obj[projekt.id] = projekt;
        return obj;
      }, {});
      for (const objekt of objekte) {
        const projekt = projekteById[objekt.projekt];
        if (projekt === undefined) {
          continue;
        }
        if (projekt._objekte === undefined) {
          projekt._objekte = [];
        }
        projekt._objekte.push({
          name: objekt.objektname,
          objekt_id: objekt.objekt_id,
        });
      }

      const anlagenById = anlagen.reduce((obj, anlage) => {
        obj[anlage.id] = anlage;
        return obj;
      }, {});
      for (const projekt of projekte) {
        const anlage = anlagenById[projekt.anlage];
        if (anlage === undefined) {
          continue;
        }
        if (anlage._projekte === undefined) {
          anlage._projekte = [];
        }
        anlage._projekte.push({
          name: projekt.projektname,
          id: projekt.id,
          _objekte: projekt._objekte || [],
        });
      }

      // concatenated for filtering/searching
      for (const anlage of anlagen) {
        if (anlage._projekte === undefined) {
          anlage._projekte = [];
        }
        // TODO: rename _projektnamen to _searchterms
        anlage._projektnamen = anlage._projekte.reduce((str, projekt) => {
          const objIds = projekt._objekte.reduce(
            (str2, objekt) => `${str2} ${objekt.objekt_id}`,
            ""
          );

          return `${str} ${projekt.name} ${objIds}`;
        }, "");
      }
    },
    async getFields() {
      const fields = await apiAuthenticated("/fields");
      return fields.reduce((obj, field) => {
        if (field.collection.startsWith("directus_")) {
          return obj;
        }
        if (obj[field.collection] === undefined) {
          obj[field.collection] = {};
        }
        obj[field.collection][field.field] = field;
        return obj;
      }, {});
    },
    async fetchGlobalData() {
      try {
        const [anlagen, users, projekte, objekte] = await Promise.all([
          apiAuthenticated("/items/anlage", limit(-1)),
          apiAuthenticated("/users"),
          apiAuthenticated("/items/projekt", limit(-1)),
          apiAuthenticated("/items/objekt", limit(-1)),
        ]);
        joinInPlace(anlagen, users, "kontaktperson");
        this.addProjektNamesToAnlagen(anlagen, projekte, objekte);

        // fetch fields
        const fields = await this.getFields();

        // save to store
        this.$store.commit("globalDataLoaded", {
          anlagen: Object.freeze(anlagen),
          projekte: Object.freeze(projekte),
          objekte: Object.freeze(objekte),
          users: Object.freeze(users),
          fields: Object.freeze(fields),
        });
      } catch (err) {
        if (err instanceof ApiError) {
          this.showError(err.userMessage());
        } else {
          throw err;
        }
      }
    },
  },
};
</script>
