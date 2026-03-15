<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { companiesService, type Company, type CompanyPayload, type EntityStatus } from '@/services/companies.service'

const router = useRouter()
const loading = ref<boolean>(true)
const saving = ref<boolean>(false)
const errorMessage = ref<string>('')
const companies = ref<Company[]>([])
const editingId = ref<number | null>(null)

const form = ref<CompanyPayload>({
    name: '',
    document: '',
    email: null,
    phone: null,
    status: 'active',
})

const resetForm = (): void =>
{
    editingId.value = null
    form.value = {
        name: '',
        document: '',
        email: null,
        phone: null,
        status: 'active',
    }
}

const loadCompanies = async (): Promise<void> =>
{
    loading.value = true
    errorMessage.value = ''
    try {
        const response = await companiesService.list()
        companies.value = response.data
    } catch {
        errorMessage.value = 'Não foi possível carregar empresas.'
    } finally {
        loading.value = false
    }
}

const startEdit = (item: Company): void =>
{
    editingId.value = item.id
    form.value = {
        name: item.name,
        document: item.document,
        email: item.email,
        phone: item.phone,
        status: item.status,
    }
}

const save = async (): Promise<void> =>
{
    saving.value = true
    errorMessage.value = ''
    try {
        if (editingId.value) {
            await companiesService.update(editingId.value, form.value)
        } else {
            await companiesService.create(form.value)
        }

        resetForm()
        await loadCompanies()
    } catch {
        errorMessage.value = 'Falha ao salvar empresa. Verifique os campos.'
    } finally {
        saving.value = false
    }
}

const remove = async (id: number): Promise<void> =>
{
    errorMessage.value = ''
    try {
        await companiesService.remove(id)
        await loadCompanies()
    } catch {
        errorMessage.value = 'Falha ao excluir empresa.'
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
    await loadCompanies()
})

const statusOptions: EntityStatus[] = ['active', 'inactive']
</script>

<template>
    <div class="crud-page">
        <header class="crud-header">
            <div>
                <h1>CRUD de Empresas</h1>
                <p>Gestão de empresas integrada à API.</p>
            </div>
            <div class="crud-header-actions">
                <button @click="toHome">Voltar ao painel</button>
                <button @click="logout">Sair</button>
            </div>
        </header>

        <section class="crud-form-card">
            <h2>{{ editingId ? 'Editar empresa' : 'Nova empresa' }}</h2>
            <div class="crud-form-grid">
                <label>
                    Nome
                    <input v-model="form.name" type="text" />
                </label>
                <label>
                    Documento
                    <input v-model="form.document" type="text" />
                </label>
                <label>
                    E-mail
                    <input v-model="form.email" type="email" />
                </label>
                <label>
                    Telefone
                    <input v-model="form.phone" type="text" />
                </label>
                <label>
                    Status
                    <select v-model="form.status">
                        <option v-for="status in statusOptions" :key="status" :value="status">
                            {{ status }}
                        </option>
                    </select>
                </label>
            </div>
            <div class="crud-form-actions">
                <button :disabled="saving" @click="save">{{ editingId ? 'Atualizar' : 'Criar' }}</button>
                <button :disabled="saving" @click="resetForm">Limpar</button>
            </div>
            <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
        </section>

        <section class="crud-table-card">
            <h2>Empresas cadastradas</h2>
            <p v-if="loading" class="loading-hint">Carregando empresas...</p>
            <table v-else>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Documento</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in companies" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.document }}</td>
                        <td>{{ item.status }}</td>
                        <td class="crud-row-actions">
                            <button @click="startEdit(item)">Editar</button>
                            <button @click="remove(item.id)">Excluir</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</template>
