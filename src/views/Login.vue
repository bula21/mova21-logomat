<template>
  <v-main>
    <v-container
      class="fill-height"
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <v-card class="elevation-12">
            <v-toolbar
              color="primary"
              dark
              flat
            >
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
  import api from '@/lib/api.js';

  export default {
    props: {
      source: String,
    },
    data() {
      return {
        errorMessage: '',
        email: '',
        password: '',
     };
    },
    methods: {
      async login () {
        this.errorMessage = '';

        try {
          const response = await api.post("/auth/authenticate", {
            "email": this.email,
            "password": this.password,
            "mode": "jwt"
          });
          this.$store.commit('loginSucceeded', response.data.data.user, response.data.data.token);
          this.$router.push({ path: '/' })
        } catch (err) {
          if (err.response) {
            const resp = err.response;
            this.errorMessage = `${resp.request.status}: ${err.response.data.error.message}`;
          } else if (err.request) {
            this.errorMessage = 'Konnte den Server nicht erreichen';
          } else {
            this.errorMessage = 'Unbekannter Fehler';
          }
          this.$store.commit('loginFailed');
        }
      }
    }
  };
</script>
