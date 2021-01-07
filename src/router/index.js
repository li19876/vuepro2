import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import index from '../components/Index.vue'
import welcome from '../components/Welcome.vue'
import users from '../components/user/Users.vue'
import rights from '../components/Rights.vue'
import roles from '../components/Roles.vue'
import cate from '../components/goods/Cate.vue'
import params from '../components/goods/Params.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/login', component: login },
  {
    path: '/index',
    component: index,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/rights', component: rights },
      { path: '/roles', component: roles },
      { path: '/categories', component: cate },
      { path: '/params', component: params }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (to.path === '/' && token) return next()
  if (!token) return next('/login')
  return next()
})
export default router
