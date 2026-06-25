import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { db } from '../database/db'
import { supabase } from '../lib/supabase'
import type { User } from '../types/user'

interface UserContextType {
  user: User | null
  userUuid: string 
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = async () => {
    setIsLoading(true)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        setUser(null)
        return
      }
      const localUser = await db.users.where('auth_id').equals(authUser.id).first()
      setUser(localUser || null)
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const value = {
    user,
    userUuid: user?.uuid || '',
    isLoading,
    refreshUser: loadUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}