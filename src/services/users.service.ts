import { authService, type AuthenticatedUser } from '@/services/auth.service'
import { api } from '@/services/api'

export interface UserItem
{
    id: number
    name: string
    email: string
}

export interface UserPayload
{
    name: string
    email: string
    password: string
}

interface UsersListResponse
{
    success: boolean
    data: UserItem[]
    meta?: {
        total: number
    }
}

interface UserItemResponse
{
    success: boolean
    data: UserItem
}

const endpointNotAvailableMessage = 'A API ainda não expõe endpoints de CRUD de usuários.'

const mapAuthenticatedUser = (user: AuthenticatedUser): UserItem =>
{
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    }
}

const isNotFoundError = (error: unknown): boolean =>
{
    const maybeError = error as { response?: { status?: number } }
    return maybeError.response?.status === 404
}

export const usersService = {
    async list(): Promise<{ users: UserItem[]; apiCrudAvailable: boolean; total: number }>
    {
        try {
            const { data } = await api.get<UsersListResponse>('/v1/users', {
                params: { per_page: 100 },
            })

            return {
                users: data.data,
                apiCrudAvailable: true,
                total: data.meta?.total ?? data.data.length,
            }
        } catch (error) {
            if (!isNotFoundError(error)) {
                throw error
            }

            const me = await authService.me()
            return {
                users: [mapAuthenticatedUser(me.data)],
                apiCrudAvailable: false,
                total: 1,
            }
        }
    },

    async create(payload: UserPayload): Promise<UserItem>
    {
        try {
            const { data } = await api.post<UserItemResponse>('/v1/users', payload)
            return data.data
        } catch (error) {
            if (isNotFoundError(error)) {
                throw new Error(endpointNotAvailableMessage)
            }

            throw error
        }
    },

    async update(id: number, payload: UserPayload): Promise<UserItem>
    {
        try {
            const { data } = await api.put<UserItemResponse>(`/v1/users/${id}`, payload)
            return data.data
        } catch (error) {
            if (isNotFoundError(error)) {
                throw new Error(endpointNotAvailableMessage)
            }

            throw error
        }
    },

    async remove(id: number): Promise<void>
    {
        try {
            await api.delete(`/v1/users/${id}`)
        } catch (error) {
            if (isNotFoundError(error)) {
                throw new Error(endpointNotAvailableMessage)
            }

            throw error
        }
    },
}
