<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { usersService, type UserItem, type UserPayload } from '@/services/users.service'

const router = useRouter()
const loading = ref<boolean>(true)
const saving = ref<boolean>(false)
const errorMessage = ref<string>('')
const infoMessage = ref<string>('')
const users = ref<UserItem[]>([])
const editingId = ref<number | null>(null)
const apiCrudAvailable = ref<boolean>(true)

const form = ref<UserPayload>({
    name: '',
    email: '',
    password: '',
})

const resetForm = (): void =>
{
    editingId.value = null
    form.value = {
        name: '',
        email: '',
        password: '',
    }
}

const loadUsers = async (): Promise<void> =>
{
    loading.value = true
    errorMessage.value = ''
    infoMessage.value = ''
    try {
        const response = await usersService.list()
        users.value = response.users
        apiCrudAvailable.value = response.apiCrudAvailable

        if (!response.apiCrudAvailable) {
            infoMessage.value = 'A API atual não possui CRUD de usuários; exibindo apenas usuário autenticado.'
        }
    } catch {
        errorMessage.value = 'Não foi possível carregar usuários.'
    } finally {
        loading.value = false
    }
}

const startEdit = (item: UserItem): void =>
{
    editingId.value = item.id
    form.value = {
        name: item.name,
        email: item.email,
        password: '',
    }
}

const save = async (): Promise<void> =>
{
    saving.value = true
    errorMessage.value = ''
    try {
        if (editingId.value) {
            await usersService.update(editingId.value, form.value)
        } else {
            await usersService.create(form.value)
        }

        resetForm()
        await loadUsers()
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao salvar usuário.'
        errorMessage.value = message
    } finally {
        saving.value = false
    }
}

const remove = async (id: number): Promise<void> =>
{
    errorMessage.value = ''
    try {
        await usersService.remove(id)
        await loadUsers()
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao excluir usuário.'
        errorMessage.value = message
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

const toHome = async (): Promise<void> =>
{
    await router.push('/home')
}

onMounted(async () =>
{
    await loadUsers()
})
</script>

<template>
    <div class="crud-page">
        <header class="crud-header">
            <div>
                <h1>CRUD de Usuários</h1>
                <p>Gestão de usuários integrada à API.</p>
            </div>
            <div class="crud-header-actions">
                <button @click="toHome">Voltar ao painel</button>
                <button @click="logout">Sair</button>
            </div>
        </header>

        <section class="crud-form-card">
            <h2>{{ editingId ? 'Editar usuário' : 'Novo usuário' }}</h2>
            <div class="crud-form-grid">
                <label>
                    Nome
                    <input v-model="form.name" type="text" />
                </label>
                <label>
                    E-mail
                    <input v-model="form.email" type="email" />
                </label>
                <label>
                    Senha
                    <input v-model="form.password" type="password" />
                </label>
            </div>
            <div class="crud-form-actions">
                <button :disabled="saving || !apiCrudAvailable" @click="save">{{ editingId ? 'Atualizar' : 'Criar' }}</button>
                <button :disabled="saving" @click="resetForm">Limpar</button>
            </div>
            <p v-if="infoMessage" class="loading-hint">{{ infoMessage }}</p>
            <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
        </section>

        <section class="crud-table-card">
            <h2>Usuários</h2>
            <p v-if="loading" class="loading-hint">Carregando usuários...</p>
            <table v-else>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in users" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.email }}</td>
                        <td class="crud-row-actions">
                            <button :disabled="!apiCrudAvailable" @click="startEdit(item)">Editar</button>
                            <button :disabled="!apiCrudAvailable" @click="remove(item.id)">Excluir</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</template>
