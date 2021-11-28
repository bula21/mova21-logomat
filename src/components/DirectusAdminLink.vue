<template>
  <v-btn icon :href="directusAdminLink(type, id)" v-if="user.role == 1">
    <v-icon>mdi-pencil-outline</v-icon>
  </v-btn>
</template>

<script>
import { mapState } from "vuex";
import { directusAdminLink } from "@/lib/api";

export default {
  name: "DirectusAdminLink",
  computed: {
    ...mapState({
      user: "user",
    }),
  },
  props: {
    id: Number,
    type: String,
  },
  methods: { directusAdminLink },
};
</script>
