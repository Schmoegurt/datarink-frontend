import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import Skaters from './Skaters.vue';
import Teams from './Teams.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/skaters' },
  { path: '/skaters', component: Skaters },
  { path: '/teams', component: Teams },
];

const router = new VueRouter({
  routes,
});

new Vue({ // eslint-disable-line no-new
  router,
  el: '#app',
  render: h => h(App),
});
