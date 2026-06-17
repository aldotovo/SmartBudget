// Serviço de domínio: geração de parcelas financeiras
// Responsável por dividir uma compra parcelada em transações individuais por competência

import type { Transaction } from '../../types/transaction'
import type { PaymentMethodType } from '../../types/paymentMethod'

// Dados de entrada para gerar parcelas
interface InstallmentInput {
  descricao: string
  valor_total: number
  total_parcelas: number
  data_compra: string
  primeira_parcela_em?: string // opcional: data do primeiro vencimento
  categoria_id: number
  forma_pagamento: PaymentMethodType
  observacao?: string
}

/**
 * Gera array de transações parceladas
 * 
 * Regras de negócio:
 * - Cada parcela é uma transação independente
 * - Competência baseada na data de vencimento de cada parcela
 * - Última parcela absorve diferença de arredondamento
 * - Todas parcelas compartilham mesmo installment_group_id
 */
export function generateInstallments(
  input: InstallmentInput
): Omit<Transaction, 'id'>[] {
  
  // UUID que agrupa todas as parcelas da mesma compra
  const installmentGroupId = crypto.randomUUID()
  
  // Cálculo do valor base com arredondamento para 2 casas decimais
  const baseAmount = Math.floor(
    (input.valor_total / input.total_parcelas) * 100
  ) / 100
  
  // Calcula total com valores base para encontrar diferença
  const totalBaseAmount = Math.round(baseAmount * input.total_parcelas * 100) / 100
  const difference = Math.round((input.valor_total - totalBaseAmount) * 100) / 100
  
  const installments: Omit<Transaction, 'id'>[] = []
  
  // Define data de início: primeira_parcela_em OU data da compra
  const startDate = input.primeira_parcela_em
    ? new Date(input.primeira_parcela_em)
    : new Date(input.data_compra)
  
  const agora = new Date().toISOString()
  
  // Gera cada parcela
  for (let i = 0; i < input.total_parcelas; i++) {
    
    // Avança mês a mês a partir da data inicial
    const installmentDate = new Date(startDate)
    installmentDate.setMonth(installmentDate.getMonth() + i)
    
    // Última parcela absorve a diferença de arredondamento
    const valor = i === input.total_parcelas - 1
      ? Math.round((baseAmount + difference) * 100) / 100
      : baseAmount
    
    installments.push({
      descricao: `${input.descricao} (${i + 1}/${input.total_parcelas})`,
      valor,
      valor_total: input.valor_total,
      categoria_id: input.categoria_id,
      data_compra: input.data_compra,
      data_competencia: installmentDate.toISOString().split('T')[0],
      competencia_mes: installmentDate.getMonth() + 1,
      competencia_ano: installmentDate.getFullYear(),
      forma_pagamento: input.forma_pagamento,
      parcelado: true,
      total_parcelas: input.total_parcelas,
      numero_parcela: i + 1,
      installment_group_id: installmentGroupId,
      primeira_parcela_em: input.primeira_parcela_em || input.data_compra,
      pago: false,
      observacao: input.observacao,
      criado_em: agora,
    })
  }
  
  return installments
}