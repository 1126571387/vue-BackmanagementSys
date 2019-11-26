import axios from 'axios'
const MyHttpServer = {}

MyHttpServer.install =  (Vue) =>{
  //基准地址
  axios.defaults.baseURL = 'http://39.108.193.251:8811/api/private/v1/'
  
  
  //在请求发送之前会自动来到这里
  // 添加请求拦截器
axios.interceptors.request.use(function (config) {


  if(config.url !== 'login'){
     //因为接口文档需要有token才可以访问接口数据，配置请求头
  const AUTH_TOKEN = localStorage.getItem('token')
  config.headers['Authorization'] = AUTH_TOKEN
  
  }

  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
  
  
  // 4. 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer