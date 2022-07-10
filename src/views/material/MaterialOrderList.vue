<style>
#orderList tr {
  cursor: pointer;
}
</style>
<template>
  <v-card>
    <portal to="topnav-title">Material / Bestellungen</portal>
    <MaterialNavigation />
    <v-card-title>Bestellungen</v-card-title>
    <v-card-text>
      <v-checkbox
        v-model="myOrders"
        label="Meine Bestellungen"
        v-if="showMyOrders"
      />
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
      :items="orders"
      :options.sync="options"
      :footer-props="{ disableItemsPerPage: true }"
      :search="search"
      :item-class="itemRowColor"
      id="orderList"
      class="elevation-1"
      @click:row="handleClick"
      loading="true"
    >
      <template v-slot:item.state.name="{ item }">
        <v-chip :color="getColor(item.state)" outlined>
          {{ item.state.name }}
        </v-chip>
      </template>
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
import { mapState } from "vuex";

import MaterialNavigation from "@/components/material/MaterialNavigation";

export default {
  name: "MaterialOrderList",
  components: { MaterialNavigation },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
  data: () => ({
    search: "",
    myOrders: false,
    showMyOrders: false,
    headers: [
      { text: "Name", value: "name" },
      { text: "Status", value: "state.name", width: "150px" },
      { text: "Ressort", value: "client.department.name", width: "150px" },
      { text: "Kunde", value: "client.name" },
      { text: "Bestellungstyp", value: "order_type.name" },
      { text: "Ausführung", value: "delivery_type.name", width: "100px" },
      { text: "Ausgabe", value: "delivery", align: "right" },
      { text: "Rücknahme", value: "return", width: "100px", align: "right" },
      { text: "Summe", value: "total.amount", align: "right" },
      { text: "", value: "id" },
    ],
    orders: [],
    id: 0,
    options: null,
  }),
  methods: {
    itemRowColor(item) {
      return item.bill ? "red accent-1" : "";
    },
    handleClick(item) {
      this.$router.push({
        name: "materialOrderDetail",
        params: { id: item.id },
      });
    },
    async fetchData() {
      try {
        const [
          orders,
          states,
          clients,
          departments,
          order_types,
          delivery_types,
          orderItems,
          items,
        ] = await Promise.all([
          apiAuthenticated("/items/mat_order"),
          apiAuthenticated("/items/mat_state"),
          apiAuthenticated("/items/mat_client"),
          apiAuthenticated("/items/mat_department"),
          apiAuthenticated("/items/mat_order_type"),
          apiAuthenticated("/items/mat_delivery_type"),
          apiAuthenticated("/items/mat_order_item", limit(-1)),
          apiAuthenticated("/items/mat_item", limit(-1)),
        ]);
        joinInPlace(orders, states, "state");
        joinInPlace(clients, departments, "department");
        joinInPlace(orders, clients, "client");
        joinInPlace(orders, order_types, "order_type");
        joinInPlace(orders, delivery_types, "delivery_type");
        joinInPlace(orderItems, items, "item");
        orders.forEach((order) => {
          if (
            order.client.name.toLowerCase() === this.user.email.toLowerCase()
          ) {
            this.showMyOrders = true;
          }
        });
        var filteredOrders = orders;
        if (this.myOrders) {
          filteredOrders = filteredOrders.filter(
            (order) =>
              this.user.email.toLowerCase() === order.client.name.toLowerCase()
          );
        }
        const totalItems = orderItems.reduce((acc, item) => {
          const thing = acc.find((group) => group.id === item.order);
          if (thing) {
            thing.amount += item.quantity * item.item.price;
          } else {
            acc.push({
              id: item.order,
              amount: item.quantity * item.item.price,
            });
          }
          return acc;
        }, []);
        orders.forEach((element) => {
          element.total = element.id;
        });
        joinInPlace(filteredOrders, totalItems, "total");
        this.orders = Object.freeze(filteredOrders);
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
    getColor(state) {
      if (state.id == 1) return "black";
      else if (state.id == 2) return "orange";
      else if (state.id == 3) return "blue";
      else if (state.id == 4) return "green";
      else return "red";
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {
    if (localStorage.orderSearch) {
      this.search = localStorage.orderSearch;
    }
    if (localStorage.orderMyOrders) {
      this.myOrders = JSON.parse(localStorage.orderMyOrders);
    }
    if (localStorage.orderOptions) {
      this.options = JSON.parse(localStorage.orderOptions);
    }
  },
  watch: {
    search(orderSearch) {
      if (orderSearch === null) {
        this.search = "";
      } else {
        localStorage.orderSearch = orderSearch;
      }
    },
    myOrders(orderMyOrders) {
      localStorage.orderMyOrders = orderMyOrders;
      this.fetchData();
    },
    options(orderOptions) {
      localStorage.orderOptions = JSON.stringify(orderOptions);
    },
  },
};
</script>
