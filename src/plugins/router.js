import Vue from 'vue';
import Router from 'vue-router';
import Main from '../views/Main.vue';
import Login from '../views/Login.vue';
import store from './store';
import jwt from 'jwt-decode';

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
    next('/login');
  } else {
    next();
  }
}

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      beforeEnter: ensureLoggedIn
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ]
});
