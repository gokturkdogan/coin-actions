import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Home from '@/layout/Main.vue'
import Login from '@/layout/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true } // login olmayan giremesin
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true } // login olan buraya giremesin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🚧 Global Route Guard
router.beforeEach(async (to, from, next) => {
  // Firebase oturum durumunu kontrol et
  const isLoggedIn = await store.dispatch('login/checkLogin')

  // Giriş yapılmamışsa ama sayfa login gerektiriyorsa
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login' })
  }
  // Giriş yapılmışsa ama guest-only sayfasına gidilmeye çalışılıyorsa
  else if (to.meta.guestOnly && isLoggedIn) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
