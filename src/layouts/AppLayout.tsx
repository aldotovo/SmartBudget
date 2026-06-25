import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import {
  HomeIcon,
  PlusCircleIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowDownTrayIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import { db } from '../database/db'
import type { User } from '../types/user'
import { supabase } from '../lib/supabase'
import { syncService } from '../services/SyncService'
import { useUser } from '../contexts/UserContext'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const { userUuid, refreshUser } = useUser()
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const userLocal = await db.users.where('auth_id').equals(authUser.id).first()
      if (userLocal) {
        setUser(userLocal)
        await refreshUser()
      } else {
        const emailName = authUser.email?.split('@')[0] || 'Usuário'
        const newUser: User = {
          uuid: crypto.randomUUID(),
          auth_id: authUser.id,
          nome: emailName,
          residencia: 'Minha Casa',
          criado_em: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        await db.users.add(newUser)
        setUser(newUser)
        await refreshUser()
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
    }
  }

  async function handleManualSync() {
    if (!userUuid) {
      console.warn('Usuário UUID não disponível. Tente novamente.')
      return
    }
    setIsSyncing(true)
    try {
      await syncService.syncAll(userUuid)
      const count = await db.transactions
        .where('sync_status')
        .equals('pending')
        .count()
      setPendingCount(count)
    } catch (error) {
      console.error('Erro na sincronização manual:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  async function handleLogout() {
    try {
      await db.transactions.clear()
      await db.metas.clear()
      console.log('Dados locais limpos.')
    } catch (error) {
      console.warn('Erro ao limpar dados locais:', error)
    }
    await supabase.auth.signOut()
    window.location.reload()
  }

  function handleReport() {
    alert('Relatório em breve!')
  }

  useEffect(() => {
    async function checkPending() {
      const count = await db.transactions
        .where('sync_status')
        .equals('pending')
        .count()
      setPendingCount(count)
    }
    checkPending()
    const interval = setInterval(checkPending, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      <aside className="hidden md:flex md:flex-col md:w-64 border-r border-slate-800 bg-slate-900">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-emerald-400">SmartBudget</h1>
          {user ? (
            <div className="mt-3">
              <p className="text-sm text-slate-300 font-medium">{user.residencia}</p>
              <p className="text-xs text-slate-500">Olá, {user.nome}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 mt-1">Controle doméstico mensal</p>
          )}
        </div>

        <nav className="flex-1 flex flex-col p-4 gap-2">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
            <HomeIcon className="h-5 w-5" aria-hidden="true" /> Dashboard
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
            <PlusCircleIcon className="h-5 w-5" aria-hidden="true" /> Lançamentos
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
            <ClockIcon className="h-5 w-5" aria-hidden="true" /> Histórico
          </NavLink>
          <NavLink to="/metas" className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
            Metas
          </NavLink>
          <NavLink to="/config" className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
            <Cog6ToothIcon className="h-5 w-5" aria-hidden="true" /> Configurações
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50">
            <span className="text-xs text-slate-400">Status:</span>
            <div className="flex items-center gap-2">
              {isSyncing ? (
                <span className="text-xs text-yellow-400 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  Sincronizando...
                </span>
              ) : pendingCount > 0 ? (
                <span className="text-xs text-yellow-400 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  {pendingCount} pendente(s)
                </span>
              ) : (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full" />
                  Sincronizado
                </span>
              )}
            </div>
          </div>

          <button onClick={handleManualSync} disabled={isSyncing} className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
            {isSyncing ? 'Sincronizando...' : 'Sincronizar agora'}
          </button>

          <button onClick={handleReport} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors w-full">
            <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" /> Exportar Relatório
          </button>

          <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors w-full">
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5" aria-hidden="true" /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto pb-20 md:pb-6">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900 flex justify-around py-2 z-50">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
          <HomeIcon className="h-6 w-6" aria-hidden="true" /> Dashboard
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
          <PlusCircleIcon className="h-6 w-6" aria-hidden="true" /> Lançamentos
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
          <ClockIcon className="h-6 w-6" aria-hidden="true" /> Histórico
        </NavLink>
        <NavLink to="/metas" className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
          </svg>
          Metas
        </NavLink>
        <NavLink to="/config" className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
          <Cog6ToothIcon className="h-6 w-6" aria-hidden="true" /> Configurações
        </NavLink>
      </nav>
    </div>
  )
}