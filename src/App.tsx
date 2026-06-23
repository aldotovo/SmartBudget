
import { useEffect, useState } from 'react'
import { AppRouter } from './routes/AppRouter'
import { AuthPage } from './pages/AuthPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'  // <-- IMPORTAÇÃO ADICIONADA
import { supabase } from './lib/supabase'
import { syncService } from './services/SyncService'
import { useUser } from './contexts/UserContext'

// Tipo para controlar qual tela de autenticação exibir (incluindo 'reset')
type AuthScreen = 'login' | 'forgot' | 'reset' 

function App() {
  const [session, setSession] = useState<boolean | null>(null)
  const [screen, setScreen] = useState<AuthScreen>('login')
  const { userUuid } = useUser()

  useEffect(() => {
    // 1. Verifica sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      const isLoggedIn = !!session
      setSession(isLoggedIn)
      
      // Se já estiver logado, sincroniza imediatamente
      if (isLoggedIn && userUuid) { 
        syncService.syncAll(userUuid) 
      }
    })

    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isLoggedIn = !!session
      setSession(isLoggedIn)
      
      if (isLoggedIn && userUuid) {
        syncService.syncAll(userUuid)
      }
    })

    
    const handleFocus = () => {
      if (session && userUuid) {
        syncService.syncAll(userUuid)
      }
    }
    window.addEventListener('focus', handleFocus)

    // 4. Sincroniza a cada 5 minutos
    const interval = setInterval(() => {
      if (session && userUuid) {
        syncService.syncAll(userUuid)
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
  }, [session, userUuid])

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