import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import api from './api'
import list from './vues/list.vue'
import process from './vues/process.vue'
import login from './vues/login.vue'
import newprocess from './vues/newprocess.vue'

Vue.config.productionTip = false

Vue.use(Router)

const router = new Router({
  mode: "hash",
  routes: [
    {
      path: '/',
      name: 'PM2 Active process',
      component: list,
    },
    {
      path: '/login',
      name: 'Login',
      component: login,
    },
    {
      path: '/active',
      name: 'Start process',
      component: newprocess,
    },
    {
      path: '/p/:id',
      name: 'Process',
      component: process,
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

Vue.prototype.api = api(router)
setInterval(()=> {
  if (router.currentRoute.path != "/login"){
    Vue.prototype.api.getList(Vue.prototype.api.event.onlist)
    if (Vue.prototype.api.event.process) Vue.prototype.api.process(Vue.prototype.api.event.process).getInfos(Vue.prototype.api.event.onprocess)
  }
}, 1000)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
