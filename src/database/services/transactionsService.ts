// Serviço de aplicação para operações com transações
// Orquestra regras de negócio e persistência

import { db } from '../db'
import { generateInstallments } from '../../domain/financial/generateInstallments'
import type { Transaction } from '../../types/transaction'
import type { PaymentMethodType } from '../../types/paymentMethod'
import { supabase } from '../../lib/supabase'

// Dados de entrada para criar uma transação
interface CreateTransactionInput {
  descricao: string
  valor: number
  valor_total?: number
  categoria_id: number
  data_compra: string
  forma_pagamento: PaymentMethodType
  total_parcelas?: number
  primeira_parcela_em?: string
  observacao?: string
}

/**
 * Cria uma transação (ou múltiplas, se for parcelada)
 * 
 * Retorna array com os IDs das transações criadas
 */
export async function createTransaction(
  input: CreateTransactionInput
): Promise<number[]> {
  
  const agora = new Date().toISOString()

  // Se for crédito parcelado com mais de 1 parcela
  if (
    input.forma_pagamento === 'credito_parcelado' &&
    input.total_parcelas &&
    input.total_parcelas > 1
  ) {
    // Gera array de parcelas usando serviço de domínio
    const parcelas = generateInstallments({
      descricao: input.descricao,
      valor_total: input.valor_total || input.valor,
      total_parcelas: input.total_parcelas,
      data_compra: input.data_compra,
      primeira_parcela_em: input.primeira_parcela_em,
      categoria_id: input.categoria_id,
      forma_pagamento: input.forma_pagamento,
      observacao: input.observacao,
    })
    
    // Persiste todas as parcelas de uma vez
    await db.transactions.bulkAdd(parcelas as Transaction[])
    syncTransactionToCloud(parcelas)  
    return [] as number[]
  }
  
    // Define competência para crédito à vista
  const dataCompetencia = new Date(input.primeira_parcela_em || input.data_compra)
  if (!input.primeira_parcela_em && input.forma_pagamento === 'credito_vista') {
    dataCompetencia.setMonth(dataCompetencia.getMonth() + 1)
  }

  const transaction: Omit<Transaction, 'id'> = {
    descricao: input.descricao,
    valor: input.valor,
    categoria_id: input.categoria_id,
    data_compra: input.data_compra,
    data_competencia: dataCompetencia.toISOString().split('T')[0],
    competencia_mes: dataCompetencia.getMonth() + 1,
    competencia_ano: dataCompetencia.getFullYear(),
    forma_pagamento: input.forma_pagamento,
    parcelado: false,
    pago: false,
    observacao: input.observacao,
    criado_em: agora,
  }
  
  await db.transactions.add(transaction as Transaction)
  syncTransactionToCloud([transaction as Transaction])  
  return [] as number[]
}

/**
 * Busca transações por competência (mês/ano)
 */
export async function getTransactionsByCompetence(
  mes: number,
  ano: number
): Promise<Transaction[]> {
  return db.transactions
    .where('competencia_mes')
    .equals(mes)
    .and((transaction: Transaction) => transaction.competencia_ano === ano)
    .toArray()
}

/**
 * Busca todas as parcelas de um grupo de parcelamento
 */
export async function getInstallmentGroup(
  groupId: string
): Promise<Transaction[]> {
  return db.transactions
    .where('installment_group_id')
    .equals(groupId)
    .toArray()
}
async function syncTransactionToCloud(transactions: Omit<Transaction, 'id'>[]) {
  try {
    for (const tx of transactions) {
      await supabase.from('transactions').insert({
        descricao: tx.descricao,
        valor: tx.valor,
        valor_total: tx.valor_total,
        categoria_id: tx.categoria_id,
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
      })
    }
  } catch (error) {
    console.error('Erro ao sincronizar com nuvem:', error)
  }
}