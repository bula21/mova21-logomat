<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <v-list-item
          @click="showTab(null)"
          :class="{'v-list-item--active': activeTab === null}"
          link
        >
          <v-list-item-action>
            <v-icon>mdi-castle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Alle Anlagen
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
        >
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Einstellungen
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider v-if="haveTabs"></v-divider>
      <v-subheader v-if="haveTabs">Anlagen-Übersicht</v-subheader>

      <v-list dense>
        <template v-for="(item, key) in tabs">
          <v-list-item
            :key="item.id"
            link
            :class="{'v-list-item--active': activeTab === item.id}"
            @click="showTab(item.id)"
          >
            <v-list-item-action>
              <v-icon>mdi-castle</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{item.anlagenname}}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1" v-on:click="closeTab(key)">mdi-close-circle</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-avatar :tile="true" width="150px" item>
        <img :src="require('@/assets/logo.svg')" alt="Mova Logo">
      </v-avatar>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">Logomat</span>
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
        class="hidden-sm-and-down"
        v-model="searchText"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
                 v-bind="attrs"
                 v-on="on"
                 target="_blank"
                 href="https://github.com/jo-m/logomat-frontend">
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </template>
        <span>View the source code</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
                 v-bind="attrs"
                 v-on="on"
                 v-on:click="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
        <span>Log out {{ user.email }}</span>
      </v-tooltip>
    </v-app-bar>
    <v-main>
      <AnlagenTable :filterText="searchText" :items="anlagen" v-on:item-clicked="openTab" v-if="activeTab === null" />
      <template v-for="item in tabs">
        <AnlagenDetail v-bind:key="item.id" :hidden="activeTab !== item.id" :item="item" />
      </template>
    </v-main>
    <v-snackbar
      :value="errorText.length > 0"
      color="error"
      :timeout="-1"
    >
      {{ errorText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          @click="dismissError()"
        >
          Schliessen
        </v-btn>
      </template>
    </v-snackbar>
    <Clippy v-if="!clippyDismissed" :showProbability="0.15"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import Clippy from '@/components/Clippy';
  import AnlagenTable from '@/components/AnlagenTable';
  import AnlagenDetail from '@/components/AnlagenDetail';
  import { apiAuthenticated } from '@/lib/api.js';

  export default {
    name: "Main",
    components: {
      Clippy,
      AnlagenTable,
      AnlagenDetail
    },
    computed: {
      ...mapState({
        user: 'user',
        clippyDismissed: 'clippyDismissed'
      }),
      haveTabs() {
        return Object.keys(this.tabs).length > 0
      }
    },
    data: () => ({
      anlagen: [],
      users: [],
      searchText: "",
      errorText: "",
      drawer: null,
      items: [
        {icon: 'mdi-castle', text: 'Alle Anlagen'},
        {icon: 'mdi-cog', text: 'Einstellungen'},
      ],
      tabs: {},
      activeTab: null
    }),
    created() {
      this.fetchData()
    },
    methods: {
      dismissError() {
        this.errorText = "";
      },
      showError(message) {
        this.errorText = message;
      },
      logout() {
        this.$store.commit('logOut');
        this.$router.push({path: '/login'})
      },
      async fetchData() {
        try {
          const anlagen = await apiAuthenticated("/items/anlage");
          const users = await apiAuthenticated("/users");
          this.anlagen = anlagen;
          this.users = users;
        } catch (err) {
          this.showError(err.userMessage())
        }
      },
      openTab(anlage) {
        if (anlage.id in this.tabs) {
          return;
        }
        this.$set(this.tabs, anlage.id, anlage)
        this.showTab(anlage.id)
      },
      closeTab(anlageId) {
        this.$delete(this.tabs, anlageId)
        // TODO show previous OR null
        this.showTab(null)
      },
      showTab(id) {
        this.activeTab = id
      }
    },
  };
</script>
