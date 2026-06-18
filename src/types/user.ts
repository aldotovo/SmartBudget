
export interface User {
  uuid: string          // CHAVE PRIMÁRIA
  auth_id: string       // ID do Supabase Auth
  nome: string
  residencia: string
  criado_em: string
  updated_at: string
}