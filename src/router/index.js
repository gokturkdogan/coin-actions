import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/layout/Main.vue'
import Coins from '@/layout/List.vue'
import Detail from '@/layout/Detail.vue'
import Volume from '@/layout/Volume.vue'
import TradeVolume from '@/layout/TradeVolume.vue'

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
    path: '/coin-actions/volume-list',
    name: 'Volume',
    component: Volume,
    meta: { requiresAuth: false }
  },
  {
    path: '/coin-actions/trade-volume',
    name: 'TradeVolume',
    component: TradeVolume,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
