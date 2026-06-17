# Banco de Dados

# Fechamento Financeiro Doméstico Mensal

---

# 📌 Objetivo da Modelagem

A modelagem do banco foi planejada para:

- funcionar totalmente offline
- ser leve e rápida
- facilitar dashboards analíticos
- suportar parcelamentos automáticos
- organizar competências financeiras mensais
- permitir futura escalabilidade

O sistema utilizará:

- IndexedDB
- Dexie.js

Como mecanismo principal de persistência local.

---

# 🧠 Filosofia da Estrutura de Dados

O sistema será orientado por:

# Competência Financeira Mensal

Isso significa que:
- os dashboards trabalham por mês/ano
- compras parceladas são distribuídas ao longo do tempo
- análises consideram parcelas mensais
- histórico é consolidado por competência

---

# 🗃️ Entidades Principais

O banco será composto inicialmente por:

- categories
- transactions
- installments
- settings

---

# 📂 Estrutura das Entidades

---

# 1. `categories`

Responsável pelas categorias financeiras do sistema.

---

## Estrutura

| Campo | Tipo | Descrição |
|---|---|---|
| id | string | identificador único |
| nome | string | nome da categoria |
| icone | string | ícone visual |
| cor | string | cor da categoria |
| tipo | string | tipo da categoria |
| criado_em | date | data de criação |

---

## Exemplos

- Combustível
- Mercado
- Água
- Luz
- Lazer
- Patrimônio

---

# 2. `transactions`

Representa as despesas cadastradas pelo usuário.

---

## Estrutura

| Campo | Tipo | Descrição |
|---|---|---|
| id | string | identificador único |
| descricao | string | descrição da despesa |
| valor_total | number | valor total da compra |
| categoria_id | string | referência da categoria |
| data_compra | date | data original da compra |
| forma_pagamento | string | forma de pagamento |
| parcelado | boolean | indica parcelamento |
| total_parcelas | number | quantidade de parcelas |
| observacao | string | observações opcionais |
| criado_em | date | data de criação |

---

## Formas de pagamento

- pix
- débito
- crédito à vista
- crédito parcelado
- dinheiro

---

# 3. `installments`

Tabela responsável pelas parcelas financeiras.

---

## Estrutura

| Campo | Tipo | Descrição |
|---|---|---|
| id | string | identificador único |
| transaction_id | string | referência da transação pai |
| numero_parcela | number | número da parcela |
| valor_parcela | number | valor individual |
| competencia_mes | number | mês da competência |
| competencia_ano | number | ano da competência |
| pago | boolean | status da parcela |
| criado_em | date | data de criação |

---

## Objetivo

As parcelas são utilizadas para:
- dashboards mensais
- cálculo financeiro
- histórico consolidado
- comparação entre competências

---

# 4. `settings`

Configurações locais da aplicação.

---

## Estrutura

| Campo | Tipo | Descrição |
|---|---|---|
| id | string | identificador |
| receita_mensal | number | receita base mensal |
| dark_mode | boolean | tema visual |
| moeda | string | moeda principal |
| criado_em | date | data de criação |

---

# 🔗 Relacionamentos

---

## Categories → Transactions

Relacionamento:

# 1:N

Uma categoria pode possuir várias transações.

---

## Transactions → Installments

Relacionamento:

# 1:N

Uma transação parcelada gera múltiplas parcelas.

---

# 🔄 Fluxo de Parcelamento

## Exemplo

Compra:
- TV
- R$ 2400
- 12x

---

## Processo

### Transação principal

```txt
transactions
```

Valor:
```txt
R$ 2400
```

---

### Parcelas geradas

```txt
installments
```

12 registros:
- parcela 1
- parcela 2
- parcela 3
- ...

Cada parcela:
```txt
R$ 200
```

---

# 📅 Estratégia de Competência Financeira

O sistema utilizará:
# competência baseada na parcela

---

## Exemplo

Compra:
- Maio/2026
- 10 parcelas

---

## Dashboards

Junho/2026:
- mostra apenas parcela daquele mês

Julho/2026:
- mostra próxima parcela

---

## Vantagem

Isso representa melhor:
- fluxo financeiro real
- orçamento doméstico
- impacto mensal

---

# 🧹 Estratégia de Exclusão

## Exclusão de transações parceladas

Ao excluir:
```txt
transaction
```

O sistema removerá automaticamente:
```txt
installments
```

Relacionados à transação.

---

# 🚫 Regras de Categorias

## Categorias poderão:

- ser editadas
- ser criadas
- ser excluídas

---

## Restrição

Categorias em uso:
# NÃO poderão ser excluídas

Enquanto existirem transações vinculadas.

---

# ⚡ Estratégia de Performance

O IndexedDB utilizará índices para:

- competência mensal
- categoria
- data
- transações parceladas

---

# 📌 Índices Planejados

## Transactions

- categoria_id
- data_compra
- forma_pagamento

---

## Installments

- competencia_mes
- competencia_ano
- transaction_id

---

# 🌱 Seeds Iniciais

O sistema iniciará com categorias padrão.

---

## Categorias iniciais

### Moradia
- Água
- Luz
- Internet

---

### Alimentação
- Mercado
- Restaurante

---

### Transporte
- Combustível
- Manutenção

---

### Saúde
- Farmácia
- Plano de saúde

---

### Lazer
- Streaming
- Viagens

---

### Patrimônio
- Eletrodomésticos
- Ferramentas
- Eletrônicos

---

# 📊 Fluxo Geral dos Dados

```txt
Usuário cria despesa
↓
Sistema salva transaction
↓
Sistema verifica parcelamento
↓
Sistema gera installments
↓
Dashboard processa competências
↓
Gráficos atualizam
```

---

# 💾 Estratégia de Backup

O backup JSON incluirá:

- categories
- transactions
- installments
- settings

---

# 📦 Estrutura do Backup

```json
{
  "categories": [],
  "transactions": [],
  "installments": [],
  "settings": []
}
```

---

# 🚀 Estratégia de Escalabilidade

A modelagem permitirá futuramente:

- sincronização em nuvem
- múltiplos dispositivos
- autenticação
- múltiplos usuários
- backend opcional

Sem necessidade de alterar a estrutura principal das entidades.

---

# 🎯 Objetivo Final da Modelagem

Construir uma estrutura de dados:

- simples
- organizada
- rápida
- escalável
- offline
- confiável
- adequada para dashboards financeiros mensais
```