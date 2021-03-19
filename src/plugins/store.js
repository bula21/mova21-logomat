import Vue from "vue";
import Vuex, { createLogger } from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  storage: window.localStorage,
  reducer: (state) => ({
    user: state.user,
    settings: state.settings,
  }),
});

const debug = process.env.NODE_ENV !== "production";

export const store = new Vuex.Store({
  strict: debug,
  plugins: debug
    ? [createLogger(), vuexLocalStorage.plugin]
    : [vuexLocalStorage.plugin],
  state: {
    user: null,
    settings: {
      hideEmpty: false,
      showAllFields: false,
      showInfoOnLoad: true,
      hideClippy: false,
    },

    // global non-persisted state
    anlagen: [],
    users: [],
    fields: {},
  },
  mutations: {
    globalDataLoaded(state, { anlagen, users, fields }) {
      state.anlagen = anlagen;
      state.users = users;
      state.fields = fields;
    },
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
    saveSettings(state, settings) {
      state.settings.hideEmpty = settings.hideEmpty;
      state.settings.showAllFields = settings.showAllFields;
      state.settings.showInfoOnLoad = settings.showInfoOnLoad;
      state.settings.hideClippy = settings.hideClippy;
    },
    doNotShowInfoOnLoad(state) {
      state.settings.showInfoOnLoad = false;
    },
  },
});

export default store;
