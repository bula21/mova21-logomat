import Vue from "vue";
import App from "./App.vue";
import PortalVue from "portal-vue";
import vuetify from "./plugins/vuetify";
import router from "./plugins/router";
import store from "./plugins/store";
import "./plugins/sanitize";

Vue.config.productionTip = false;
Vue.use(PortalVue);

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
