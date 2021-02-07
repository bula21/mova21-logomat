import Vue from "vue";
import Router from "vue-router";
import Login from "../views/Login.vue";
import Material from "../views/Material.vue";
import Order from "../views/Order.vue";
import Item from "../views/Item.vue";
import Sponsoring from "../views/Sponsoring.vue";
import store from "./store";
import jwt from "jwt-decode";

Vue.use(Router);

// important: this does not check the signature!
function loginValid(user) {
  if (!user._token) {
    return false;
  }
  const token = jwt(user._token);
  return token.exp !== undefined && token.exp > Date.now() / 1000;
}

function ensureLoggedIn(to, from, next) {
  if (store.state.user === null || !loginValid(store.state.user)) {
    next("/login");
  } else {
    next();
  }
}

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/material",
      name: "material",
      component: Material,
    },
    {
      path: "/material/order/:id",
      name: "order",
      component: Order,
    },
    {
      path: "/material/item",
      name: "item",
      component: Item,
    },
    {
      path: "/material/sponsoring",
      name: "sponsoring",
      component: Sponsoring,
    },
    {
      path: "/",
      name: "main",
      component: () => import("../views/Main.vue"),
      beforeEnter: ensureLoggedIn,
    },
  ],
});
