# Arquitetura do Projeto

# Fechamento Financeiro Doméstico Mensal

---

## 📌 Objetivo da Arquitetura

A arquitetura do sistema foi planejada para ser:

- simples
- modular
- offline-first
- escalável
- leve
- organizada
- de fácil manutenção

O projeto será desenvolvido como uma aplicação web local (PWA), sem dependência inicial de backend ou serviços em nuvem.

---

# 🧱 Stack Oficial

## Frontend
- React
- Vite
- TypeScript
- TailwindCSS

---

## Banco de dados local
- IndexedDB
- Dexie.js

---

## Gerenciamento de estado
- Zustand

---

## Navegação
- React Router DOM

---

## Dashboards
- Recharts

---

## PWA
- vite-plugin-pwa

---

# 🧠 Filosofia Arquitetural

O sistema seguirá a abordagem:

# Offline First + Frontend Modular

Isso significa que:

- toda lógica roda localmente
- os dados permanecem no dispositivo
- não existe dependência de APIs externas
- dashboards são processados localmente
- a aplicação deve continuar funcional sem internet

---

# 📁 Estrutura Oficial de Pastas

```txt
src/
│
├── assets/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   ├── charts/
│   └── feedback/
│
├── pages/
│   ├── dashboard/
│   ├── transactions/
│   ├── history/
│   ├── reports/
│   └── settings/
│
├── database/
│   ├── db.ts
│   ├── repositories/
│   ├── services/
│   └── seeds/
│
├── hooks/
│
├── routes/
│
├── services/
│
├── store/
│
├── styles/
│
├── types/
│
├── utils/
│
├── constants/
│
└── App.tsx
```

---

# 🧩 Responsabilidade das Pastas

# `/components`

Componentes reutilizáveis da interface.

---

## `/components/ui`

Componentes base:

- Button
- Card
- Input
- Select
- Modal

---

## `/components/layout`

Estrutura visual da aplicação:

- Sidebar
- Header
- BottomNavigation
- PageContainer

---

## `/components/forms`

Formulários do sistema:

- TransactionForm
- FiltersForm
- SettingsForm

---

## `/components/charts`

Gráficos financeiros:

- PieChart
- MonthlyBarChart
- EvolutionChart
- CategoryRanking

---

## `/components/feedback`

Componentes de feedback visual:

- Toasts
- EmptyState
- Loading
- ConfirmDialog

---

# `/pages`

Páginas principais do sistema.

---

## `/dashboard`

Painel principal financeiro.

---

## `/transactions`

Cadastro e gerenciamento de despesas.

---

## `/history`

Histórico financeiro mensal.

---

## `/reports`

Exportações e relatórios.

---

## `/settings`

Configurações locais da aplicação.

---

# `/database`

Camada de persistência local.

---

## `db.ts`

Configuração principal do IndexedDB.

---

## `/repositories`

Responsável pelo acesso organizado aos dados.

Exemplos:

- transactionsRepository
- categoriesRepository
- installmentsRepository

---

## `/services`

Regras de negócio relacionadas ao banco.

Exemplos:

- geração de parcelas
- fechamento mensal
- cálculos financeiros

---

## `/seeds`

Categorias padrão iniciais da aplicação.

---

# `/hooks`

Custom hooks reutilizáveis.

Exemplos:

- useTransactions
- useDashboard
- useMonthlyData

---

# `/store`

Estado global da aplicação utilizando Zustand.

Responsável por:

- competência atual
- tema dark/light
- filtros globais
- preferências locais

---

# `/utils`

Funções auxiliares reutilizáveis.

Exemplos:

- formatCurrency
- formatDate
- generateInstallments
- calculateMonthlyTotals

---

# `/types`

Tipagens TypeScript globais.

Exemplos:

- Transaction
- Installment
- Category
- DashboardData

---

# `/constants`

Constantes globais do sistema.

Exemplos:

- formas de pagamento
- categorias padrão
- limites
- cores

---

# 🔄 Fluxo Arquitetural Principal

```txt
Usuário
↓
Interface React
↓
Formulários
↓
Services
↓
Repositories
↓
IndexedDB (Dexie)
↓
Hooks
↓
Dashboard
```

---

# 🗃️ Estratégia de Persistência

Todos os dados serão armazenados localmente utilizando IndexedDB.

---

## Dados persistidos

- categorias
- transações
- parcelas
- configurações
- preferências

---

## Vantagens

- funcionamento offline
- alta performance
- zero custo
- independência de servidores
- maior privacidade

---

# 📦 Estratégia de Backup

## Exportação JSON

Backup completo contendo:

- categorias
- transações
- parcelas
- configurações

---

## Importação JSON

Restauração completa dos dados locais.

---

## Exportação Excel

Relatórios financeiros externos.

---

# 📊 Estratégia de Dashboards

Os dashboards serão calculados localmente utilizando os dados armazenados no IndexedDB.

---

## Métricas principais

- gasto total mensal
- média diária
- ranking de categorias
- evolução mensal
- comparativos históricos

---

## Gráficos principais

- pizza por categoria
- barras mensais
- linha temporal
- indicadores financeiros

---

# 📱 Estratégia de Responsividade

## Desktop
- sidebar lateral fixa
- dashboards amplos

---

## Mobile
- navegação inferior
- cards empilhados
- foco em lançamentos rápidos

---

# 🌙 Estratégia Visual

## Direção de design

- dark mode
- minimalista
- baixa poluição visual
- gráficos protagonistas
- foco analítico

---

# 🔐 Estratégia de Segurança

O sistema NÃO armazenará:

- CPF
- dados bancários
- números de cartão
- senhas
- informações sensíveis

---

# 🚀 Estratégia de Escalabilidade

Mesmo sendo offline-first, a arquitetura permitirá futuramente:

- sincronização em nuvem
- autenticação
- múltiplos usuários
- backend opcional
- aplicativo mobile nativo

Sem necessidade de reescrever o frontend.

---

# 📏 Padrões de Desenvolvimento

## Diretrizes

- componentes desacoplados
- responsabilidade única
- reutilização máxima
- tipagem forte
- separação entre UI e lógica
- código modular
- manutenção simplificada

---

# 🎯 Objetivo Arquitetural Final

Construir uma aplicação:

- profissional
- organizada
- rápida
- offline
- escalável
- moderna
- fácil de manter
- agradável de usar
- focada em fechamento financeiro doméstico mensal