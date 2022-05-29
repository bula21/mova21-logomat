<style>
#deliveryList tr {
  cursor: pointer;
}
</style>
<template>
  <v-card>
    <portal to="topnav-title">Material / Lieferungen</portal>
    <MaterialNavigation />
    <v-card-title>Lieferungen</v-card-title>
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
      :items="deliveries"
      :items-per-page="20"
      :footer-props="{
        'items-per-page-options': [20, 50, -1],
        showFirstLastPage: true,
      }"
      :search="search"
      id="deliveryList"
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
      <template v-slot:item.id="{ item }">
        <v-icon small>mdi-pencil</v-icon>
        <span class="text--secondary">{{ item.id }}</span>
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
  name: "MaterialDeliveryList",
  components: { MaterialNavigation },
  data: () => ({
    search: "",
    headers: [
      { text: "Name", value: "name" },
      { text: "Lieferant", value: "supplier.name" },
      { text: "Bestellungstyp", value: "supplier_delivery_type.name" },
      { text: "Ausführung", value: "delivery_type.name" },
      { text: "Ausgabe", value: "delivery", align: "right" },
      { text: "Rücknahme", value: "return", align: "right" },
      { text: "Summe", value: "total.amount", align: "right" },
      { text: "", value: "id" },
    ],
    deliveries: [],
    id: 0,
  }),
  methods: {
    handleClick(item) {
      this.$router.push({
        name: "materialDeliveryDetail",
        params: { id: item.id },
      });
    },
    async fetchData() {
      try {
        const [
          supplierDeliveryItems,
          supplierDeliveries,
          supplierItems,
          supplierDeliveryTypes,
          deliveryTypes,
          suppliers,
        ] = await Promise.all([
          apiAuthenticated("/items/mat_supplier_delivery_item", limit(-1)),
          apiAuthenticated("/items/mat_supplier_delivery", limit(-1)),
          apiAuthenticated("/items/mat_supplier_item", limit(-1)),
          apiAuthenticated("/items/mat_supplier_delivery_type"),
          apiAuthenticated("/items/mat_delivery_type"),
          apiAuthenticated("/items/mat_supplier"),
        ]);
        joinInPlace(supplierDeliveryItems, supplierItems, "supplier_item");
        joinInPlace(supplierDeliveries, suppliers, "supplier");
        joinInPlace(
          supplierDeliveries,
          supplierDeliveryTypes,
          "supplier_delivery_type"
        );
        joinInPlace(supplierDeliveries, deliveryTypes, "delivery_type");
        joinInPlace(
          supplierDeliveryItems,
          supplierDeliveries,
          "supplier_delivery"
        );
        const totalItems = supplierDeliveryItems.reduce((acc, item) => {
          const thing = acc.find(
            (group) => group.id === item.supplier_delivery.id
          );
          if (thing) {
            thing.amount += item.quantity * item.supplier_item.price;
          } else {
            acc.push({
              id: item.supplier_delivery.id,
              amount: item.quantity * item.supplier_item.price,
            });
          }
          return acc;
        }, []);
        supplierDeliveries.forEach((element) => {
          element.total = element.id;
        });
        joinInPlace(supplierDeliveries, totalItems, "total");
        this.deliveries = Object.freeze(supplierDeliveries);
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
    if (localStorage.deliverySearch) {
      this.search = localStorage.deliverySearch;
    }
  },
  watch: {
    search(deliverySearch) {
      if (deliverySearch === null) {
        this.search = "";
      } else {
        localStorage.deliverySearch = deliverySearch;
      }
    },
  },
};
</script>
