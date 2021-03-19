<template>
  <v-container fluid>
    <portal to="topnav-title">Material</portal>
    <MaterialNavigation></MaterialNavigation>

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
            <v-btn block :to="{ name: 'materialOrderList' }"
              >Bestellungen</v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn block :to="{ name: 'materialDepartementList' }"
              >Ressorts</v-btn
            >
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
            <v-btn block :to="{ name: 'materialItemList' }">Artikel</v-btn>
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
        <v-btn block :to="{ name: 'materialSponsoringList' }"
          >Sponsorings</v-btn
        >
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import MaterialNavigation from "@/components/material/MaterialNavigation";

export default {
  name: "MaterialDashboard",
  components: { MaterialNavigation },
};
</script>
