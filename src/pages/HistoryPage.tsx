import { useEffect, useState, useCallback } from 'react'
import { db } from '../database/db'
import type { Transaction } from '../types/transaction'
import { AppLayout } from '../layouts/AppLayout'

export function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(new Map()) // UUID -> nome

  // Função de carregamento (será chamada manualmente)
  const loadData = useCallback(async () => {
    // 1. Busca transações
    const data = await db.transactions.toArray()
    data.sort((a, b) => new Date(b.data_compra).getTime() - new Date(a.data_compra).getTime())
    setTransactions(data)

    // 2. Busca categorias e monta mapa UUID -> nome
    const cats = await db.categories.toArray()
    const map = new Map<string, string>()
    cats.forEach((c) => {
      if (c.uuid) map.set(c.uuid, c.nome)
    })
    setCategoryMap(map)
  }, [])

  // Carrega ao montar
  useEffect(() => {
    loadData()

    // Recarrega quando a janela ganhar foco (usuário voltou ao app)
    const handleFocus = () => {
      loadData()
    }
    window.addEventListener('focus', handleFocus)

    // Recarrega quando a página ficar visível novamente (ex: voltou de outra aba)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [loadData])

  function getCategoryName(categoriaUuid: string): string {
    return categoryMap.get(categoriaUuid) || '—'
  }

  function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function formatPaymentMethod(method: string): string {
    const labels: Record<string, string> = {
      pix: 'Pix',
      dinheiro: 'Dinheiro',
      debito: 'Débito',
      credito_vista: 'Crédito à Vista',
      credito_parcelado: 'Crédito Parcelado',
    }
    return labels[method] || method
  }

  return (
    <AppLayout>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">Histórico</h2>
          <p className="mt-2 text-sm text-slate-400">
            Registro completo dos lançamentos.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">
            {transactions.length} lançamentos
          </span>
        </div>

        {transactions.length === 0 ? (
          <p className="text-slate-500 text-center py-12">
            Nenhum lançamento encontrado.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((t) => (
              <article
                key={t.uuid} // <-- MUDOU: agora usa uuid (string)
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex flex-col">
                  <strong className="text-base text-slate-100">
                    {t.descricao}
                  </strong>
                  <span className="mt-1 text-xs text-slate-400">
                    {getCategoryName(t.categoria_uuid)} {/* <-- MUDOU: usa categoria_uuid */}
                    {t.parcelado && ` · ${t.numero_parcela}/${t.total_parcelas}`}
                    {' · '}
                    {new Date(t.data_compra).toLocaleDateString('pt-BR')}
                    {t.observacao && ` · ${t.observacao}`}
                  </span>
                </div>

                <div className="text-right">
                  <strong className="text-lg font-bold text-red-400">
                    {formatCurrency(t.valor)}
                  </strong>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatPaymentMethod(t.forma_pagamento)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  )
}