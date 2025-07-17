import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/layout/Main.vue'
import Coins from '@/layout/List.vue'
import Detail from '@/layout/Detail.vue'
import Book from '@/layout/Book.vue'
import Future from '@/layout/Future.vue'
import Spot from '@/layout/Spot.vue'

const routes = [
  {
    path: '/coin-actions/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/coin-actions/coin-list',
    name: 'Coins',
    component: Coins,
    meta: { requiresAuth: false }
  },
  {
    path: '/coin-actions/coin-detail/:symbol',
    name: 'CoinDetail',
    component: Detail,
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/coin-actions/order-book',
    name: 'Book',
    component: Book,
    meta: { requiresAuth: false }
  },
  {
    path: '/coin-actions/future-list',
    name: 'Future',
    component: Future,
    meta: { requiresAuth: false }
  },
  {
    path: '/coin-actions/spot-list',
    name: 'Spot',
    component: Spot,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
