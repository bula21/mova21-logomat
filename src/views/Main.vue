<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <v-list-item link :to="{ name: 'logomatAnlageList' }" exact>
          <v-list-item-action>
            <v-icon>mdi-castle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Anlagen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <Export :users="users" />

        <v-list-item link :to="{ name: 'materialDashboard' }" exact>
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

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue-grey darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <router-link
        :to="{ name: 'logomatAnlageList' }"
        class="hidden-sm-and-down"
      >
        <v-avatar :tile="true" width="110px">
          <MovaLogo alt="mova Logo" />
        </v-avatar>
      </router-link>
      <router-link :to="{ name: 'logomatAnlageList' }">
        <v-avatar :tile="true" style="margin-left: 20px">
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
        href="https://github.com/bula21/mova21-logomat"
      >
        <v-icon>mdi-github</v-icon>
      </v-btn>
      <v-btn icon v-on:click="logout" :title="`Log out ${user.email}`">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view v-on:api-error="showError" v-if="globalDataLoaded" />
      <v-container v-else fluid>
        <v-layout justify-center>
          <v-progress-circular indeterminate size="64" />
        </v-layout>
      </v-container>
    </v-main>
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
import { apiAuthenticated, ApiError } from "@/lib/api.js";
import { joinInPlace } from "@/lib/join.js";

import Clippy from "@/components/Clippy";
import Settings from "@/components/Settings";
import Export from "@/components/anlagen/Export";
import Info from "@/components/Info";
import MovaLogo from "@/assets/mova-logo-white.svg";
import LogomatLogo from "@/assets/logomat-logo.svg";

export default {
  name: "Main",
  components: {
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
    drawer: true,
  }),
  created() {
    this.fetchGlobalData();
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
        if (anlage._projekte === undefined) {
          anlage._projekte = [];
        }
        anlage._projekte.push({ name: projekt.projektname, id: projekt.id });
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
        const [anlagen, users, projekte] = await Promise.all([
          apiAuthenticated("/items/anlage"),
          apiAuthenticated("/users"),
          apiAuthenticated("/items/projekt"),
        ]);
        joinInPlace(anlagen, users, "kontaktperson");
        this.addProjektNamesToAnlagen(anlagen, projekte);

        // fetch fields
        const fields = await this.getFields();

        // save to store
        this.$store.commit("globalDataLoaded", {
          anlagen: Object.freeze(anlagen),
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
