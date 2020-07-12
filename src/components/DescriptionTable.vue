<template>
  <v-simple-table dense>
    <template v-slot:default>
      <tbody>
        <tr v-for="(prop, key) in props" :key="key">
          <!-- key -->
          <td class="description" v-if="prop.title">{{ prop.title }}:</td>
          <td class="description" v-else>{{ capitalCase(prop.prop) }}:</td>

          <!-- value -->
          <td>
            <slot
              :name="`prop.${prop.prop}`"
              v-bind:item="item[prop.prop]"
              v-if="prop.person !== true"
            >
              <v-icon
                v-if="
                  item[prop.prop] === null ||
                  item[prop.prop] === undefined ||
                  item[prop.prop] === ''
                "
                >mdi-diameter-variant</v-icon
              >
              <template v-else-if="typeof item[prop.prop] === 'boolean'">
                <template v-if="item[prop.prop]"
                  ><v-icon>mdi-check-outline</v-icon></template
                >
                <template v-else><v-icon>mdi-close-outline</v-icon></template>
              </template>
              <template v-else>{{ item[prop.prop] }}</template>
            </slot>
            <Person v-else :item="item[prop.prop]" />
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import { capitalCase } from "capital-case";
import Person from "@/components/Person";

export default {
  name: "DescriptionTable",
  components: {
    Person,
  },
  props: {
    item: Object,
    props: Array,
  },
  methods: {
    capitalCase,
  },
};
</script>

<style>
td.description {
  background-color: #eeeeee;
  font-weight: bold;
}
</style>
