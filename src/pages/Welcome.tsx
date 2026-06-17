// Tela de boas-vindas / cadastro inicial
// Exibida apenas no primeiro acesso, quando não há usuário cadastrado

import { useState } from 'react'
import { db } from '../database/db'

interface WelcomeProps {
  onComplete: () => void
}

export function WelcomePage({ onComplete }: WelcomeProps) {
  const [nome, setNome] = useState('')
  const [residencia, setResidencia] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleStart() {
    if (!nome.trim() || !residencia.trim()) {
      alert('Preencha todos os campos para continuar.')
      return
    }

    setSaving(true)

    await db.users.put({
      id: 1,
      nome: nome.trim(),
      residencia: residencia.trim(),
      criado_em: new Date().toISOString(),
    })

    onComplete()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Marca */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-emerald-400 tracking-tight">
            SmartBudget
          </h1>
          <p className="mt-3 text-slate-400 text-sm">
            Controle financeiro da sua residência
          </p>
        </div>

        {/* Card de cadastro */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-2">
            Bem-vindo
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Configure sua residência para começar a usar o SmartBudget.
          </p>

          <div className="flex flex-col gap-4">
            {/* Nome da residência */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400">
                Nome da residência
              </label>
              <input
                type="text"
                placeholder="Ex: Casa Silva"
                value={residencia}
                onChange={(e) => setResidencia(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                autoFocus
              />
            </div>

            {/* Nome do usuário */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400">
                Seu nome
              </label>
              <input
                type="text"
                placeholder="Ex: João"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleStart}
              disabled={saving}
              className="mt-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Configurando...' : 'Começar'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Seus dados ficam salvos apenas neste dispositivo.
        </p>
      </div>
    </div>
  )
}