import { createRouter, createWebHistory } from 'vue-router';
import OverviewView from '@/views/OverviewView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'overview', component: OverviewView },
    { path: '/color', component: () => import('@/views/ColorView.vue') },
    { path: '/type', component: () => import('@/views/TypeView.vue') },
    { path: '/shape', component: () => import('@/views/ShapeView.vue') },
    { path: '/layout', component: () => import('@/views/LayoutView.vue') },
    { path: '/components', component: () => import('@/views/ComponentsView.vue') },
    { path: '/components/:slug', component: () => import('@/views/ComponentView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: (to, from, saved) => saved ?? (to.path !== from.path ? { top: 0 } : undefined),
});
