<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { companiesService, type Company, type EntityStatus } from '@/services/companies.service'
import { productsService, type Product, type ProductPayload } from '@/services/products.service'
import { suppliersService, type Supplier } from '@/services/suppliers.service'

const router = useRouter()
const loading = ref<boolean>(true)
const saving = ref<boolean>(false)
const errorMessage = ref<string>('')
const products = ref<Product[]>([])
const companies = ref<Company[]>([])
const suppliers = ref<Supplier[]>([])
const editingId = ref<number | null>(null)

const form = ref<ProductPayload>({
    company_id: 0,
    supplier_id: null,
    name: '',
    sku: '',
    price: 0,
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

const supplierMap = computed(() =>
{
    return suppliers.value.reduce<Record<number, string>>((acc, item) =>
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
        supplier_id: null,
        name: '',
        sku: '',
        price: 0,
        status: 'active',
    }
}

const loadBaseData = async (): Promise<void> =>
{
    const [companiesResponse, suppliersResponse, productsResponse] = await Promise.all([
        companiesService.list(),
        suppliersService.list(),
        productsService.list(),
    ])

    companies.value = companiesResponse.data
    suppliers.value = suppliersResponse.data
    products.value = productsResponse.data

    if (!form.value.company_id) {
        form.value.company_id = companies.value[0]?.id ?? 0
    }
}

const loadProducts = async (): Promise<void> =>
{
    loading.value = true
    errorMessage.value = ''
    try {
        await loadBaseData()
    } catch {
        errorMessage.value = 'Não foi possível carregar produtos.'
    } finally {
        loading.value = false
    }
}

const startEdit = (item: Product): void =>
{
    editingId.value = item.id
    form.value = {
        company_id: item.company_id,
        supplier_id: item.supplier_id,
        name: item.name,
        sku: item.sku,
        price: Number(item.price),
        status: item.status,
    }
}

const save = async (): Promise<void> =>
{
    saving.value = true
    errorMessage.value = ''
    try {
        const payload: ProductPayload = {
            ...form.value,
            price: Number(form.value.price),
            supplier_id: form.value.supplier_id ? Number(form.value.supplier_id) : null,
        }

        if (editingId.value) {
            await productsService.update(editingId.value, payload)
        } else {
            await productsService.create(payload)
        }

        resetForm()
        await loadProducts()
    } catch {
        errorMessage.value = 'Falha ao salvar produto. Verifique os campos.'
    } finally {
        saving.value = false
    }
}

const remove = async (id: number): Promise<void> =>
{
    errorMessage.value = ''
    try {
        await productsService.remove(id)
        await loadProducts()
    } catch {
        errorMessage.value = 'Falha ao excluir produto.'
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
    await loadProducts()
})

const statusOptions: EntityStatus[] = ['active', 'inactive']
</script>

<template>
    <div class="crud-page">
        <header class="crud-header">
            <div>
                <h1>CRUD de Produtos</h1>
                <p>Gestão de produtos integrada à API.</p>
            </div>
            <div class="crud-header-actions">
                <button @click="toHome">Voltar ao painel</button>
                <button @click="logout">Sair</button>
            </div>
        </header>

        <section class="crud-form-card">
            <h2>{{ editingId ? 'Editar produto' : 'Novo produto' }}</h2>
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
                    Fornecedor
                    <select v-model.number="form.supplier_id">
                        <option :value="null">Sem fornecedor</option>
                        <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                            {{ supplier.name }}
                        </option>
                    </select>
                </label>
                <label>
                    Nome
                    <input v-model="form.name" type="text" />
                </label>
                <label>
                    SKU
                    <input v-model="form.sku" type="text" />
                </label>
                <label>
                    Preço
                    <input v-model.number="form.price" type="number" min="0" step="0.01" />
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
            <h2>Produtos cadastrados</h2>
            <p v-if="loading" class="loading-hint">Carregando produtos...</p>
            <table v-else>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>SKU</th>
                        <th>Empresa</th>
                        <th>Fornecedor</th>
                        <th>Preço</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in products" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.sku }}</td>
                        <td>{{ companyMap[item.company_id] ?? item.company_id }}</td>
                        <td>{{ item.supplier_id ? (supplierMap[item.supplier_id] ?? item.supplier_id) : 'Sem fornecedor' }}</td>
                        <td>R$ {{ Number(item.price).toFixed(2) }}</td>
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
