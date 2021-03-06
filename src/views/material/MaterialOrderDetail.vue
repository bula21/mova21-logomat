<template>
  <v-card>
    <portal to="topnav-title">Material / Bestellung / {{ order.name }}</portal>
    <MaterialNavigation />

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
        <tr>
          <td>Projekt</td>
          <td>{{ order.projekt }}</td>
        </tr>
        <tr>
          <td>Standort</td>
          <td>{{ order.standort }}</td>
        </tr>
      </v-simple-table>
    </v-card-text>
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
      <template v-slot:item.quantity="{ item }">
        <span v-if="item.cancellation === undefined"
          ><v-icon
            color="red"
            small
            v-on:click="cancel(item.id)"
            v-if="showConfirmLead"
            >mdi-delete</v-icon
          >
          {{ item.quantity }}</span
        >
        <span v-else class="text--disabled">( {{ item.quantity }} )</span>
      </template>
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
    <v-card-title>Bestätigungen</v-card-title>
    <v-data-table
      dense
      :headers="confirmationHeaders"
      :items="confirmationItems"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:item.time="{ item }">
        <span>{{ timestamp(item.time) }}</span>
      </template>
    </v-data-table>
    <v-card-text v-if="showConfirm">
      <v-btn v-on:click="confirm">Bestätigung</v-btn>
    </v-card-text>
    <v-card-text v-if="showConfirmLead">
      <v-btn v-on:click="confirm">Bestätigung Ressortleitung</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  apiAuthenticated,
  ApiError,
  filter,
  limit,
  apiAuthCreate,
} from "@/lib/api";
import { joinInPlace } from "@/lib/join";
import { DateTime } from "luxon";
import XLSX from "xlsx";
import { mapState } from "vuex";

import MaterialNavigation from "@/components/material/MaterialNavigation";

export default {
  name: "MaterialOrderDetail",
  components: { MaterialNavigation },
  computed: {
    ...mapState({
      user: "user",
    }),
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
    confirmationHeaders: [
      { text: "Name", value: "name" },
      { text: "Zeitpunkt", value: "time" },
    ],
    confirmationItems: [],
    showConfirm: false,
    showConfirmLead: false,
  }),
  methods: {
    async fetchData() {
      try {
        const [
          orders,
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
        joinInPlace(orders, states, "state");
        joinInPlace(clients, departements, "departement");
        joinInPlace(orders, clients, "client");
        joinInPlace(orders, order_types, "order_type");
        joinInPlace(orders, delivery_types, "delivery_type");
        var order = orders[0];
        if (order.projekt != null) {
          const projekte = await apiAuthenticated(
            "/items/projekt",
            filter("id", "=", order.projekt)
          );
          order.projekt = projekte[0].projektname;
          if (projekte[0].anlage != null) {
            const anlagen = await apiAuthenticated(
              "/items/anlage",
              filter("id", "=", projekte[0].anlage)
            );
            order.standort = anlagen[0].anlagenname;
            if (anlagen[0].standort) {
              order.standort += ", " + anlagen[0].standort;
            }
            if (anlagen[0].standortcode) {
              order.standort += ", " + anlagen[0].standortcode;
            }
          } else {
            order.standort = "n/a";
          }
        } else {
          order.projekt = "n/a";
          order.standort = "n/a";
        }
        if (
          order.state.id != 4 &&
          order.client.departement.lead.split(";").includes(this.user.email)
        ) {
          this.showConfirmLead = true;
        } else {
          if (order.state.id == 2) {
            this.showConfirm = true;
          }
        }
        this.order = Object.freeze(order);
        this.showOrder = true;
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
        const [
          orderItems,
          items,
          units,
          catalogs,
          cancellations,
        ] = await Promise.all([
          apiAuthenticated(
            "/items/mat_order_item",
            filter("order", "=", this.orderId)
          ),
          apiAuthenticated("/items/mat_item", limit(-1)),
          apiAuthenticated("/items/mat_unit"),
          apiAuthenticated("/items/mat_catalog"),
          apiAuthenticated("/items/mat_order_item_cancellation"),
        ]);
        joinInPlace(items, units, "unit");
        joinInPlace(items, catalogs, "catalog");
        joinInPlace(orderItems, items, "item");
        orderItems.forEach((element) => {
          element.total = element.quantity * element.item.price;
          element.cancellation = element.id;
        });
        joinInPlace(orderItems, cancellations, "cancellation", "order_item");
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
    async fetchConfirmation() {
      try {
        const confirmations = await apiAuthenticated(
          "/items/mat_order_confirmation",
          filter("order", "=", this.orderId)
        );
        this.confirmationItems = Object.freeze(confirmations);
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
    timestamp(time) {
      const date = DateTime.fromSQL(time + " UTC").setLocale("de-ch");
      //        .toLocal();
      return (
        date.toLocaleString(DateTime.DATE_HUGE) +
        " " +
        date.toLocaleString(DateTime.TIME_24_WITH_SECONDS)
      );
    },
    download() {
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
    async confirm() {
      const confirmation = {
        order: this.orderId,
        name: this.user.email,
      };
      this.showConfirm = false;
      this.showConfirmLead = false;
      await apiAuthCreate("/items/mat_order_confirmation", confirmation);
      this.fetchConfirmation();
    },
    async cancel(orderItem) {
      const cancellation = {
        order_item: orderItem,
        name: this.user.email,
      };
      await apiAuthCreate("/items/mat_order_item_cancellation", cancellation);
      this.fetchList();
    },
  },
  created() {
    this.fetchData();
    this.fetchList();
    this.fetchConfirmation();
  },
};
</script>
