<template>
  <div>
    <portal to="topnav-title">Anlagen</portal>

    <v-data-table
      :headers="[
        { text: 'ID', value: 'anlagen_id', filterable: true, width: '50px' },
        {
          text: 'Name',
          value: 'anlagenname',
          filterable: true,
          width: '180px',
        },
        {
          text: 'Beschreibung',
          value: 'beschreibung',
          filterable: true,
          width: '200px',
        },
        {
          text: 'Kontaktperson',
          value: 'kontaktperson',
          filterable: false,
          width: '150px',
        },
        {
          text: 'Dateiablage',
          value: 'ordner_link',
          filterable: false,
          width: '50px',
        },
        // this is for filtering/searching, _projektnamen is not actually rendered
        // but a custom slot
        { text: 'Projekte', value: '_projektnamen', filterable: true },
      ]"
      :items="itemsFilteredOnlyMine"
      :search="filterText"
      item-key="id"
      :items-per-page="10"
      hide-default-footer
    >
      <template v-slot:top="{ pagination, options, updateOptions }">
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                hide-details
                clearable
                prepend-inner-icon="mdi-magnify"
                label="Suche Anlagen oder Projekte"
                v-model="filterText"
              />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-checkbox
                v-model="filterOnlyMine"
                solo-inverted
                hide-details
                label="Nur meine Anlagen anzeigen"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-data-footer
                show-first-last-page
                :items-per-page-options="[10, 20, 50, -1]"
                style="border: none"
                :pagination="pagination"
                :options="options"
                @update:options="updateOptions"
                items-per-page-text="$vuetify.dataTable.itemsPerPageText"
              />
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item="{ item }">
        <router-link
          :to="{ name: 'logomatAnlageDetail', params: { id: item.anlagen_id } }"
          style="cursor: pointer"
          custom
          v-slot="{ navigate }"
        >
          <tr @click="navigate" role="link">
            <td>{{ item.anlagen_id }}</td>
            <td>
              <b>{{ item.anlagenname }}</b>
            </td>
            <td :title="item.beschreibung">
              {{ item.beschreibung }}
            </td>
            <td>
              <Person :item="item.kontaktperson" />
            </td>
            <td>
              <OrdnerLink :item="item.ordner_link" />
            </td>
            <td>
              <v-chip
                v-for="projekt in item._projekte"
                :key="projekt.id"
                label
                small
                style="margin: 1px"
                :input-value="true"
              >
                {{ stripTitle(projekt.name, item.anlagenname) }}
              </v-chip>
            </td>
          </tr>
        </router-link>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Person from "@/components/anlagen/Person";
import OrdnerLink from "@/components/anlagen/OrdnerLink";

import { mapState } from "vuex";
import { stripTitle } from "@/lib/util";

export default {
  name: "AnlageList",
  data: () => ({
    filterText: "",
    filterOnlyMine: false,
  }),
  methods: {
    stripTitle,
  },
  computed: {
    itemsFilteredOnlyMine() {
      if (!this.filterOnlyMine) {
        return this.items;
      }
      return this.items.filter((item) => {
        return item?.kontaktperson?.id === parseInt(this.user.id);
      });
    },
    ...mapState({
      user: "user",
      items: "anlagen",
    }),
  },
  components: {
    OrdnerLink,
    Person,
  },
};
</script>
