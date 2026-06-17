# Roadmap de Desenvolvimento

# Fechamento Financeiro Doméstico Mensal

---

# 📌 Objetivo do Roadmap

Este documento define o plano oficial de desenvolvimento do sistema.

O roadmap foi estruturado para:

- desenvolvimento incremental
- foco em MVP
- organização técnica
- evolução controlada
- entregas progressivas
- manutenção simplificada

---

# 🧠 Estratégia de Desenvolvimento

O projeto seguirá a filosofia:

# MVP First + Offline First

---

## Objetivos principais

- construir rapidamente uma versão funcional
- validar arquitetura local
- manter simplicidade
- evitar overengineering
- priorizar usabilidade
- focar em dashboards financeiros

---

# 🚀 Roadmap Geral

| Fase | Nome | Status |
|---|---|---|
| 1 | Planejamento e arquitetura | ✅ |
| 2 | Setup inicial do projeto | ⏳ |
| 3 | Estrutura visual base | ⏳ |
| 4 | Banco local IndexedDB | ⏳ |
| 5 | CRUD de despesas | ⏳ |
| 6 | Parcelamentos automáticos | ⏳ |
| 7 | Dashboards financeiros | ⏳ |
| 8 | Histórico financeiro | ⏳ |
| 9 | Backup e exportação | ⏳ |
| 10 | PWA e offline | ⏳ |
| 11 | Refinamento UX/UI | ⏳ |
| 12 | Testes e estabilização | ⏳ |

---

# 📅 FASE 1 — Planejamento e Arquitetura

## Status
✅ Concluído

---

## Objetivos

- definir arquitetura
- modelar banco
- definir stack
- estruturar documentação

---

## Entregáveis

- README.md
- arquitetura.md
- banco-de-dados.md
- roadmap.md

---

# 📅 FASE 2 — Setup Inicial do Projeto

## Status
⏳ Pendente

---

## Objetivos

Criar estrutura inicial do frontend.

---

## Tarefas

### Projeto base
- [ ] criar projeto React + Vite
- [ ] configurar TypeScript
- [ ] configurar ESLint
- [ ] configurar Prettier

---

### Estilização
- [ ] instalar TailwindCSS
- [ ] configurar dark mode
- [ ] criar estilos globais

---

### Navegação
- [ ] instalar React Router
- [ ] criar estrutura inicial de rotas

---

### Organização
- [ ] criar estrutura oficial de pastas
- [ ] configurar aliases de importação

---

## Entregável final

Projeto React inicial funcional.

---

# 📅 FASE 3 — Estrutura Visual Base

## Status
⏳ Pendente

---

## Objetivos

Criar estrutura visual reutilizável.

---

## Tarefas

### Layout
- [ ] criar sidebar desktop
- [ ] criar bottom navigation mobile
- [ ] criar header principal
- [ ] criar PageContainer

---

### Componentes UI
- [ ] Button
- [ ] Card
- [ ] Input
- [ ] Select
- [ ] Modal
- [ ] EmptyState

---

### Responsividade
- [ ] adaptar mobile
- [ ] adaptar tablet
- [ ] adaptar desktop

---

## Entregável final

Base visual pronta para páginas.

---

# 📅 FASE 4 — Banco Local IndexedDB

## Status
⏳ Pendente

---

## Objetivos

Implementar persistência local.

---

## Tarefas

### Banco
- [ ] instalar Dexie.js
- [ ] criar db.ts
- [ ] configurar IndexedDB

---

### Tabelas
- [ ] categories
- [ ] transactions
- [ ] installments
- [ ] settings

---

### Repositories
- [ ] categoriesRepository
- [ ] transactionsRepository
- [ ] installmentsRepository

---

### Seeds
- [ ] categorias padrão

---

## Entregável final

Banco local funcional.

---

# 📅 FASE 5 — CRUD de Despesas

## Status
⏳ Pendente

---

## Objetivos

Permitir gerenciamento completo das despesas.

---

## Tarefas

### Formulários
- [ ] criar TransactionForm
- [ ] validação de campos
- [ ] máscaras monetárias

---

### Funcionalidades
- [ ] criar despesas
- [ ] editar despesas
- [ ] excluir despesas
- [ ] listar despesas

---

