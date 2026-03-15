import { api } from '@/services/api'
import type { EntityStatus } from '@/services/companies.service'

export interface Customer
{
    id: number
    company_id: number
    name: string
    document: string
    email: string | null
    phone: string | null
    status: EntityStatus
}

export interface CustomerPayload
{
    company_id: number
    name: string
    document: string
    email: string | null
    phone: string | null
    status: EntityStatus
}

interface ApiCollectionMeta
{
    total: number
}

interface CustomerListResponse
{
    success: boolean
    data: Customer[]
    meta: ApiCollectionMeta
}

interface CustomerItemResponse
{
    success: boolean
    data: Customer
}

export const customersService = {
    async list(perPage = 100): Promise<CustomerListResponse>
    {
        const { data } = await api.get<CustomerListResponse>('/v1/customers', {
            params: { per_page: perPage },
        })
        return data
    },

    async create(payload: CustomerPayload): Promise<Customer>
    {
        const { data } = await api.post<CustomerItemResponse>('/v1/customers', payload)
        return data.data
    },

    async update(id: number, payload: CustomerPayload): Promise<Customer>
    {
        const { data } = await api.put<CustomerItemResponse>(`/v1/customers/${id}`, payload)
        return data.data
    },

    async remove(id: number): Promise<void>
    {
        await api.delete(`/v1/customers/${id}`)
    },
}
