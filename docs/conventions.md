# Convenções de Desenvolvimento

# Fechamento Financeiro Doméstico Mensal

---

# 📌 Objetivo do Documento

Este documento define:

- padrões de código
- convenções de nomenclatura
- organização do projeto
- boas práticas
- estratégia Git
- padrões React/TypeScript

O objetivo é garantir:

- legibilidade
- manutenção simples
- organização
- consistência
- escalabilidade

---

# 🧠 Filosofia de Desenvolvimento

O projeto seguirá os princípios:

- simplicidade
- modularidade
- legibilidade
- componentização
- baixo acoplamento
- performance
- escalabilidade controlada

---

# 🎯 Objetivos Técnicos

O código deve ser:

- limpo
- previsível
- reutilizável
- fácil de manter
- fácil de navegar

---

# 🚫 Evitar

- componentes gigantes
- duplicação de lógica
- acoplamento excessivo
- arquivos muito grandes
- abstrações desnecessárias

---

# 📁 Convenções de Estrutura

---

# Estrutura oficial

```txt
src/
│
├── components/
├── pages/
├── layouts/
├── hooks/
├── services/
├── database/
├── repositories/
├── routes/
├── types/
├── utils/
├── constants/
├── styles/
└── assets/
```

---

# 📦 Convenções de Pastas

---

# components

Somente:
- componentes reutilizáveis

---

# pages

Somente:
- páginas principais

---

# hooks

Somente:
- hooks customizados

---

# services

Somente:
- serviços auxiliares
- exportações
- utilidades externas

---

# repositories

Camada responsável por:
- acesso IndexedDB
- queries
- persistência

---

# utils

Funções puras e reutilizáveis.

---

# 🎨 Convenções de Componentes

---

# Estrutura recomendada

```txt
Component/
├── index.tsx
├── styles.ts
└── types.ts
```

---

# Estratégia

Componentes devem:
- ter responsabilidade única
- ser pequenos
- ser reutilizáveis

---

# 🚫 Evitar

- lógica excessiva no JSX
- componentes acima de 300 linhas
- múltiplas responsabilidades

---

# 🧩 Convenções de Nomenclatura

---

# Componentes

## Padrão

```txt
PascalCase
```

---

## Exemplos

```txt
SummaryCard
ExpenseForm
MonthlyChart
```

---

# Hooks

## Padrão

```txt
camelCase com prefixo use
```

---

## Exemplos

```txt
useTransactions
useDashboard
useMonthlyStats
```

---

# Funções

## Padrão

```txt
camelCase
```

---

## Exemplos

```txt
calculateTotal
formatCurrency
generateInstallments
```

---

# Arquivos

## Componentes

```txt
PascalCase.tsx
```

---

## Hooks

```txt
useHookName.ts
```

---

## Utilitários

```txt
camelCase.ts
```

---

# Tipos

## Padrão

```txt
PascalCase
```

---

## Exemplos

```txt
Transaction
Category
Installment
```

---

# Interfaces

## Prefixo

```txt
I
```

---

## Exemplos

```txt
ITransaction
ICategory
```

---

# Enums

## Sufixo

```txt
Enum
```

---

## Exemplos

```txt
PaymentMethodEnum
CategoryTypeEnum
```

---

# 🔷 Convenções TypeScript

---

# Obrigatório

Todo código deverá utilizar:
# TypeScript estrito

---

# Estratégia

Evitar:
```ts
any
```

---

# Priorizar

- interfaces
- types
- tipagem explícita

---

# Exemplo correto

```ts
interface ITransaction {
  id: number
  description: string
  amount: number
}
```

---

# 🚫 Evitar

```ts
const data: any
```

---

# ⚛️ Convenções React

---

# Estratégia oficial

Utilizar:
- componentes funcionais
- hooks
- composição

---

# Evitar

- class components
- prop drilling excessivo
- estados globais desnecessários

---

# Componentes

Cada componente deve:
- possuir responsabilidade única
- ser reutilizável
- ser desacoplado

---

# Hooks customizados

Toda lógica complexa deverá:
# ser extraída para hooks

---

# Exemplos

```txt
useTransactions
useInstallments
useDashboardMetrics
```

---

# ⚡ Estratégia de Performance

---

# Utilizar quando necessário

- useMemo
- useCallback
- React.memo

---

# Evitar

- memoização prematura
- otimizações desnecessárias

---

# 🎨 Convenções TailwindCSS

---

# Estratégia

Utilizar:
- classes utilitárias
- composição limpa
- padronização visual

---

# Ordem recomendada das classes

```txt
layout → spacing → typography → colors → effects
```

---

# Exemplo

```tsx
className="
flex items-center
p-4
text-sm font-medium
bg-slate-800
rounded-xl
shadow
"
```

---

# 🚫 Evitar

- classes gigantes
- repetição excessiva
- estilos inline

---

# 📄 Convenções de Imports

---

# Ordem oficial

```ts
1. React
2. Bibliotecas externas
3. Aliases internos
4. Imports relativos
5. Styles
```

---

# Exemplo

```ts
import { useState } from 'react'

import { PieChart } from 'recharts'

import { Button } from '@/components/Button'

import './styles.css'
```

---

# 🗃️ Convenções IndexedDB

---

# Estratégia

Todo acesso ao banco deverá ocorrer:
# via repositories

---

# Evitar

- queries espalhadas
- acesso direto no componente

---

# Correto

```txt
repositories/
```

---

# 🚫 Incorreto

```txt
components/
```

---

# 🔍 Convenções de Logs

---

# Desenvolvimento

Permitido:
```ts
console.log()
```

---

# Produção

Remover:
- logs desnecessários
- debugs
- traces

---

# 🧪 Convenções de Qualidade

---

# ESLint

Responsável por:
- boas práticas
- validação
- consistência

---

# Prettier

Responsável por:
- formatação automática

---

# Estratégia oficial

Código deve:
# sempre passar no lint

---

# 🌿 Convenções Git

---

# Branch principal

```txt
main
```

---

# Branch desenvolvimento

```txt
develop
```

---

# Branches de feature

## Padrão

```txt
feature/nome-feature
```

---

# Exemplos

```txt
feature/dashboard
feature/installments
feature/export-excel
```

---

# 📝 Convenções de Commit

---

# Padrão

```txt
tipo: descrição
```

---

# Tipos oficiais

```txt
feat:
fix:
refactor:
style:
docs:
test:
chore:
```

---

# Exemplos

```txt
feat: create dashboard cards
fix: correct installment calculation
docs: update roadmap
style: improve sidebar spacing
```

---

# 🚀 Estratégia de Escalabilidade

O projeto deverá crescer:
- modularmente
- sem reescrever estrutura
- mantendo simplicidade

---

# Estratégias

- componentização
- repositories
- hooks reutilizáveis
- separação de responsabilidades

---

# 📱 Estratégia Mobile First

Toda interface deverá ser construída:
# mobile first

---

# Prioridades

- responsividade
- performance mobile
- acessibilidade
- fluidez

---

# 🚫 Anti-Padrões Proibidos

---

# Não utilizar

- any excessivo
- lógica dentro do JSX
- componentes gigantes
- CSS inline excessivo
- duplicação de código
- funções enormes
- acoplamento forte

---

# 🎯 Objetivo Final das Convenções

Garantir um projeto:

- organizado
- moderno
- previsível
- legível
- performático
- fácil de manter
- escalável
- profissional