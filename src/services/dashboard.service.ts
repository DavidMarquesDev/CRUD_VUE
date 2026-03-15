import { companiesService } from '@/services/companies.service'
import { customersService } from '@/services/customers.service'
import { productsService } from '@/services/products.service'
import { suppliersService } from '@/services/suppliers.service'

export interface DashboardCard
{
    title: string
    total: number
}

export interface DashboardSummary
{
    cards: DashboardCard[]
    productsPreview: {
        id: number
        name: string
        sku: string
    }[]
}

const getTotal = async (handler: () => Promise<{ meta?: { total?: number }; data: unknown[] }>): Promise<number> =>
{
    try {
        const response = await handler()
        return response.meta?.total ?? response.data.length
    } catch {
        return 0
    }
}

export const dashboardService = {
    async summary(): Promise<DashboardSummary>
    {
        const [companies, customers, suppliers, productsResponse] = await Promise.all([
            getTotal(() => companiesService.list(1)),
            getTotal(() => customersService.list(1)),
            getTotal(() => suppliersService.list(1)),
            productsService.list(8),
        ])

        const cards: DashboardCard[] = [
            { title: 'Empresas', total: companies },
            { title: 'Clientes', total: customers },
            { title: 'Fornecedores', total: suppliers },
            { title: 'Produtos', total: productsResponse.meta.total },
        ]

        const productsPreview = productsResponse.data.slice(0, 5).map((item) =>
        {
            return {
                id: item.id,
                name: item.name,
                sku: item.sku,
            }
        })

        return {
            cards,
            productsPreview,
        }
    },
}
