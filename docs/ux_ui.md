# UX/UI Design System

# Fechamento Financeiro Doméstico Mensal

---

# 📌 Objetivo do Documento

Este documento define:

- identidade visual
- experiência do usuário
- estrutura das telas
- componentes reutilizáveis
- padrões visuais
- responsividade
- navegação
- wireframes conceituais

O objetivo é garantir:
- consistência visual
- organização
- escalabilidade do frontend
- melhor experiência de uso

---

# 🧠 Filosofia Visual

O sistema foi concebido para transmitir:

- clareza
- organização
- controle financeiro
- simplicidade
- modernidade

---

# 🎯 Direção de Design

A interface seguirá os princípios:

- minimalismo
- baixa poluição visual
- foco analítico
- dashboards protagonistas
- navegação simples
- responsividade total

---

# 🌙 Estratégia Visual

## Tema principal

# Dark Mode

---

## Conceito visual

O sistema deve parecer:

# um painel doméstico financeiro moderno

E NÃO:
- aplicativo bancário
- planilha financeira
- ERP corporativo

---

# 🎨 Paleta de Cores

## Fundo principal
```txt
#0F172A
```

---

## Cards
```txt
#1E293B
```

---

## Bordas
```txt
#334155
```

---

## Texto principal
```txt
#F8FAFC
```

---

## Texto secundário
```txt
#94A3B8
```

---

## Destaque positivo
```txt
#22C55E
```

---

## Destaque alerta
```txt
#F59E0B
```

---

## Destaque negativo
```txt
#EF4444
```

---

# 🔤 Tipografia

## Fonte principal

```txt
Inter
```

---

## Estratégia tipográfica

- títulos fortes
- números grandes
- textos compactos
- leitura rápida

---

## Hierarquia

### Título principal
```txt
32px
```

### Título de seção
```txt
24px
```

### Cards/KPIs
```txt
20px
```

### Texto padrão
```txt
14px - 16px
```

---

# 📐 Espaçamentos

## Estratégia

Interface respirável e limpa.

---

## Padding padrão

```txt
16px
```

---

## Espaçamento entre cards

```txt
20px
```

---

## Border radius

```txt
16px
```

---

# 🧭 Navegação

# Desktop

## Estrutura

```txt
┌──────────────┬────────────────────┐
│ Sidebar      │ Conteúdo           │
│              │                    │
│ Dashboard    │ Cards              │
│ Lançamentos  │ Gráficos           │
│ Histórico    │ Tabelas            │
│ Relatórios   │                    │
│ Configuração │                    │
└──────────────┴────────────────────┘
```

---

## Sidebar

### Itens

- Dashboard
- Lançamentos
- Histórico
- Relatórios
- Configurações

---

## Características

- fixa
- compacta
- ícones minimalistas
- destaque da página ativa

---

# 📱 Mobile

## Estrutura

Bottom Navigation.

---

## Navegação inferior

```txt
Dashboard
Lançamentos
Histórico
Relatórios
Configurações
```

---

## Estratégia mobile

Prioridade para:
- lançamentos rápidos
- visualização simples
- navegação com uma mão

---

# 📊 Estrutura do Dashboard

Tela principal da aplicação.

---

# Objetivo

Permitir leitura rápida da situação financeira mensal.

---

# Estrutura visual

---

## Topo

### Competência atual

```txt
Maio 2026
```

---

## Cards principais

- gasto total
- média diária
- maior categoria
- quantidade de despesas

---

## Área central

### Gráfico principal

“Para onde foi o dinheiro”

---

## Área inferior

- evolução mensal
- ranking categorias
- últimas despesas

---

# 📈 Estratégia dos Dashboards

## Filosofia

Poucos gráficos:
# porém muito úteis.

---

# Prioridade

- clareza
- leitura rápida
- comparativos
- tendências

---

# Gráficos principais

## Pizza
Distribuição por categoria.

---

## Barras
Comparação mensal.

---

## Linha temporal
Evolução financeira.

---

## Ranking
Categorias dominantes.

---

# 🧾 Tela de Lançamentos

## Objetivo

Registrar despesas rapidamente.

---

# Estrutura

## Formulário superior

Campos:
- descrição
- valor
- categoria
- pagamento
- parcelamento

---

## Lista inferior

Histórico do mês.

---

# Estratégia UX

- poucos cliques
- foco em velocidade
- experiência fluida

---

# 📅 Tela de Histórico

## Objetivo

Analisar competências anteriores.

---

## Funcionalidades

- comparação mensal
- evolução financeira
- histórico consolidado

---

# 📄 Tela de Relatórios

## Objetivo

Exportar e consolidar informações.

---

## Funcionalidades

- exportação JSON
- importação JSON
- exportação Excel

---

# ⚙️ Tela de Configurações

## Funcionalidades

- alterar dark mode
- definir receita mensal
- gerenciar backups

---

# 🧩 Componentes Reutilizáveis

---

# UI Base

## Componentes

- Button
- Input
- Select
- Modal
- Card
- Badge
- Tooltip

---

# Layout

## Componentes

- Sidebar
- Header
- BottomNavigation
- PageContainer

---

# Dashboard

## Componentes

- SummaryCard
- ExpenseCard
- MonthlyChart
- CategoryChart
- RankingList

---

# Feedback

## Componentes

- Toast
- EmptyState
- Loading
- ConfirmDialog

---

# 📲 Responsividade

# Desktop

- sidebar fixa
- dashboards amplos
- múltiplas colunas

---

# Tablet

- adaptação intermediária
- grids reduzidos

---

# Mobile

- layout vertical
- cards empilhados
- bottom navigation

---

# ⚡ Estratégia de Performance UX

A interface deve:

- carregar rapidamente
- evitar animações excessivas
- priorizar fluidez
- minimizar renderizações

---

# 🎞️ Estratégia de Animações

Animações leves e discretas.

---

## Uso permitido

- hover cards
- fade transitions
- microinterações

---

## Evitar

- animações exageradas
- delays excessivos
- elementos piscando

---

# 🔍 Estratégia de Feedback Visual

O usuário deve sempre saber:

- o que aconteceu
- o que foi salvo
- o que falhou

---

## Exemplos

- toast de sucesso
- confirmação de exclusão
- loading states
- empty states

---

# 🧠 Filosofia UX Final

O sistema deve transmitir:

- controle
- clareza
- tranquilidade
- organização

O usuário deve sentir que:
# consegue entender rapidamente sua situação financeira mensal.

---

# 🎯 Objetivo Final do UX/UI

Construir uma interface:

- moderna
- leve
- elegante
- organizada
- intuitiva
- responsiva
- agradável
- focada em dashboards financeiros domésticos