import Vue from "vue";
import Router from "vue-router";
import Login from "../views/Login.vue";
import Anlagen from "../views/anlagen/Anlagen.vue";
import Anlage from "../views/anlagen/Anlage.vue";
import Material from "../views/material/Material.vue";
import MaterialOrder from "../views/material/MaterialOrder.vue";
import MaterialOrderDetail from "../views/material/MaterialOrderDetail.vue";
import MaterialDepartement from "../views/material/MaterialDepartement.vue";
import MaterialItem from "../views/material/MaterialItem.vue";
import MaterialItemDetail from "../views/material/MaterialItemDetail.vue";
import MaterialSponsoring from "../views/material/MaterialSponsoring.vue";
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
      beforeEnter: ensureLoggedIn,
    },
    {
      path: "/material/order",
      name: "materialOrder",
      component: MaterialOrder,
      beforeEnter: ensureLoggedIn,
    },
    {
      path: "/material/order/:id",
      name: "materialOrderDetail",
      component: MaterialOrderDetail,
      beforeEnter: ensureLoggedIn,
    },
    {
      path: "/material/departement",
      name: "materialDepartement",
      component: MaterialDepartement,
      beforeEnter: ensureLoggedIn,
    },
    {
      path: "/material/item",
      name: "materialItem",
      component: MaterialItem,
      beforeEnter: ensureLoggedIn,
    },
    {
      path: "/material/item/:id",
      name: "materialItemDetail",
      component: MaterialItemDetail,
      beforeEnter: ensureLoggedIn,
    },
    {
      path: "/material/sponsoring",
      name: "materialSponsoring",
      component: MaterialSponsoring,
      beforeEnter: ensureLoggedIn,
    },
    {
      path: "/",
      component: () => import("../views/Main.vue"),
      beforeEnter: ensureLoggedIn,
      children: [
        {
          path: "",
          name: "logomatAnlagen",
          component: Anlagen,
        },
        {
          path: "anlage/:id",
          name: "logomatAnlage",
          component: Anlage,
        },
      ],
    },
  ],
});
