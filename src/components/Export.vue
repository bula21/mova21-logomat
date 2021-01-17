<template>
  <v-menu
    v-model="show"
    :close-on-content-click="true"
    :nudge-width="200"
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on" @click="open()" link>
        <v-list-item-action>
          <v-icon>mdi-table-arrow-right</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title> CSV-Export </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-card>
      <v-list>
        <v-list-item @click="export_('anlage')" style="cursor: pointer" ripple>
          <v-list-item-icon>
            <v-icon>mdi-castle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Anlagen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="export_('projekt')" style="cursor: pointer" ripple>
          <v-list-item-icon>
            <v-icon>mdi-home-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Projekte</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="export_('objekt')" style="cursor: pointer" ripple>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Objekte</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="export_('dienstleistung')"
          style="cursor: pointer"
          ripple
        >
          <v-list-item-icon>
            <v-icon>mdi-power-plug</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dienstleistungen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { apiAuthenticated } from "@/lib/api.js";
import { createObjectCsvStringifier } from "csv-writer";
import { joinInPlace } from "@/lib/join.js";

export default {
  name: "Export",
  data: () => ({
    show: false,
  }),
  props: {
    users: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    open() {
      this.show = true;
    },
    createCsv(fields, rows) {
      const fieldNames = fields.map((x) => x.field);
      const csvWriter = createObjectCsvStringifier({
        path: "blah.csv",
        header: fieldNames,
      });
      return fieldNames.join(",") + "\n" + csvWriter.stringifyRecords(rows);
    },
    sendCsvDownload(name, content) {
      const link = document.createElement("a");
      link.setAttribute(
        "href",
        // add UTF-8 BOM so Excel doesn't hiccup
        "data:text/plain;charset=utf-8,%EF%BB%BF" + encodeURIComponent(content)
      );
      link.setAttribute("download", name);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async export_(name) {
      const fields = await apiAuthenticated("/fields");
      const collectionFields = fields.filter(
        (x) => x.collection === name && x.interface !== "one-to-many"
      );
      const fieldsToJoinUsers = collectionFields.filter(
        // hack
        (x) => x.options?.template === "{{first_name}} {{last_name}}"
      );

      // join users
      const items = await apiAuthenticated(`/items/${name}`);
      for (const field of fieldsToJoinUsers) {
        joinInPlace(
          items,
          this.users,
          field.field,
          "id",
          (user) => `${user.first_name} ${user.last_name} ${user.email}`
        );
      }
      const csv = this.createCsv(collectionFields, items);
      this.sendCsvDownload(`${name}.csv`, csv);
    },
  },
};
</script>
