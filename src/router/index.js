import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Home from '@/layout/Main.vue'
import Login from '@/layout/Login.vue'
import Register from '@/layout/Register.vue'
import Forgot from '@/layout/Forgot.vue'
import Coins from '@/layout/List.vue'
import Detail from '@/layout/Detail.vue'
import Orders from '@/layout/Orders.vue'
import Book from '@/layout/Book.vue'
import Future from '@/layout/Future.vue'
import Spot from '@/layout/Spot.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/reset-password',
    name: 'Forgot',
    component: Forgot,
    meta: { guestOnly: true }
  },
  {
    path: '/coin-list',
    name: 'Coins',
    component: Coins,
    meta: { requiresAuth: false }
  },
  {
    path: '/coin-detail/:symbol',
    name: 'CoinDetail',
    component: Detail,
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: { requiresAuth: false }
  },
  {
    path: '/order-book',
    name: 'Book',
    component: Book,
    meta: { requiresAuth: false }
  },
  {
    path: '/future-list',
    name: 'Future',
    component: Future,
    meta: { requiresAuth: false }
  },
  {
    path: '/spot-list',
    name: 'Spot',
    component: Spot,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = await store.dispatch('login/checkLogin')
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login' })
  }
  else if (to.meta.guestOnly && isLoggedIn) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
