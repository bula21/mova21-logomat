import Vue from 'vue';
import Vuex, {createLogger} from 'vuex';
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  storage: window.localStorage,
});

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  strict: debug,
  plugins: debug ? [createLogger(), vuexLocalStorage.plugin] : [vuexLocalStorage.plugin],
  state: {
    user: null,
    clippyDismissed: false
  },
  mutations: {
    loginSucceeded(state, user) {
      state.user = user;
    },
    loginFailed(state) {
      state.user = null;
    },
    logOut(state) {
      state.user = null;
    },
    dismissClippy(state) {
      state.clippyDismissed = true;
    }
  }
});
