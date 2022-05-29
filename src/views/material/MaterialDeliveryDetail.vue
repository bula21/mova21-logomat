<template>
  <v-card>
    <portal to="topnav-title"
      >Material / Lieferung / {{ delivery.name }}</portal
    >
    <MaterialNavigation />

    <v-card-title v-if="showDelivery">{{ delivery.name }}</v-card-title>
    <v-card-text v-if="showDelivery">
      <v-simple-table>
        <tr>
          <td>Lieferant</td>
          <td>{{ delivery.supplier.name }}</td>
        </tr>
        <tr>
          <td>Bestellungstyp</td>
          <td>{{ delivery.supplier_delivery_type.name }}</td>
        </tr>
        <tr>
          <td>Ausführung</td>
          <td>{{ delivery.delivery_type.name }}</td>
        </tr>
        <tr>
          <td>Ausgabe</td>
          <td>{{ longDate(delivery.delivery) }}</td>
        </tr>
        <tr>
          <td>Rücknahme</td>
          <td>{{ longDate(delivery.return) }}</td>
        </tr>
      </v-simple-table>
    </v-card-text>
    <v-data-table
      dense
      :headers="headers"
      :items="deliveryItems"
      :items-per-page="20"
      :footer-props="{
        'items-per-page-options': [20, 50, -1],
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
  </v-card>
</template>

<script>
import { apiAuthenticated, ApiError, filter, limit } from "@/lib/api";
import { joinInPlace } from "@/lib/join";
import { DateTime } from "luxon";

import MaterialNavigation from "@/components/material/MaterialNavigation";

export default {
  name: "MaterialDeliveryDetail",
  components: { MaterialNavigation },
  computed: {
    deliveryId() {
      return this.$route.params.id;
    },
  },
  data: () => ({
    headers: [
      { text: "Anzahl", value: "quantity", align: "right" },
      { text: "Artikel", value: "supplier_item.name" },
      { text: "Nummer", value: "supplier_item.code" },
      { text: "Preis", value: "supplier_item.price", align: "right" },
      { text: "Total", value: "total", align: "right" },
    ],
    deliveryItems: [],
    delivery: {},
    showDelivery: false,
    total: null,
    showTotal: false,
  }),
  methods: {
    async fetchData() {
      try {
        const [
          deliveries,
          suppliers,
          supplier_delivery_types,
          delivery_types,
        ] = await Promise.all([
          apiAuthenticated(
            "/items/mat_supplier_delivery",
            filter("id", "=", this.deliveryId)
          ),
          apiAuthenticated("/items/mat_supplier"),
          apiAuthenticated("/items/mat_supplier_delivery_type"),
          apiAuthenticated("/items/mat_delivery_type"),
        ]);
        joinInPlace(deliveries, suppliers, "supplier");
        joinInPlace(
          deliveries,
          supplier_delivery_types,
          "supplier_delivery_type"
        );
        joinInPlace(deliveries, delivery_types, "delivery_type");
        var delivery = deliveries[0];
        this.delivery = Object.freeze(delivery);
        this.showDelivery = true;
      } catch (err) {
        if (err instanceof ApiError) {
          this.$emit("api-error", err.userMessage());
        } else {
          throw err;
        }
      }
    },
    async fetchList() {
      try {
        const [deliveryItems, supplierItems] = await Promise.all([
          apiAuthenticated(
            "/items/mat_supplier_delivery_item",
            filter("supplier_delivery", "=", this.deliveryId)
          ),
          apiAuthenticated("/items/mat_supplier_item", limit(-1)),
        ]);
        joinInPlace(deliveryItems, supplierItems, "supplier_item");
        deliveryItems.forEach((element) => {
          element.total = element.quantity * element.supplier_item.price;
        });
        this.deliveryItems = Object.freeze(deliveryItems);
        this.total = deliveryItems.reduce((acc, item) => {
          return acc + item.quantity * item.supplier_item.price;
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
    this.fetchList();
  },
};
</script>
