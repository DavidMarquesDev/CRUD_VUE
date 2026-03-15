import { createRouter, createWebHistory } from 'vue-router'
import CrudCompaniesPage from '@/pages/CrudCompaniesPage.vue'
import CrudCustomersPage from '@/pages/CrudCustomersPage.vue'
import CrudProductsPage from '@/pages/CrudProductsPage.vue'
import CrudUsersPage from '@/pages/CrudUsersPage.vue'
import HomePage from '@/pages/HomePage.vue'
import IndexPage from '@/pages/IndexPage.vue'
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
            name: 'index',
            component: IndexPage,
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
        {
            path: '/crud/products',
            name: 'crud-products',
            component: CrudProductsPage,
            beforeEnter: requireAuth,
        },
        {
            path: '/crud/companies',
            name: 'crud-companies',
            component: CrudCompaniesPage,
            beforeEnter: requireAuth,
        },
        {
            path: '/crud/customers',
            name: 'crud-customers',
            component: CrudCustomersPage,
            beforeEnter: requireAuth,
        },
        {
            path: '/crud/users',
            name: 'crud-users',
            component: CrudUsersPage,
            beforeEnter: requireAuth,
        },
    ],
})
