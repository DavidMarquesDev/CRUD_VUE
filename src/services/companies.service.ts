import { api } from '@/services/api'

export type EntityStatus = 'active' | 'inactive'

export interface Company
{
    id: number
    name: string
    document: string
    email: string | null
    phone: string | null
    status: EntityStatus
}

export interface CompanyPayload
{
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

interface CompanyListResponse
{
    success: boolean
    data: Company[]
    meta: ApiCollectionMeta
}

interface CompanyItemResponse
{
    success: boolean
    data: Company
}

export const companiesService = {
    async list(perPage = 100): Promise<CompanyListResponse>
    {
        const { data } = await api.get<CompanyListResponse>('/v1/companies', {
            params: { per_page: perPage },
        })
        return data
    },

    async create(payload: CompanyPayload): Promise<Company>
    {
        const { data } = await api.post<CompanyItemResponse>('/v1/companies', payload)
        return data.data
    },

    async update(id: number, payload: CompanyPayload): Promise<Company>
    {
        const { data } = await api.put<CompanyItemResponse>(`/v1/companies/${id}`, payload)
        return data.data
    },

    async remove(id: number): Promise<void>
    {
        await api.delete(`/v1/companies/${id}`)
    },
}
