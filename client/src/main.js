import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import api from './api'
import list from './vues/list.vue'
import process from './vues/process.vue'

Vue.config.productionTip = false

Vue.use(Router)

Vue.prototype.api = api;

new Vue({
  router: new Router({
    routes: [
      {
        path: '/',
        name: 'Miakinager',
        component: list,
      },
      {
        path: '/:id',
        name: 'Process',
        component: process,
      },
    ]
  }),
  render: h => h(App)
}).$mount('#app')
