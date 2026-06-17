export interface Installment {
  id?: number

  transaction_id: number

  numero_parcela: number

  valor_parcela: number

  competencia_mes: number

  competencia_ano: number

  pago: boolean

  criado_em: string
}