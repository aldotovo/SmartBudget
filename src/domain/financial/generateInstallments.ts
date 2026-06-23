
import type { Transaction } from '../../types/transaction'
import type { PaymentMethodType } from '../../types/paymentMethod'

interface InstallmentInput {
  descricao: string
  valor_total: number
  total_parcelas: number
  data_compra: string
  primeira_parcela_em?: string
  categoria_uuid: string 
  forma_pagamento: PaymentMethodType
  observacao?: string
  user_uuid: string
}

export function generateInstallments(
  input: InstallmentInput
): Omit<Transaction, 'id'>[] {
  const installmentGroupId = crypto.randomUUID()
  const agora = new Date().toISOString()

  const baseAmount = Math.floor((input.valor_total / input.total_parcelas) * 100) / 100
  const totalBaseAmount = Math.round(baseAmount * input.total_parcelas * 100) / 100
  const difference = Math.round((input.valor_total - totalBaseAmount) * 100) / 100

  const startDate = input.primeira_parcela_em
    ? new Date(input.primeira_parcela_em)
    : new Date(input.data_compra)

  const installments: Omit<Transaction, 'id'>[] = []

  for (let i = 0; i < input.total_parcelas; i++) {
    const installmentDate = new Date(startDate)
    installmentDate.setMonth(installmentDate.getMonth() + i)

    const valor = i === input.total_parcelas - 1
      ? Math.round((baseAmount + difference) * 100) / 100
      : baseAmount

    installments.push({
      uuid: crypto.randomUUID(), 
      user_uuid: input.user_uuid,
      descricao: `${input.descricao} (${i + 1}/${input.total_parcelas})`,
      valor,
      valor_total: input.valor_total,
      categoria_uuid: input.categoria_uuid, // <-- mudou
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
      sync_status: 'pending', // <-- NOVO
      criado_em: agora,
      updated_at: agora, // <-- NOVO
    })
  }

  return installments
}