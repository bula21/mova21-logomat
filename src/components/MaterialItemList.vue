<style>
#itemList tr {
  cursor: pointer;
}
</style>

<template>
  <v-main>
    <v-card>
      <v-card-title>Artikel</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Filter"
          single-line
          hide-details
        ></v-text-field>
      </v-card-text>
      <v-data-table
        dense
        :headers="headers"
        :items="items"
        :items-per-page="20"
        :footer-props="{
          'items-per-page-options': [20, 50, -1],
          showFirstLastPage: true,
        }"
        :search="search"
        id="itemList"
        class="elevation-1"
        @click:row="handleClick"
      >
        <template v-slot:item.price="{ item }">
          <span>{{ item.price.toFixed(2) }}</span>
        </template>
        <template v-slot:item.id>
          <v-icon small> mdi-pencil </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-main>
</template>

<script>
import { apiAuthenticated, ApiError, limit } from "@/lib/api";
import { joinInPlace } from "@/lib/join";

export default {
  name: "MaterialItemList",
  components: {},
  data: () => ({
    search: "",
    headers: [
      { text: "Name", value: "name" },
      { text: "Einheit", value: "unit.name" },
      { text: "Beschreibung", value: "description" },
      { text: "Katalog", value: "catalog.name" },
      { text: "Richtpreis", value: "price", align: "right" },
      { text: "", value: "id" },
    ],
    items: [],
  }),
  methods: {
    handleClick(item) {
      this.$router.push({ path: "/material/item/" + item.id });
    },
    async fetchData() {
      try {
        const [items, units, catalogs] = await Promise.all([
          apiAuthenticated("/items/mat_item", limit(-1)),
          apiAuthenticated("/items/mat_unit"),
          apiAuthenticated("/items/mat_catalog"),
        ]);
        joinInPlace(items, units, "unit");
        joinInPlace(items, catalogs, "catalog");
        this.items = Object.freeze(items);
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
