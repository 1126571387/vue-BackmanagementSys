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
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-s-order"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-check"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-s-claim"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-s-grid"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-suitcase"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-notebook-2"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-school"></i>
              <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-data-analysis"></i>
              <span>商品分类</span>
            </el-menu-item>                        
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-location"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-mobile"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-document-copy"></i>
              <span>数据报表</span>
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
  //要在创建组件之前去判断token是否存在，create或者beforecreate
  beforeCreate(){
    const token = localStorage.getItem('token')
    if(!token) {
      this.$router.push({name:'login'})
    }
  },
  methods:{
    handleSignout(){
      localStorage.clear()
      this.$message.success('退出成功')
      this.$router.push({name:'login'})
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