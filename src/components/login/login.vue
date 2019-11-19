<template>
  <div class="login-wrap">
      <el-form
      class="lgin-from"
      label-position="top"
      label-width="80px"
      :model="formdata">
      <h2>用户登录</h2>
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
          <el-button class="login-btn" type="primary" @click="handlelogin">登录</el-button>
      </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formdata: {
          username: '',
          password: '',
        }
      };
    },
    methods: {
    async  handlelogin() {
      const res = await this.$http.post('login',this.formdata)
          console.log(res)
          const {
            data,
            meta:{msg ,status}
          } = res.data

          // 登录成功
          if(status === 200) {
          //保存登录的标识token
            localStorage.setItem('token',data.token)
          // 挑转页面  
            this.$router.push({name:'home'})

          // 提示成功
            this.$message.success(msg)
          }else{
            this.$message.warning(msg)
          }

          // 保存数据
          // 登录失败
          // 提示失败
      }
    }
  }
</script>

<style>
.login-wrap{
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .lgin-from{
   width: 400px;
   background-color: white;
   border-radius: 5px;
   padding: 30px;
}
.login-wrap .login-btn {
  width: 100%;
}
</style>