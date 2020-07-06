<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              link
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            link
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
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
      <v-avatar :tile="true" size="150px" item>
        <img :src="require('@/assets/logo.svg')" alt="Mova Logo">
      </v-avatar>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">Bula Bauten</span>
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
                 v-on:click="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
        <span>Log out {{ user.email }}</span>
      </v-tooltip>
    </v-app-bar>
    <v-main>
      <br>
      <v-data-table
        :headers="headers"
        :items="anlagen"
        :search="searchText"
        item-key="id"
        class="elevation-1"
        :items-per-page="25"
      >
      </v-data-table>
    </v-main>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import api from '@/lib/api.js';

  export default {
    methods: {
      logout() {
        this.$store.commit('logOut');
        this.$router.push({path: '/login'})
      },
      async apiFetch(path) {
        const config = {
          headers: {
            Authorization: `bearer ${this.user._token}`
          }
        };
        try {
          const resp = await api.get(path, config);
          return resp.data.data;
        } catch (err) {
          this.logout()
          throw err;
        }
      },
      fetchData() {
        this.apiFetch("/items/anlage")
          .then((data) => {
            this.anlagen = data;
          });
      },
    },
    created() {
      this.fetchData()
    },
    components: {},
    computed: {
      ...mapState({
        user: 'user',
      })
    },
    data: () => ({
      anlagen: [],
      searchText: "",
      drawer: null,
      headers: [
        {text: "Anlagenname", value: "anlagenname", filterable: true},
        {text: "Beschreibung", value: "beschreibung", filterable: true},
        {text: "Kontaktperson", value: "kontaktperson"},
        {text: "Avanti", value: "avanti_link"},
      ],
      items: [
        {icon: 'mdi-contacts', text: 'Contacts'},
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: 'More',
          model: false,
          children: [
            {text: 'Import'},
            {text: 'Export'},
            {text: 'Print'},
          ],
        },
        {icon: 'mdi-cog', text: 'Settings'},
      ],
    }),
  };
</script>
