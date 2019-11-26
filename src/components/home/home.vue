<template>
<el-container class="container">
  <el-header class="header">

<el-row>
  <el-col :span="4">
    <div class="grid-content bg-purple">
      <img src="../../assets/1.jpg.jpg" width="60px" height="60px" >
    </div>
  </el-col>
  <el-col :span="18" class="middle">
      <h3>电商后台管理系统 </h3>
  </el-col>
  <el-col :span="2">
    <div class="grid-content bg-purple">
     <a href="#" class="login-out" @click.prevent="handleSignout()">退出</a>
    </div>
  </el-col>
</el-row>

  </el-header>
  <el-container>
    <el-aside width="200px" class="aside">
       <el-menu
        :router="true"
        :unique-opened="true">
          <el-submenu :index="''+item1.order" v-for="(item1,index) in menusList" :key="index">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2,index) in item1.children" :key="index" >
              <i class="el-icon-s-order"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
       </el-menu>
    </el-aside>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data(){
    return{
      //左侧菜单列表
      menusList:[],
    }
  },
  //要在创建组件之前去判断token是否存在，create或者beforecreate
  beforeCreate(){
    const token = localStorage.getItem('token')
    if(!token) {
      this.$router.push({name:'login'})
    }
  },
  created(){
    //获取左侧菜单
    this.getMenus()
  },
  methods:{
    handleSignout(){
      localStorage.clear()
      this.$message.success('退出成功')
      this.$router.push({name:'login'})
    },

    //获取左侧菜单
    async getMenus(){
     const res =await this.$http.get(`menus`)

     this.menusList=res.data.data
     console.log('左侧菜单',this.menusList)
    }
  }
}
</script>

<style>
  .container {
    height: 100%;
  }
  .header {
    background-color: #b3c0d1;
  }
  .aside{
    background-color: #d3dcd6
  }
  .login-out{
    line-height: 60px;
    text-decoration: none;
  }
  .middle{
    text-align: center; 
  }
</style>