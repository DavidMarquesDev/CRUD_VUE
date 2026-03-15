import { api } from '@/services/api'
import type { EntityStatus } from '@/services/companies.service'

export interface Supplier
{
    id: number
    company_id: number
    name: string
    document: string
    email: string | null
    phone: string | null
    status: EntityStatus
}

interface SupplierListResponse
{
    success: boolean
    data: Supplier[]
    meta: {
        total: number
    }
}

export const suppliersService = {
    async list(perPage = 100): Promise<SupplierListResponse>
    {
        const { data } = await api.get<SupplierListResponse>('/v1/suppliers', {
            params: { per_page: perPage },
        })
        return data
    },
}
