# Setup de Desenvolvimento

# Fechamento Financeiro Doméstico Mensal

---

# 📌 Objetivo do Documento

Este documento descreve:

- preparação do ambiente local
- instalação das ferramentas
- inicialização do projeto
- comandos principais
- estrutura inicial do desenvolvimento

O objetivo é padronizar:
- ambiente
- execução
- desenvolvimento local

---

# 🧠 Stack Oficial do Projeto

---

# Frontend

- React
- TypeScript
- Vite

---

# Estilização

- TailwindCSS

---

# Banco Local

- IndexedDB
- Dexie.js

---

# Gráficos

- Recharts

---

# PWA

- vite-plugin-pwa

---

# Ferramentas auxiliares

- ESLint
- Prettier

---

# 🛠️ Pré-Requisitos

Antes de iniciar o projeto, instalar:

---

# Node.js

## Versão recomendada

```txt
>= 22.x
```

---

# Download oficial

[Node.js](https://nodejs.org/?utm_source=chatgpt.com)

---

# Git

## Download oficial

[Git SCM](https://git-scm.com/?utm_source=chatgpt.com)

---

# Editor recomendado

## Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com/?utm_source=chatgpt.com)

---

# 🔌 Extensões VSCode Recomendadas

---

# Obrigatórias

- ESLint
- Prettier
- Tailwind CSS IntelliSense

---

# Recomendadas

- Error Lens
- GitLens
- Material Icon Theme

---

# 📦 Inicialização do Projeto

---

# Criar projeto Vite

```bash
npm create vite@latest
```

---

# Configurações

```txt
Project name:
fechamento-financeiro

Framework:
React

Variant:
TypeScript
```

---

# Entrar na pasta

```bash
cd fechamento-financeiro
```

---

# Instalar dependências

```bash
npm install
```

---

# 🚀 Instalação das Dependências Oficiais

---

# TailwindCSS

```bash
npm install tailwindcss @tailwindcss/vite
```

---

# React Router

```bash
npm install react-router-dom
```

---

# Dexie

```bash
npm install dexie
```

---

# Recharts

```bash
npm install recharts
```

---

# Ícones

```bash
npm install lucide-react
```

---

# PWA

```bash
npm install vite-plugin-pwa -D
```

---

# ESLint

```bash
npm install eslint @eslint/js typescript-eslint -D
```

---

# Prettier

```bash
npm install prettier eslint-config-prettier eslint-plugin-prettier -D
```

---

# ▶️ Executar Projeto

---

# Ambiente de desenvolvimento

```bash
npm run dev
```

---

# Resultado esperado

```txt
http://localhost:5173
```

---

# 🏗️ Estrutura Inicial de Pastas

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
├── types/
├── utils/
├── constants/
├── routes/
├── styles/
└── assets/
```

---

# 📁 Objetivo das Pastas

---

# components

Componentes reutilizáveis.

---

# pages

Páginas principais.

---

# layouts

Estruturas globais.

---

# hooks

Hooks customizados.

---

# services

Serviços auxiliares.

---

# database

Configuração IndexedDB.

---

# repositories

Camada de acesso aos dados.

---

# types

Interfaces TypeScript.

---

# utils

Funções utilitárias.

---

# constants

Constantes globais.

---

# routes

Rotas da aplicação.

---

# styles

CSS global.

---

# ⚡ Scripts Oficiais

---

# Desenvolvimento

```bash
npm run dev
```

---

# Build produção

```bash
npm run build
```

---

# Preview build

```bash
npm run preview
```

---

# Lint

```bash
npm run lint
```

---

# 🎨 Configuração Tailwind

---

# Objetivo

Padronizar:
- cores
- dark mode
- espaçamentos
- responsividade

---

# Estratégia oficial

```txt
darkMode: 'class'
```

---

# 🌙 Dark Mode

O sistema utilizará:

# dark mode como padrão principal

---

# Estratégia

Classe global:

```txt
dark
```

---

# 🗃️ Configuração IndexedDB

---

# Objetivo

Persistência totalmente local.

---

# Estratégia

Arquivo principal:

```txt
src/database/db.ts
```

---

# Biblioteca oficial

```txt
Dexie.js
```

---

# 📊 Configuração Recharts

---

# Objetivo

Renderização dos dashboards.

---

# Estratégia

- gráficos leves
- responsivos
- baixa poluição visual

---

# 📲 Configuração PWA

---

# Plugin oficial

```txt
vite-plugin-pwa
```

---

# Objetivos

- instalação mobile
- instalação desktop
- funcionamento offline

---

# 🔍 Estratégia ESLint + Prettier

---

# Objetivo

Garantir:
- padronização
- legibilidade
- qualidade do código

---

# ESLint

Responsável por:
- validação
- boas práticas

---

# Prettier

Responsável por:
- formatação automática

---

# 🌿 Estratégia Git

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

# Estratégia inicial

Projeto inicialmente:
# single developer

---

# 📦 Primeiro Commit Recomendado

```txt
chore: initial project setup
```

---

# 🚀 Fluxo Inicial Recomendado

```txt
Criar projeto Vite
↓
Instalar dependências
↓
Configurar Tailwind
↓
Configurar ESLint
↓
Criar estrutura de pastas
↓
Criar layout base
↓
Configurar IndexedDB
↓
Iniciar desenvolvimento do MVP
```

---

# ⚠️ Cuidados Importantes

---

# Não utilizar

- localStorage para persistência principal
- bibliotecas pesadas
- excesso de dependências

---

# Priorizar

- simplicidade
- modularidade
- performance
- legibilidade

---

# 🎯 Objetivo Final do Setup

Preparar um ambiente:

- moderno
- leve
- organizado
- escalável
- offline
- rápido
- padronizado
- pronto para construção do MVP