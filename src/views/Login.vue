<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>LOGomat Login</v-toolbar-title>
            </v-toolbar>
            <v-alert type="error" v-if="errorMessage.length > 0">
              {{ errorMessage }}
            </v-alert>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="vorname.nachname@bula21.ch"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="email"
                ></v-text-field>

                <v-text-field
                  id="password"
                  label="Passwort"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-spacer></v-spacer>
              <v-btn
                :text="!showHelp"
                color="primary"
                v-on:click="showHelp = !showHelp"
                >Registrieren</v-btn
              >
              <v-btn text color="primary" v-on:click="login">Login</v-btn>
            </v-card-actions>

            <v-expand-transition>
              <div v-show="showHelp">
                <v-divider></v-divider>

                <v-card-title>
                  Wie bekomme ich ein Passwort für den LOGomat?
                </v-card-title>

                <v-card-text style="font-size: medium;">
                  Leider kannst du dich hier nicht direkt mit dem mova-Login
                  einloggen.
                  Aber mit einem kleinen Umweg gehts trotzdem...
                  <br>
                  Für den Login auf dem LOGomat muss zuerst ein Passwort
                  erstellt werden:
                  <br /><br />
                  <ol>
                    <li>
                      <a
                        href="https://log.bula21.ch/admin/#/login"
                        target="_blank"
                        >Diesen Link</a
                      >
                      öffnen
                    </li>
                    <li>
                      Unten links auf das kleine runde mova-Logo klicken
                    </li>
                    <li>
                      Rechts "mova-Crew" auswählen
                    </li>
                    <li>Mit normaler mova Email und Passwort einloggen</li>
                    <li>Ganz unten links auf das User-Icon klicken</li>
                    <li>
                      Ein Passwort setzen (kann auch das gleiche sein wie fürs
                      mova Email-Login)
                    </li>
                    <li>Zum Speichern oben rechts auf das Häkchen klicken</li>
                  </ol>
                  <br />
                  Kehre zu dieser Website (logomat.mova.ch) zurück und logge dich hier
                  mit der mova-Email und dem gerade gesetzen Passwort ein.
                  <br>
                  Wenn du noch Fragen hast oder Probleme beim Login, melde dich einfach
                  via Slack unter
                    <a
                        href="https://bulacafe21.slack.com/archives/C014ZNQ510B"
                        target="_blank"
                      >
                      #286_koord_aufabbau_request</a>
                  .
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { login } from "@/lib/api.js";

export default {
  data() {
    return {
      errorMessage: "",
      email: "",
      password: "",
      showHelp: false,
    };
  },
  methods: {
    async login() {
      this.errorMessage = "";
      try {
        await login(this.email, this.password);
        await this.$router.push({ path: "/" });
      } catch (error) {
        this.errorMessage = error.userMessage();
      }
    },
  },
};
</script>
