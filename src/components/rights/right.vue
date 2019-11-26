<template>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 面包屑导航条 -->
      <MyBread level1="权限管理" level2="权限列表"></MyBread>
      
      <el-table
      height='400px'
      :data="rightsList"
      border
      stripe
      style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
</template>
  
<script>
export default {
   data(){
     return{
      rightsList:[],
     }
   },
   
   created(){
     this.getRightlist()
   },
   methods: {
     async getRightlist(){
 
        const res =await this.$http.get(`rights/list`)
        console.log('权限列表',res)
        this.rightsList =res.data.data
     }
   }
}
</script>

<style>
 .box-card{
   height: 100%;
 }
</style>