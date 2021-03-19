<template>
  <v-card>
    <portal to="topnav-title">Material / Bestellung / {{order.name}}</portal>
    <MaterialNavigation></MaterialNavigation>

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
      </template>
      <template v-slot:item.total="{ item }">
        <span>{{ item.total.toFixed(2) }}</span>
      </template>
    </v-data-table>
    <v-card-text v-if="showTotal">
      Summe CHF {{ total.toFixed(2) }}
    </v-card-text>
    <v-card-text>
      <v-btn v-on:click="download">Export</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { apiAuthenticated, ApiError, filter, limit } from "@/lib/api";
import { joinInPlace } from "@/lib/join";
import { DateTime } from "luxon";
import XLSX from "xlsx";
import MaterialNavigation from "@/components/material/MaterialNavigation";

export default {
  name: "MaterialOrderDetail",
  components: { MaterialNavigation },
  computed: {
    orderId() {
      return this.$route.params.id;
    },
  },
  data: () => ({
    headers: [
      { text: "Anzahl", value: "quantity", align: "right" },
      { text: "Einheit", value: "item.unit.name" },
      { text: "Artikel", value: "item.name" },
      { text: "Beschreibung", value: "item.description" },
      { text: "Katalog", value: "item.catalog.name" },
      { text: "Richtpreis", value: "item.price", align: "right" },
      { text: "Total", value: "total", align: "right" },
    ],
    orderItems: [],
    order: {},
    showOrder: false,
    total: null,
    showTotal: false,
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
        orderItems.forEach((element) => {
          element.total = element.quantity * element.item.price;
        });
        this.orderItems = Object.freeze(orderItems);
        this.total = orderItems.reduce((acc, item) => {
          return acc + item.quantity * item.item.price;
        }, 0);
        this.showTotal = true;
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
    longDate(date) {
      if (date) {
        return DateTime.fromISO(date)
          .setLocale("de-ch")
          .toLocaleString(DateTime.DATE_HUGE);
      } else {
        return "n/a";
      }
    },
    download: function () {
      const mappedOrder = [
        { key: "Name", value: this.order.name },
        { key: "Status", value: this.order.state.name },
        { key: "Ressort", value: this.order.client.departement.name },
        { key: "Kunde", value: this.order.client.name },
        { key: "Bestellungstyp", value: this.order.order_type.name },
        { key: "Ausführung", value: this.order.delivery_type.name },
        { key: "Ausgabe", value: this.shortDate(this.order.delivery) },
        { key: "Rücknahme", value: this.shortDate(this.order.return) },
        { key: "Kommentar", value: this.order.comment },
      ];
      const mappedItems = this.orderItems.map((item) => {
        return {
          Anzahl: item.quantity,
          Einheit: item.item.unit.name,
          Artikel: item.item.name,
          Beschreibung: item.item.description,
          Katalog: item.item.catalog.name,
          Richtpreis: item.item.price,
        };
      });
      var data = XLSX.utils.json_to_sheet(mappedOrder, { skipHeader: true });
      data = XLSX.utils.sheet_add_json(data, mappedItems, {
        origin: { r: 10, c: 0 },
      });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, data, "data");
      XLSX.writeFile(wb, "bestellung.xlsx");
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
