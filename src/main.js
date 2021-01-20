import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fontawesome-5.11.2/css/all.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import axios from 'axios'
axios.defaults.baseURL = 'http://192.168.0.39:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// http响应拦截器
axios.interceptors.response.use(res => {
  if (res.data.meta && res.data.meta.status) {
    const status = res.data.meta.status
    const msg = res.data.meta.msg
    // 10101是未登录状态码
    if (status === 401 || msg === '无效token') { // 如果是未登录直接踢出去
      location.href = '/#/login'
    }
  }
  return res
}, error => {
  console.log(error)
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
