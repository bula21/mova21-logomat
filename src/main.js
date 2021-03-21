import Vue from "vue";
import App from "./App.vue";

import vuetify from "./plugins/vuetify";
import router from "./plugins/router";
import store from "./plugins/store";
import "./plugins/sanitize";
import "./plugins/portal";

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
