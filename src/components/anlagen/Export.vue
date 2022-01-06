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
            <v-icon>mdi-cellphone-basic</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Telekom</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="export_('strom')" style="cursor: pointer" ripple>
          <v-list-item-icon>
            <v-icon>mdi-transmission-tower</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Strom</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="export_strom_material()"
          style="cursor: pointer"
          ripple
        >
          <v-list-item-icon>
            <v-icon>mdi-transmission-tower</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Strom Zusätzliches Material</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="export_('wasser')" style="cursor: pointer" ripple>
          <v-list-item-icon>
            <v-icon>mdi-cup-water</v-icon>
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
            <v-icon>mdi-tanker-truck</v-icon>
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
            <v-icon>mdi-trash-can</v-icon>
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

      const transformCell = (data, name) => {
        // remove newlines so M$ Excel does not hiccup
        if (typeof data === "string" || data instanceof String) {
          return data.replace(/\n/g, " ");
        }
        // sometimes data cells contain arrays of other objects
        if (Array.isArray(data)) {
          if (name === "geraete") {
            return data.map((x) => x["Gerätename"]).join(", ");
          } else if (name === "zusaetzliches_material") {
            return data.map((x) => x["Material"]).join(", ");
          } else {
            console.log("UNKNOWN", name, data);
            return "Array[]";
          }
        }
        return data;
      };

      // convert row objects to arrays
      const rowsTransformed = rows.map((rowObj) => {
        return headers.map((header) => transformCell(rowObj[header], header));
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
    async export_strom_material() {
      const items = await apiAuthenticated(`/items/strom`, limit(-1));

      const projekte = await apiAuthenticated(`/items/projekt`, limit(-1));
      joinInPlace(
        items,
        projekte,
        "projekt",
        "id",
        (projekt) => `(${projekt.projekt_id}) ${projekt.projektname}`
      );

      const objekte = await apiAuthenticated(`/items/objekt`, limit(-1));
      joinInPlace(
        items,
        objekte,
        "objekt",
        "id",
        (objekt) => `(${objekt.objekt_id}) ${objekt.objektname}`
      );

      const toExport = [];
      for (const i of items) {
        if (i.zusaetzliches_material !== null) {
          for (const z of i.zusaetzliches_material) {
            toExport.push({
              Projekt: i.projekt,
              Objekt: i.objekt,
              Location: i.location,
              "Zusätzliches_Material[Stückzahl]": z["Stückzahl"],
              "Zusätzliches_Material[Material]": z["Material"],
              "Zusätzliches_Material[Lieferant]": z["Lieferant"],
            });
          }
        }
      }

      const csv = this.createCsv(
        [
          { field: "Projekt" },
          { field: "Objekt" },
          { field: "Location" },
          { field: "Zusätzliches_Material[Stückzahl]" },
          { field: "Zusätzliches_Material[Material]" },
          { field: "Zusätzliches_Material[Lieferant]" },
        ],
        toExport
      );
      this.sendCsvDownload(`strom_material.csv`, csv);
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

      const collectionsWithProjekte = [
        "objekt",
        "strom",
        "telekom",
        "abfallentsorgung",
        "abwasser",
        "wasser",
      ];

      // join more stuff, per case
      if (collectionsWithProjekte.includes(name)) {
        const projekte = await apiAuthenticated(`/items/projekt`, limit(-1));
        joinInPlace(
          items,
          projekte,
          "projekt",
          "id",
          (projekt) => `(${projekt.projekt_id}) ${projekt.projektname}`
        );
      }

      // replace anlade-id by name
      if (name === "projekt") {
        const anlagen = await apiAuthenticated(`/items/anlage`, limit(-1));
        joinInPlace(
          items,
          anlagen,
          "anlage",
          "id",
          (anlage) => `(${anlage.anlagen_id}) ${anlage.anlagenname}`
        );
      }

      // for all enum/dropdown fields, replace db value with display text
      collectionFields
        .filter((field) => field.options?.choices !== undefined)
        .forEach((field) => {
          // db value => text
          const choices = field.options.choices;
          for (const item of items) {
            if (choices[item[field.field]] === undefined) {
              continue;
            }
            item[field.field] = choices[item[field.field]];
          }
        });

      // create CSV
      const csv = this.createCsv(collectionFields, items);
      this.sendCsvDownload(`${name}.csv`, csv);
    },
  },
};
</script>
