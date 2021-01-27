<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Filter"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      dense
      :headers="headers"
      :items="orders"
      :items-per-page="20"
      :footer-props="{ 'items-per-page-options': [20, 50, -1] }"
      :search="search"
      class="elevation-1"
      @click:row="handleClick"
    >
      <template v-slot:item.delivery="{ item }">
        <span>{{ shortDate(item.delivery) }}</span>
      </template>
      <template v-slot:item.return="{ item }">
        <span>{{ shortDate(item.return) }}</span>
      </template>
    </v-data-table>
    <v-card-text>
      <v-btn v-on:click="download">download</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { apiAuthenticated, ApiError } from "@/lib/api.js";
import { joinInPlace } from "@/lib/join.js";
import moment from "moment";
import XLSX from "xlsx";

export default {
  name: "OrderList",
  components: {},
  data: () => ({
    search: "",
    headers: [
      { text: "Name", value: "name" },
      { text: "Status", value: "state.name", width: "120px" },
      { text: "Ressort", value: "client.departement.name", width: "160px" },
      { text: "Kunde", value: "client.name" },
      { text: "Bestellungstyp", value: "order_type.name" },
      { text: "Ausführung", value: "delivery_type.name", width: "120px" },
      { text: "Ausgabe", value: "delivery" },
      { text: "Rücknahme", value: "return", width: "120px" },
    ],
    orders: [],
    id: 0,
  }),
  methods: {
    handleClick(item) {
      this.$router.push({ path: "/material/order/" + item.id });
    },
    async fetchData() {
      try {
        const [
          orders,
          states,
          clients,
          departements,
          order_types,
          delivery_types,
        ] = await Promise.all([
          apiAuthenticated("/items/mat_order"),
          apiAuthenticated("/items/mat_state"),
          apiAuthenticated("/items/mat_client"),
          apiAuthenticated("/items/mat_departement"),
          apiAuthenticated("/items/mat_order_type"),
          apiAuthenticated("/items/mat_delivery_type"),
        ]);
        joinInPlace(orders, states, "state");
        joinInPlace(clients, departements, "departement");
        joinInPlace(orders, clients, "client");
        joinInPlace(orders, order_types, "order_type");
        joinInPlace(orders, delivery_types, "delivery_type");
        this.orders = Object.freeze(orders);
      } catch (err) {
        if (err instanceof ApiError) {
          this.$emit("api-error", err.userMessage());
        } else {
          throw err;
        }
      }
    },
    shortDate(date) {
      if (date) {
        return moment(date, "YYYY-MM-DD", true).format("DD.MM.YYYY");
      } else {
        return "";
      }
    },
    download: function () {
      const mappedOrders = this.orders.map((item) => {
        return {
          Name: item.name,
          Status: item.state.name,
          Ressort: item.client.departement.name,
          Kunde: item.client.name,
          Bestellungstyp: item.order_type.name,
          Ausführung: item.delivery_type.name,
          Ausgabe: item.delivery,
          Rücknahme: item.return,
          Kommentar: item.comment,
        };
      });
      const data = XLSX.utils.json_to_sheet(mappedOrders);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, data, "data");
      XLSX.writeFile(wb, "orders.xlsx");
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
