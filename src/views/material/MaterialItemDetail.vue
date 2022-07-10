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
          <td>Katalog (Teilbereich, Bestellungstyp)</td>
          <td>
            {{ item.catalog.name }} ({{ item.catalog.section.name }},
            {{ item.catalog.order_type.name }})
          </td>
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
      :items-per-page="-1"
      hide-default-footer
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
      Total {{ total }} {{ item.unit.name }} ( {{ concurrent }} gleichzeitig )
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
    <v-card-title>Lieferungen</v-card-title>
    <v-data-table
      dense
      :headers="deliveries"
      :items="itemDeliveries"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:item.supplier_delivery.delivery="{ item }">
        <span>{{ shortDate(item.supplier_delivery.delivery) }}</span>
      </template>
      <template v-slot:item.supplier_delivery.return="{ item }">
        <span>{{ shortDate(item.supplier_delivery.return) }}</span>
      </template>
    </v-data-table>
    <v-sparkline
      color="text"
      :line-width="1"
      :value="sparkValue"
      :labels="sparkLabels"
      :label-size="2"
    ></v-sparkline>
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
      { text: "Status", value: "order.state.name", width: "150px" },
      {
        text: "Ressort",
        value: "order.client.department.name",
        width: "150px",
      },
      { text: "Kunde", value: "order.client.name" },
      { text: "Bestellungstyp", value: "order.order_type.name" },
      { text: "Ausführung", value: "order.delivery_type.name", width: "100px" },
      { text: "Ausgabe", value: "order.delivery", align: "right" },
      {
        text: "Rücknahme",
        value: "order.return",
        width: "100px",
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
    deliveries: [
      { text: "Anzahl", value: "quantity" },
      { text: "Artikel", value: "supplier_item.name" },
      { text: "Lieferant", value: "supplier_delivery.supplier.name" },
      { text: "Lieferung", value: "supplier_delivery.name" },
      {
        text: "Lieferungstyp",
        value: "supplier_delivery.supplier_delivery_type.name",
      },
      { text: "Ausführung", value: "supplier_delivery.delivery_type.name" },
      { text: "Ausgabe", value: "supplier_delivery.delivery", align: "right" },
      { text: "Rücknahme", value: "supplier_delivery.return", align: "right" },
    ],
    itemDeliveries: [],
    item: {},
    showItem: false,
    total: null,
    concurrent: null,
    showTotal: false,
    sparkValue: [],
    sparkLabels: [],
  }),
  methods: {
    async fetchData() {
      try {
        const [
          item,
          units,
          catalogs,
          sections,
          orderTypes,
        ] = await Promise.all([
          apiAuthenticated("/items/mat_item", filter("id", "=", this.itemId)),
          apiAuthenticated("/items/mat_unit"),
          apiAuthenticated("/items/mat_catalog"),
          apiAuthenticated("/items/mat_section"),
          apiAuthenticated("/items/mat_order_type"),
        ]);
        joinInPlace(item, units, "unit");
        joinInPlace(catalogs, sections, "section");
        joinInPlace(catalogs, orderTypes, "order_type");
        joinInPlace(item, catalogs, "catalog");
        this.item = Object.freeze(item[0]);
        this.showItem = true;
        const [
          itemOrders,
          orders,
          states,
          clients,
          departments,
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
          apiAuthenticated("/items/mat_department"),
          apiAuthenticated("/items/mat_order_type"),
          apiAuthenticated("/items/mat_delivery_type"),
        ]);
        joinInPlace(orders, states, "state");
        joinInPlace(clients, departments, "department");
        joinInPlace(orders, clients, "client");
        joinInPlace(orders, order_types, "order_type");
        joinInPlace(orders, delivery_types, "delivery_type");
        joinInPlace(itemOrders, orders, "order");
        this.itemOrders = Object.freeze(itemOrders);
        this.total = itemOrders.reduce((acc, item) => {
          return acc + item.quantity;
        }, 0);
        for (
          let sparkDate = DateTime.fromISO("2022-07-07");
          sparkDate <= DateTime.fromISO("2022-08-15");
          sparkDate = sparkDate.plus({ days: 1 })
        ) {
          this.sparkValue.push(
            itemOrders.reduce((acc, item) => {
              return DateTime.fromISO(item.order.delivery) <= sparkDate &&
                (item.order.return == null ||
                  DateTime.fromISO(item.order.return) >= sparkDate)
                ? acc + item.quantity
                : acc;
            }, 0)
          );
          this.sparkLabels.push(this.shorterDate(sparkDate));
        }
        this.concurrent = Math.max(...this.sparkValue);
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
        const itemSupplierIds = itemSuppliers.reduce((acc, item) => {
          return acc != "" ? acc + "," + item.id : item.id;
        }, "");
        const [
          itemDeliveries,
          deliveries,
          supplier_delivery_types,
        ] = await Promise.all([
          apiAuthenticated(
            "/items/mat_supplier_delivery_item",
            filter("supplier_item", "in", itemSupplierIds)
          ),
          apiAuthenticated("/items/mat_supplier_delivery"),
          apiAuthenticated("/items/mat_supplier_delivery_type"),
        ]);
        joinInPlace(itemDeliveries, itemSuppliers, "supplier_item");
        joinInPlace(
          deliveries,
          supplier_delivery_types,
          "supplier_delivery_type"
        );
        joinInPlace(deliveries, suppliers, "supplier");
        joinInPlace(deliveries, delivery_types, "delivery_type");
        joinInPlace(itemDeliveries, deliveries, "supplier_delivery");
        this.itemDeliveries = Object.freeze(itemDeliveries);
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
    shorterDate(dateTime) {
      return dateTime
        .setLocale("de-ch")
        .toLocaleString({ month: "2-digit", day: "2-digit" });
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
