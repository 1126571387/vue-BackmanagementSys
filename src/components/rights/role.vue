<template>  
  <el-card>
     <MyBread level1="权限管理" level2="角色管理"></MyBread>

     <el-row class="addbutton">
       <el-col>
         <el-button type="info">添加角色</el-button>
       </el-col>
     </el-row>

     <!-- 表格数据-->
    <el-table  height="400px" :data="rolelist" style="width: 100%">
           <!-- 展开的内容-->
          <el-table-column type="expand" width="150">
            <template slot-scope="scope">
                <el-row  v-for="(item1 ,i) in scope.row.children" :key="i">
                   <el-col :span="4">  
                     <el-tag @close="deleRight(scope.row, item1.id)" closable type="success"> {{item1.authName}}</el-tag>
                     <i class="el-icon-arrow-right"></i>
                   </el-col>
                   <el-col :span="20">
                     <el-row  v-for="(item2 ,index2) in item1.children" :key="index2" >
                       
                        <el-col :span="4">
                           <el-tag @close="deleRight(scope.row, item2.id)" closable type="info"> {{item2.authName}}</el-tag>
                           <i class="el-icon-arrow-right"></i>
                        </el-col>

                         <el-col :span="20">
                         <!--  <el-tag  v-for="(item3 ,i) in itme2.children" :key="i">
                               {{item3.authName}}
                            </el-tag>  -->
                            <el-tag @close="deleRight(scope.row, item3.id)" closable type="warning"
                                     v-for="(item3 ,index3) in item2.children" :key="index3">
                               {{item3.authName}}
                            </el-tag>
                        </el-col>

                     </el-row>
                   </el-col>
                </el-row>
                <span class="nodata" v-if="scope.row.children.length==0">{{"无权限分配"}}</span>
            </template>
          </el-table-column>

          <!--显示 和 操作 -->
          <el-table-column type="index" label="#" width="150"></el-table-column>
          <el-table-column prop="roleName" label="角色名称" > </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                plain type="primary"
                icon="el-icon-edit"
                circle
                 >
              </el-button>
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
                 >
              </el-button>
              <el-button
                size="mini" 
                plain
                type="success" 
                icon="el-icon-check" 
                circle
                @click="showSetRightDias(scope.row)"
                ></el-button>
            </template>
          </el-table-column>   
       </el-table>

       <!--修改权限的对话框 -->
       <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
          <!--树形结构
              data 数据源[]
              show-checkbox选择框
              node-key 每个节点的唯一标识 通常时data数据源的中的key名id
              default-expanded-keys [默认展开的节点的id]
              default-checked-keys [要选择的节点的id，就是展示已经有的权限]
              props 配置项 {label，children }
              label 节点的文字 标题和children 节点的子节点
              值都来源于data绑定的数据源中的该数据的key名 ‘label’和children
           -->

            <!-- :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]" -->

             <!-- :default-expanded-keys="arrexpand"   以后要用 -->

             <!-- default-expand-all展开所有的数据 -->

          <el-tree
            ref="tree"
            :data="treelist"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="arrcheck"
            :props="defaultProps">
          </el-tree>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
            <el-button type="primary" @click="setRoleRight()">确 定</el-button>
          </div>
       </el-dialog>
  </el-card>
</template>

<script>
export default {
   data(){
     return{
      rolelist:[],
      dialogFormVisibleRight:false,
      treelist:[],
      defaultProps:{
        label:'authName',
        children:'children'
      },
      arrexpand:[],
      arrcheck:[],
      
      currRoleId:-1
     }
   },
  //  components:{
  //   MyBread
  //  },
   
   created(){
     this.getRoletlist()
   },
   methods: {
     //请求数据权限的列表
     async getRoletlist(){
        const res =await this.$http.get(`roles`)
        console.log('角色',res)
        this.rolelist =res.data.data
     },

     //标签点击删除
    async deleRight(role,rightId) {
       //roles/:roleId/rights/:rightId
      //  :roleId	角色 ID	不能为空携带在url中
      //  :rightId	权限 ID	不能为空携带在url中
       const res =await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
       console.log("要取消的权限",res)
       const {meta:{msg,status}}=res.data

       if(status ===200){
         this.$message.success(msg)
        //  this.getRoletlist()   这样子每次删除一个都会整个页面更新，没必要
        //将返回的数据，赋值给children，因为上面循环的是children
       role.children=res.data.data
       }else{
         this.$message.warnning(msg)
       }
     },

    //点击打开  修改、分配、打开权限  的时候
    async showSetRightDias(rold){
      //给currRoleId赋值，下一个方法要用到
      this.currRoleId=rold.id

      console.log("默认选择到 的权限",rold)

      //所有权限列表
       const res =await this.$http.get(`rights/tree`)
       console.log("tree状权限列表",res)
       this.treelist=res.data.data

       //收集每一级的id,即全部id
      //  var temp1 =[]
      //  this.treelist.forEach((item1,index1)=>{
      //     temp1.push(item1.id)
      //     item1.children.forEach((item2,index2)=>{
      //        temp1.push(item2.id)
      //        item2.children.forEach((item3,indxe3)=>{
      //          temp1.push(item3.id)
      //        })
      //     })
      //  })
      //  console.log("temp1.id",temp1)
      //  this.arrexpand=temp1


      //点击打开框的时候，显示默认选中的项，即收集到id就行
       var temp2=[]
       rold.children.forEach((item1,index1)=>{
         temp2.push(item1.id)
         item1.children.forEach((item2,index2)=>{
           temp2.push(item2.id)
           item2.children.forEach((item3,index3)=>{
             temp2.push(item3.id)
           })
         })
       })
      console.log("默认选中的id",temp2)
      this.arrcheck=temp2
      this.dialogFormVisibleRight=true
    },

    //点击确定的时候 设置权限
    async setRoleRight(){
     //roles/:roleId/rights
        //  :roleId	角色 ID	不能为空携带在url中

        //  rids	权限 ID 列表	以 , 分割的权限 ID 列表,
        //  即使树形节点中 所有的全选和半选的label的id[]集合  去文档找方法
            //获取全选的id的数组 arr1   getCheckedKeys
              let arr1 = this.$refs.tree.getCheckedKeys()
            //获取半选的id的数组 arr2   getHalfCheckedKeys
              let arr2 =this.$refs.tree.getHalfCheckedKeys()
                //怎么使用标签的方法？  
                  //div -> js方法/属性innerText
                    //1.获取div -> DOM元素
                    //2. DOM.innerText
                        // var div =document.getElementById('div')
                        // div.innerText;
                  
                  //同理
                  //el-tree ->js 方法 getCheckedKeys
                  //1.给要操作的dom元素 设置ref属性值   input ref=“txt”
                  //2. this.$refs.ref属性值.js方法名() this.$refs.txt.foucs() 

            // arr =arr1+arr2 es6 如果arr1=[1,2,3]，arr2=[4，5] 那么 [...arr1，...arr2]=[1,2,3,4,5]
            let arr=[...arr1,...arr2]
            // console.log("已选择的权限",arr)
            
        const res =await this.$http.post(`roles/${this.currRoleId}/rights`,{
          rids:arr.join(",")
          })   //post后要带请求体
          console.log("已选择的权限",res)
       //更新视图
       this.getRoletlist()
       //关闭
       this.dialogFormVisibleRight=false
    }
   },

}
</script>

<style>
  .addbutton{
    margin-top: 20px;
  }
  .nodata{
    display: flex;
    align-items: center;
    justify-content: center;
    color:rgb(160, 159, 158)
  }
</style>