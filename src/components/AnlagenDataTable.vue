<template>
  <v-data-table
    :headers="[
      { text: 'Name', value: 'anlagenname', filterable: true },
      { text: 'Beschreibung', value: 'beschreibung', filterable: true },
      { text: 'Kontaktperson', value: 'kontaktperson' },
      { text: 'Link zu Avanti', value: 'avanti_link' },
    ]"
    :items="items"
    :search="filterText"
    item-key="id"
    class="elevation-1"
    :items-per-page="10"
  >
    <template v-slot:item="{ item }">
      <tr @click="$emit('item-clicked', item)" style="cursor: pointer;">
        <td>{{ item.anlagenname }}</td>
        <td class="truncate-ellipsis" :title="item.beschreibung">
          {{ item.beschreibung }}
        </td>
        <td>
          <Person :item="item.kontaktperson" />
        </td>
        <td>
          <AvantiLink :item="item.avanti_link" />
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import Person from "@/components/Person";
import AvantiLink from "@/components/AvantiLink";

export default {
  name: "AnlagenDataTable",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    filterText: {
      type: String,
      default: () => "",
    },
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
