import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'

const requireAuth = (_to: unknown, _from: unknown, next: (path?: string) => void): void =>
{
    const token = localStorage.getItem('crud_vendas_token')

    if (!token) {
        next('/login')
        return
    }

    next()
}

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home',
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
        },
        {
            path: '/home',
            name: 'home',
            component: HomePage,
            beforeEnter: requireAuth,
        },
    ],
})
