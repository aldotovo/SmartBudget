// src/pages/MetasPage.tsx
// Página de metas financeiras - VERSÃO UUID
// Permite definir valor máximo de gastos por competência

import { useState, useEffect } from 'react'
import { db } from '../database/db'
import type { Meta } from '../types/meta'
import { AppLayout } from '../layouts/AppLayout'

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function MetasPage() {
  const today = new Date()
  const [metas, setMetas] = useState<Meta[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Meta | null>(null)

  // Form state
  const [competencia, setCompetencia] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  )
  const [valor, setValor] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null) // <-- MUDOU: agora string (uuid)

  useEffect(() => {
    loadMetas()
  }, [])

  async function loadMetas() {
    const data = await db.metas.orderBy('competencia').reverse().toArray()
    setMetas(data)
  }

  function resetForm() {
    setCompetencia(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`)
    setValor('')
    setShowForm(false)
    setEditing(null)
  }

  async function handleSave() {
    const valorNumerico = parseFloat(valor.replace(/[R$\s.]/g, '').replace(',', '.'))

    if (!competencia || !valorNumerico || valorNumerico <= 0) {
      alert('Preencha todos os campos corretamente.')
      return
    }

    if (editing?.uuid) { // <-- MUDOU: usa uuid
      // Atualiza meta existente
      await db.metas.update(editing.uuid, { // <-- MUDOU: usa uuid
        competencia,
        valor: valorNumerico,
        updated_at: new Date().toISOString(),
      })
    } else {
      // Verifica se já existe meta para esta competência
      const exists = await db.metas.where('competencia').equals(competencia).first()
      if (exists) {
        alert('Já existe uma meta para esta competência.')
        return
      }

      // Gera UUID para a nova meta
      const uuid = crypto.randomUUID() // <-- NOVO
      await db.metas.add({
        uuid, // <-- NOVO
        competencia,
        valor: valorNumerico,
        criado_em: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    resetForm()
    loadMetas()
  }

  function startEdit(meta: Meta) {
    setEditing(meta)
    setCompetencia(meta.competencia)
    setValor(meta.valor.toString())
    setShowForm(true)
  }

  async function handleDelete(uuid: string) { // <-- MUDOU: parâmetro agora é string
    await db.metas.delete(uuid) // <-- MUDOU: usa uuid
    setDeleteConfirm(null)
    loadMetas()
  }

  function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function formatCompetencia(comp: string): string {
    const [ano, mes] = comp.split('-')
    return `${MONTHS[Number(mes) - 1]}/${ano}`
  }

  return (
    <AppLayout>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100">Metas</h2>
            <p className="mt-2 text-sm text-slate-400">
              Defina limites de gastos por mês e acompanhe o progresso.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Nova'}
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-slate-200">
              {editing ? 'Editar meta' : 'Nova meta'}
            </h3>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-sm text-slate-400">Competência</label>
                <input
                  type="month"
                  value={competencia}
                  onChange={(e) => setCompetencia(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <label className="text-sm text-slate-400">Valor máximo</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={valor}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, '')
                    const num = Number(raw) / 100
                    setValor(
                      num.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                    )
                  }}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={handleSave}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={resetForm}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de metas */}
        {metas.length === 0 ? (
          <p className="text-slate-500 text-center py-12">
            Nenhuma meta definida. Crie sua primeira meta para acompanhar seus gastos.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {metas.map((meta) => (
              <div key={meta.uuid}> {/* <-- MUDOU: key agora é meta.uuid */}
                {deleteConfirm === meta.uuid ? ( // <-- MUDOU: compara UUID
                  <div className="flex items-center gap-3 rounded-xl border border-red-800 bg-red-950/30 px-5 py-4">
                    <span className="flex-1 text-sm text-red-300">
                      Excluir meta de {formatCompetencia(meta.competencia)}?
                    </span>
                    <button
                      onClick={() => handleDelete(meta.uuid!)} // <-- MUDOU: usa uuid
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors"
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-600 transition-colors"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">
                    <div>
                      <p className="text-slate-100 font-medium">
                        {formatCompetencia(meta.competencia)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-blue-400">
                        {formatCurrency(meta.valor)}
                      </span>
                      <button
                        onClick={() => startEdit(meta)}
                        className="rounded-lg bg-blue-600/20 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-600/30 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(meta.uuid!)} // <-- MUDOU: usa uuid
                        className="rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-600/30 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  )
}