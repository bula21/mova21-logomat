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
          <v-list-item-title>CSV-Export</v-list-item-title>
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
        <v-list-item @click="export_('telekom')" style="cursor: pointer" ripple>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Telekom</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="export_('strom')" style="cursor: pointer" ripple>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Strom</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="export_('wasser')" style="cursor: pointer" ripple>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Wasser</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="export_('abwasser')"
          style="cursor: pointer"
          ripple
        >
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Abwasser</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="export_('abfallentsorgung')"
          style="cursor: pointer"
          ripple
        >
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Abfallentsorgung</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { apiAuthenticated, limit } from "@/lib/api";
import { createArrayCsvStringifier } from "csv-writer";
import { joinInPlace } from "@/lib/join";

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
      const delimiter = ";";
      const headers = fields.map((x) => x.field);

      const transformCell = (data) => {
        if (typeof data === "string" || data instanceof String) {
          return data.replace(/\n/g, " ");
        }
        return data;
      };

      // convert row objects to arrays
      const rowsTransformed = rows.map((rowObj) => {
        return headers.map((header) => transformCell(rowObj[header]));
      });

      const csvWriter = createArrayCsvStringifier({
        path: "items.csv",
        header: headers,
        fieldDelimiter: delimiter,
      });

      return (
        csvWriter.getHeaderString() +
        csvWriter.stringifyRecords(rowsTransformed)
      );
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
        // matches collection name, and is not a reverse foreign key relationship
        (x) => x.collection === name && x.interface !== "one-to-many"
      );
      // hack to find all fields which reference users
      const fieldsToJoinUsers = collectionFields.filter(
        (x) => x.options?.template === "{{first_name}} {{last_name}}"
      );

      // get items
      const items = await apiAuthenticated(`/items/${name}`, limit(-1));

      // join users
      for (const field of fieldsToJoinUsers) {
        joinInPlace(
          items,
          this.users,
          field.field,
          "id",
          (user) => `${user.first_name} ${user.last_name} ${user.email}`
        );
      }

      // join more stuff, per case
      if (name === "objekt") {
        const projekte = await apiAuthenticated(`/items/projekt`, limit(-1));
        joinInPlace(
          items,
          projekte,
          "projekt",
          "id",
          (projekt) => `#${projekt.id} - ${projekt.projektname}`
        );
      }

      // create CSV
      const csv = this.createCsv(collectionFields, items);
      this.sendCsvDownload(`${name}.csv`, csv);
    },
  },
};
</script>
