# Análise de Tecnologia do `conectaservidor_front` e Plano de Implementação para `crud-vendas`

## Objetivo
Este documento consolida:

1. A tecnologia identificada no projeto `conectaservidor_front`.
2. Um plano prático para implementar o frontend em `crud-vendas-front` consumindo a API `crud-vendas`.

---

## 1) Stack Identificada no `conectaservidor_front`

## Framework e Base
- **Vue 3** (`vue ^3.5.17`)
- **TypeScript** (strict mode com `vue-tsc`)
- **Vite** como bundler/dev server (`vite ^6`)
- **Vue Router 4** com geração automática de rotas via `unplugin-vue-router`

## UI/UX
- **Vuetify 3** como biblioteca principal de componentes
- **Font Awesome** e **MDI** para ícones
- **SCSS/SASS** para estilos

## Estado e Arquitetura de Front
- **Pinia** para estado global
- Organização por domínio com separação clara entre:
  - `pages` (entrada de rota)
  - `views` (orquestração de tela)
  - `components` (UI reutilizável)
  - `composables` (lógica de interface)
  - `stores` (estado + orquestração de fluxos)
  - `services` (HTTP)
  - `types` (contratos)

## HTTP e Segurança
- **Axios** com instância central (`axiosInstance`)
- Interceptor de request para adicionar `Bearer token`
- Interceptor de response para tratar `401` (sessão expirada) e erros de servidor
- Token armazenado em cookie (`js-cookie`)

## Formulários e Validação
- **vee-validate** + **yup**

## Qualidade e Testes
- **ESLint** + **Prettier**
- **Vitest** + **@vue/test-utils** (testes unitários de front)

## Conclusão da Análise
Sim, sua hipótese está correta: o `conectaservidor_front` usa **Vue 3 + TypeScript + Vuetify + Pinia + Vite** como base principal.

---

## 2) API `crud-vendas` a ser consumida (resumo técnico)

Base de versão:
- Prefixo geral: `/api/v1`

Autenticação:
- `POST /api/v1/auth/login` (público, com throttle)
- `GET /api/v1/auth/me` (auth:sanctum)
- `POST /api/v1/auth/logout` (auth:sanctum)

Recursos protegidos por Sanctum + permissões:
- `companies` (`companies.read`, `companies.write`)
- `customers` (`customers.read`, `customers.write`)
- `suppliers` (`suppliers.read`, `suppliers.write`)
- `products` (`products.read`, `products.write`)

Endpoint público adicional:
- `GET /api/v1/home`

Contrato de resposta predominante:
- `success` (boolean)
- `data` (objeto/lista)
- `meta` (quando paginado)
- `message` (em respostas informativas)

---

## 3) Plano de Implementação do `crud-vendas-front`

## Fase 1 — Foundation
1. Inicializar projeto Vue 3 com TypeScript e Vite.
2. Instalar dependências base:
   - `vue-router`
   - `pinia`
   - `axios`
   - `vuetify`
   - `vee-validate` + `yup`
3. Criar aliases `@/` no `tsconfig` e Vite.
4. Definir `.env` com `VITE_API_URL`.

## Fase 2 — Estrutura por Domínio
Estruturar o `src`:

- `src/pages`
- `src/views`
- `src/components`
- `src/composables`
- `src/stores`
- `src/services`
- `src/types`
- `src/router`
- `src/plugins`
- `src/utils`

Domínios iniciais:
- `auth`
- `companies`
- `customers`
- `suppliers`
- `products`
- `shared`

## Fase 3 — Camada HTTP e Sessão
1. Criar `src/services/axiosInstance.ts`:
   - `baseURL = ${VITE_API_URL}/api`
   - Headers JSON padrão
2. Implementar interceptor de request:
   - Injetar `Authorization: Bearer <token>`
3. Implementar interceptor de response:
   - Tratar `401` com limpeza de sessão e redirecionamento ao login

## Fase 4 — Auth
1. Tipos:
   - `LoginParams`, `LoginResponse`, `MeResponse`
2. Service:
   - `login`, `me`, `logout`
3. Store (`auth.store.ts`):
   - estado de `token`, `user`, `isLoading`, `error`
   - ações de login, bootstrap de sessão e logout
4. Guard de rota:
   - proteger rotas internas

## Fase 5 — CRUD por Módulo
Para cada módulo (`companies`, `customers`, `suppliers`, `products`):

1. **Types**
   - DTO de entidade
   - DTO de filtros/paginação
   - DTO de resposta (`data`, `meta`)
2. **Service**
   - `list`, `show`, `create`, `update`, `remove`
3. **Store**
   - estado da listagem
   - paginação
   - loading e erro
4. **Views/Components**
   - listagem com paginação server-side
   - formulário create/edit com validação
   - confirmação de exclusão

## Fase 6 — Permissões no Front
Implementar controle de visibilidade por abilities vindas do login:

- `companies.read` / `companies.write`
- `customers.read` / `customers.write`
- `suppliers.read` / `suppliers.write`
- `products.read` / `products.write`

Aplicar permissões em:
- rotas
- botões de ação (criar/editar/excluir)
- menus laterais

## Fase 7 — Padronização de UX/API
1. Tratar mensagens de erro da API de forma centralizada.
2. Padronizar tabela paginada com componente reutilizável.
3. Padronizar formulário base com schema `yup`.
4. Padronizar estados visuais: loading, vazio, erro e sucesso.

## Fase 8 — Testes e Qualidade
1. Testes unitários de:
   - stores
   - services (mocks HTTP)
   - componentes críticos
2. Rodar:
   - `npm run type-check`
   - `npm run lint:fix`
   - `npm run test:unit`
3. Garantir build:
   - `npm run build`

---

## 4) Sequência recomendada de entrega (MVP)

1. Auth (login/me/logout + guard)
2. Companies (list/create/update/delete)
3. Customers
4. Suppliers
5. Products
6. Ajustes de permissão fina e refinamento visual

---

## 5) Riscos e atenção

- Garantir alinhamento exato dos contratos `data/meta/message`.
- Evitar filtros client-side quando endpoint já suporta paginação/filtro server-side.
- Manter tipagem estrita sem `any`.
- Centralizar autenticação e tratamento de `401` em um único ponto.

---

## 6) Resultado esperado

Com esse plano, o `crud-vendas-front` nasce com uma base sólida, padronizada e aderente ao padrão já validado no `conectaservidor_front`, reduzindo retrabalho e acelerando a entrega dos módulos de CRUD.
