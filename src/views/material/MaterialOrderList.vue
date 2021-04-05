<style>
#orderList tr {
  cursor: pointer;
}
</style>
<template>
  <v-card>
    <portal to="topnav-title">Material / Bestellungen</portal>
    <MaterialNavigation />

    <v-card-title>Bestellung</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Filter"
        single-line
        hide-details
        clearable
      />
    </v-card-text>
    <v-data-table
      dense
      :headers="headers"
      :items="orders"
      :items-per-page="20"
      :footer-props="{
        'items-per-page-options': [20, 50, -1],
        showFirstLastPage: true,
      }"
      :search="search"
      id="orderList"
      class="elevation-1"
      @click:row="handleClick"
    >
      <template v-slot:item.delivery="{ item }">
        <span>{{ shortDate(item.delivery) }}</span>
      </template>
      <template v-slot:item.return="{ item }">
        <span>{{ shortDate(item.return) }}</span>
      </template>
      <template v-slot:item.total.amount="{ item }">
        <span>{{ item.total.amount.toFixed(2) }}</span>
      </template>
      <template v-slot:item.id>
        <v-icon small>mdi-pencil</v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { apiAuthenticated, ApiError, limit } from "@/lib/api";
import { joinInPlace } from "@/lib/join";
import { DateTime } from "luxon";

import MaterialNavigation from "@/components/material/MaterialNavigation";

export default {
  name: "MaterialOrderList",
  components: { MaterialNavigation },
  data: () => ({
    search: "",
    headers: [
      { text: "Name", value: "name" },
      { text: "Status", value: "state.name", width: "150px" },
      { text: "Ressort", value: "client.departement.name", width: "150px" },
      { text: "Kunde", value: "client.name" },
      { text: "Bestellungstyp", value: "order_type.name" },
      { text: "Ausführung", value: "delivery_type.name", width: "100px" },
      { text: "Ausgabe", value: "delivery", align: "right" },
      { text: "Rücknahme", value: "return", width: "100px", align: "right" },
      { text: "Summe", value: "total.amount", align: "right" },
      { text: "", value: "id" },
    ],
    orders: [],
    id: 0,
  }),
  methods: {
    handleClick(item) {
      this.$router.push({
        name: "materialOrderDetail",
        params: { id: item.id },
      });
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
          orderItems,
          items,
        ] = await Promise.all([
          apiAuthenticated("/items/mat_order"),
          apiAuthenticated("/items/mat_state"),
          apiAuthenticated("/items/mat_client"),
          apiAuthenticated("/items/mat_departement"),
          apiAuthenticated("/items/mat_order_type"),
          apiAuthenticated("/items/mat_delivery_type"),
          apiAuthenticated("/items/mat_order_item", limit(-1)),
          apiAuthenticated("/items/mat_item", limit(-1)),
        ]);
        joinInPlace(orders, states, "state");
        joinInPlace(clients, departements, "departement");
        joinInPlace(orders, clients, "client");
        joinInPlace(orders, order_types, "order_type");
        joinInPlace(orders, delivery_types, "delivery_type");
        joinInPlace(orderItems, items, "item");
        const totalItems = orderItems.reduce((acc, item) => {
          const thing = acc.find((group) => group.id === item.order);
          if (thing) {
            thing.amount += item.quantity * item.item.price;
          } else {
            acc.push({
              id: item.order,
              amount: item.quantity * item.item.price,
            });
          }
          return acc;
        }, []);
        orders.forEach((element) => {
          element.total = element.id;
        });
        joinInPlace(orders, totalItems, "total");
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
        return DateTime.fromISO(date)
          .setLocale("de-ch")
          .toLocaleString(DateTime.DATE_SHORT);
      } else {
        return "";
      }
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {
    if (localStorage.orderSearch) {
      this.search = localStorage.orderSearch;
    }
  },
  watch: {
    search(orderSearch) {
      if (orderSearch === null) {
        this.search = "";
      } else {
        localStorage.orderSearch = orderSearch;
      }
    },
  },
};
</script>
