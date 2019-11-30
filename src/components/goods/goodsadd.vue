<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>

    <!-- 商品进度信息 -->
     <el-alert class="alart" title="添加商品信息" type="success" center show-icon></el-alert>

     <!-- 步骤条   -->
     <el-steps :active="1*active" finish-status="success" simple style="margin-top: 20px">
        <el-step title="基本信息" ></el-step>
        <el-step title="商品参数" ></el-step>
        <el-step title="商品属性" ></el-step>
        <el-step title="商品图片" ></el-step>
        <el-step title="商品内容" ></el-step>
     </el-steps>

     <!-- 最外层是el-form 方便收集数据发送请求-->
     <el-form label-position="top" label-width="80px" :model="form" style="height:300px;overflow:scroll;">
        <!-- tabs标签页 -->
        <el-tabs @tab-click="tabChange()" v-model="active" tab-position="left">
          <el-tab-pane name="1" label="基本信息">
            <el-form-item  label="商品名称 ">
              <el-input v-model="form.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="form.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="form.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="form.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">

              <!-- 级联选择器 -->
              {{selectedOptions }}
              <!-- {{defaultProp}} -->
              <el-cascader 
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              :props="defaultProp"
              @change="handleChange"
               clearable
               >
              </el-cascader>

            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品参数">
            <el-form-item 
              :label="item1.attr_name"
              v-for="(item1,i) in arrDyparams"
              :key="i"
             >
              <el-checkbox-group  v-model="item1.attr_vals">
                <el-checkbox 
                 border
                 :label="item2"
                 v-for="(item2,i) in item1.attr_vals"  
                 :key="i">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane name="3" label="商品属性" >
            <el-form-item :label="item.attr_name" v-for="(item,i) in arrStaticparams" :key="i">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品图片">
            <el-form-item>
              <el-upload
                action="http://39.108.193.251:8811/api/private/v1/upload"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handlesuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="5" label="商品内容">
            <el-button type="primary" @click="addGoods()">点我添加商品</el-button>
            <!-- 富文本 -->
             <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-tab-pane>
        </el-tabs>
     </el-form>

  </el-card> 
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  
  data(){
    return{
      active:"1",

      //添加商品的表单数据
        //以后发送请求的时候想要form表单数据 this.$http.post(url,this.form)
            // goods_name	商品名称	不能为空
            // goods_price	价格	不能为空
            // goods_number	数量	不能为空
            // goods_weight	重量	不能为空
            // goods_introduce	介绍	可以为空


            // goods_cat	以为','分割的分类列表	不能为空
            // pics	上传的图片临时路径（对象）	可以为空
            // attrs	商品的参数（数组）	可以为空

      form:{
        goods_name:'',
        goods_price:'',
        goods_number:'',
        goods_weight:'',
        goods_introduce:'',

        goods_cat:[],
        pics:[],
        attrs:[],
      },
      //级联选择器中绑定的数据
      options:[],
      selectedOptions:[],
      defaultProp:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      //动态获取的参数，即name=2
      arrDyparams:[],

      // 静态参数，name=3
      arrStaticparams:[],
      
      //设置上传图片的接口的头部headers
      headers:{
        Authorization:localStorage.getItem('token')
      }
    }
  },
  components: {
    quillEditor
  },
  created(){
    this.getGoodCate()
  },
  methods:{
    //级联选择器绑定@change事件绑定的方法
    handleChange(){

    },

    //添加商品，发送请求
   async addGoods(){
      // goods_cat	以为','分割的分类列表	不能为空
      this.form.goods_cat = this.selectedOptions.join(",")
      console.log("this.goods_cat",this.form.goods_cat)

      // pics	上传的图片临时路径（对象）	可以为空
      
      
     // attrs	商品的参数（数组）	可以为空
        //动态
        console.log("动态参数",this.arrDyparams)
        let arr1= this.arrDyparams.map(item=>{
          return [{attr_id:item.attr_id},{attr_value:item.attr_vals}]
        })
        console.log("返回的动态参数",arr1)
        
        //静态
        let arr2 =this.arrStaticparams.map(item=>{
          return [{attr_id:item.attr_id},{attr_value:item.attr_vals}]
        })
   
        //合并attrs
        this.form.attrs = [...arr1,...arr2]
        console.log("合并动态和静态的参数",this.form.attrs)
     
        //发起请求
        const res =await this.$http.post(`goods`,this.form)
        console.log("商品添加后的数据",res)
      
    },

    //获取商品三级分类
    async getGoodCate(){
      const res =await this.$http.get(`categories?type=3`)
      console.log("分类的列表",res)
      //将数据赋值给级联选择器的数据源
      this.options=res.data.data
    },

      //当改变节点的时候，触发的方法
    async tabChange(){
      //点击第二个tab ，同时 三级分类要有值
      if(this.active=='2'){
        if(this.selectedOptions.length!==3){
          this.$message.warning("请选择三等级")
          return
        }
        
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

      }else if(this.active=='3'){
        if(this.selectedOptions.length!==3){
          this.$message.warning("请选择三等级")
          return
        }

         //获取静态参数的值
         const res =await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
         console.log("静态参数值",res)
         this.arrStaticparams=res.data.data
      }

  },

  // 点击文件列表中已上传的文件时的钩子
  handlePreview(file){
   console.log("上传",file)
  },

  // 文件列表移除文件时的钩子
  handleRemove(file){
    //移除的临时路径 file.response.data.tmp_path
   console.log("移除",file)
  
  //当点击要删除的一个的时候， handleRemove(file)方法会返回一个临时路径，
  // 将这个路径去对比已经上传成功的数组里面有没有这个路径，在哪个位置，把位置index返回
   let index=this.form.pics.findIndex((item)=>{
     return item.pics ===file.response.data.tmp_path
   })
  //拿到index位置，删除它,每次删除，都会更新pics
   this.form.pics.splice(index,1)
   console.log("删除后的临时路径",this.form.pics)
  },
  //文件上传成功时的钩子
  handlesuccess(file){
    //图片临时上传的地址  file.data.tmp_path
   console.log("成功",file)

   //pics
   this.form.pics.push({
     pic:file.data.tmp_path
   })

   console.log("上传成功后的临时路径", this.form.pics)
  }
  }


}
</script>

<style>
  .alart{
    margin-top: 20px;
  }
  .ql-editor {
     min-height: 300px;
  }
</style>