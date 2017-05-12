import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import Foo from './Foo.vue';
import Bar from './Bar.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/foo' },
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar },
];

const router = new VueRouter({
  routes,
});

new Vue({ // eslint-disable-line no-new
  router,
  el: '#app',
  render: h => h(App),
});
