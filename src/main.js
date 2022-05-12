import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import axios from 'axios'
Vue.prototype.$axios = axios;
// //配置请求跟路径
// axios.defaults.baseURL = 'http://localhost:9001'
Vue.prototype.$http = axios
Vue.config.productionTip = false

axios.interceptors.request.use(config =>{
  config.headers.Authorization = window.sessionStorage.getItem("token")
  // 固定写法必须有返回值
  return config;
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
