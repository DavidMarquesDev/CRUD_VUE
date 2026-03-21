# CRUD Vendas Frontend

[🇺🇸 English](./README.en.md) | [🇧🇷 Português](./README.pt-BR.md)

SPA em Vue 3 para operação comercial integrada à API `CRUD_LARAVEL`, com autenticação por token, painel de indicadores e módulos CRUD.

## Sumário

- [Visão Geral](#visão-geral)
- [Objetivo do Frontend](#objetivo-do-frontend)
- [Arquitetura e Padrões](#arquitetura-e-padrões)
- [Tecnologias e Bibliotecas](#tecnologias-e-bibliotecas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Módulos Funcionais](#módulos-funcionais)
- [Fluxo de Navegação e Requisição](#fluxo-de-navegação-e-requisição)
- [Autenticação e Sessão](#autenticação-e-sessão)
- [Rotas da Aplicação](#rotas-da-aplicação)
- [Integração com API](#integração-com-api)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Comandos Úteis](#comandos-úteis)
- [Qualidade e Ferramentas](#qualidade-e-ferramentas)
- [Troubleshooting](#troubleshooting)

## Visão Geral

Este projeto implementa o frontend do ecossistema CRUD Vendas para gestão de dados comerciais.

- Aplicação: `crud-vendas-front`
- Tipo: Single Page Application (SPA)
- Domínio: gestão comercial e cadastro operacional
- Backend alvo: `CRUD_LARAVEL` (`/api/v1`)
- Estilo de integração: REST + Bearer Token

## Objetivo do Frontend

Fornecer interface web para os principais fluxos da API:

- login e logout;
- dashboard com consolidação de dados;
- CRUD de empresas, clientes e produtos;
- gerenciamento de usuários com fallback para `/auth/me` quando `/users` não estiver disponível;
- navegação pública (landing page) e área interna protegida.

## Arquitetura e Padrões

### Arquitetura por responsabilidades

- **Apresentação:** páginas Vue (`src/pages`) e roteamento de navegação.
- **Aplicação:** serviços que centralizam chamadas de API e regras de orquestração.
- **Infraestrutura:** cliente HTTP Axios com interceptors e guardas de rota.
- **Bootstrap:** inicialização do app com Vue, Pinia e Router.

### Padrões aplicados no front

- Service Layer no frontend para encapsular integração HTTP.
- Separação de responsabilidades entre página e serviço.
- Tipagem explícita de contratos de entrada e saída em TypeScript.
- Configuração central de sessão/token.

## Tecnologias e Bibliotecas

### Core

- Vue 3
- TypeScript (strict mode)
- Vite
- Vue Router 4
- Pinia

### Integração HTTP

- Axios com instância única em `src/services/api.ts`
- `baseURL` via variável `VITE_API_URL`
- Interceptor de request com `Authorization: Bearer {token}`
- Interceptor de response para tratar `401`

### Tooling

- ESLint (flat config)
- `vue-tsc` para type-check
- Alias `@` para `src/`

## Estrutura de Pastas

```text
src/
├─ pages/
│  ├─ IndexPage.vue
│  ├─ LoginPage.vue
│  ├─ HomePage.vue
│  ├─ CrudCompaniesPage.vue
│  ├─ CrudCustomersPage.vue
│  ├─ CrudProductsPage.vue
│  └─ CrudUsersPage.vue
├─ router/
│  └─ index.ts
├─ services/
│  ├─ api.ts
│  ├─ auth.service.ts
│  ├─ home.service.ts
│  ├─ dashboard.service.ts
│  ├─ companies.service.ts
│  ├─ customers.service.ts
│  ├─ suppliers.service.ts
│  ├─ products.service.ts
│  └─ users.service.ts
├─ styles/
│  └─ main.css
├─ App.vue
└─ main.ts
```

## Módulos Funcionais

### Landing

- vitrine inicial pública com navegação para login e painel.

### Auth

- autenticação por credenciais;
- persistência do token no `localStorage`;
- logout com revogação via API e limpeza local.

### Home / Dashboard

- leitura de `/home`;
- agregação de totais de empresas, clientes, fornecedores e produtos;
- preview dos produtos mais recentes.

### Companies

- listagem, criação, edição e remoção.

### Customers

- listagem, criação, edição e remoção.

### Products

- listagem, criação, edição e remoção;
- vínculo com empresa e fornecedor.

### Users

- integração com `/users`;
- fallback para usuário autenticado quando endpoint não existe (`404`).

## Fluxo de Navegação e Requisição

Fluxo padrão de uma operação protegida:

1. Usuário autentica em `/login`.
2. Token é salvo em `localStorage` (`crud_vendas_token`).
3. Navegação para rota interna passa pelo guard de autenticação.
4. Página dispara ação que consome serviço.
5. Serviço usa `api.ts` para enviar requisição à API.
6. Resposta atualiza estado local da tela.
7. Em `401`, sessão é limpa e usuário retorna para `/login`.

## Autenticação e Sessão

- header de autenticação:

```bash
Authorization: Bearer {seu_token}
```

- estratégia atual:
  - token em `localStorage`;
  - validação de acesso por route guard;
  - redirecionamento automático no interceptor quando sessão expira.

## Rotas da Aplicação

### Públicas

- `/`
- `/login`

### Protegidas

- `/home`
- `/crud/companies`
- `/crud/customers`
- `/crud/products`
- `/crud/users`

## Integração com API

Base local sugerida:

`http://127.0.0.1:8000/api/v1`

Endpoints consumidos:

### Autenticação

- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

### Home

- `GET /home`

### Empresas

- `GET /companies`
- `POST /companies`
- `PUT /companies/{id}`
- `DELETE /companies/{id}`

### Clientes

- `GET /customers`
- `POST /customers`
- `PUT /customers/{id}`
- `DELETE /customers/{id}`

### Fornecedores

- `GET /suppliers` (consumo para apoio de cadastros e dashboard)

### Produtos

- `GET /products`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`

### Usuários

- `GET /users`
- `POST /users`
- `PUT /users/{id}`
- `DELETE /users/{id}`

## Como Rodar o Projeto

## Pré-requisitos

- Node.js LTS
- npm
- API `CRUD_LARAVEL` disponível

## Instalação

1) Instalar dependências:

```bash
npm install
```

2) Criar arquivo de ambiente:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3) Ajustar URL da API no `.env`:

```env
VITE_API_URL=http://localhost:8000
```

## Execução em desenvolvimento

Rodar aplicação local:

```bash
npm run dev
```

## Comandos Úteis

- Type-check:

```bash
npm run type-check
```

- Lint:

```bash
npm run lint
```

- Correção automática de lint:

```bash
npm run lint:fix
```

- Build de produção:

```bash
npm run build
```

- Preview do build:

```bash
npm run preview
```

## Qualidade e Ferramentas

- ESLint para análise estática do código.
- TypeScript estrito para segurança de tipos.
- `vue-tsc` para validação de tipos em arquivos `.vue`.
- Configuração de alias para imports limpos.
- Configuração atual do `package.json` não inclui script de testes automatizados.

## Troubleshooting

### Erro 401 em rotas internas

- verificar se o token está salvo em `localStorage`;
- validar se login retornou token;
- verificar se a API está com sessão/token válidos.

### Redirecionamento constante para `/login`

- conferir valor de `VITE_API_URL`;
- confirmar disponibilidade da API backend;
- validar se o endpoint `/api/v1/auth/me` está acessível com Bearer token.

### Falha de CORS ou conexão com API

- validar configuração de CORS no backend;
- confirmar se frontend e backend apontam para hosts corretos;
- revisar porta e protocolo (`http`/`https`) no `.env`.

### Build ou lint com erro

- executar `npm install` novamente;
- executar `npm run type-check` e `npm run lint` para identificar arquivo exato;
- validar versão do Node.js compatível com o projeto.
