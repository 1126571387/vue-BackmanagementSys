
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import './assets/css/global.css'
import MyHttpServer from './plugins/http.js'
import moment from 'moment'
import MyBread from './components/cuscom/myBread.vue'

Vue.use(ElementUI)
Vue.use(MyHttpServer)
//注册全局组件MyBread 和使用组件的名称my-bread
Vue.component('MyBread',MyBread)
// Vue.component(MyBread.name,MyBread)
Vue.config.productionTip = false

//全局过滤器
Vue.filter('fmtdate',(v)=>{
  return moment(v).format('YYYY-MM-DD HH:mm:ss')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
