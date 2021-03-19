<style>
#clientList tr {
  cursor: pointer;
}
</style>
<template>
  <v-card>
    <portal to="topnav-title">Material / Ressorts</portal>
    <MaterialNavigation></MaterialNavigation>

    <v-card-title>Ressort</v-card-title>
    <v-card-text>
      <v-select
        :items="departements"
        label="Ressort"
        item-text="name"
        item-value="id"
        @change="handleChange"
      ></v-select>
    </v-card-text>
    <v-data-table
      dense
      :headers="headers"
      :items="clients"
      :items-per-page="20"
      :footer-props="{
        'items-per-page-options': [20, 50, -1],
        showFirstLastPage: true,
      }"
      id="clientList"
      class="elevation-1"
      @click:row="handleClick"
    >
      <template v-slot:item.amount="{ item }">
        <span>{{
          item.amount.toLocaleString(undefined, {
            style: "currency",
            currency: "CHF",
          })
        }}</span>
      </template>
    </v-data-table>
    <v-card-text v-if="showTotal">
      <span v-if="showClient">{{ total.client }} Kunden, </span
      >{{ total.order }} Bestellungen, {{ total.orderItem }} Positionen, Summe
      {{
        total.amount.toLocaleString(undefined, {
          style: "currency",
          currency: "CHF",
        })
      }}
    </v-card-text>
  </v-card>
</template>

<script>
import { apiAuthenticated, ApiError, filter, limit } from "@/lib/api";
import { joinInPlace } from "@/lib/join";
import MaterialNavigation from "@/components/material/MaterialNavigation";

export default {
  name: "MaterialDepartementList",
  components: { MaterialNavigation },
  data: () => ({
    departements: [],
    headers: [
      { text: "Kunde", value: "client" },
      { text: "Bestellungen", value: "order" },
      { text: "Positionen", value: "orderItem" },
      { text: "Summe", value: "amount", align: "right" },
    ],
    clients: [],
    showTotal: false,
    showClient: null,
    total: null,
  }),
  methods: {
    handleClick(item) {
      // TODO replace this with store or URL component
      localStorage.orderSearch = item.client;
      this.$router.push({ name: "materialOrderList" });
    },
    async handleChange(value) {
      try {
        const [clients, orders, orderItems, items] = await Promise.all([
          apiAuthenticated(
            "/items/mat_client",
            filter("departement", "=", value)
          ),
          apiAuthenticated("/items/mat_order"),
          apiAuthenticated("/items/mat_order_item", limit(-1)),
          apiAuthenticated("/items/mat_item", limit(-1)),
        ]);
        joinInPlace(orders, clients, "client");
        joinInPlace(orderItems, orders, "order");
        joinInPlace(orderItems, items, "item");
        const totalOrders = orderItems.reduce((acc, item) => {
          if (item.order.client) {
            const thing = acc.find((group) => group.order === item.order.name);
            if (thing) {
              thing.orderItem += 1;
              thing.amount += item.quantity * item.item.price;
            } else {
              acc.push({
                order: item.order.name,
                client: item.order.client.name,
                orderItem: 1,
                amount: item.quantity * item.item.price,
              });
            }
          }
          return acc;
        }, []);
        const totalClients = totalOrders.reduce((acc, item) => {
          const thing = acc.find((group) => group.client === item.client);
          if (thing) {
            thing.order += 1;
            thing.orderItem += item.orderItem;
            thing.amount += item.amount;
          } else {
            acc.push({
              client: item.client,
              order: 1,
              orderItem: item.orderItem,
              amount: item.amount,
            });
          }
          return acc;
        }, []);
        this.clients = Object.freeze(totalClients);
        this.total = totalClients.reduce(
          (acc, item) => {
            acc.client += 1;
            acc.order += item.order;
            acc.orderItem += item.orderItem;
            acc.amount += item.amount;
            return acc;
          },
          { client: 0, order: 0, orderItem: 0, amount: 0 }
        );
        this.showClient = this.total.client > 1;
        this.showTotal = true;
      } catch (err) {
        if (err instanceof ApiError) {
          this.$emit("api-error", err.userMessage());
        } else {
          throw err;
        }
      }
    },
    async fetchData() {
      try {
        const [departements] = await Promise.all([
          apiAuthenticated("/items/mat_departement"),
        ]);
        this.departements = Object.freeze(departements);
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
};
</script>
