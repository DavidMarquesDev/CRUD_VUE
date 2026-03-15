<script setup lang="ts">
import { authService } from '@/services/auth.service'

const router = useRouter()
const email = ref<string>('')
const password = ref<string>('')
const isLoading = ref<boolean>(false)
const errorMessage = ref<string>('')

const handleSubmit = async (): Promise<void> =>
{
    errorMessage.value = ''
    isLoading.value = true

    try {
        const response = await authService.login({
            email: email.value,
            password: password.value,
        })

        localStorage.setItem('crud_vendas_token', response.data.token)
        await router.push('/home')
    } catch {
        errorMessage.value = 'Não foi possível autenticar. Verifique e-mail e senha.'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="auth-page">
        <section class="auth-highlight">
            <p class="auth-badge">CRUD VENDAS</p>
            <h1>Controle de vendas com experiência moderna e foco em performance</h1>
            <p>
                Visual inspirado em e-commerce gamer: contraste forte, cartões em destaque e navegação
                objetiva para acelerar operação comercial.
            </p>
        </section>

        <section class="auth-form-wrapper">
            <form class="auth-form" @submit.prevent="handleSubmit">
                <h2>Entrar</h2>
                <p>Acesse sua conta para gerenciar produtos, clientes, fornecedores e empresas.</p>

                <label for="email">E-mail</label>
                <input
                    id="email"
                    v-model="email"
                    type="email"
                    placeholder="admin@empresa.com"
                    required
                />

                <label for="password">Senha</label>
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="Digite sua senha"
                    required
                />

                <button type="submit" :disabled="isLoading">
                    {{ isLoading ? 'Entrando...' : 'Acessar painel' }}
                </button>

                <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
            </form>
        </section>
    </div>
</template>
