<template>
  <el-card>
       <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="参数列表"></my-bread>
    <el-alert class="alert" title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
    <el-form label-position="left" label-width="80px" style="margin-top:10px">
      <el-form-item label="商品分类">
          <!-- 级联选择器 -->
          {{selectedOptions }}
          <!-- {{defaultProp}} -->
          <el-cascader 
          :show-all-levels="false"
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            :props="defaultProp"
            @change="handleChange"
              clearable
              >
          </el-cascader>
      </el-form-item>
    </el-form>
    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
         <!-- 按钮 -->
         <el-button primary="warn">设置动态参数</el-button>
         <!-- 表格 -->
          <el-table
            :data="arrDyparams"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <!-- el-tag -->
                  <el-tag
                    :key="tag"
                    v-for="tag in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name,tag)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name)"
                    @blur="handleInputConfirm(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </el-form>
              </template>
              </el-table-column>
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
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
              </template>
            </el-table-column>
           </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
          <el-table :data="arrStaticparams" style="width: 100%">
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="属性值" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
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
                  </template>
              </el-table-column>
           </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
 data(){
   return{
     //级联选择器中绑定的数据
      options:[],
      selectedOptions:[],
      defaultProp:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      arrDyparams:[],
      arrStaticparams:[],
      active:"1",
      inputVisible: false,
      inputValue: ''
   }
 },
 created(){
   this.getGoodCate()
 },
 methods:{
   showDeleUserMsgBox(){

   },
   showEditUserDia(){

   },

   async handleClick(){
     if(this.active==='2'){
       if(this.selectedOptions.length===3){
      //获取静态参数的值
        const res =await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
        console.log("xxxx",res)
              //  
        //处理静态数据
         this.arrStaticparams=res.data.data
       };

     }

   },

   async handleChange(){
          //获取动态参数的值
      const res =await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
      console.log("转换为数组前res.data.data.attr_vals：",res.data.data[0].attr_vals)
      res.data.data.forEach(item => {
      item.attr_vals =
      item.attr_vals.length===0
      ?[]: item.attr_vals.trim().split(',') 
      })
      this.arrDyparams=res.data.data
      console.log("arrDyparams",this.arrDyparams)
      console.log("转换为数组后arrDyparams.attr_vals： ",this.arrDyparams[0].attr_vals)
   },

      //获取商品三级分类
   async getGoodCate(){
    const res =await this.$http.get(`categories?type=3`)
    console.log("分类的列表",res)
    //将数据赋值给级联选择器的数据源
    this.options=res.data.data
   },
   //点击x按钮
  async handleClose(attr_vals,attr_id,attr_name,tag) {
    attr_vals.splice(attr_vals.indexOf(tag), 1);
   
   //put请求体对象 { attr_name：？，attr_sel：？，attr_vals：？}
    //    attr_name	参数名称	不能为空
    // attr_sel	[only,many]	不能为空
    // attr_vals	如果是 many 就需要填写值的选项，以逗号分隔
    let putData ={
      attr_name:attr_name,
      attr_sel:"many",
      attr_vals:attr_vals.join(","),
    }
    const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr_id}`,putData)
     console.log("删除标签tag",res)
   },

  //  点击newTag+
   showInput() {
    this.inputVisible = true;
    this.$nextTick(_ => {
      this.$refs.saveTagInput.$refs.input.focus();
    });
   },

  //  点击回车，失去焦点
   async handleInputConfirm(attr_vals,attr_id,attr_name) {
    let inputValue = this.inputValue;
    if (inputValue) {
      attr_vals.push(inputValue);

      //发送请求
      let putData ={
      attr_name:attr_name,
      attr_sel:"many",
      attr_vals:attr_vals.join(","),
    }
    const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr_id}`,putData)
     console.log("删除标签tag",res)
    }
    this.inputVisible = false;
    this.inputValue = '';
      }
    }

}
</script>

<style>
 .alert{
   margin-top: 20px;
 }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>