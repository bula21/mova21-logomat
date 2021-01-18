<template>
  <div>
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue-grey darken-3"
      dark
    >
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
    <v-main>
      <OrderList />
    </v-main>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Settings from "@/components/Settings";
import OrderList from "@/components/OrderList";

export default {
  name: "Material",
  components: {
    Settings,
    OrderList,
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
