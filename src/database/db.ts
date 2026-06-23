// src/database/db.ts
// Configuração do banco de dados IndexedDB via Dexie.js
// VERSÃO 9: Adiciona user_uuid para isolamento entre usuários

import Dexie from 'dexie'
import type { Table } from 'dexie'

import type { Category } from '../types/category'
import type { Transaction } from '../types/transaction'
import type { Setting } from '../types/settings'
import type { Meta } from '../types/meta'
import type { User } from '../types/user'
import type { CreditCard } from '../types/creditCard'

export class MyDatabase extends Dexie {
  categories!: Table<Category, string>
  transactions!: Table<Transaction, string>
  settings!: Table<Setting, string>
  metas!: Table<Meta, string>
  users!: Table<User, string>
  credit_cards!: Table<CreditCard, string>

  constructor() {
    super('SmartBudget_v3')

    
    this.version(9).stores({
      transactions: '&uuid, categoria_uuid, competencia_mes, competencia_ano, pago, sync_status, updated_at, cartao_uuid, user_uuid',
      categories: '&uuid, nome, updated_at',
      metas: '&uuid, competencia, updated_at, user_uuid',
      users: '&uuid, auth_id, updated_at',
      settings: '&uuid',
      credit_cards: '&uuid, nome, updated_at',
    })
  }
}

export const db = new MyDatabase()

// ============================================================
// SEED: Categorias padrão (com UUID)
// ============================================================
async function seedCategories() {
  const count = await db.categories.count()
  if (count === 0) {
    const agora = new Date().toISOString()
    await db.categories.bulkAdd([
      { uuid: crypto.randomUUID(), nome: 'Água', tipo: 'Moradia', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Luz', tipo: 'Moradia', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Internet', tipo: 'Moradia', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Mercado', tipo: 'Alimentação', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Restaurante', tipo: 'Alimentação', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Combustível', tipo: 'Transporte', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Manutenção', tipo: 'Transporte', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Farmácia', tipo: 'Saúde', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Plano de saúde', tipo: 'Saúde', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Streaming', tipo: 'Lazer', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Viagens', tipo: 'Lazer', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Eletrodomésticos', tipo: 'Patrimônio', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Ferramentas', tipo: 'Patrimônio', criado_em: agora, updated_at: agora },
      { uuid: crypto.randomUUID(), nome: 'Eletrônicos', tipo: 'Patrimônio', criado_em: agora, updated_at: agora },
    ])
    console.log('✅ Categorias padrão criadas.')
  }
}

seedCategories()