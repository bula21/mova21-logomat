<template>
  <v-card>
    <v-card-title>
      <v-text-field
        flat
        hide-details
        clearable
        prepend-inner-icon="mdi-magnify"
        label="Suche Anlagen oder Projekte"
        class="hidden-sm-and-down"
        v-model="filterText"
      ></v-text-field>
      <v-checkbox
        v-model="filterOnlyMine"
        flat
        solo-inverted
        hide-details
        label="Nur meine Anlagen anzeigen"
      />
    </v-card-title>
    <v-data-table
      :headers="[
        { text: 'ID', value: 'anlagen_id', filterable: true },
        { text: 'Name', value: 'anlagenname', filterable: true },
        { text: 'Beschreibung', value: 'beschreibung', filterable: true },
        { text: 'Kontaktperson', value: 'kontaktperson', filterable: false },
        { text: 'Link zu Avanti', value: 'avanti_link', filterable: false },
        { text: 'Projekte', value: '_projektnamen', filterable: true },
      ]"
      :items="itemsFilteredOnlyMine"
      :search="filterText"
      item-key="id"
      :items-per-page="10"
    >
      <template v-slot:item="{ item }">
        <router-link
          tag="tr"
          :to="{ name: 'logomatAnlageDetail', params: { id: item.anlagen_id } }"
          style="cursor: pointer"
        >
          <td>{{ item.anlagen_id }}</td>
          <td>
            <b>{{ item.anlagenname }}</b>
          </td>
          <td class="truncate-ellipsis" :title="item.beschreibung">
            {{ item.beschreibung }}
          </td>
          <td>
            <Person :item="item.kontaktperson" />
          </td>
          <td>
            <AvantiLink :item="item.avanti_link" />
          </td>
          <td>
            {{ item._projektnamen }}
          </td>
        </router-link>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Person from "@/components/anlagen/Person";
import AvantiLink from "@/components/anlagen/AvantiLink";
import { mapState } from "vuex";

export default {
  name: "AnlagenDataTable",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    filterText: "",
    filterOnlyMine: false,
  }),
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
    }),
  },
  components: {
    AvantiLink,
    Person,
  },
};
</script>

<style>
td.truncate-ellipsis {
  max-width: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
