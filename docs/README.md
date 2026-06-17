# Fechamento Financeiro Doméstico Mensal

Aplicação web local para controle de despesas domésticas, organização financeira mensal e visualização analítica através de dashboards modernos.

---

## 📌 Objetivo

O projeto tem como objetivo oferecer uma solução simples, leve e offline para acompanhamento financeiro doméstico, permitindo:

- registro de despesas
- categorização financeira
- parcelamentos automáticos
- análise mensal
- dashboards interativos
- histórico financeiro
- exportação de dados

---

## 🚀 Tecnologias

### Frontend
- React
- Vite
- TypeScript
- TailwindCSS

### Banco local
- IndexedDB
- Dexie.js

### Dashboards
- Recharts

### Estado global
- Zustand

### Navegação
- React Router DOM

### PWA
- vite-plugin-pwa

---

## 📦 Funcionalidades do MVP

### Gestão financeira
- cadastro de despesas
- edição e exclusão
- categorização
- filtros mensais

### Parcelamentos
- compras parceladas
- geração automática de parcelas
- distribuição por competência mensal

### Dashboards
- gastos por categoria
- evolução mensal
- gráficos comparativos
- KPIs financeiros

### Histórico
- consulta de competências anteriores
- comparação entre períodos

### Backup
- exportação JSON
- importação JSON
- exportação Excel

### Interface
- dark mode
- responsividade
- funcionamento offline
- instalação como PWA

---

## 📁 Estrutura do Projeto

```txt
src/
│
├── assets/
├── components/
├── pages/
├── database/
├── hooks/
├── routes/
├── services/
├── store/
├── styles/
├── types/
├── utils/
└── constants/
```

---

## 🧠 Conceito do Sistema

O sistema foi pensado para funcionar como um:
### “Painel doméstico de fechamento financeiro mensal”

Diferente de aplicativos bancários tradicionais, o foco está em:
- competências mensais
- organização doméstica
- clareza visual
- análise consolidada

---

## 💾 Armazenamento

Todos os dados são armazenados localmente utilizando IndexedDB.

O sistema:
- não depende de servidores
- não utiliza APIs externas
- não armazena dados sensíveis
- funciona offline

---

## 🔐 Segurança

O projeto NÃO armazena:
- CPF
- dados bancários
- números de cartão
- senhas
- informações sensíveis

---

## 📊 Roadmap do MVP

- [x] Planejamento inicial
- [ ] Estrutura React
- [ ] Banco local IndexedDB
- [ ] CRUD de despesas
- [ ] Parcelamentos automáticos
- [ ] Dashboards financeiros
- [ ] Exportação JSON
- [ ] Exportação Excel
- [ ] PWA offline
- [ ] Refinamento visual

---

## 📱 Compatibilidade

- Desktop
- Android
- Tablets
- Navegadores modernos

---

## 🎯 Objetivo Final

Construir uma aplicação:
- leve
- moderna
- privada
- offline
- visualmente agradável
- fácil de usar
- focada em fechamento financeiro doméstico mensal

---

## 📄 Licença

Projeto de uso pessoal e educacional.