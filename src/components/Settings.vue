<template>
  <v-menu
    v-model="show"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
        @click="open()"
        title="Einstellungen"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-toolbar flat color="secondary">
        <span class="headline">Einstellungen</span>
      </v-toolbar>
      <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-switch v-model="settingsTemp.hideEmpty" />
          </v-list-item-action>
          <v-list-item-title>Leere Felder verstecken</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-switch v-model="settingsTemp.showAllFields" />
          </v-list-item-action>
          <v-list-item-title>Immer alle Felder anzeigen</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-switch v-model="settingsTemp.showInfoOnLoad" />
          </v-list-item-action>
          <v-list-item-title
            >Info-Dialog nach dem Login anzeigen</v-list-item-title
          >
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-switch v-model="settingsTemp.hideClippy" />
          </v-list-item-action>
          <v-list-item-title>Clippy nicht mehr anzeigen</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer />

        <v-btn color="primary" text @click="cancel()">Abbrechen</v-btn>
        <v-btn color="primary" @click="save()">Speichern</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Settings",
  data: () => ({
    show: false,
    settingsTemp: {
      hideEmpty: null,
      showAllFields: null,
      showInfoOnLoad: null,
      hideClippy: null,
    },
  }),
  computed: {
    ...mapState({
      settings: "settings",
    }),
  },
  methods: {
    open() {
      this.settingsTemp.hideEmpty = this.settings.hideEmpty;
      this.settingsTemp.showAllFields = this.settings.showAllFields;
      this.settingsTemp.showInfoOnLoad = this.settings.showInfoOnLoad;
      this.settingsTemp.hideClippy = this.settings.hideClippy;
      this.show = true;
    },
    save() {
      this.$store.commit("saveSettings", this.settingsTemp);
      this.show = false;
    },
    cancel() {
      this.show = false;
    },
  },
};
</script>
