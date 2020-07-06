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
    jwt: null,
  },
  mutations: {
    loginSucceeded(state, userInfo, jwt) {
      state.user = userInfo;
      state.jwt = jwt;
    },
    loginFailed(state) {
      state.user = null;
      state.jwt = null;
    },
    logOut(state) {
      state.user = null;
      state.jwt = null;
    }
  }
});
