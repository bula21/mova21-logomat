<template>
  <v-main>
    <v-card>
      <v-card-title v-if="showOrder">{{ order.name }}</v-card-title>
      <v-card-text v-if="showOrder">
        <v-simple-table>
          <tr>
            <td>Status</td>
            <td>{{ order.state.name }}</td>
          </tr>
          <tr>
            <td>Ressort</td>
            <td>{{ order.client.departement.name }}</td>
          </tr>
          <tr>
            <td>Kunde</td>
            <td>{{ order.client.name }}</td>
          </tr>
          <tr>
            <td>Bestellungstyp</td>
            <td>{{ order.order_type.name }}</td>
          </tr>
          <tr>
            <td>Ausführung</td>
            <td>{{ order.delivery_type.name }}</td>
          </tr>
          <tr>
            <td>Ausgabe</td>
            <td>{{ longDate(order.delivery) }}</td>
          </tr>
          <tr>
            <td>Rücknahme</td>
            <td>{{ longDate(order.return) }}</td>
          </tr>
          <tr>
            <td>Kommentar</td>
            <td>{{ order.comment }}</td>
          </tr>
        </v-simple-table>
      </v-card-text>
      <v-data-table
        dense
        :headers="headers"
        :items="orderItems"
        :items-per-page="15"
        :footer-props="{
          'items-per-page-options': [15, 45, -1],
          showFirstLastPage: true,
        }"
        class="elevation-1"
      >
        <template v-slot:item.item.price="{ item }">
          <span>{{ item.item.price.toFixed(2) }}</span>
        </template></v-data-table
      >
    </v-card>
  </v-main>
</template>

<script>
import { apiAuthenticated, ApiError, filter, limit } from "@/lib/api";
import { joinInPlace } from "@/lib/join";
import { DateTime } from "luxon";

export default {
  name: "MaterialOrderItem",
  components: {},
  props: {
    orderId: String,
  },
  data: () => ({
    headers: [
      { text: "Anzahl", value: "quantity" },
      { text: "Einheit", value: "item.unit.name" },
      { text: "Artikel", value: "item.name" },
      { text: "Beschreibung", value: "item.description" },
      { text: "Katalog", value: "item.catalog.name" },
      { text: "Richtpreis", value: "item.price", align: "right" },
    ],
    orderItems: [],
    order: {},
    showOrder: false,
  }),
  methods: {
    async fetchData() {
      try {
        const [
          order,
          states,
          clients,
          departements,
          order_types,
          delivery_types,
        ] = await Promise.all([
          apiAuthenticated("/items/mat_order", filter("id", "=", this.orderId)),
          apiAuthenticated("/items/mat_state"),
          apiAuthenticated("/items/mat_client"),
          apiAuthenticated("/items/mat_departement"),
          apiAuthenticated("/items/mat_order_type"),
          apiAuthenticated("/items/mat_delivery_type"),
        ]);
        joinInPlace(order, states, "state");
        joinInPlace(clients, departements, "departement");
        joinInPlace(order, clients, "client");
        joinInPlace(order, order_types, "order_type");
        joinInPlace(order, delivery_types, "delivery_type");
        this.order = Object.freeze(order[0]);
        this.showOrder = true;
        const [orderItems, items, units, catalogs] = await Promise.all([
          apiAuthenticated(
            "/items/mat_order_item",
            filter("order", "=", this.orderId)
          ),
          apiAuthenticated("/items/mat_item", limit(-1)),
          apiAuthenticated("/items/mat_unit"),
          apiAuthenticated("/items/mat_catalog"),
        ]);
        joinInPlace(items, units, "unit");
        joinInPlace(items, catalogs, "catalog");
        joinInPlace(orderItems, items, "item");
        this.orderItems = Object.freeze(orderItems);
      } catch (err) {
        if (err instanceof ApiError) {
          this.$emit("api-error", err.userMessage());
        } else {
          throw err;
        }
      }
    },
    longDate(date) {
      if (date) {
        return DateTime.fromISO(date)
          .setLocale("de-ch")
          .toLocaleString(DateTime.DATE_HUGE);
      } else {
        return "n/a";
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
