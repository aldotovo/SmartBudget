import { supabase } from './supabase'
import { db } from '../database/db'

// Envia dados locais para o Supabase (sem enviar o id)
export async function syncToCloud(): Promise<void> {
  // Sincroniza categorias
  const categories = await db.categories.toArray()
  for (const cat of categories) {
    const { error } = await supabase.from('categories').upsert({
      nome: cat.nome,
      tipo: cat.tipo,
      cor: cat.cor,
      icone: cat.icone,
    }, { onConflict: 'nome' })
    if (error) console.error('Erro sync categoria:', error)
  }

  // Sincroniza transações
  const transactions = await db.transactions.toArray()
  for (const tx of transactions) {
    const { error } = await supabase.from('transactions').insert({
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
    } as any)
    if (error) console.error('Erro sync transação:', error)
  }

  // Sincroniza metas
  const metas = await db.metas.toArray()
  for (const meta of metas) {
    const { error } = await supabase.from('metas').upsert({
      competencia: meta.competencia,
      valor: meta.valor,
    }, { onConflict: 'competencia' })
    if (error) console.error('Erro sync meta:', error)
  }
}

// Baixa dados da nuvem
export async function syncFromCloud(): Promise<void> {
  const { data: categories } = await supabase.from('categories').select('*')
  if (categories) {
    for (const cat of categories) {
      const exists = await db.categories.where('nome').equals(cat.nome).first()
      if (!exists) {
        await db.categories.add({
          nome: cat.nome,
          tipo: cat.tipo,
          cor: cat.cor,
          icone: cat.icone,
          criado_em: cat.criado_em || new Date().toISOString(),
        })
      }
    }
  }

  const { data: transactions } = await supabase.from('transactions').select('*')
  if (transactions) {
    for (const tx of transactions) {
      const exists = await db.transactions.get(tx.id)
      if (!exists) {
        await db.transactions.add({
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
          criado_em: tx.criado_em || new Date().toISOString(),
        } as any)
      }
    }
  }

  const { data: metas } = await supabase.from('metas').select('*')
  if (metas) {
    for (const meta of metas) {
      const exists = await db.metas.where('competencia').equals(meta.competencia).first()
      if (!exists) {
        await db.metas.add({
          competencia: meta.competencia,
          valor: meta.valor,
        })
      }
    }
  }
}