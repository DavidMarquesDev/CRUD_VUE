<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { dashboardService, type DashboardCard } from '@/services/dashboard.service'

const router = useRouter()
const userName = ref<string>('Usuário')
const loading = ref<boolean>(true)
const cards = ref<DashboardCard[]>([])
const productsPreview = ref<{ id: number; name: string; sku: string }[]>([])
const errorMessage = ref<string>('')

const loadData = async (): Promise<void> =>
{
    loading.value = true
    errorMessage.value = ''
    try {
        const [meResponse, summary] = await Promise.all([authService.me(), dashboardService.summary()])
        userName.value = meResponse.data.name
        cards.value = summary.cards
        productsPreview.value = summary.productsPreview
    } catch {
        cards.value = []
        productsPreview.value = []
        errorMessage.value = 'Não foi possível carregar os dados reais da API.'
    } finally {
        loading.value = false
    }
}

const logout = async (): Promise<void> =>
{
    try {
        await authService.logout()
    } finally {
        localStorage.removeItem('crud_vendas_token')
        await router.push('/login')
    }
}

onMounted(async () =>
{
    await loadData()
})
</script>

<template>
    <div class="home-page">
        <header class="home-header">
            <div class="home-logo">
                <span class="dot"></span>
                <strong>CRUD VENDAS</strong>
            </div>
            <div class="home-user">
                <span>Olá, {{ userName }}</span>
                <button @click="logout">Sair</button>
            </div>
        </header>

        <section class="home-hero">
            <h1>Painel Comercial</h1>
            <p>
                Monitoramento em tempo real dos dados da API e acesso rápido aos módulos de gestão.
            </p>
        </section>

        <section class="stats-grid" aria-live="polite">
            <article v-for="card in cards" :key="card.title" class="stat-card">
                <p>{{ card.title }}</p>
                <strong>{{ card.total }}</strong>
            </article>
        </section>

        <section class="home-banner">
            <h2>Gestão rápida</h2>
            <p>
                Acesse os módulos CRUD para manter produtos, empresas, clientes e usuários.
            </p>
            <div class="home-actions">
                <router-link to="/crud/products">Produtos</router-link>
                <router-link to="/crud/companies">Empresas</router-link>
                <router-link to="/crud/customers">Clientes</router-link>
                <router-link to="/crud/users">Usuários</router-link>
            </div>
        </section>

        <section class="home-list-section">
            <h2>Produtos recentes</h2>
            <ul v-if="productsPreview.length > 0" class="home-list">
                <li v-for="item in productsPreview" :key="item.id">
                    <strong>{{ item.name }}</strong>
                    <span>SKU: {{ item.sku }}</span>
                </li>
            </ul>
            <p v-else class="loading-hint">Nenhum produto retornado para preview.</p>
        </section>

        <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
        <p v-if="loading" class="loading-hint">Carregando dados do dashboard...</p>
    </div>
</template>
