
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  // Verifica se o token de reset é válido ao montar
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        setMessage('Link inválido ou expirado. Solicite um novo link.')
      }
    }
    checkSession()
  }, [])

  async function handleResetPassword() {
    if (!password || !confirmPassword) {
      setMessage('Preencha ambos os campos.')
      return
    }
    if (password.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.')
      return
    }

    setLoading(true)
    setMessage('')
    setSuccess(false)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage(error.message)
    } else {
      setSuccess(true)
      setMessage('Senha redefinida com sucesso!')
      setTimeout(() => navigate('/'), 3000)
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
            Nova senha
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Digite sua nova senha.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400">Nova senha</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400">Confirmar senha</label>
              <input
                type="password"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {message && (
              <p className={`text-sm ${success ? 'text-emerald-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}

            <button
              onClick={handleResetPassword}
              disabled={loading || success}
              className="mt-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}