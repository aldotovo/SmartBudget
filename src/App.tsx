import { useEffect, useState } from 'react'
import { AppRouter } from './routes/AppRouter'
import { AuthPage } from './pages/AuthPage'
import { supabase } from './lib/supabase'

function App() {
  const [session, setSession] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-500">Carregando...</p>
      </div>
    )
  }

  if (!session) {
    return <AuthPage onAuthenticated={() => setSession(true)} />
  }

  return <AppRouter />
}

export default App