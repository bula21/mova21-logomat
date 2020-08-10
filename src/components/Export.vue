<template>
  <v-menu
    v-model="show"
    :close-on-content-click="true"
    :nudge-width="200"
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" @click="open()" title="CSV-Export">
        <v-icon>mdi-table-arrow-right</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <v-list-item @click="export_('anlage')" style="cursor: pointer;" ripple>
          <v-list-item-icon>
            <v-icon>mdi-castle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Anlagen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="export_('projekt')"
          style="cursor: pointer;"
          ripple
        >
          <v-list-item-icon>
            <v-icon>mdi-home-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Projekte</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="export_('objekt')" style="cursor: pointer;" ripple>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Objekte</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="export_('dienstleistung')"
          style="cursor: pointer;"
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

export default {
  name: "Export",
  data: () => ({
    show: false,
  }),
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
        "data:text/plain;charset=utf-8," + encodeURIComponent(content)
      );
      link.setAttribute("download", name);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async export_(name) {
      const fields = await apiAuthenticated("/fields");
      const items = await apiAuthenticated(`/items/${name}`);
      const collectionFields = fields.filter((x) => x.collection === name);
      const csv = this.createCsv(collectionFields, items);
      this.sendCsvDownload(`${name}.csv`, csv);
    },
  },
};
</script>
