import { createRouter, createWebHistory } from 'vue-router'
import FormsPage from './pages/FormsPage.vue'
import FeedbackPage from './pages/FeedbackPage.vue'
import OverlayPage from './pages/OverlayPage.vue'
import DataDisplayPage from './pages/DataDisplayPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: FormsPage },
    { path: '/feedback', component: FeedbackPage },
    { path: '/overlay', component: OverlayPage },
    { path: '/data-display', component: DataDisplayPage },
  ],
})
