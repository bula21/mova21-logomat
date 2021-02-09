<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Material</v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <v-btn block to="/material/order">Bestellung</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn block disabled>Ressort</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn block disabled>Kunde</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn block disabled>Status</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn block disabled>Bestellungstyp</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn block disabled>Ausführung</v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-col>
              <v-btn block to="/material/item">Artikel</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn block disabled>Katalog</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn block disabled>Einheit</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block to="/material/sponsoring">Sponsoring</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { apiAuthenticated, ApiError } from "@/lib/api";
import { joinInPlace } from "@/lib/join";
import { DateTime } from "luxon";

export default {
  name: "MaterialDashboard",
  components: {},
  data: () => ({
    search: "",
    headers: [
      { text: "Name", value: "name" },
      { text: "Status", value: "state.name", width: "120px" },
      { text: "Ressort", value: "client.departement.name", width: "160px" },
      { text: "Kunde", value: "client.name" },
      { text: "Bestellungstyp", value: "order_type.name" },
      { text: "Ausführung", value: "delivery_type.name", width: "120px" },
      { text: "Ausgabe", value: "delivery" },
      { text: "Rücknahme", value: "return", width: "120px" },
      { text: "", value: "id" },
    ],
    orders: [],
    id: 0,
  }),
  methods: {
    handleClick(item) {
      this.$router.push({ path: "/material/order/" + item.id });
    },
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
        this.orders = Object.freeze(orders);
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
