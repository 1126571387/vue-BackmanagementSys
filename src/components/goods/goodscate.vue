<template>
  <el-card>
     <my-bread level1="商品管理" level2="商品分类" ></my-bread>
     <el-row>
       <el-col>
         <el-button class="btn" @click="addGoodsCate()" type="success">添加分类</el-button>
       </el-col>
     </el-row>
   

      <!-- 表格 -->
      <el-table
        :data="list"
        style="width: 100%">
           <!-- <el-table-column label="分类名称" prop="cat_name" >
          </el-table-column> -->

           <!-- 使用引入的多级树形组件
              treeKey ->nodekey ->节点唯一标识 id
              parentKey -> 父亲节点的id
              LevelKey -> 当前节点级别
              children ->子节点
            -->
           <el-tree-grid
             prop="cat_name" 
             label="分类名称"
             treeKey="cat_id"
             parentKey="cat_pid"
             LevelKey="cat_level"
             children="children"
           >
           </el-tree-grid>

          <el-table-column label="级别" >
            <template slot-scope="scope">
              <span v-if="scope.row.cat_level===0">一级</span>
              <span v-else-if="scope.row.cat_level===1">二级</span>
              <span v-else-if="scope.row.cat_level===2">三级</span>
            </template>
          </el-table-column>
          <el-table-column label="是否有效" >
            <template slot-scope="scope">
              <span v-if="scope.row.cat_deleted===false">有效</span>
              <span v-if="scope.row.cat_deleted===true">无效</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain type="primary"
              icon="el-icon-edit"
              circle>
            </el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              circle>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

          <!-- 添加分类的对话框 -->
      <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%">
        <!-- 添加分类的表单 -->
        <el-form :model="form"  ref="addFormRef" label-width="100px">
          <el-form-item label="分类名称：" :label-width="formLabelWidth">
            <el-input v-model="form.cat_name"></el-input>
          </el-form-item>
          <!-- :options 用来指定数据源 -->
          <!-- :props 用来指定对应关系 -->
          {{selectedOptions}}
          <el-form-item label="父级分类：">
            <el-cascader 
            expand-trigger="hover"
            :label-width="formLabelWidth"
            change-on-select
            :clearable="true"
            :options="catelist"
            v-model="selectedOptions"
            :props="defaultProp">
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 页码数 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 4, 8, 16]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
       </el-pagination>
  </el-card>
</template>

<script>
//引入element-tree-grid  多级树形结构
var ElTreeGrid = require('element-tree-grid');
export default {
  components:{
    //组件名字 el-tree-grid
    ElTreeGrid
  },
  data(){
    return{
     list:[],
     currentPage:1,
     //当前哪页
     pagenum:1,
     //每页多少条
     pagesize:5,
     //总条数
     total:-1,
     //  cat_deleted:false?"无效":"有效"
     formLabelWidth:"100px",
      //表单
     form:{
        cat_name:'',
        cat_pid:-1,
        cat_level:-1
      },
      //级联选择器
      catelist:[],
      // options:[],
      selectedOptions:[],
      defaultProp:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      addDialogVisible:false
    }
  },
  created(){
    this.getGoodcate()
  },
  methods:{
    // //关闭对话框
    // addDialogClosed(){
    //   this.addDialogVisible=false
    // },
   async addCate(){
      // cat_pid	分类父 ID	不能为空
      // cat_name	分类名称	不能为空
      // cat_level	分类层级	不能为空

    //思路逻辑
      //添加分类有三种情况
      // 1.一级分类 selectedOptions.length=0  cat_pid=0 cat_level=0
      //2.二级分类 selectedOptions.length=1  cat_pid=selectedOptions[0] cat_level=1
      //3.三级分类 selectedOptions.length=2  cat_pid=selectedOptions[1] cat_level=2n

      if(this.selectedOptions.length===0){
        this.form.cat_pid=0
        this.form.cat_level=0
      }else if(this.selectedOptions.length===1){
        this.form.cat_pid=this.selectedOptions[0]
        this.form.cat_level=1
      }else if(this.selectedOptions.length===2){
        this.form.cat_pid=this.selectedOptions[1]
        this.form.cat_level=2
      }

      const res = await this.$http.post(`categories`,this.form)
      console.log("添加分类后的数据",res)
      //更新视图
      this.getGoodcate()
      //关闭
      this.addDialogVisible=false
      //清空form
      this.form={}
    },
    //每页多少条
    handleSizeChange(val){
      console.log(`每页 ${val} 条`);
      this.pagesize=val
      this.pagenum=1
      this.getGoodcate()
    },
    //当前是什么页
    handleCurrentChange(val){
      console.log(`当前页: ${val}`);
      this.pagenum=val
      this.getGoodcate()
    },

    //获取分类列表
   async getGoodcate(){
      const res = await this.$http.get(`categories?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      console.log("商品分类列表",res)
      const {meta:{status,msg},data:{total,pagenum,pagesize}}=res.data
      console.log(status,msg,total,pagenum,pagesize)
      this.total=total
      this.list=res.data.data.result
      console.log("list",this.list)
    },

    //添加分类
    async addGoodsCate(){
      //获取2级分类的数据   catelist数据源
      const res =await this.$http.get(`categories?type=2`)

      this.catelist= res.data.data
      console.log("二级分类数据源",this.catelist)
      this.addDialogVisible=true
      this.selectedOptions={} 
    },
  },
}
</script>

<style>
.btn{
  margin-top: 20px;
}
</style>