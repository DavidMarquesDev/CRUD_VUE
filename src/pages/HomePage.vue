<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { homeService, type HomeCardData } from '@/services/home.service'

const router = useRouter()
const userName = ref<string>('Usuário')
const loading = ref<boolean>(true)
const cards = ref<HomeCardData[]>([])

const fallbackCards: HomeCardData[] = [
    { title: 'Empresas ativas', total: 24 },
    { title: 'Clientes cadastrados', total: 378 },
    { title: 'Fornecedores homologados', total: 62 },
    { title: 'Produtos em catálogo', total: 1249 },
]

const loadData = async (): Promise<void> =>
{
    loading.value = true
    try {
        const [meResponse, homeResponse] = await Promise.all([authService.me(), homeService.index()])
        userName.value = meResponse.data.name
        cards.value = homeResponse.data.cards && homeResponse.data.cards.length > 0
            ? homeResponse.data.cards
            : fallbackCards
    } catch {
        cards.value = fallbackCards
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
                Layout com destaque visual para ofertas e indicadores, inspirado em vitrines de alto
                impacto para leitura rápida dos números do negócio.
            </p>
        </section>

        <section class="stats-grid" aria-live="polite">
            <article v-for="card in cards" :key="card.title" class="stat-card">
                <p>{{ card.title }}</p>
                <strong>{{ card.total }}</strong>
            </article>
        </section>

        <section class="home-banner">
            <h2>Próximo passo do projeto</h2>
            <p>
                Integrar os módulos de listagem e CRUD de Empresas, Clientes, Fornecedores e Produtos
                seguindo o plano de implementação definido.
            </p>
        </section>

        <p v-if="loading" class="loading-hint">Carregando dados do dashboard...</p>
    </div>
</template>
