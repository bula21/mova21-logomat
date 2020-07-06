import Vue from 'vue';
import Router from 'vue-router';
import Main from '../views/Main.vue';
import Login from '../views/Login.vue';
import store from './store';

Vue.use(Router);

function ensureLoggedIn(to, from, next) {
  if (store.state.user === null) {
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
