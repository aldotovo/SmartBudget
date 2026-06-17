# Funcionalidades do Sistema

# Fechamento Financeiro Doméstico Mensal

---

# 📌 Objetivo do Documento

Este documento descreve todas as funcionalidades planejadas para o sistema, incluindo:

- funcionalidades do MVP
- regras de negócio
- fluxos principais
- restrições
- futuras evoluções

O objetivo é centralizar o comportamento funcional da aplicação.

---

# 🧠 Filosofia Funcional

O sistema foi concebido para funcionar como um:

# Painel de Fechamento Financeiro Doméstico

Seu foco principal é:

- organização financeira mensal
- visualização analítica
- simplicidade operacional
- funcionamento offline
- histórico consolidado

---

# 🚀 Funcionalidades do MVP

---

# 📊 Dashboard Financeiro

Painel principal da aplicação.

---

## Funcionalidades

- visualizar competência atual
- visualizar gasto total do mês
- visualizar média diária
- visualizar maior categoria de gasto
- visualizar quantidade de despesas
- visualizar evolução mensal
- visualizar ranking de categorias
- visualizar gráficos financeiros

---

## Gráficos previstos

- pizza por categoria
- barras mensais
- linha temporal
- ranking financeiro

---

## Filtros

- mês
- ano
- categoria
- forma de pagamento

---

# 💸 Gestão de Despesas

Módulo responsável pelo gerenciamento financeiro.

---

## Cadastro de despesas

O usuário poderá:

- adicionar despesas
- editar despesas
- excluir despesas
- visualizar despesas

---

## Campos da despesa

- descrição
- valor
- categoria
- forma de pagamento
- parcelamento
- observações
- data da compra

---

## Formas de pagamento

- pix
- débito
- crédito à vista
- crédito parcelado
- dinheiro

---

# 🧾 Parcelamentos Automáticos

Sistema automático de distribuição financeira mensal.

---

## Funcionalidades

- gerar parcelas automaticamente
- distribuir parcelas por competência
- calcular valores mensais
- vincular parcelas à transação principal

---

## Regras

### Compras parceladas
Geram automaticamente registros em:

```txt
installments
```

---

### Competência financeira
A análise mensal será baseada:
# na parcela

E não na data total da compra.

---

## Exclusão

Ao excluir uma compra parcelada:
- todas as parcelas serão removidas automaticamente

---

# 🗂️ Categorias Financeiras

Sistema híbrido de categorias.

---

## Funcionalidades

- criar categorias
- editar categorias
- excluir categorias
- visualizar categorias

---

## Categorias padrão

### Moradia
- água
- luz
- internet

---

### Alimentação
- mercado
- restaurante

---

### Transporte
- combustível
- manutenção

---

### Saúde
- farmácia
- plano de saúde

---

### Patrimônio
- eletrodomésticos
- ferramentas
- eletrônicos

---

## Regras

Categorias vinculadas a despesas:
# não poderão ser excluídas

---

# 📅 Competência Financeira

Sistema central baseado em fechamento mensal.

---

## Funcionalidades

- visualizar competências passadas
- alternar entre meses
- consultar histórico financeiro
- comparar períodos

---

## Objetivo

Permitir:
- análise histórica
- controle financeiro mensal
- acompanhamento de evolução

---

# 📈 Histórico Financeiro

Visualização consolidada de períodos anteriores.

---

## Funcionalidades

- histórico mensal
- comparação mensal
- evolução de gastos
- análise por categoria

---

# 💾 Backup e Exportação

Sistema de segurança e portabilidade dos dados.

---

## Exportação JSON

Backup completo da aplicação contendo:

- categorias
- transações
- parcelas
- configurações

---

## Importação JSON

Restauração completa dos dados locais.

---

## Exportação Excel

Geração de relatórios financeiros externos.

---

# 🌙 Configurações do Sistema

Preferências locais da aplicação.

---

## Funcionalidades

- ativar dark mode
- definir receita mensal
- exportar backup
- importar backup

---

# 📱 Responsividade

O sistema será compatível com:

- desktop
- notebooks
- tablets
- smartphones

---

# 📲 PWA (Aplicativo Instalável)

O sistema poderá ser instalado como aplicativo.

---

## Funcionalidades

- instalação no celular
- instalação no desktop
- funcionamento offline
- cache local

---

# 🔍 Filtros Globais

Filtros reutilizáveis em toda aplicação.

---

## Filtros previstos

- competência
- categoria
- forma de pagamento
- período

---

# ⚡ Regras de Negócio

---

# Parcelamentos

Compras parceladas:
- geram parcelas automáticas
- são distribuídas mensalmente
- alimentam dashboards mensalmente

---

# Exclusão de Parcelas

Excluir uma compra:
- remove todas as parcelas relacionadas

---

# Categorias

Categorias em uso:
- não podem ser excluídas

---

# Competência Financeira

Os dashboards utilizam:
# competência da parcela

---

# Receita Mensal

A receita mensal:
- será fixa por competência
- utilizada para comparativos financeiros

---

# 🚫 Restrições do Sistema

O sistema NÃO terá inicialmente:

- login
- autenticação
- sincronização em nuvem
- integração bancária
- importação automática de extratos
- múltiplos usuários
- OCR de comprovantes

---

# 🔐 Segurança

O sistema NÃO armazenará:

- CPF
- números de cartão
- senhas
- dados bancários
- informações sensíveis

---

# 🚀 Funcionalidades Futuras

Possíveis evoluções futuras:

---

## Financeiro

- metas financeiras
- previsão de gastos
- planejamento anual
- orçamento mensal

---

## Patrimônio

- controle patrimonial
- depreciação de bens
- histórico de patrimônio

---

## Inteligência

- insights automáticos
- alertas financeiros
- análise preditiva

---

## Integrações

- sincronização em nuvem
- múltiplos dispositivos
- backend opcional

---

# 📊 Fluxo Principal do Usuário

```txt
Usuário abre aplicação
↓
Seleciona competência
↓
Registra despesas
↓
Sistema gera parcelas
↓
Dashboard atualiza métricas
↓
Usuário analisa gráficos
↓
Usuário exporta relatórios
```

---

# 🎯 Objetivo Funcional Final

Construir um sistema:

- leve
- simples
- visual
- offline
- moderno
- analítico
- organizado
- focado em fechamento financeiro doméstico mensal