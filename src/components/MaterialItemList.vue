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
          clearable
        ></v-text-field>
      </v-card-text>
      <v-data-table
        dense
        :headers="headers"
        :items="totalItems"
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
        <template v-slot:item.item.price="{ item }">
          <span>{{ item.item.price.toFixed(2) }}</span>
        </template>
        <template v-slot:item.item.id>
          <v-icon small> mdi-pencil </v-icon>
        </template>
      </v-data-table>
      <v-card-text>
        <v-btn v-on:click="download">Export</v-btn>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import { apiAuthenticated, ApiError, limit } from "@/lib/api";
import { joinInPlace } from "@/lib/join";
import XLSX from "xlsx";

export default {
  name: "MaterialItemList",
  components: {},
  data: () => ({
    search: "",
    headers: [
      { text: "Anzahl", value: "quantity" },
      { text: "Einheit", value: "item.unit.name" },
      { text: "Name", value: "item.name" },
      { text: "Beschreibung", value: "item.description" },
      { text: "Katalog", value: "item.catalog.name" },
      { text: "Richtpreis", value: "item.price", align: "right" },
      { text: "", value: "item.id" },
    ],
    totalItems: [],
  }),
  methods: {
    handleClick(item) {
      this.$router.push({ path: "/material/item/" + item.item.id });
    },
    async fetchData() {
      try {
        const [orderItems, items, units, catalogs] = await Promise.all([
          apiAuthenticated("/items/mat_order_item", limit(-1)),
          apiAuthenticated("/items/mat_item", limit(-1)),
          apiAuthenticated("/items/mat_unit"),
          apiAuthenticated("/items/mat_catalog"),
        ]);
        const totalItems = orderItems.reduce((acc, item) => {
          const thing = acc.find((group) => group.item === item.item);
          if (thing) {
            thing.quantity += item.quantity;
          } else {
            acc.push({ item: item.item, quantity: item.quantity });
          }
          return acc;
        }, []);
        joinInPlace(items, units, "unit");
        joinInPlace(items, catalogs, "catalog");
        joinInPlace(totalItems, items, "item");
        this.totalItems = Object.freeze(totalItems);
      } catch (err) {
        if (err instanceof ApiError) {
          this.$emit("api-error", err.userMessage());
        } else {
          throw err;
        }
      }
    },
    download: function () {
      const mappedItems = this.totalItems.map((item) => {
        return {
          Anzahl: item.quantity,
          Einheit: item.item.unit.name,
          Name: item.item.name,
          Beschreibung: item.item.description,
          Katalog: item.item.catalog.name,
          Richtpreis: item.item.price,
        };
      });
      const data = XLSX.utils.json_to_sheet(mappedItems);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, data, "data");
      XLSX.writeFile(wb, "artikel.xlsx");
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {
    if (localStorage.itemSearch) {
      this.search = localStorage.itemSearch;
    }
  },
  watch: {
    search(itemSearch) {
      if (itemSearch === null) {
        this.search = "";
      } else {
        localStorage.itemSearch = itemSearch;
      }
    },
  },
};
</script>
