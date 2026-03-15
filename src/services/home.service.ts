import { api } from '@/services/api'

export interface HomeCardData
{
    title: string
    total: number
}

export interface HomeResponse
{
    success: boolean
    data: {
        cards?: HomeCardData[]
        [key: string]: unknown
    }
}

export const homeService = {
    async index(): Promise<HomeResponse>
    {
        const { data } = await api.get<HomeResponse>('/v1/home')
        return data
    },
}
