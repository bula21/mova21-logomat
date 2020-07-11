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
        <td>{{ item.kontaktperson }}</td>
        <td>
          <a
            :href="item.avanti_link"
            target="_blank"
            v-if="item.avanti_link"
            v-on:click.stop
          >
            Link zu Avanti
          </a>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "AnlagenTable",
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
