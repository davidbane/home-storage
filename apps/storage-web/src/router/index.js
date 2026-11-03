import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    // One URL per state at every width: ?in= picks a container, ?item= opens an item.
    // Desktop shows the item in a pane beside the list; phones show it as its own screen.
    // meta.dock: the view renders its own bottom action dock on phones, so the tab bar is hidden.
    { path: '/rooms/:roomId', name: 'room', component: () => import('@/views/RoomView.vue'), meta: { dock: true } },
    { path: '/low', name: 'low', component: () => import('@/views/LowStockView.vue') },
    { path: '/lists', name: 'lists', component: () => import('@/views/ListsView.vue') },
    // ?room= preselects a room's bins; ?ids= preselects specific places.
    { path: '/labels', name: 'labels', component: () => import('@/views/LabelsView.vue') },
    { path: '/settings', name: 'settings', component: () => import('@/views/SettingsView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: (to, from, saved) => saved ?? (to.path !== from.path ? { top: 0 } : undefined),
})
