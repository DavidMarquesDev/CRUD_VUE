import { api } from '@/services/api'

export interface LoginPayload
{
    email: string
    password: string
}

export interface AuthenticatedUser
{
    id: number
    name: string
    email: string
}

export interface LoginResponse
{
    success: boolean
    data: {
        token: string
        token_type: string
        abilities: string[]
        user: AuthenticatedUser
    }
}

export interface MeResponse
{
    success: boolean
    data: AuthenticatedUser
}

export const authService = {
    async login(payload: LoginPayload): Promise<LoginResponse>
    {
        const { data } = await api.post<LoginResponse>('/v1/auth/login', payload)
        return data
    },

    async me(): Promise<MeResponse>
    {
        const { data } = await api.get<MeResponse>('/v1/auth/me')
        return data
    },

    async logout(): Promise<void>
    {
        await api.post('/v1/auth/logout')
    },
}
