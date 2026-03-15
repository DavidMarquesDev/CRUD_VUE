<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface BannerItem
{
    id: number
    title: string
    subtitle: string
    image: string
}

interface ProductItem
{
    id: number
    name: string
    price: string
    image: string
    highlight: string
}

const banners: BannerItem[] = [
    {
        id: 1,
        title: 'Semana Gamer de Ofertas',
        subtitle: 'Descontos em PCs, acessórios e periféricos para montar seu setup.',
        image: 'https://picsum.photos/seed/crud-banner-1/1600/650',
    },
    {
        id: 2,
        title: 'Setup Completo para Escritório',
        subtitle: 'Monitores, teclados e cadeiras ergonômicas com condições especiais.',
        image: 'https://picsum.photos/seed/crud-banner-2/1600/650',
    },
    {
        id: 3,
        title: 'Lançamentos de Hardware',
        subtitle: 'Processadores, placas de vídeo e refrigeração com alto desempenho.',
        image: 'https://picsum.photos/seed/crud-banner-3/1600/650',
    },
]

const products: ProductItem[] = [
    {
        id: 1,
        name: 'Headset Pro X Wireless',
        price: 'R$ 459,90',
        image: 'https://picsum.photos/seed/crud-product-1/600/600',
        highlight: 'Frete grátis',
    },
    {
        id: 2,
        name: 'Teclado Mecânico RGB',
        price: 'R$ 329,90',
        image: 'https://picsum.photos/seed/crud-product-2/600/600',
        highlight: '12x sem juros',
    },
    {
        id: 3,
        name: 'Monitor Gamer 27" 165Hz',
        price: 'R$ 1.399,90',
        image: 'https://picsum.photos/seed/crud-product-3/600/600',
        highlight: 'Oferta relâmpago',
    },
    {
        id: 4,
        name: 'Mouse Ultra Precision',
        price: 'R$ 199,90',
        image: 'https://picsum.photos/seed/crud-product-4/600/600',
        highlight: 'Top vendas',
    },
    {
        id: 5,
        name: 'Gabinete Mid Tower Glass',
        price: 'R$ 549,90',
        image: 'https://picsum.photos/seed/crud-product-5/600/600',
        highlight: 'Últimas unidades',
    },
    {
        id: 6,
        name: 'Placa de Vídeo RTX',
        price: 'R$ 3.199,90',
        image: 'https://picsum.photos/seed/crud-product-6/600/600',
        highlight: 'Lançamento',
    },
]

const activeBanner = ref<number>(0)
const productIndex = ref<number>(0)
const productsPerSlide = 4
const visibleProducts = computed(() =>
{
    const total = products.length
    return Array.from({ length: productsPerSlide }, (_, offset) =>
    {
        const index = (productIndex.value + offset) % total
        return products[index]
    })
})

let bannerTimer: ReturnType<typeof setInterval> | null = null
let productTimer: ReturnType<typeof setInterval> | null = null

const nextBanner = (): void =>
{
    activeBanner.value = (activeBanner.value + 1) % banners.length
}

const prevBanner = (): void =>
{
    activeBanner.value = (activeBanner.value - 1 + banners.length) % banners.length
}

const nextProducts = (): void =>
{
    productIndex.value = (productIndex.value + 1) % products.length
}

const prevProducts = (): void =>
{
    productIndex.value = (productIndex.value - 1 + products.length) % products.length
}

const startTimers = (): void =>
{
    bannerTimer = setInterval(nextBanner, 5000)
    productTimer = setInterval(nextProducts, 3500)
}

const stopTimers = (): void =>
{
    if (bannerTimer) {
        clearInterval(bannerTimer)
        bannerTimer = null
    }

    if (productTimer) {
        clearInterval(productTimer)
        productTimer = null
    }
}

onMounted(() =>
{
    startTimers()
})

onBeforeUnmount(() =>
{
    stopTimers()
})
</script>

<template>
    <div class="index-page">
        <header class="store-header">
            <div class="store-brand">
                <span class="store-brand-dot"></span>
                <div>
                    <strong>CRUD VENDAS STORE</strong>
                    <p>Equipamentos, periféricos e tecnologia para seu negócio</p>
                </div>
            </div>
            <nav class="store-actions">
                <router-link to="/login" class="store-link">Entrar</router-link>
                <router-link to="/home" class="store-button">Painel</router-link>
            </nav>
        </header>

        <section class="hero-banner">
            <img :src="banners[activeBanner].image" :alt="banners[activeBanner].title" />
            <div class="hero-overlay">
                <h1>{{ banners[activeBanner].title }}</h1>
                <p>{{ banners[activeBanner].subtitle }}</p>
            </div>
            <button class="hero-nav hero-nav-left" @click="prevBanner" aria-label="Banner anterior">
                ‹
            </button>
            <button class="hero-nav hero-nav-right" @click="nextBanner" aria-label="Próximo banner">
                ›
            </button>
        </section>

        <section class="product-section">
            <div class="product-header">
                <h2>Produtos em destaque</h2>
                <div class="product-controls">
                    <button @click="prevProducts" aria-label="Produtos anteriores">‹</button>
                    <button @click="nextProducts" aria-label="Próximos produtos">›</button>
                </div>
            </div>

            <div class="product-carousel">
                <article v-for="product in visibleProducts" :key="product.id" class="product-card">
                    <img :src="product.image" :alt="product.name" />
                    <span>{{ product.highlight }}</span>
                    <h3>{{ product.name }}</h3>
                    <strong>{{ product.price }}</strong>
                </article>
            </div>
        </section>

        <footer class="store-footer">
            <div class="footer-top-banner">
                <p>Quer comprar para empresa? Condições especiais para CNPJ e compras em volume.</p>
                <a href="#">Fale com comercial</a>
            </div>
            <div class="footer-columns">
                <div>
                    <h4>Departamentos</h4>
                    <ul>
                        <li>Hardware</li>
                        <li>Periféricos</li>
                        <li>Monitores</li>
                        <li>Notebooks</li>
                    </ul>
                </div>
                <div>
                    <h4>Institucional</h4>
                    <ul>
                        <li>Quem somos</li>
                        <li>Nossas lojas</li>
                        <li>Política de privacidade</li>
                        <li>Trabalhe conosco</li>
                    </ul>
                </div>
                <div>
                    <h4>Atendimento</h4>
                    <ul>
                        <li>(31) 3305-5150</li>
                        <li>seg. a sex. 8h às 18h</li>
                        <li>sac@crudvendas.com.br</li>
                        <li>Suporte técnico online</li>
                    </ul>
                </div>
            </div>
            <p class="footer-copy">© {{ new Date().getFullYear() }} CRUD VENDAS STORE. Todos os direitos reservados.</p>
        </footer>
    </div>
</template>
