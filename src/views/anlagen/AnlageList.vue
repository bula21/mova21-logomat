<template>
  <v-container fluid id="container">
    <portal to="topnav-title">Anlagen</portal>

    <v-text-field
      flat
      hide-details
      prepend-inner-icon="mdi-magnify"
      label="Suche Anlagen oder Projekte"
      class="hidden-sm-and-down"
      v-model="searchText"
    ></v-text-field>
    <v-checkbox
      v-model="searchOnlyMine"
      flat
      solo-inverted
      hide-details
      label="Nur meine Anlagen"
    />
    <AnlagenDataTable
      :filterText="searchText"
      :filterOnlyMine="searchOnlyMine"
      :items="anlagen"
    />
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import AnlagenDataTable from "@/components/anlagen/AnlagenDataTable";

export default {
  name: "AnlageList",
  components: {
    AnlagenDataTable,
  },
  computed: {
    ...mapState({
      user: "user",
      users: "users",
      anlagen: "anlagen",
      fields: "fields",
    }),
  },
  data: () => ({
    searchText: "",
    searchOnlyMine: false,
  }),
};
</script>
