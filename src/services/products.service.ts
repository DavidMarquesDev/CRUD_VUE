import { api } from '@/services/api'
import type { EntityStatus } from '@/services/companies.service'

export interface Product
{
    id: number
    company_id: number
    supplier_id: number | null
    name: string
    sku: string
    price: number
    status: EntityStatus
}

export interface ProductPayload
{
    company_id: number
    supplier_id: number | null
    name: string
    sku: string
    price: number
    status: EntityStatus
}

interface ProductListResponse
{
    success: boolean
    data: Product[]
    meta: {
        total: number
    }
}

interface ProductItemResponse
{
    success: boolean
    data: Product
}

export const productsService = {
    async list(perPage = 100): Promise<ProductListResponse>
    {
        const { data } = await api.get<ProductListResponse>('/v1/products', {
            params: { per_page: perPage },
        })
        return data
    },

    async create(payload: ProductPayload): Promise<Product>
    {
        const { data } = await api.post<ProductItemResponse>('/v1/products', payload)
        return data.data
    },

    async update(id: number, payload: ProductPayload): Promise<Product>
    {
        const { data } = await api.put<ProductItemResponse>(`/v1/products/${id}`, payload)
        return data.data
    },

    async remove(id: number): Promise<void>
    {
        await api.delete(`/v1/products/${id}`)
    },
}
