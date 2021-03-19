<template>
  <portal to="sidenav-extended">
    <v-divider></v-divider>

    <v-list dense>
      <v-list-item link :to="{ name: 'materialOrderList' }">
        <v-list-item-action>
          <v-icon>mdi-cart-arrow-down</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Bestellungen</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link :to="{ name: 'materialItemList' }">
        <v-list-item-action>
          <v-icon>mdi-package-variant-closed</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Artikel</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link :to="{ name: 'materialDepartementList' }">
        <v-list-item-action>
          <v-icon>mdi-account-group</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Ressorts</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link :to="{ name: 'materialSponsoringList' }">
        <v-list-item-action>
          <v-icon>mdi-cash-multiple</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Sponsoring</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </portal>
</template>

<script>
export default {
  name: "MaterialNavigation2",
};
</script>
