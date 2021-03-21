<template>
  <v-card>
    <portal to="topnav-title">Material / Artikel / {{ item.name }}</portal>
    <MaterialNavigation />

    <v-card-title v-if="showItem">{{ item.name }}</v-card-title>
    <v-card-text v-if="showItem">
      <v-simple-table>
        <tr>
          <td>Einheit</td>
          <td>{{ item.unit.name }}</td>
        </tr>
        <tr>
          <td>Beschreibung</td>
          <td>{{ item.description }}</td>
        </tr>
        <tr>
          <td>Katalog</td>
          <td>{{ item.catalog.name }}</td>
        </tr>
        <tr>
          <td>Richtpreis</td>
          <td>{{ item.price.toFixed(2) }}</td>
        </tr>
      </v-simple-table>
    </v-card-text>
    <v-data-table
      dense
      :headers="orders"
      :items="itemOrders"
      :items-per-page="15"
      :footer-props="{
        'items-per-page-options': [15, 45, -1],
        showFirstLastPage: true,
      }"
      class="elevation-1"
    >
      <template v-slot:item.order.delivery="{ item }">
        <span>{{ shortDate(item.order.delivery) }}</span>
      </template>
      <template v-slot:item.order.return="{ item }">
        <span>{{ shortDate(item.order.return) }}</span>
      </template>
    </v-data-table>
    <v-card-text v-if="showTotal">
      Total {{ total }} {{ item.unit.name }}
    </v-card-text>

    <v-card-title>Lieferanten</v-card-title>
    <v-data-table
      dense
      :headers="suppliers"
      :items="itemSuppliers"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:item.price="{ item }">
        <span>{{ item.price.toFixed(2) }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import MaterialNavigation from "@/components/material/MaterialNavigation";

import { apiAuthenticated, ApiError, filter } from "@/lib/api";
import { joinInPlace } from "@/lib/join";
import { DateTime } from "luxon";

export default {
  name: "MaterialItemDetail",
  components: { MaterialNavigation },
  computed: {
    itemId() {
      return this.$route.params.id;
    },
  },
  data: () => ({
    orders: [
      { text: "Anzahl", value: "quantity", align: "right" },
      { text: "Name", value: "order.name" },
      { text: "Status", value: "order.state.name", width: "120px" },
      {
        text: "Ressort",
        value: "order.client.departement.name",
        width: "160px",
      },
      { text: "Kunde", value: "order.client.name" },
      { text: "Bestellungstyp", value: "order.order_type.name" },
      { text: "Ausführung", value: "order.delivery_type.name", width: "120px" },
      { text: "Ausgabe", value: "order.delivery", align: "right" },
      {
        text: "Rücknahme",
        value: "order.return",
        width: "120px",
        align: "right",
      },
    ],
    itemOrders: [],
    suppliers: [
      { text: "Lieferant", value: "supplier.name" },
      { text: "Nummer", value: "code" },
      { text: "Name", value: "name" },
      { text: "Preis", value: "price", align: "right" },
    ],
    itemSuppliers: [],
    item: {},
    showItem: false,
    total: null,
    showTotal: false,
  }),
  methods: {
    async fetchData() {
      try {
        const [item, units, catalogs] = await Promise.all([
          apiAuthenticated("/items/mat_item", filter("id", "=", this.itemId)),
          apiAuthenticated("/items/mat_unit"),
          apiAuthenticated("/items/mat_catalog"),
        ]);
        joinInPlace(item, units, "unit");
        joinInPlace(item, catalogs, "catalog");
        this.item = Object.freeze(item[0]);
        this.showItem = true;
        const [
          itemOrders,
          orders,
          states,
          clients,
          departements,
          order_types,
          delivery_types,
        ] = await Promise.all([
          apiAuthenticated(
            "/items/mat_order_item",
            filter("item", "=", this.itemId)
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
        joinInPlace(itemOrders, orders, "order");
        this.itemOrders = Object.freeze(itemOrders);
        this.total = itemOrders.reduce((acc, item) => {
          return acc + item.quantity;
        }, 0);
        this.showTotal = true;
        const [itemSuppliers, suppliers] = await Promise.all([
          apiAuthenticated(
            "/items/mat_supplier_item",
            filter("item", "=", this.itemId)
          ),
          apiAuthenticated("/items/mat_supplier"),
        ]);
        joinInPlace(itemSuppliers, suppliers, "supplier");
        this.itemSuppliers = Object.freeze(itemSuppliers);
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
