
import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface ForgotPasswordPageProps {
  onBack: () => void
}

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleReset() {
    if (!email) {
      setMessage('Digite seu email.')
      return
    }

    setLoading(true)
    setMessage('')
    setSuccess(false)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setSuccess(true)
      setMessage('Enviamos um link para seu email. Siga as instruções para redefinir sua senha.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-emerald-400 tracking-tight">
            SmartBudget
          </h1>
          <p className="mt-3 text-slate-400 text-sm">
            Redefinir senha
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-2">
            Esqueceu sua senha?
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={success}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            {message && (
              <p className={`text-sm ${success ? 'text-emerald-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}

            <button
              onClick={handleReset}
              disabled={loading || success}
              className="mt-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar link'}
            </button>

            <button
              onClick={onBack}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors text-center mt-2"
            >
              ← Voltar para o login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}