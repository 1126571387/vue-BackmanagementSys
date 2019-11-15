import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import SSS from '../components/sss.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
    name: 'login',
    path: '/',
    component: Login
  },
  {
    name: 'sss',
    path: '/sss',
    component: SSS
  }
  ]
})
