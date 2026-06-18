
import type { PaymentMethodType } from './paymentMethod'

export interface Transaction {
  // CHAVE PRIMÁRIA GLOBAL (obrigatória)
  uuid: string

  descricao: string

  cartao_uuid?: string

  // valor da parcela (ou valor total se não parcelado)
  valor: number

  // valor total da compra (preenchido apenas quando parcelado)
  valor_total?: number

  // AGORA REFERENCIA O UUID DA CATEGORIA (não mais o número)
  categoria_uuid: string

  data_compra: string // data da compra original (ISO: AAAA-MM-DD)

  data_competencia?: string // data de competência da parcela (ISO: AAAA-MM-DD)

  competencia_mes?: number // mês da competência (1-12)

  competencia_ano?: number // ano da competência (AAAA)

  forma_pagamento: PaymentMethodType

  // Campos de parcelamento
  parcelado: boolean
  total_parcelas?: number
  numero_parcela?: number
  installment_group_id?: string
  primeira_parcela_em?: string

  // Status de pagamento
  pago: boolean
  data_pagamento?: string

  // Status de sincronização
  sync_status: 'synced' | 'pending' | 'failed'

  // Metadados
  observacao?: string

  // Data da última modificação (para pull incremental)
  updated_at: string

  // Mantido
  criado_em: string
}