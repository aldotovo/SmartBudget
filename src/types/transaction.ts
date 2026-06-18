
import type { PaymentMethodType } from './paymentMethod'

export interface Transaction {
  uuid: string
  descricao: string
  valor: number
  valor_total?: number
  categoria_uuid: string
  cartao_uuid?: string // <-- NOVO
  data_compra: string
  data_competencia?: string
  competencia_mes?: number
  competencia_ano?: number
  forma_pagamento: PaymentMethodType
  parcelado: boolean
  total_parcelas?: number
  numero_parcela?: number
  installment_group_id?: string
  primeira_parcela_em?: string
  pago: boolean
  data_pagamento?: string
  sync_status: 'synced' | 'pending' | 'failed'
  observacao?: string
  criado_em: string
  updated_at: string
}