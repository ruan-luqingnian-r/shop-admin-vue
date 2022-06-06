import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import UserList from '@/components/user/UserList'
import BannnerList from '@/components/front/BannnerList'
import ProductCategoryList from '@/components/product/ProductCategoryList'
import ProductList from '@/components/product/ProductList'
import HotProductList from '@/components/front/HotProductList'


Vue.use(VueRouter)

const routes = [
  { path:"/", redirect: '/login' },
  { path:"/login", component:Login },
  { path: "/home",
    component: Home,
    redirect: "/welcome",
    children:[
      {path:"/welcome", component:Welcome},
      {path: "/user",component: UserList},
      {path: "/front/banner",component: BannnerList},
      {path: "/goods/category",component: ProductCategoryList},
      {path: "/goods/product",component: ProductList},
      {path: "/front/hot",component: HotProductList}
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
//挂载路由守卫
router.beforeEach((to, from, next)=>{
  //to 将要访问的路径
  //from 从哪一个路径跳转来
  //next 是一个函数，表示放行 next()放行 next("/login")强制跳转到/login
  //如果用户要登录,直接放行
  if (to.path === "/login") return next()
  //如果不是登录页面，先获取token，判断是否存在，存在放行，不存在跳转
  const token = window.sessionStorage.getItem('token')
  if (!token) return next("/login")
  next()
  }

)
