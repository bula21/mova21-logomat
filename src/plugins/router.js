import Vue from "vue";
import VueRouter from "vue-router";

import Login from "../views/Login";
import Main from "../views/Main";
import AnlageDetail from "../views/anlagen/AnlageDetail";
import MaterialDashboard from "../views/material/MaterialDashboard";
import MaterialDepartmentList from "../views/material/MaterialDepartmentList";
import MaterialItemDetail from "../views/material/MaterialItemDetail";
import MaterialItemList from "../views/material/MaterialItemList";
import MaterialOrderDetail from "../views/material/MaterialOrderDetail";
import MaterialOrderList from "../views/material/MaterialOrderList";
import MaterialDeliveryDetail from "../views/material/MaterialDeliveryDetail";
import MaterialDeliveryList from "../views/material/MaterialDeliveryList";
import MaterialSponsoringList from "../views/material/MaterialSponsoringList";
import AnlageList from "@/views/anlagen/AnlageList";

import store from "./store";
import jwt from "jwt-decode";

Vue.use(VueRouter);

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
    next({ name: "login" });
  } else {
    next();
  }
}

export default new VueRouter({
  base: process.env.BASE_URL,
  routes: [
    // login
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/material",
      component: Main,
      beforeEnter: ensureLoggedIn,
      children: [
        {
          path: "",
          name: "materialDashboard",
          component: MaterialDashboard,
        },
        {
          path: "order",
          name: "materialOrderList",
          component: MaterialOrderList,
        },
        {
          path: "order/:id",
          name: "materialOrderDetail",
          component: MaterialOrderDetail,
        },
        {
          path: "department",
          name: "materialDepartmentList",
          component: MaterialDepartmentList,
        },
        {
          path: "item",
          name: "materialItemList",
          component: MaterialItemList,
        },
        {
          path: "item/:id",
          name: "materialItemDetail",
          component: MaterialItemDetail,
        },
        {
          path: "delivery",
          name: "materialDeliveryList",
          component: MaterialDeliveryList,
        },
        {
          path: "delivery/:id",
          name: "materialDeliveryDetail",
          component: MaterialDeliveryDetail,
        },
        {
          path: "sponsoring",
          name: "materialSponsoringList",
          component: MaterialSponsoringList,
        },
      ],
    },
    {
      path: "/anlagen",
      component: () => import("../views/Main.vue"),
      beforeEnter: ensureLoggedIn,
      children: [
        {
          path: "",
          name: "logomatAnlageList",
          component: AnlageList,
        },
        {
          path: ":id",
          name: "logomatAnlageDetail",
          component: AnlageDetail,
        },
      ],
    },
    // default redirect
    { path: "*", redirect: { name: "logomatAnlageList" } },
  ],
});
