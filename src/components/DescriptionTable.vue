<template>
  <div>
    <v-simple-table dense v-if="propsFiltered.length > 0">
      <template v-slot:default>
        <tbody>
          <tr
            v-show="hasHiddenFields"
            v-if="!settings.showAllFields"
            @click="showAllFields = !showAllFields"
            style="cursor: pointer"
          >
            <td>Mehr Felder anzeigen</td>
            <td>
              <v-switch v-model="showAllFields" readonly dense />
            </td>
          </tr>

          <tr v-for="(prop, key) in propsFiltered" :key="key">
            <!-- key -->
            <td class="description" v-if="prop.title">{{ prop.title }}:</td>
            <td class="description" v-else>{{ nicifyTitle(prop.prop) }}:</td>

            <!-- value -->
            <td>
              <slot
                :name="`prop.${prop.prop}`"
                v-bind:item="item[prop.prop]"
                v-if="prop.person !== true"
              >
                <v-icon v-if="isEmpty(prop.prop)">mdi-diameter-variant</v-icon>
                <template v-else-if="typeof item[prop.prop] === 'boolean'">
                  <template v-if="item[prop.prop]">
                    <v-icon>mdi-check-outline</v-icon> (ja)
                  </template>
                  <template v-else>
                    <v-icon>mdi-close-outline</v-icon> (nein)
                  </template>
                </template>
                <template v-else>
                  <span v-html="renderNewlines(item[prop.prop])" />
                </template>
              </slot>
              <Person v-else :item="item[prop.prop]" />
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-alert v-else type="warning">Keine Felder</v-alert>
  </div>
</template>

<script>
import Person from "@/components/anlagen/Person";
import { mapState } from "vuex";
import { nicifyTitle } from "@/lib/util";

export default {
  name: "DescriptionTable",
  components: {
    Person,
  },
  data: () => ({
    showAllFields: false,
  }),
  props: {
    item: Object,
    props: Array,
  },
  computed: {
    hasHiddenFields() {
      for (const prop of this.props) {
        if (prop.default_hide === true) {
          return true;
        }
      }
      return false;
    },
    propsFiltered() {
      return this.props.filter((prop) => {
        if (this.settings.hideEmpty && this.isEmpty(prop.prop)) {
          return false;
        }
        return !(
          !this.settings.showAllFields &&
          !this.showAllFields &&
          prop.default_hide === true
        );
      });
    },
    ...mapState({
      settings: "settings",
    }),
  },
  methods: {
    nicifyTitle,
    renderNewlines(text) {
      if (!(typeof text === "string")) {
        return text;
      }
      const withNewlines = text.replace(/(?:\r\n|\r|\n)/g, "<br />");
      return this.$sanitize(withNewlines);
    },
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

<style scoped>
td.description {
  font-weight: bold;
  width: 33%;
}
</style>