### Filtros
- [ ] filtro por mês
- [ ] filtro por categoria
- [ ] filtro por pagamento

---

## Entregável final

CRUD completo funcional.

---

# 📅 FASE 6 — Parcelamentos Automáticos

## Status
⏳ Pendente

---

## Objetivos

Automatizar distribuição financeira mensal.

---

## Tarefas

### Lógica
- [ ] gerar parcelas automaticamente
- [ ] distribuir competências
- [ ] vincular parcelas à transação

---

### Regras
- [ ] exclusão em cascata
- [ ] cálculo de parcelas
- [ ] arredondamento monetário

---

### Visualização
- [ ] listar parcelas
- [ ] mostrar progresso

---

## Entregável final

Sistema de parcelamento funcional.

---

# 📅 FASE 7 — Dashboards Financeiros

## Status
⏳ Pendente

---

## Objetivos

Criar painel analítico financeiro.

---

## Tarefas

### KPIs
- [ ] gasto total
- [ ] média diária
- [ ] maior categoria
- [ ] quantidade de despesas

---

### Gráficos
- [ ] pizza por categoria
- [ ] barras mensais
- [ ] linha temporal
- [ ] ranking categorias

---

### Filtros
- [ ] competência
- [ ] categoria
- [ ] período

---

## Entregável final

Dashboard financeiro completo.

---

# 📅 FASE 8 — Histórico Financeiro

## Status
⏳ Pendente

---

## Objetivos

Consolidar competências passadas.

---

## Tarefas

- [ ] histórico mensal
- [ ] comparação mensal
- [ ] evolução financeira
- [ ] fechamento mensal

---

## Entregável final

Histórico consolidado funcional.

---

# 📅 FASE 9 — Backup e Exportação

## Status
⏳ Pendente

---

## Objetivos

Garantir segurança e portabilidade dos dados.

---

## Tarefas

### JSON
- [ ] exportação JSON
- [ ] importação JSON
- [ ] validação de backup

---

### Excel
- [ ] exportação XLSX
- [ ] relatórios financeiros

---

## Entregável final

Sistema de backup completo.

---

# 📅 FASE 10 — PWA e Offline

## Status
⏳ Pendente

---

## Objetivos

Transformar sistema em aplicativo instalável.

---

## Tarefas

- [ ] instalar vite-plugin-pwa
- [ ] configurar manifest
- [ ] configurar service worker
- [ ] configurar cache offline
- [ ] testar instalação mobile

---

## Entregável final

Aplicação instalável como PWA.

---

# 📅 FASE 11 — Refinamento UX/UI

## Status
⏳ Pendente

---

## Objetivos

Melhorar experiência visual.

---

## Tarefas

- [ ] revisar responsividade
- [ ] melhorar espaçamentos
- [ ] melhorar feedback visual
- [ ] melhorar acessibilidade
- [ ] otimizar gráficos

---

## Entregável final

Interface refinada.

---

# 📅 FASE 12 — Testes e Estabilização

## Status
⏳ Pendente

---

## Objetivos

Garantir estabilidade do MVP.

---

## Tarefas

- [ ] testar CRUD
- [ ] testar parcelamentos
- [ ] testar dashboards
- [ ] testar exportações
- [ ] testar offline
- [ ] testar mobile

---

## Entregável final

MVP estável e utilizável.

---

# 🎯 Critérios de Conclusão do MVP

O MVP será considerado finalizado quando:

- CRUD estiver funcional
- parcelamentos funcionando
- dashboards operacionais
- histórico consolidado
- backup funcionando
- sistema offline funcional
- PWA instalável
- interface responsiva

---

# 🚀 Melhorias Futuras

## Futuras possibilidades

- sincronização em nuvem
- múltiplos usuários
- metas financeiras
- controle patrimonial
- notificações
- importação bancária
- aplicativo mobile nativo
- inteligência financeira

---

# 📌 Estratégia de Priorização

A ordem de prioridade será:

1. funcionamento
2. estabilidade
3. performance
4. experiência visual
5. funcionalidades futuras

---

# 🎯 Objetivo Final do Roadmap

Construir uma aplicação:

- leve
- moderna
- estável
- offline
- organizada
- visualmente agradável
- simples de manter
- focada em fechamento financeiro doméstico mensal