<template>
  <el-card class="box-card">
    <!-- 面包屑导航条 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>


    <el-row class="searchRow">
       <el-col>
          <el-input 
           @clear="loadUserList()"
            placeholder="请输入内容"
            v-model="query" 
            class="inputSearch"
            clearable>
              <el-button slot="append" icon="el-icon-search" @click="searchUsers()"></el-button>
          </el-input>

          <el-button type="success" @click="adddialogFormVisible()">添加用户</el-button>

          <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
            
            <el-form :model="formdata">
              <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="formdata.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="formdata.password" autocomplete="off"></el-input>
              </el-form-item>        
              <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formdata.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
              </el-form-item>           
            </el-form>


            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser()">确 定</el-button>
            </div>
          </el-dialog>


       </el-col>
    </el-row>

    <el-table
        height="300px"
        :data="userlist"
        style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            width="60">
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            >
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话">
          </el-table-column>

          <el-table-column
            prop="create_time"
            label="创建日期">
            <template slot-scope="scope">
             {{scope.row.create_time | fmtdate}}
            </template>
          </el-table-column>
          
          <el-table-column
            prop="role_name"
            label="角色">
          </el-table-column>

          <el-table-column
            prop="mg_state"
            label="用户状态">
            <template slot-scope="scope">
             <el-switch
                @change="changeMgState(scope.row)"
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                plain type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditUserDia(scope.row)">
              </el-button>
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
                @click="showDeleUserMsgBox(scope.row.id)">
              </el-button>
              <el-button
                size="mini" 
                plain type="success" 
                icon="el-icon-check" 
                circle
                @click="showSetUserRoleDia(scope.row)"
                ></el-button>
             
            </template>
          </el-table-column>     
       </el-table>
       <!--分页 -->
       <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum" 
            :page-sizes="[2, 4, 6, 8]"
            :page-size="2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

       <!--修改用户 -->
        <el-dialog title="修改用户" :visible.sync="dialogFormEdit">
          <el-form :model="formdata">
            <el-form-item  label="用户名" :label-width="formLabelWidth">
              <el-input disabled v-model="formdata.username" autocomplete="off"></el-input>
            </el-form-item>       
            <el-form-item label="邮箱" :label-width="formLabelWidth">
              <el-input v-model="formdata.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
              <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
            </el-form-item>           
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormEdit = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
          </div>
        </el-dialog>

         <!--分配角色 -->
   
        <el-dialog title="分配角色" :visible.sync="dialogFormVisiblerol">
          <el-form >
            <el-form-item label="当前用户" :label-width="formLabelWidth">
          <!--    <el-input disabled v-model="form.name" autocomplete="off"></el-input>   -->
              {{currUsername}}
            </el-form-item>
          <!--  <el-form-item label="当前角色" :label-width="formLabelWidth">
            {{"当前角色"}} -->
       <!--    <el-input disabled v-model="form.name" autocomplete="off"></el-input>  </el-form-item> -->
            
            <el-form-item label="角色" :label-width="formLabelWidth">
            <!--  如果select绑定的值和option的vule值一样，则显示 option中的lable值     -->
                    {{currRoleId}}
              <el-select v-model="currRoleId">
                <el-option label="请选择" :value="-1"></el-option>
                 <el-option 
                 :label="item.roleName" 
                 :value="item.id"
                 v-for="(item,i) in roles "
                 :key="i"
                 ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisiblerol = false">取 消</el-button>
            <el-button type="primary" @click="setRole()">确 定</el-button>
          </div>
        </el-dialog>
  </el-card>
    
</template>

