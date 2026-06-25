// src/services/SyncService.ts
import { db } from '../database/db'
import { supabase } from '../lib/supabase'
import type { Transaction } from '../types/transaction'
import type { Category } from '../types/category'
import type { CreditCard } from '../types/creditCard'

export class SyncService {
  /**
   * Sincroniza TODAS as categorias locais para a nuvem (upsert)
   */
  async syncCategories(): Promise<void> {
    const categories = await db.categories.toArray()
    if (categories.length === 0) return

    console.log(`Enviando ${categories.length} categorias para a nuvem...`)

    for (const cat of categories) {
      try {
        const { error } = await supabase.from('categories').upsert(
          {
            uuid: cat.uuid,
            nome: cat.nome,
            tipo: cat.tipo || '',
            cor: cat.cor || '',
            icone: cat.icone || '',
            criado_em: cat.criado_em,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'uuid' }
        )
        if (error) throw error
        console.log(`Categoria ${cat.nome} (${cat.uuid}) sincronizada.`)
      } catch (err) {
        console.error(`Erro ao sincronizar categoria ${cat.nome}:`, err)
      }
    }
  }

  /**
   * Sincroniza TODOS os cartões de crédito locais para a nuvem (upsert)
   */
  async syncCreditCards(): Promise<void> {
    const cards = await db.credit_cards.toArray()
    if (cards.length === 0) return

    console.log(`Enviando ${cards.length} cartões para a nuvem...`)

    for (const card of cards) {
      try {
        const { error } = await supabase.from('credit_cards').upsert(
          {
            uuid: card.uuid,
            nome: card.nome,
            criado_em: card.criado_em,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'uuid' }
        )
        if (error) throw error
        console.log(`Cartão ${card.nome} (${card.uuid}) sincronizado.`)
      } catch (err) {
        console.error(`Erro ao sincronizar cartão ${card.nome}:`, err)
      }
    }
  }

  /**
   * Tenta reenviar todas as transações com sync_status = 'pending'
   */
  async syncPendingTransactions(): Promise<void> {
    const pending = await db.transactions
      .where('sync_status')
      .equals('pending')
      .toArray()

    if (pending.length === 0) {
      console.log('Nenhuma transação pendente.')
      return
    }

    console.log(`Tentando sincronizar ${pending.length} transações pendentes...`)

    for (const tx of pending) {
      try {
        const { error } = await supabase.from('transactions').upsert(
          {
            uuid: tx.uuid,
            user_uuid: tx.user_uuid,
            descricao: tx.descricao,
            valor: tx.valor,
            valor_total: tx.valor_total,
            categoria_uuid: tx.categoria_uuid,
            cartao_uuid: tx.cartao_uuid || null,
            data_compra: tx.data_compra,
            data_competencia: tx.data_competencia,
            competencia_mes: tx.competencia_mes,
            competencia_ano: tx.competencia_ano,
            forma_pagamento: tx.forma_pagamento,
            parcelado: tx.parcelado,
            total_parcelas: tx.total_parcelas,
            numero_parcela: tx.numero_parcela,
            installment_group_id: tx.installment_group_id,
            primeira_parcela_em: tx.primeira_parcela_em,
            pago: tx.pago,
            observacao: tx.observacao,
            sync_status: 'synced',
            criado_em: tx.criado_em,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'uuid' }
        )

        if (error) throw error

        await db.transactions.update(tx.uuid, { sync_status: 'synced' })
        console.log(`Transação ${tx.uuid} sincronizada.`)
      } catch (err) {
        console.error(`Falha ao sincronizar ${tx.uuid}:`, err)
        // Mantém como 'pending' para tentar depois
      }
    }
  }

  
  async pullTransactions(userUuid: string): Promise<void> {
    try {
      const lastSync = await db.settings.get('last_sync')
      const since = lastSync?.updated_at || '1970-01-01T00:00:00Z'
    
    
      let query = supabase.from('transactions').select('*')
      if (userUuid) {
        query = query.eq('user_uuid', userUuid)
      } else {
        console.warn('⚠️ pullTransactions: baixando todos os dados (sem userUuid)')
    }

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_uuid', userUuid)
        .gt('updated_at', since)

      if (error) throw error

      if (transactions && transactions.length > 0) {
        for (const tx of transactions) {
          await db.transactions.put(tx)
        }
        console.log(`📥 Baixadas ${transactions.length} transações da nuvem.`)

        await db.settings.put({
          uuid: 'last_sync',
          updated_at: new Date().toISOString(),
          criado_em: new Date().toISOString(),
        })
      }
    } catch (err) {
      console.warn('Pull de transações falhou:', err)
    }
  }

  /**
   * Sincronização completa: categorias, cartões, transações (envio e pull)
   * Requer userUuid para filtrar os dados baixados
   */
  async syncAll(userUuid: string): Promise<void> {
    console.log('Iniciando sincronização completa...')
    await this.syncCategories()
    await this.syncCreditCards()
    await this.syncPendingTransactions()
    await this.pullTransactions(userUuid)
    console.log('Sincronização concluída.')
  }
}

export const syncService = new SyncService()