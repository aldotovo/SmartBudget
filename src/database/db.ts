// Configuração do banco de dados IndexedDB via Dexie.js
// Schema versão 5: adiciona tabela users

import Dexie from 'dexie'
import type { Table } from 'dexie'

import type { Category } from '../types/category'
import type { Transaction } from '../types/transaction'
import type { Setting } from '../types/settings'
import type { Meta } from '../types/meta'
import type { User } from '../types/user'

export class MyDatabase extends Dexie {
  categories!: Table<Category, number>

  transactions!: Table<Transaction, number>

  settings!: Table<Setting, number>

  metas!: Table<Meta, number>

  users!: Table<User, number>

  constructor() {
    super('MyDatabase')

    // Versão 5: adiciona tabela users
    this.version(5).stores({
      categories:
        '++id, nome, tipo',

      transactions:
        '++id, categoria_id, forma_pagamento, competencia_mes, competencia_ano, installment_group_id, pago',

      settings:
        'id',

      metas:
        '++id, competencia',

      users:
        'id',
    })
  }
}

// Exporta instância única do banco
export const db = new MyDatabase()

// Categorias padrão iniciais
async function seedCategories() {
  const count = await db.categories.count()

  if (count === 0) {
    await db.categories.bulkAdd([
      { nome: 'Água', tipo: 'Moradia', criado_em: new Date().toISOString() },
      { nome: 'Luz', tipo: 'Moradia', criado_em: new Date().toISOString() },
      { nome: 'Internet', tipo: 'Moradia', criado_em: new Date().toISOString() },
      { nome: 'Mercado', tipo: 'Alimentação', criado_em: new Date().toISOString() },
      { nome: 'Restaurante', tipo: 'Alimentação', criado_em: new Date().toISOString() },
      { nome: 'Combustível', tipo: 'Transporte', criado_em: new Date().toISOString() },
      { nome: 'Manutenção', tipo: 'Transporte', criado_em: new Date().toISOString() },
      { nome: 'Farmácia', tipo: 'Saúde', criado_em: new Date().toISOString() },
      { nome: 'Plano de saúde', tipo: 'Saúde', criado_em: new Date().toISOString() },
      { nome: 'Streaming', tipo: 'Lazer', criado_em: new Date().toISOString() },
      { nome: 'Viagens', tipo: 'Lazer', criado_em: new Date().toISOString() },
      { nome: 'Eletrodomésticos', tipo: 'Patrimônio', criado_em: new Date().toISOString() },
      { nome: 'Ferramentas', tipo: 'Patrimônio', criado_em: new Date().toISOString() },
      { nome: 'Eletrônicos', tipo: 'Patrimônio', criado_em: new Date().toISOString() },
    ])
  }
}

// Executa seeds ao iniciar
seedCategories()