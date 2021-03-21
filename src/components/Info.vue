<template>
  <v-dialog v-model="show" max-width="600px" scrollable color="secondary">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        @click="open(false)"
        icon
        title="Info & Hilfe"
      >
        <v-icon>mdi-information</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar flat color="secondary">
        <span class="headline">Herzlich Willkommen auf dem LOGomat!</span>
      </v-toolbar>
      <v-card-title> </v-card-title>
      <v-card-text>
        <b>Übersicht</b>
        <br />
        Hier findest du eine Zusammenstellung von Informationen vom Ressort
        Logistik. Die Angaben sind in Anlagen, Projekte, Objekte und
        Dienstleistungen aufgeteilt.

        <br />
        <br />

        <v-simple-table :dense="false">
          <template v-slot:default>
            <tbody>
              <tr>
                <td class="description">Anlage</td>
                <td>
                  Gruppe von Projekten, die auf dem Gelände einzigartig sind.
                  Kann aus einem oder mehreren Projekten bestehen
                </td>
              </tr>
              <tr>
                <td class="description">Projekt</td>
                <td>
                  Ansammlung von Objekten und Dienstleistung. Hat definierten
                  Standort auf dem Gelände. Immer einer Anlage zugeordnet.
                </td>
              </tr>
              <tr>
                <td class="description">Objekt</td>
                <td>Infrastruktureinheit (z.B. Zelt, Container, ...).</td>
              </tr>
              <tr>
                <td class="description">Dienstleistung</td>
                <td>
                  Auftrag oder eine Bestellung an einen Bereich der Logistik
                  (z.B. Strom, Wasser, Telekom, ...).
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <br />
        <br />

        <b>Funktionen</b>
        <br />
        Im LOGomat kannst du:

        <br />
        <br />

        <v-simple-table :dense="false">
          <template v-slot:default>
            <tbody>
              <tr>
                <td class="description">Suchen</td>
                <td>Nach Anlagenamen.</td>
              </tr>
              <tr>
                <td class="description">Filtern</td>
                <td>
                  Mit Knopf «nur meine» → Anlagen, bei der du als Kontaktperson
                  hinterlegt bist.
                </td>
              </tr>
              <tr>
                <td class="description">Bestellungen erfassen</td>
                <td>
                  Dienstleistungen können mit der Schaltfläche im Menu bestellt
                  werden. Bestellte Dienstleistungen erscheinen nicht direkt im
                  LOGomat.
                </td>
              </tr>
              <tr>
                <td class="description">Änderungen melden</td>
                <td>
                  Änderungen, Fehler oder Ergänzungen an Anlagen, Projekten oder
                  Objekten müssen via Service Desk im Menu oben gemeldet werden.
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <br />
        <br />

        <b>Wiki & Dokumentation</b>
        <br />
        LOGomat & LOGdb - Wiki & FAQ -
        <a href="https://avanti.bula21.ch/x/ugrJAQ" target="_blank">
          https://avanti.bula21.ch/x/ugrJAQ
        </a>

        <br />
        <br />

        <b>Kontakt</b>
        <br />
        Fragen via
        <a
          href="https://bulacafe21.slack.com/archives/C014ZNQ510B"
          target="_blank"
          >Slack #286_koord_aufabbau_request</a
        >
        oder
        <a
          href="https://voila.bula21.ch/servicedesk/customer/portal/8"
          target="_blank"
          >Service Desk</a
        >.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="hide(true)"
          v-if="settings.showInfoOnLoad"
          >Nicht mehr anzeigen</v-btn
        >
        <v-btn color="primary" @click="hide(false)">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Info",
  data: () => ({
    show: false,
  }),
  computed: {
    ...mapState({
      settings: "settings",
    }),
  },
  created() {
    if (this.settings.showInfoOnLoad) {
      this.open();
    }
  },
  methods: {
    open() {
      this.show = true;
    },
    hide(forever) {
      if (forever) {
        this.$store.commit("doNotShowInfoOnLoad");
      }
      this.show = false;
    },
  },
};
</script>

<style>
td.description {
  font-weight: bold;
  width: 33%;
}
</style>