<script>  
export default {
   data() {
     return {
        query: '',
        //表格数据
        userlist:[],
        //分页数据
        total:-1,
        pagenum:1,
        pagesize:5,

        //表单默认隐藏
        dialogFormVisible:false,
        dialogFormEdit:false,
        dialogFormVisiblerol:false,
        formLabelWidth: '120px',
        //表单信息
        formdata:{
          username:'',
          password:'',
          email:'',
          mobile:'',
          role_name:''
        },
        //分配角色
        currRoleId:-1,
        //修改权限的时候，当前用户的id
        currUserId:-1,
        currUsername:'',
        roles:[],
     }

   },
   created () {
     this.getUsersList()
   },
   methods:{

     //请求列表数据
   async  getUsersList () {
    
    //因为接口文档需要有token才可以访问接口数据，配置请求头
    const AUTH_TOKEN = localStorage.getItem('token')
    this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
    
    console.log('token',AUTH_TOKEN)

    const res = await this.$http.get(
      `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
    )
    console.log('res',res)
    const {
      meta:{msg ,status},data:{users,total}
    } =res.data

    if(status ===200 ){
      //给表格赋值
      this.userlist = users
      //给总数赋值
      this.total =total
      this.$message.success(msg)
    }else{
      this.$message.warning(msg)
    }
   },
     //每页多少条
   handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize=val
      this.pagenum=1
      this.getUsersList()
    },

    //当前是哪页
   handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum=val
      this.getUsersList()
    },
    
   //搜索数据
   searchUsers(){
      this.getUsersList()
    },

   //清空输入框的时候还原全部数据
   loadUserList(){
      this.getUsersList()
   },
   //添加按钮
   adddialogFormVisible(){
     this.formdata ={}
    this.dialogFormVisible =true
   },
   //添加用户
   async addUser(){
     //关闭对话框
     const res =await this.$http.post(`users`, this.formdata)
     console.log('添加用户',res)
     this.getUsersList()
     const {
        meta:{msg, status},
        data
      }=res.data
      if(status ===200){
        //提示成功
        this.$message.success(msg)
        //更新视图
        // this.getUsersList()
        //清空文本
        this.formdata={}
      }else{
        this.$message.warning(msg)
      }
      this.dialogFormVisible = false
   },

   //删除用户
   showDeleUserMsgBox(userId){
      this.$confirm('删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        
        const res = await this.$http.delete(`users/${userId}`)
        console.log('userId',res)
  
        if(res.data.meta.status === 200){
          //更新视图
          this.getUsersList()
          //提示
          this.$message({
            type: 'success',
            message: res.data.meta.message
        });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
   },
   //打开编辑
    showEditUserDia(user){
       //user是一整项，这里的formdata已经携带id了，
       // 也就是说新的formdata也有id了，下面方法可以直接调用
     this.formdata =user
     this.dialogFormEdit =true
   },
   //点击编确定按钮
   async editUser(){
     const res = await this.$http.put(`users/${this.formdata.id}`,this.formdata)
     console.log('编辑',res)
     const {meta:{status ,msg},data }=res.data
     if(this.status === 200){
       this.getUsersList()
       this.$message.success(msg)
     }
     else{
        this.$message.warning(msg)
     }
     this.dialogFormEdit =false
   },

   //改变用户状态
   async changeMgState(Users){
     const res = await this.$http.put(`users/${Users.id}/state/${Users.mg_state}`)
     const {meta:{msg,status}} =res.data
     if(status ===200){
       this.$message.success(msg)
     }else{
       this.$message.warning(msg)
     }
     console.log("状态", res)
   },

   //设置用户权限
  async showSetUserRoleDia(user){
    this.currUsername =user.username
    //给当前的用户id赋值，下面那个方法要用到
    this.currUserId=user.id
    this.dialogFormVisiblerol=true

    //获取所有的角色
     const res1 = await this.$http.get(`roles`)
     console.log('所有角色',res1)
     this.roles =res1.data.data

    //获取用户id
     const res = await this.$http.get(`users/${user.id}`)
     console.log('权限用户ID',res)
   },

   //修改角色
  async setRole(){
    const res = await this.$http.put(`users/${this.currUserId}/role`,{
      rid:this.currRoleId
    })
    const {meta:{msg,status}}=res.data
    if(status===200){
      this.$message.success(msg)
      this.getUsersList()
    }
    else{
      this.$message.warning(msg)
    }
    console.log("修改角色",res)
    
    this.dialogFormVisiblerol = false

   }
   }
}

</script>

<style>
  .box-card{
    height: 100%;
  }
.inputSearch{
  width: 300px;
}
.searchRow {
  margin-top: 20px;
}
</style>