
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { db } from '../database/db'

interface AuthPageProps {
  onAuthenticated: () => void
  onForgotPassword: () => void
}

export function AuthPage({ onAuthenticated, onForgotPassword }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [residencia, setResidencia] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSignUp() {
  console.log('Iniciando signUp...')
  if (!email || !password || !nome || !residencia) {
    setMessage('Preencha todos os campos.')
    return
  }
  if (password.length < 6) {
    setMessage('A senha deve ter pelo menos 6 caracteres.')
    return
  }

  setLoading(true)
  setMessage('')

  try {
    console.log('Enviando requisição para Supabase...')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    console.log('Resposta do Supabase:', { data, error })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    const authId = data.user?.id
    console.log('authId:', authId)

    if (authId) {
      const uuid = crypto.randomUUID ? crypto.randomUUID() : 'fallback-' + Date.now()
      console.log('UUID gerado:', uuid)

      await db.users.put({
        uuid,
        auth_id: authId,
        nome: nome.trim(),
        residencia: residencia.trim(),
        criado_em: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      console.log('✅ Usuário salvo localmente.')
    }

    setMessage('Código de confirmação enviado para seu email. Verifique sua caixa de entrada.')
  } catch (err) {
    console.error('Erro inesperado:', err)
    setMessage('Erro interno. Verifique o console.')
  } finally {
    setLoading(false)
  }
}

  async function handleSignIn() {
    if (!email || !password) {
      setMessage('Preencha todos os campos.')
      return
    }

    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      const authId = data.user?.id

      if (authId) {
        // Verifica se o usuário já existe localmente
        const existingUser = await db.users.where('auth_id').equals(authId).first()

        if (!existingUser) {
          // Primeiro login neste dispositivo: cria usuário local
          // Usa o email como nome padrão (o usuário pode alterar depois)
          const emailName = email.split('@')[0]
          await db.users.put({
            uuid: crypto.randomUUID(),
            auth_id: authId,
            nome: emailName || 'Usuário',
            residencia: 'Minha Casa',
            criado_em: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }
      }

      onAuthenticated()
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
            {isSignUp ? 'Crie sua conta' : 'Entre na sua conta'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            {isSignUp && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-slate-400">Nome da residência</label>
                  <input
                    type="text"
                    placeholder="Ex: Casa Silva"
                    value={residencia}
                    onChange={(e) => setResidencia(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-slate-400">Seu nome</label>
                  <input
                    type="text"
                    placeholder="Ex: João"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400">Senha</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {message && (
              <p className={`text-sm ${message.includes('enviado') ? 'text-emerald-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}

            <button
              onClick={isSignUp ? handleSignUp : handleSignIn}
              disabled={loading}
              className="mt-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Carregando...' : isSignUp ? 'Criar conta' : 'Entrar'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setMessage('')
              }}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isSignUp ? 'Já tem conta? Entre aqui' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
          {!isSignUp && (
            <div className="text-center mt-4">
              <button
                onClick={() => onForgotPassword()}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>
          )}    
        </div>
      </div>
    </div>
  )
}