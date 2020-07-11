<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-alert type="error" v-if="errorMessage.length > 0">
              {{ errorMessage }}
            </v-alert>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Email"
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
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" v-on:click="login">Login</v-btn>
            </v-card-actions>
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
