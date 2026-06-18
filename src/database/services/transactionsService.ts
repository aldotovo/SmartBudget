// src/database/services/transactionsService.ts
import { db } from '../db'
import { generateInstallments } from '../../domain/financial/generateInstallments'
import type { Transaction } from '../../types/transaction'
import type { PaymentMethodType } from '../../types/paymentMethod'
import { supabase } from '../../lib/supabase'

interface CreateTransactionInput {
  descricao: string
  valor: number
  valor_total?: number
  categoria_uuid: string
  data_compra: string
  forma_pagamento: PaymentMethodType
  total_parcelas?: number
  primeira_parcela_em?: string
  observacao?: string
}

export async function createTransaction(input: CreateTransactionInput): Promise<string> {
  const agora = new Date().toISOString()

  if (
    input.forma_pagamento === 'credito_parcelado' &&
    input.total_parcelas &&
    input.total_parcelas > 1
  ) {
    const parcelas = generateInstallments({
      descricao: input.descricao,
      valor_total: input.valor_total || input.valor,
      total_parcelas: input.total_parcelas,
      data_compra: input.data_compra,
      primeira_parcela_em: input.primeira_parcela_em,
      categoria_uuid: input.categoria_uuid,
      forma_pagamento: input.forma_pagamento,
      observacao: input.observacao,
    })

    await db.transactions.bulkAdd(parcelas as Transaction[])
    await syncTransactionsToCloud(parcelas)
    return parcelas[0]?.installment_group_id || ''
  }

  const dataCompetencia = new Date(input.primeira_parcela_em || input.data_compra)
  if (!input.primeira_parcela_em && input.forma_pagamento === 'credito_vista') {
    dataCompetencia.setMonth(dataCompetencia.getMonth() + 1)
  }

  const uuid = crypto.randomUUID()

  const transaction: Transaction = {
    uuid,
    descricao: input.descricao,
    valor: input.valor,
    categoria_uuid: input.categoria_uuid,
    data_compra: input.data_compra,
    data_competencia: dataCompetencia.toISOString().split('T')[0],
    competencia_mes: dataCompetencia.getMonth() + 1,
    competencia_ano: dataCompetencia.getFullYear(),
    forma_pagamento: input.forma_pagamento,
    parcelado: false,
    pago: false,
    observacao: input.observacao,
    sync_status: 'pending',
    criado_em: agora,
    updated_at: agora,
  }

  await db.transactions.add(transaction)
  await syncTransactionToCloud(transaction)

  return uuid
}

async function syncTransactionToCloud(tx: Transaction): Promise<void> {
  try {
    const { error } = await supabase.from('transactions').upsert(
      {
        uuid: tx.uuid,
        descricao: tx.descricao,
        valor: tx.valor,
        valor_total: tx.valor_total,
        categoria_uuid: tx.categoria_uuid,
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
  } catch (error) {
    console.error('Falha ao enviar transação para a nuvem. Marcada como pendente.', error)
  }
}

async function syncTransactionsToCloud(transactions: Transaction[]): Promise<void> {
  for (const tx of transactions) {
    await syncTransactionToCloud(tx)
  }
}

export async function getTransactionsByCompetence(
  mes: number,
  ano: number
): Promise<Transaction[]> {
  return db.transactions
    .where('competencia_mes')
    .equals(mes)
    .and((tx) => tx.competencia_ano === ano)
    .toArray()
}

export async function getInstallmentGroup(
  groupId: string
): Promise<Transaction[]> {
  return db.transactions
    .where('installment_group_id')
    .equals(groupId)
    .toArray()
}