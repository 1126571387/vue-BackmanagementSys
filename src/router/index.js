import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import Users from '../components/users/users.vue'
import Right from '../components/rights/right.vue'
import Roles from '../components/rights/role.vue'
import GoodsList from '../components/goods/goodslist.vue'
import GoodsAdd from '../components/goods/goodsadd.vue'
import CateParams from '../components/goods/cateparams.vue'
import GoodsCate from '../components/goods/goodscate.vue'

Vue.use(Router)

 const router= new Router({
  routes: [
    {
    path: '/login',
    name: 'login',
    component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children:[
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
            path:'/rights',
            name:'right',
            component:Right
        },
        {
          path:'/roles',
          name:'roles',
          component:Roles
        },
        {
          path:'/goods',
          name:'goods',
          component:GoodsList
        },
        {
          path:'/goodsadd',
          name:'goodsadd',
          component:GoodsAdd  
        },
        {
          path:'/params',
          name:'params',
          component:CateParams  
        },
        {
          path:'/categories',
          name:'categories',
          component:GoodsCate  
        }]
    },

  ]
})

export default router

router.beforeEach((to, from, next) => {
  console.log('to',to)
   console.log('from',from)
  const token =localStorage.getItem("token")
  console.log("token",token)
  console.log("this",this)

  if(to.path==="/login"){
    //如果去的是登录页面即跳转到登录页面
    next()
  }else{
    //如果去的不是登录页面，先判断是不是有token
    const token =localStorage.getItem('token')
    if(!token){
      // this.$message.warnning("请先登录")
      // this.$router.push({name:login})
      Message.warnning("请先登录")
      router.push({
        name:'login'
      })
      return
    }
   
  //如果有token  -》next
  next()
  }

})
