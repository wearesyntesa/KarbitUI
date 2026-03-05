import { createRouter, createWebHistory } from 'vue-router'
import FormsPage from './pages/FormsPage.vue'
import FeedbackPage from './pages/FeedbackPage.vue'
import OverlayPage from './pages/OverlayPage.vue'
import DataDisplayPage from './pages/DataDisplayPage.vue'
import NavigationPage from './pages/NavigationPage.vue'
import LayoutPage from './pages/LayoutPage.vue'
import TypographyPage from './pages/TypographyPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: FormsPage },
    { path: '/feedback', component: FeedbackPage },
    { path: '/overlay', component: OverlayPage },
    { path: '/data-display', component: DataDisplayPage },
    { path: '/navigation', component: NavigationPage },
    { path: '/layout', component: LayoutPage },
    { path: '/typography', component: TypographyPage },
  ],
})
