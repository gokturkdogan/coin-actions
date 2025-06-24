import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Home from '@/layout/Main.vue'
import Login from '@/layout/Login.vue'
import Register from '@/layout/Register.vue'
import Forgot from '@/layout/Forgot.vue'

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
