<template>
  <v-container fluid>
    <portal to="topnav-title">Anlagen</portal>

    <AnlagenDataTable :items="anlagen" />
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
};
</script>
