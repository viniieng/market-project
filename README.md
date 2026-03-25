# Market Manager

Sistema SaaS de gerenciamento de mercado para controle de estoque e preços, com autenticação Google, Firestore multiusuário e deploy automático em produção.

![Status](https://img.shields.io/badge/status-production-brightgreen)
![React](https://img.shields.io/badge/React-18+-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Hosting%20%7C%20Auth%20%7C%20Firestore-ffca28?logo=firebase&logoColor=black)

## 📌 Descrição

Projeto fullstack para cadastro, edição, listagem e exclusão de produtos, com filtros, dashboard e histórico de alterações. Cada usuário acessa apenas os próprios dados via isolamento por `uid` no Firestore.

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como trabalho do curso de **Análise e Desenvolvimento de Sistemas (ADS)**, com foco no uso de **prompts para IA** como apoio no processo de criação, estruturação e evolução da aplicação.

## 🌐 Preview / Demonstração

- **Produção:** https://market-project-b0740.web.app
- **Acesso:** entre com Google para usar o painel (rotas protegidas).

## ✨ Funcionalidades

- Autenticação com Firebase Auth (Google Login).
- Rotas privadas para usuários autenticados.
- CRUD completo de produtos:
  - Nome, descrição, preço, categoria, estoque.
  - Data de criação e atualização.
- Busca, filtros e ordenação de produtos.
- Dashboard com métricas de estoque.
- Indicador de estoque baixo.
- Histórico simples de alterações (`CREATE`, `UPDATE`, `DELETE`).
- Interface moderna com Tailwind, toasts e skeleton loading.

## 🧰 Tecnologias Utilizadas

- **Frontend:** React + TypeScript + Vite
- **UI:** TailwindCSS, Lucide Icons, Framer Motion, React Hot Toast
- **Backend/BaaS:** Firebase (Auth + Firestore)
- **Infra:** Firebase Hosting
- **CI/CD:** GitHub Actions

## 🏗️ Arquitetura (Resumo)

- Arquitetura modular por domínio (`auth`, `products`, `dashboard`).
- Camada de serviços para integração Firebase.
- Tipagem forte com TypeScript.
- Dados isolados por usuário no Firestore:
  - `users/{uid}/products`
  - `users/{uid}/product_logs`

## ▶️ Como Rodar Localmente

### 1) Clonar o repositório

```bash
git clone https://github.com/viniieng/market-project.git
cd market-project
```

### 2) Instalar dependências

```bash
npm install
```

### 3) Configurar ambiente

```bash
cp .env.example .env
```

Preencha o `.env` com os dados do app Web no Firebase:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 4) Rodar aplicação

```bash
npm run dev
```

### 5) Build local de produção (opcional)

```bash
npm run build
npm run preview
```

## 🔐 Autenticação (Firebase / Google Login)

1. No Firebase Console, habilite **Authentication**.
2. Ative o provedor **Google**.
3. No app, o usuário autentica via popup Google.
4. Rotas internas exigem sessão válida.

## 🚀 Deploy

Deploy manual:

```bash
npm run firebase:deploy
```

O projeto publica no Firebase Hosting e aplica regras/índices do Firestore.

## ⚙️ CI/CD (GitHub Actions)

Workflow: `.github/workflows/firebase-hosting-deploy.yml`

### Fluxo automático

Ao fazer `push` na branch `main`, o pipeline executa:

1. Instala dependências.
2. Valida variáveis obrigatórias.
3. Gera build de produção.
4. Faz deploy no Firebase Hosting.

### Secrets necessários

```txt
FIREBASE_PROJECT_ID
FIREBASE_TOKEN
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### Exemplo resumido do workflow

```yaml
name: Deploy Firebase Hosting

on:
  push:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
      - run: firebase deploy --only hosting,firestore:rules,firestore:indexes --project "$FIREBASE_PROJECT_ID" --token "$FIREBASE_TOKEN"
        env:
          FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## 📁 Estrutura de Pastas (Resumo)

```txt
src/
  app/
    router.tsx
  modules/
    auth/
    products/
    dashboard/
  services/
    firebase/
  shared/
    components/
    lib/
    types/
```

## 🛣️ Melhorias Futuras (Roadmap)

- [ ] Paginação e virtualização de tabela.
- [ ] Exportação CSV/PDF de inventário.
- [ ] Alertas automáticos para estoque crítico.
- [ ] Testes E2E e suíte de integração.
- [ ] Modo tema escuro (dark mode).
- [ ] Lazy loading para reduzir bundle inicial.

## 👨‍💻 Autor

**Vinicius Engelmann**

- GitHub: https://github.com/viniieng
