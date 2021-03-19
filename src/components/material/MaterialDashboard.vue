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
              <v-btn block to="/material/departement">Ressort</v-btn>
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
          <v-row>
            <v-col>
              <v-btn block disabled>Lieferant</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3"></v-col>
        <v-col cols="6">
          <v-btn block to="/material/sponsoring">Sponsoring</v-btn>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "MaterialDashboard",
  components: {},
  methods: {},
};
</script>
