import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ '../views/RegisterView.vue')
    },
    {
      path: '/user/:id',
      name: 'userPage',
      component: () => import(/* webpackChunkName: "userPage" */ '../views/UserPageView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import(/* webpackChunkName: "notFound" */ '../views/NotFoundPageView.vue')
    },
    {
      path: '/search',
      name: 'searchPage',
      component: () => import(/* webpackChunkName: "userPage" */ '../views/SearchPageView.vue')
    },
    {
      path: '/friends',
      name: 'Friends',
      component: () => import(/* webpackChunkName: "userPage" */ '../views/FriendsPage.vue')
    },
  ],
})

export default router
