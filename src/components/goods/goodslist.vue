<template>
  <el-card class="box-card">
    <!-- 面包屑导航条 -->
     <MyBread level1="商品管理" level2="商品列表"></MyBread>
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

          <el-button type="success" @click="$router.push({name:'goodsadd'})">添加商品</el-button>
<!-- 
          <el-dialog title="添加商品" :visible.sync="dialogFormVisible">
            
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
          </el-dialog> -->


       </el-col>
    </el-row>


     <!-- 商品信息表格 -->
    <el-table
        height="300px"
        :data="goodslist"
        style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            width="60">
          </el-table-column>
          <el-table-column
            prop="goods_name"
            label="商品名称"
            >
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格（元）">
          </el-table-column>
          <el-table-column
            prop="goods_weight"
            label="商品重量">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间">
            <template slot-scope="scope">
             {{scope.row.create_time | fmtdate}}
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
                @click="showDeleUserMsgBox(scope.row.goods_id)">
              </el-button> 
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

       <!--编辑商品 -->
        <el-dialog title="编辑商品" :visible.sync="dialogFormEdit">
          <el-form :model="formdata">
            <el-form-item  label="用户名" :label-width="formLabelWidth">
              <el-input disabled v-model="formdata.goods_name" autocomplete="off"></el-input>
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
  </el-card>
    
</template>

<script>  
export default {
   data() {
     return {
        query: '',
        //表格数据
        goodslist:[],

        //分页数据
        total:-1,
        pagenum:1,
        pagesize:5,

        //表单默认隐藏
        dialogFormEdit:false,
        dialogFormVisiblerol:false,
        formLabelWidth: '120px',

        //表单信息
        formdata:{
          goods_name:'',
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
     this.getGoodsList()
   },
   methods:{
   async getGoodsList(){
     const res = await this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
     console.log('商品列表', res)

     const {
       meta:{msg,status},
       data:{goods,total}
     } =res.data

     if(status===200 ){
       this.goodslist = goods
       this.total=total
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
      this.getGoodsList()
    },

    //当前是哪页
   handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum=val
      this.getGoodsList()
    },
    
   //搜索数据
   searchUsers(){
      this.getGoodsList()
    },

   //清空输入框的时候还原全部数据
   loadUserList(){
      this.getGoodsList()
   },
  //  //添加按钮
  //  adddialogFormVisible(){
  //    this.formdata ={}
  //  },
   //添加用户
  //  async addUser(){
  //    //关闭对话框
  //    const res =await this.$http.post(`users`, this.formdata)
  //    console.log('添加用户',res)
  //    this.getUsersList()
  //    const {
  //       meta:{msg, status},
  //       data
  //     }=res.data
  //     if(status ===200){
  //       //提示成功
  //       this.$message.success(msg)
  //       //更新视图
  //       // this.getUsersList()
  //       //清空文本
  //       this.formdata={}
  //     }else{
  //       this.$message.warning(msg)
  //     }
  //     this.dialogFormVisible = false
  //  },

   //删除用户
   showDeleUserMsgBox(goodsId){
      this.$confirm('删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        
        const res = await this.$http.delete(`goods/${goodsId}`)
        console.log("删除商品",res)
        if(res.data.meta.status === 200){
          //更新视图
          this.getGoodsList()
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
    showEditUserDia(goods){
       //user是一整项，这里的formdata已经携带id了，
       // 也就是说新的formdata也有id了，下面方法可以直接调用
     this.formdata =goods
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