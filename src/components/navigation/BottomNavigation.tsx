import {
  BarChart3,
  History,
  PlusCircle,
  Settings,
} from 'lucide-react'

import { Link, useLocation } from 'react-router-dom'

export function BottomNavigation() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        border-t
        border-slate-800
        bg-slate-900/95
        backdrop-blur
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-2xl
          items-center
          justify-around
          px-4
          py-3
        "
      >
        <Link
          to="/"
          className={`
            flex
            flex-col
            items-center
            gap-1
            ${
              isActive('/')
                ? 'text-emerald-400'
                : 'text-slate-400'
            }
          `}
        >
          <BarChart3 size={20} />

          <span className="text-xs">
            Dashboard
          </span>
        </Link>

        <Link
          to="/transactions"
          className={`
            flex
            flex-col
            items-center
            gap-1
            ${
              isActive('/transactions')
                ? 'text-emerald-400'
                : 'text-slate-400'
            }
          `}
        >
          <PlusCircle size={20} />

          <span className="text-xs">
            Lançar
          </span>
        </Link>

        <Link
          to="/history"
          className={`
            flex
            flex-col
            items-center
            gap-1
            ${
              isActive('/history')
                ? 'text-emerald-400'
                : 'text-slate-400'
            }
          `}
        >
          <History size={20} />

          <span className="text-xs">
            Histórico
          </span>
        </Link>

        <Link
          to="/settings"
          className={`
            flex
            flex-col
            items-center
            gap-1
            ${
              isActive('/settings')
                ? 'text-emerald-400'
                : 'text-slate-400'
            }
          `}
        >
          <Settings size={20} />

          <span className="text-xs">
            Config
          </span>
        </Link>
      </div>
    </nav>
  )
}