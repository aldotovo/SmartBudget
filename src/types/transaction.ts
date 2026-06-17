// Tipo principal de transação financeira
// Representa tanto lançamentos avulsos quanto parcelas individuais

import type { PaymentMethodType } from './paymentMethod'

export interface Transaction {
  id?: number

  uuid?: string

  descricao: string

  valor: number // valor da parcela (ou valor total se não parcelado)

  valor_total?: number // valor total da compra (preenchido apenas quando parcelado)

  categoria_id: number

  data_compra: string // data da compra original (ISO: AAAA-MM-DD)

  data_competencia?: string // data de competência da parcela (ISO: AAAA-MM-DD)

  competencia_mes?: number // mês da competência (1-12)

  competencia_ano?: number // ano da competência (AAAA)

  forma_pagamento: PaymentMethodType

  // Campos de parcelamento
  parcelado: boolean // indica se faz parte de um parcelamento

  total_parcelas?: number // total de parcelas da compra (ex: 12)

  numero_parcela?: number // número sequencial desta parcela (ex: 3)

  installment_group_id?: string // UUID que agrupa parcelas da mesma compra

  primeira_parcela_em?: string // data do primeiro vencimento (pode diferir da data_compra)

  // Status de pagamento
  pago: boolean

  data_pagamento?: string // data em que foi pago (ISO)

  // Metadados
  observacao?: string

  criado_em: string
}