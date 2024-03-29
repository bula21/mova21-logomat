<template>
  <v-card>
    <portal to="topnav-title">Material / Sponsoring</portal>
    <MaterialNavigation />

    <v-card-title>Sponsoring</v-card-title>
    <v-data-table
      dense
      :headers="headers"
      :items="orderItems"
      :items-per-page="20"
      :footer-props="{
        'items-per-page-options': [20, 50, -1],
        showFirstLastPage: true,
      }"
      class="elevation-1"
    >
      <template v-slot:item.von="{ item }">
        <span>{{ shortDate(item.von) }}</span>
      </template>
      <template v-slot:item.bis="{ item }">
        <span>{{ shortDate(item.bis) }}</span>
      </template>
    </v-data-table>
    <v-card-text>
      <v-btn v-on:click="download">Export</v-btn>
    </v-card-text>
    <!--
    <v-card-text>
      <v-btn v-on:click="prog">Export Materialliste Ressort Programm</v-btn>
    </v-card-text>
    -->
  </v-card>
</template>

<script>
import { apiAuthenticated, ApiError, limit } from "@/lib/api";
import { joinInPlace } from "@/lib/join";
import { DateTime } from "luxon";
import XLSX from "xlsx";

import MaterialNavigation from "@/components/material/MaterialNavigation";

export default {
  name: "MaterialSponsoringList",
  components: { MaterialNavigation },
  props: {
    orderId: String,
  },
  data: () => ({
    headers: [
      { text: "Ressort", value: "ressort" },
      { text: "Bereich", value: "bereich" },
      { text: "Teilbereich", value: "teilbereich" },
      { text: "Pfadiname", value: "pfadiname" },
      { text: "Name + Vorname", value: "name_vorname" },
      { text: "Detailierter Beschrieb der Sachleistung", value: "name" },
      { text: "Mengeneinheit", value: "einheit" },
      { text: "Anzahl", value: "anzahl", align: "right" },
      {
        text: "mögliche Hersteller/Lieferanten/Artikelnummer",
        value: "lieferant",
      },
      { text: "Benötigt von", value: "von", align: "right" },
      { text: "Benötigt bis", value: "bis", align: "right" },
      { text: "Sonstige Bemerkungen", value: "bemerkung" },
    ],
    orderItems: [],
  }),
  methods: {
    async fetchData() {
      try {
        const [
          orders,
          orderItems,
          items,
          units,
          supplierItems,
          suppliers,
        ] = await Promise.all([
          apiAuthenticated("/items/mat_order"),
          apiAuthenticated("/items/mat_order_item", limit(-1)),
          apiAuthenticated("/items/mat_item", limit(-1)),
          apiAuthenticated("/items/mat_unit"),
          apiAuthenticated("/items/mat_supplier_item", limit(-1)),
          apiAuthenticated("/items/mat_supplier"),
        ]);
        joinInPlace(orderItems, orders, "order");
        joinInPlace(items, units, "unit");
        joinInPlace(supplierItems, suppliers, "supplier");
        const supplierTexts = supplierItems.reduce((acc, item) => {
          const thing = acc.find((group) => group.id === item.item);
          const text =
            item.supplier.name +
            ", " +
            item.name +
            (item.code ? ", " + item.code : "");
          if (thing) {
            thing.text += "; " + text;
          } else {
            acc.push({ id: item.item, text: text });
          }
          return acc;
        }, []);
        items.forEach((item) => {
          item.supplier = item.id;
        });
        joinInPlace(items, supplierTexts, "supplier");
        joinInPlace(orderItems, items, "item");
        const mappedItems = orderItems
          .map((orderItem) => ({
            ressort: "Logistik",
            bereich: "Material",
            teilbereich: null,
            pfadiname: "Selva",
            name_vorname: "Hotz Andreas",
            name: orderItem.item.name,
            einheit: orderItem.item.unit.name,
            anzahl: orderItem.quantity,
            lieferant: orderItem.item.supplier
              ? orderItem.item.supplier.text
              : null,
            von: orderItem.order.delivery
              ? DateTime.fromISO(orderItem.order.delivery)
              : null,
            bis: orderItem.order.return
              ? DateTime.fromISO(orderItem.order.return)
              : null,
            bemerkung: orderItem.item.description,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        const totalItems = mappedItems.reduce((acc, item) => {
          const thing = acc.find((group) => group.name === item.name);
          if (thing) {
            thing.anzahl += item.anzahl;
            if (thing.von) {
              if (item.von) {
                thing.von = DateTime.min(thing.von, item.von);
              }
            } else {
              thing.von = item.von;
            }
            if (thing.bis) {
              if (item.bis) {
                thing.bis = DateTime.max(thing.bis, item.bis);
              }
            } else {
              thing.bis = item.bis;
            }
          } else {
            acc.push(item);
          }
          return acc;
        }, []);
        this.orderItems = Object.freeze(totalItems);
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
        return date.setLocale("de-ch").toLocaleString(DateTime.DATE_SHORT);
      } else {
        return null;
      }
    },
    download: function () {
      const mappedItems = this.orderItems.map((item) => {
        // noinspection JSNonASCIINames,NonAsciiCharacters
        return {
          Ressort: item.ressort,
          Bereich: item.bereich,
          Teilbereich: item.teilbereich,
          Pfadiname: item.pfadiname,
          "Name + Vorname": item.name_vorname,
          "Detailierter Beschrieb der Sachleistung": item.name,
          Mengeneinheit: item.einheit,
          Anzahl: item.anzahl,
          "mögliche Hersteller/Lieferanten/Artikelnummer": item.lieferant,
          "Benötigt von": this.shortDate(item.von),
          "Benötigt bis": this.shortDate(item.bis),
          "Sonstige Bemerkungen": item.bemerkung,
        };
      });
      const data = XLSX.utils.json_to_sheet(mappedItems);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, data, "data");
      XLSX.writeFile(wb, "sponsoring.xlsx");
    },
    /*
    async prog() {
      try {
        const items = await apiAuthenticated(
          "/items/prog_material",
          limit("-1")
        );
        const data = XLSX.utils.json_to_sheet(items);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, data, "data");
        XLSX.writeFile(wb, "prog_material.xlsx");
      } catch (err) {
        if (err instanceof ApiError) {
          this.$emit("api-error", err.userMessage());
        } else {
          throw err;
        }
      }
    },
    */
  },
  created() {
    this.fetchData();
  },
};
</script>
