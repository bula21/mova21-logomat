<template>
  <div>
    <div>{{ anlage }}</div>
    <div>{{ objekte }}</div>
    <div>{{ dienstleistungen }}</div>
  </div>
</template>

<script>
import { apiAuthenticated, ApiError, filter } from "@/lib/api.js";
import { joinInPlace } from "@/lib/join.js";

export default {
  name: "AnlagenDetail",
  props: {
    anlage: Object,
    users: Array,
  },
  data: () => ({
    objekte: [],
    dienstleistungen: [],
  }),
  methods: {
    async fetchData() {
      console.log(this.anlage);

      try {
        const projekte = await apiAuthenticated(
          "/items/projekt",
          filter("anlage", "=", this.anlage.id)
        );
        const projekteIds = projekte.map((p) => p.id);

        const objekte = await apiAuthenticated(
          "/items/objekt",
          filter("projekt", "in", projekteIds)
        );
        joinInPlace(objekte, this.users, "owner");
        joinInPlace(objekte, this.users, "kontaktperson_nutzung");
        joinInPlace(objekte, this.users, "kontaktperson_auftraggeber");
        joinInPlace(objekte, this.users, "planung");
        this.objekte = Object.freeze(objekte);

        const dienstleistungen = await apiAuthenticated(
          "/items/dienstleistung",
          filter("projekte", "in", projekteIds)
        );
        joinInPlace(objekte, this.users, "owner");
        joinInPlace(objekte, this.users, "kontaktperson_nutzung");
        joinInPlace(objekte, this.users, "kontaktperson_auftraggeber");
        this.dienstleistungen = Object.freeze(dienstleistungen);
      } catch (err) {
        if (err instanceof ApiError) {
          this.$emit("api-error", err.userMessage());
        } else {
          throw err;
        }
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
