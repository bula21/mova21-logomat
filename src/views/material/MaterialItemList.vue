<style>
#itemList tr {
  cursor: pointer;
}
</style>

<template>
  <v-card>
    <portal to="topnav-title">Material / Artikel</portal>
    <MaterialNavigation />

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
      loading="true"
    >
      <template v-slot:item.item.price="{ item }">
        <span>{{ item.item.price.toFixed(2) }}</span>
      </template>
      <template v-slot:item.item.id="{ item }">
        <v-icon small>mdi-pencil</v-icon>
        <span class="text--secondary">{{ item.item.id }}</span>
      </template>
    </v-data-table>
    <v-card-text>
      <v-row>
        <v-col><v-btn v-on:click="downloadBasic">Export Basic</v-btn></v-col>
        <v-col><v-btn v-on:click="downloadPro">Export Pro</v-btn></v-col>
        <v-col><v-btn v-on:click="downloadPlus">Export Plus</v-btn></v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { apiAuthenticated, ApiError, limit } from "@/lib/api";
import { joinInPlace } from "@/lib/join";
import XLSX from "xlsx";

import MaterialNavigation from "@/components/material/MaterialNavigation";

export default {
  name: "MaterialItemList",
  components: { MaterialNavigation },
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
      this.$router.push({
        name: "materialItemDetail",
        params: { id: item.item.id },
      });
    },
    async fetchData() {
      try {
        const [
          orderItems,
          items,
          units,
          catalogs,
          //          sections,
          //          orderTypes,
          //          supplierItems,
          //          suppliers,
        ] = await Promise.all([
          apiAuthenticated("/items/mat_order_item", limit(-1)),
          apiAuthenticated("/items/mat_item", limit(-1)),
          apiAuthenticated("/items/mat_unit"),
          apiAuthenticated("/items/mat_catalog"),
          //          apiAuthenticated("/items/mat_section"),
          //          apiAuthenticated("/items/mat_order_type"),
          //          apiAuthenticated("/items/mat_supplier_item", limit(-1)),
          //          apiAuthenticated("/items/mat_supplier"),
        ]);
        const totalItems = orderItems.reduce((acc, item) => {
          const thing = acc.find((group) => group.item === item.item);
          if (thing) {
            thing.quantity += item.quantity;
          } else {
            acc.push({
              item: item.item,
              quantity: item.quantity,
              supplierItem: item.item,
            });
          }
          return acc;
        }, []);
        joinInPlace(items, units, "unit");
        //        joinInPlace(catalogs, sections, "section");
        //        joinInPlace(catalogs, orderTypes, "order_type");
        joinInPlace(items, catalogs, "catalog");
        joinInPlace(totalItems, items, "item");
        //        const supplierItemsUnique = supplierItems.reduce((acc, item) => {
        //          const unique = acc.find((unique) => unique.item === item.item);
        //          if (unique == null) {
        //            acc.push(item);
        //          }
        //          return acc;
        //        }, []);
        //        joinInPlace(supplierItemsUnique, suppliers, "supplier");
        //        joinInPlace(totalItems, supplierItemsUnique, "supplierItem", "item");
        this.totalItems = Object.freeze(totalItems);
      } catch (err) {
        if (err instanceof ApiError) {
          this.$emit("api-error", err.userMessage());
        } else {
          throw err;
        }
      }
    },
    downloadBasic: function () {
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
      XLSX.writeFile(wb, "artikel_basic.xlsx");
    },
    async downloadPro() {
      try {
        const [
          orderItems,
          items,
          units,
          catalogs,
          sections,
          orderTypes,
          supplierItems,
          suppliers,
          supplierDeliveryItems,
          supplierDeliveries,
        ] = await Promise.all([
          apiAuthenticated("/items/mat_order_item", limit(-1)),
          apiAuthenticated("/items/mat_item", limit(-1)),
          apiAuthenticated("/items/mat_unit"),
          apiAuthenticated("/items/mat_catalog"),
          apiAuthenticated("/items/mat_section"),
          apiAuthenticated("/items/mat_order_type"),
          apiAuthenticated("/items/mat_supplier_item", limit(-1)),
          apiAuthenticated("/items/mat_supplier"),
          apiAuthenticated("/items/mat_supplier_delivery_item", limit(-1)),
          apiAuthenticated("/items/mat_supplier_delivery"),
        ]);
        const totalItems = orderItems.reduce((acc, item) => {
          const thing = acc.find((group) => group.item === item.item);
          if (thing) {
            thing.quantity += item.quantity;
          } else {
            acc.push({
              item: item.item,
              quantity: item.quantity,
              supplierItem: item.item,
              supplierDeliveryItem: item.item,
            });
          }
          return acc;
        }, []);
        joinInPlace(items, units, "unit");
        joinInPlace(catalogs, sections, "section");
        joinInPlace(catalogs, orderTypes, "order_type");
        joinInPlace(items, catalogs, "catalog");
        joinInPlace(totalItems, items, "item");
        joinInPlace(supplierItems, suppliers, "supplier");
        const supplierItemsUnique = supplierItems.reduce((acc, item) => {
          const unique = acc.find((unique) => unique.item === item.item);
          if (unique == null) {
            acc.push({
              item: item.item,
              supplier: item.supplier.name,
              name: item.name,
              code: item.code,
            });
          } else {
            unique.supplier = "...";
            unique.name = "...";
            unique.code = "...";
          }
          return acc;
        }, []);
        joinInPlace(totalItems, supplierItemsUnique, "supplierItem", "item");
        joinInPlace(
          supplierDeliveryItems,
          supplierDeliveries,
          "supplier_delivery"
        );
        joinInPlace(supplierDeliveryItems, supplierItems, "supplier_item");
        const supplierDeliveryItemsUnique = supplierDeliveryItems.reduce(
          (acc, item) => {
            const unique = acc.find(
              (unique) => unique.item === item.supplier_item.item
            );
            if (unique == null) {
              acc.push({
                item: item.supplier_item.item,
                quantity: item.quantity,
                supplier_delivery: item.supplier_delivery.name,
              });
            } else {
              unique.quantity += item.quantity;
              unique.supplier_delivery = "...";
            }
            return acc;
          },
          []
        );
        joinInPlace(
          totalItems,
          supplierDeliveryItemsUnique,
          "supplierDeliveryItem",
          "item"
        );
        const mappedItems = totalItems.map((item) => {
          return {
            ID: item.item.id,
            Anzahl: item.quantity,
            Einheit: item.item.unit.name,
            Name: item.item.name,
            Beschreibung: item.item.description,
            Katalog: item.item.catalog.name,
            Teilbereich: item.item.catalog.section.name,
            Bestellungstyp: item.item.catalog.order_type.name,
            Richtpreis: item.item.price,
            Lieferant: item.supplierItem ? item.supplierItem.supplier : null,
            Artikel: item.supplierItem ? item.supplierItem.name : null,
            Code: item.supplierItem ? item.supplierItem.code : null,
            Anzahl_Lieferung: item.supplierDeliveryItem
              ? item.supplierDeliveryItem.quantity
              : null,
            Name_Lieferung: item.supplierDeliveryItem
              ? item.supplierDeliveryItem.supplier_delivery
              : null,
            Delta: item.supplierDeliveryItem
              ? item.supplierDeliveryItem.quantity - item.quantity
              : 0 - item.quantity,
          };
        });
        const data = XLSX.utils.json_to_sheet(mappedItems);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, data, "data");
        XLSX.writeFile(wb, "artikel_pro.xlsx");
      } catch (err) {
        if (err instanceof ApiError) {
          this.$emit("api-error", err.userMessage());
        } else {
          throw err;
        }
      }
    },
    async downloadPlus() {
      try {
        const [
          orders,
          clients,
          departments,
          deliveryTypes,
          orderItems,
          items,
          units,
          catalogs,
          sections,
          orderTypes,
        ] = await Promise.all([
          apiAuthenticated("/items/mat_order"),
          apiAuthenticated("/items/mat_client"),
          apiAuthenticated("/items/mat_department"),
          apiAuthenticated("/items/mat_delivery_type"),
          apiAuthenticated("/items/mat_order_item", limit(-1)),
          apiAuthenticated("/items/mat_item", limit(-1)),
          apiAuthenticated("/items/mat_unit"),
          apiAuthenticated("/items/mat_catalog"),
          apiAuthenticated("/items/mat_section"),
          apiAuthenticated("/items/mat_order_type"),
        ]);
        joinInPlace(clients, departments, "department");
        joinInPlace(orders, clients, "client");
        joinInPlace(orders, deliveryTypes, "delivery_type");
        joinInPlace(items, units, "unit");
        joinInPlace(catalogs, sections, "section");
        joinInPlace(catalogs, orderTypes, "order_type");
        joinInPlace(items, catalogs, "catalog");
        joinInPlace(orderItems, orders, "order");
        joinInPlace(orderItems, items, "item");
        const mappedItems = orderItems.map((item) => {
          return {
            Ressort: item.order.client.department.name,
            Kunde: item.order.client.name,
            Bestellung: item.order.name,
            Ausführung: item.order.delivery_type.name,
            Ausgabe: item.order.delivery,
            Rücknahme: item.order.return,
            Anzahl: item.quantity,
            Einheit: item.item.unit.name,
            Artikel: item.item.name,
            Katalog: item.item.catalog.name,
            Teilbereich: item.item.catalog.section.name,
            Bestellungstyp: item.item.catalog.order_type.name,
          };
        });
        const data = XLSX.utils.json_to_sheet(mappedItems);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, data, "data");
        XLSX.writeFile(wb, "artikel_plus.xlsx");
      } catch (err) {
        if (err instanceof ApiError) {
          this.$emit("api-error", err.userMessage());
        } else {
          throw err;
        }
      }
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
