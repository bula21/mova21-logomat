import Vue from "vue";
import vuetify from "./plugins/vuetify";
import App from "./App.vue";
import router from "./plugins/router";
import PortalVue from "portal-vue";
import store from "./plugins/store";

Vue.config.productionTip = false;
Vue.use(PortalVue);

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
