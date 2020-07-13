<template>
  <div>
    <v-simple-table dense v-if="propsFiltered.length > 0">
      <template v-slot:default>
        <tbody>
          <tr v-for="(prop, key) in propsFiltered" :key="key">
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
                <v-icon v-if="isEmpty(prop.prop)">mdi-diameter-variant</v-icon>
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
    <v-alert v-else color="#ffbbbb">
      Keine Elemente
    </v-alert>
  </div>
</template>

<script>
import { capitalCase } from "capital-case";
import Person from "@/components/Person";
import { mapState } from "vuex";

export default {
  name: "DescriptionTable",
  components: {
    Person,
  },
  props: {
    item: Object,
    props: Array,
  },
  computed: {
    propsFiltered() {
      if (!this.hideEmpty) {
        return this.props;
      }
      return this.props.filter((prop) => !this.isEmpty(prop.prop));
    },
    ...mapState({
      hideEmpty: "hideEmpty",
    }),
  },
  methods: {
    capitalCase,
    isEmpty(prop) {
      return (
        this.item[prop] === null ||
        this.item[prop] === undefined ||
        this.item[prop] === ""
      );
    },
  },
};
</script>

<style>
td.description {
  background-color: #eeeeee;
  font-weight: bold;
}
</style>
