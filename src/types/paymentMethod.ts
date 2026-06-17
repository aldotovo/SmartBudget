// Tipos de formas de pagamento disponíveis no sistema
export type PaymentMethodType =
  | 'pix'
  | 'dinheiro'
  | 'debito'
  | 'credito_vista'
  | 'credito_parcelado'

// Opção formatada para uso em selects e listagens
export interface PaymentMethodOption {
  id: PaymentMethodType
  label: string
}

// Lista completa de formas de pagamento para exibição na UI
export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: 'pix', label: 'Pix' },
  { id: 'dinheiro', label: 'Dinheiro' },
  { id: 'debito', label: 'Débito' },
  { id: 'credito_vista', label: 'Crédito à Vista' },
  { id: 'credito_parcelado', label: 'Crédito Parcelado' },
]