
import { useEffect, useState } from 'react'
import { AppRouter } from './routes/AppRouter'
import { AuthPage } from './pages/AuthPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'  // <-- IMPORTAÇÃO ADICIONADA
import { supabase } from './lib/supabase'
import { syncService } from './services/SyncService'

// Tipo para controlar qual tela de autenticação exibir (incluindo 'reset')
type AuthScreen = 'login' | 'forgot' | 'reset'  // <-- 'reset' adicionado

function App() {
  const [session, setSession] = useState<boolean | null>(null)
  const [screen, setScreen] = useState<AuthScreen>('login')

  useEffect(() => {
    // 1. Verifica sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      const isLoggedIn = !!session
      setSession(isLoggedIn)
      if (isLoggedIn) {
        syncService.syncAll()
      }
    })

    // 2. Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isLoggedIn = !!session
      setSession(isLoggedIn)
      if (isLoggedIn) {
        syncService.syncAll()
      }
    })

    // 3. Sincroniza quando a janela ganha foco
    const handleFocus = () => {
      if (session) {
        syncService.syncAll()
      }
    }
    window.addEventListener('focus', handleFocus)

    // 4. Sincroniza a cada 5 minutos
    const interval = setInterval(() => {
      if (session) {
        syncService.syncAll()
      }
    }, 5 * 60 * 1000)

    // 5. Detecta se a URL contém token de reset de senha
    const hash = window.location.hash
    if (hash.includes('access_token')) {
      console.log('🔑 Token de reset detectado!')
      setScreen('reset')
    }

    // 6. Cleanup
    return () => {
      subscription.unsubscribe()
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [session])

  // Tela de carregamento
  if (session === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-500">Carregando...</p>
      </div>
    )
  }

  // Se não estiver logado, mostra a tela de autenticação adequada
  if (!session) {
    if (screen === 'forgot') {
      return <ForgotPasswordPage onBack={() => setScreen('login')} />
    }
    if (screen === 'reset') {
      return <ResetPasswordPage />
    }
    return (
      <AuthPage
        onAuthenticated={() => setSession(true)}
        onForgotPassword={() => setScreen('forgot')}
      />
    )
  }

  // Logado: renderiza o app com roteamento
  return <AppRouter />
}

export default App