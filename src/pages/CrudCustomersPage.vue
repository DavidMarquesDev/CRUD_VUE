<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { companiesService, type Company, type EntityStatus } from '@/services/companies.service'
import { customersService, type Customer, type CustomerPayload } from '@/services/customers.service'

const router = useRouter()
const loading = ref<boolean>(true)
const saving = ref<boolean>(false)
const errorMessage = ref<string>('')
const customers = ref<Customer[]>([])
const companies = ref<Company[]>([])
const editingId = ref<number | null>(null)

const form = ref<CustomerPayload>({
    company_id: 0,
    name: '',
    document: '',
    email: null,
    phone: null,
    status: 'active',
})

const companyMap = computed(() =>
{
    return companies.value.reduce<Record<number, string>>((acc, item) =>
    {
        acc[item.id] = item.name
        return acc
    }, {})
})

const resetForm = (): void =>
{
    editingId.value = null
    form.value = {
        company_id: companies.value[0]?.id ?? 0,
        name: '',
        document: '',
        email: null,
        phone: null,
        status: 'active',
    }
}

const loadBaseData = async (): Promise<void> =>
{
    const [companiesResponse, customersResponse] = await Promise.all([
        companiesService.list(),
        customersService.list(),
    ])

    companies.value = companiesResponse.data
    customers.value = customersResponse.data

    if (!form.value.company_id) {
        form.value.company_id = companies.value[0]?.id ?? 0
    }
}

const loadCustomers = async (): Promise<void> =>
{
    loading.value = true
    errorMessage.value = ''
    try {
        await loadBaseData()
    } catch {
        errorMessage.value = 'Não foi possível carregar clientes.'
    } finally {
        loading.value = false
    }
}

const startEdit = (item: Customer): void =>
{
    editingId.value = item.id
    form.value = {
        company_id: item.company_id,
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
            await customersService.update(editingId.value, form.value)
        } else {
            await customersService.create(form.value)
        }

        resetForm()
        await loadCustomers()
    } catch {
        errorMessage.value = 'Falha ao salvar cliente. Verifique os campos.'
    } finally {
        saving.value = false
    }
}

const remove = async (id: number): Promise<void> =>
{
    errorMessage.value = ''
    try {
        await customersService.remove(id)
        await loadCustomers()
    } catch {
        errorMessage.value = 'Falha ao excluir cliente.'
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
    await loadCustomers()
})

const statusOptions: EntityStatus[] = ['active', 'inactive']
</script>

<template>
    <div class="crud-page">
        <header class="crud-header">
            <div>
                <h1>CRUD de Clientes</h1>
                <p>Gestão de clientes integrada à API.</p>
            </div>
            <div class="crud-header-actions">
                <button @click="toHome">Voltar ao painel</button>
                <button @click="logout">Sair</button>
            </div>
        </header>

        <section class="crud-form-card">
            <h2>{{ editingId ? 'Editar cliente' : 'Novo cliente' }}</h2>
            <div class="crud-form-grid">
                <label>
                    Empresa
                    <select v-model.number="form.company_id">
                        <option v-for="company in companies" :key="company.id" :value="company.id">
                            {{ company.name }}
                        </option>
                    </select>
                </label>
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
            <h2>Clientes cadastrados</h2>
            <p v-if="loading" class="loading-hint">Carregando clientes...</p>
            <table v-else>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Empresa</th>
                        <th>Nome</th>
                        <th>Documento</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in customers" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ companyMap[item.company_id] ?? item.company_id }}</td>
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
