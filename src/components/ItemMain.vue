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
        :headers="itemHeader"
        :items="items"
        :items-per-page="5"
        :footer-props="{
          'items-per-page-options': [5, 20],
          showFirstLastPage: true,
        }"
        :search="search"
        class="elevation-1"
        @click:row="handleClick"
      >
        <template v-slot:item.id>
          <v-icon small> mdi-pencil </v-icon>
        </template>
      </v-data-table>
      <v-card-title v-if="showOrderItems"> {{ name }} </v-card-title>
      <v-data-table
        dense
        :headers="orderItemHeader"
        :items="orderItems"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-options': [10, 40],
          showFirstLastPage: true,
        }"
        class="elevation-1"
        v-if="showOrderItems"
      >
        <template v-slot:item.order.delivery="{ item }">
          <span>{{ shortDate(item.order.delivery) }}</span>
        </template>
        <template v-slot:item.order.return="{ item }">
          <span>{{ shortDate(item.order.return) }}</span>
        </template>
      </v-data-table>
      <v-card-text v-if="showOrderItems"> {{ total }} </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import { apiAuthenticated, ApiError, filter, limit } from "@/lib/api";
import { joinInPlace } from "@/lib/join";
import { DateTime } from "luxon";

export default {
  name: "ItemMain",
  components: {},
  data: () => ({
    search: "",
    itemHeader: [
      { text: "Name", value: "name" },
      { text: "Einheit", value: "unit.name" },
      { text: "Beschreibung", value: "description" },
      { text: "Katalog", value: "catalog.name" },
      { text: "Richtpreis", value: "price" },
      { text: "", value: "id" },
    ],
    items: [],
    orderItemHeader: [
      { text: "Anzahl", value: "quantity" },
      { text: "Bestellung", value: "order.name" },
      { text: "Status", value: "order.state.name" },
      { text: "Ressort", value: "order.client.departement.name" },
      { text: "Kunde", value: "order.client.name" },
      { text: "Bestellungstyp", value: "order.order_type.name" },
      { text: "Ausführng", value: "order.delivery_type.name" },
      { text: "Ausgabe", value: "order.delivery" },
      { text: "Rückname", value: "order.return" },
    ],
    orderItems: [],
    name: null,
    total: null,
    showOrderItems: false,
  }),
  methods: {
    async handleClick(item) {
      this.name = item.name;
      try {
        const [
          orderItems,
          orders,
          states,
          clients,
          departements,
          order_types,
          delivery_types,
        ] = await Promise.all([
          apiAuthenticated(
            "/items/mat_order_item",
            filter("item", "=", item.id)
          ),
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
        joinInPlace(orderItems, orders, "order");
        this.orderItems = Object.freeze(orderItems);
        const total = orderItems.reduce((acc, item) => {
          acc += item.quantity;
          return acc;
        }, 0);
        this.total = "Total " + total + " " + item.unit.name;
        this.showOrderItems = true;
      } catch (err) {
        if (err instanceof ApiError) {
          this.$emit("api-error", err.userMessage());
        } else {
          throw err;
        }
      }
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
};
</script>
