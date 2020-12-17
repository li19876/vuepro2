import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import index from '../components/Index.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/index', component: index }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  return next()
})
export default router
