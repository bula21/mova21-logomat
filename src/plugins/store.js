import Vue from "vue";
import Vuex, { createLogger } from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  storage: window.localStorage,
});

const debug = process.env.NODE_ENV !== "production";

export const store = new Vuex.Store({
  strict: debug,
  plugins: debug
    ? [createLogger(), vuexLocalStorage.plugin]
    : [vuexLocalStorage.plugin],
  state: {
    user: null,
    hideEmpty: false,
  },
  mutations: {
    loginSucceeded(state, user) {
      state.user = user;
    },
    updateToken(state, token) {
      if (state.user !== null) {
        state.user["_token"] = token;
      }
    },
    loginFailed(state) {
      state.user = null;
    },
    logOut(state) {
      state.user = null;
    },
  },
});

export default store;
