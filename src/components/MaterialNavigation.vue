<template>
  <v-app-bar app color="blue-grey darken-3" dark>
    <v-avatar :tile="true" width="140px">
      <img :src="require('@/assets/logo.svg')" alt="mova Logo" />
    </v-avatar>
    <v-avatar :tile="true">
      <img :src="require('@/assets/logomat-logo.svg')" alt="LOGomat Logo" />
    </v-avatar>
    <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
      <span class="hidden-sm-and-down">LOGomat</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn title="Material" icon disabled>
      <v-icon>mdi-death-star-variant</v-icon>
    </v-btn>
    <v-btn title="Material" to="/material" v-if="$route.path !== '/material'">
      Material
    </v-btn>
    <v-btn
      title="Sponsoring"
      to="/material/sponsoring"
      v-if="$route.path !== '/material/sponsoring'"
    >
      Sponsoring
    </v-btn>
    <v-btn icon title="Logomat" to="/">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <Settings />
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
</template>

<script>
import { mapState } from "vuex";
import Settings from "@/components/Settings";

export default {
  name: "MaterialNavigation",
  components: {
    Settings,
  },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
  data: () => ({}),
  methods: {
    logout() {
      this.$store.commit("logOut");
      this.$router.push({ path: "/login" });
    },
  },
};
</script>
