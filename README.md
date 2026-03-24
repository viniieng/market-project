# Market Manager

Sistema fullstack para gestão de mercado (estoque e preços) com autenticação Firebase, CRUD de produtos, dashboard e deploy contínuo para Firebase Hosting.

## Stack

- Frontend: React + TypeScript + Vite
- Backend/BaaS: Firebase Firestore
- Autenticação: Firebase Auth (Google OAuth)
- Deploy: Firebase Hosting
- CI/CD: GitHub Actions (deploy automático em `main`)

## Funcionalidades

- Login com Google via Firebase Auth
- Rotas protegidas para usuários autenticados
- CRUD completo de produtos:
  - Nome, descrição, preço, categoria, quantidade em estoque
  - Datas de criação e atualização
- Busca e filtros por nome/descrição, categoria e faixa de preço
- Ordenação por atualização, preço e nome
- Dashboard com:
  - Quantidade total de produtos
  - Valor total em estoque
  - Indicador de estoque baixo
- Histórico simples de alterações (`CREATE`, `UPDATE`, `DELETE`)

## Arquitetura

Estrutura modular para escalabilidade e separação de responsabilidades:

```txt
src/
  app/
    router.tsx
  modules/
    auth/
      components/
      context/
      hooks/
      pages/
    products/
      components/
      hooks/
      pages/
    dashboard/
      pages/
  services/
    firebase/
      auth.ts
      config.ts
      products.ts
  shared/
    components/
    types/
```

## Pré-requisitos

- Node.js 20+
- Conta Firebase
- Projeto Firebase criado
- Repositório no GitHub (para CI/CD)

## Configuração do Firebase (console)

1. Crie um projeto no Firebase.
2. Ative **Authentication** e habilite o provedor **Google**.
3. Crie o banco **Cloud Firestore** (modo production).
4. Em **Project settings > General**, crie um app Web e copie as credenciais.

## Configuração de ambiente local

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

2. Preencha as variáveis no `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Ajuste o ID do projeto em `.firebaserc`:

```json
{
  "projects": {
    "default": "seu-project-id"
  }
}
```

## Rodando localmente

```bash
npm install
npm run dev
```

Abra no navegador a URL exibida pelo Vite (normalmente `http://localhost:5173`).

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy manual no Firebase

1. Faça login no Firebase CLI:

```bash
npx firebase login
```

2. Faça deploy:

```bash
npm run firebase:deploy
```

## CI/CD com GitHub Actions

Workflow: `.github/workflows/firebase-hosting-deploy.yml`

Disparo automático: push na branch `main`.

### Secrets necessários no GitHub

Em `Settings > Secrets and variables > Actions`, configure:

- `FIREBASE_PROJECT_ID`: ID do seu projeto Firebase
- `FIREBASE_TOKEN`: token gerado via:

```bash
npx firebase login:ci
```

## Regras e Hosting

- Regras do Firestore: `firestore.rules`
- Índices Firestore: `firestore.indexes.json`
- Hosting SPA rewrite: `firebase.json`

## Observações de produção

- O build atual funciona pronto para deploy.
- Para reduzir tamanho de bundle, a evolução natural é split de rotas/componentes com import dinâmico.
