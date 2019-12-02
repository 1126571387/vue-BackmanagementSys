<template>
<el-card>
  <my-bread level1="数据统计" level2="数据报表" ></my-bread>

   <!-- 指定div容器 -->
   <div id="main" style="width:600px; height:400px"></div>
</el-card>
</template>

<script>
var echarts =require('echarts')
export default {
  data(){
    return{

    } 
  },
  mounted(){
    this.useEchart();
  },
  methods:{
   async useEchart(){
      //init
      var myChart = echarts.init(document.getElementById('main'));
     
      //发起请求

      const res =await this.$http.get(`reports/type/1`)
      console.log("res数据统计",res)

      //配置 option

      //请求到的数据
      let option2=res.data.data

      //一些默认的option配置
      let option1 = {
          title: {
              text: '堆叠区域图'
          },
          tooltip : {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  label: {
                      backgroundColor: '#6a7985'
                  }
              }
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
      };
      let option={...option1,...option2}
      //使用 setoption
        myChart.setOption(option);
 

    }
  }
}
</script>

<style>

</style>