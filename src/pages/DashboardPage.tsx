import { AppLayout } from '../layouts/AppLayout'
import { useEffect, useState } from 'react'
import { db } from '../database/db'
import type { Transaction } from '../types/transaction'
import type { Meta } from '../types/meta'
import type { Category } from '../types/category'
import type { User } from '../types/user'
import { supabase } from '../lib/supabase'
import { useUser } from '../contexts/UserContext'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export function DashboardPage() {
  const { userUuid } = useUser()
  const today = new Date()
  const [month, setMonth] = useState<number>(today.getMonth() + 1)
  const [year, setYear] = useState<number>(today.getFullYear())

  const [user, setUser] = useState<User | null>(null)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [totalIncomes, setTotalIncomes] = useState(0)
  const [monthBalance, setMonthBalance] = useState(0)
  const [monthGoal, setMonthGoal] = useState<Meta | null>(null)
  const [goalPercentage, setGoalPercentage] = useState<number | null>(null)
  const [categoriesData, setCategoriesData] = useState<{ name: string; value: number }[]>([])
  const [evolutionData, setEvolutionData] = useState<{ month: string; amount: number }[]>([])
  const [hasAnyData, setHasAnyData] = useState(false)

  useEffect(() => {
    loadData()
  }, [month, year])

  async function loadUser() {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return
    
    const user = await db.users.where('auth_id').equals(authUser.id).first()
    if (user) setUser(user)
  }

  async function loadData() {
    // 1. Busca transações do mês
    const transactions = await db.transactions
      .where('competencia_mes')
      .equals(month)
      .and((t: Transaction) => t.competencia_ano === year && t.user_uuid === userUuid)
      .toArray()

    // 2. Busca categorias e cria mapa UUID -> Category
    const categories = await db.categories.toArray()
    const categoryMap = new Map<string, Category>() // <-- MUDOU: agora usa string (UUID)
    categories.forEach((c) => {
      if (c.uuid) categoryMap.set(c.uuid, c) // <-- MUDOU: c.uuid
    })

    // 3. Calcula despesas e receitas
    let expenses = 0
    let incomes = 0

    transactions.forEach((t) => {
      if (t.valor > 0) {
        expenses += t.valor
      } else {
        incomes += Math.abs(t.valor)
      }
    })

    setTotalExpenses(expenses)
    setTotalIncomes(incomes)
    setMonthBalance(incomes - expenses)

    // 4. Busca meta do mês
    const competenceStr = `${year}-${String(month).padStart(2, '0')}`
    const goal = await db.metas.where('competencia').equals(competenceStr).first()
    setMonthGoal(goal || null)

    if (goal && goal.valor > 0) {
      const percentage = Math.round((expenses / goal.valor) * 100)
      setGoalPercentage(percentage)
    } else {
      setGoalPercentage(null)
    }

    // 5. Agrupa despesas por categoria (USANDO categoria_uuid)
    const grouped: Record<string, { name: string; amount: number }> = {} // <-- MUDOU: chave é string

    transactions
      .filter((t) => t.valor > 0)
      .forEach((t) => {
        const catUuid = t.categoria_uuid 
        if (!grouped[catUuid]) {
          const cat = categoryMap.get(catUuid) 
          grouped[catUuid] = {
            name: cat?.nome || 'Sem categoria',
            amount: 0,
          }
        }
        grouped[catUuid].amount += t.valor
      })

    const pieData = Object.values(grouped).map((item) => ({
      name: item.name,
      value: Math.round(item.amount * 100) / 100,
    }))
    setCategoriesData(pieData)

    // 6. Evolução mensal (últimos 6 meses)
    const evolution: { month: string; amount: number }[] = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1)
      const loopMonth = d.getMonth() + 1
      const loopYear = d.getFullYear()

      const loopTransactions = await db.transactions
        .where('competencia_mes')
        .equals(loopMonth)
        .and((t: Transaction) => t.competencia_ano === loopYear && t.user_uuid === userUuid)
        .toArray()

      const sum = loopTransactions
        .filter((t) => t.valor > 0)
        .reduce((acc, t) => acc + t.valor, 0)

      evolution.push({
        month: `${MONTHS[d.getMonth()]}/${loopYear}`,
        amount: Math.round(sum * 100) / 100,
      })
    }

    setEvolutionData(evolution)

    // 7. Verifica se existe algum dado
    const totalTransactions = await db.transactions.count()
    setHasAnyData(totalTransactions > 0)
  }

  function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function previousMonth() {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  function goToCurrentMonth() {
    const now = new Date()
    setMonth(now.getMonth() + 1)
    setYear(now.getFullYear())
  }

  return (
    <AppLayout>
      <section className="flex flex-col gap-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100">
              {user ? (
                <>
                  <svg className="h-6 w-6 inline-block mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                  </svg>
                  {user.residencia}
                </>
              ) : 'Dashboard'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Visão geral das finanças
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors"
              aria-label="Mês anterior"
            >
              ◀
            </button>

            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-1.5">
              <span className="text-slate-100 font-medium">
                {MONTHS[month - 1]}/{year}
              </span>
            </div>

            <button
              onClick={nextMonth}
              className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors"
              aria-label="Mês seguinte"
            >
              ▶
            </button>

            <button
              onClick={goToCurrentMonth}
              className="ml-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Hoje
            </button>
          </div>
        </div>

        {/* Mensagem quando não há dados */}
        {!hasAnyData && (
          <div className="rounded-2xl border border-emerald-800 bg-emerald-950/30 p-8 text-center">
            <p className="text-emerald-400 text-lg font-semibold mb-2">
              Bem-vindo ao SmartBudget!
            </p>
            <p className="text-slate-400 text-sm">
              Você ainda não tem lançamentos. Vá em <strong>Lançamentos</strong> e comece a registrar suas despesas.
            </p>
          </div>
        )}

        {/* Cards principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400 mb-1">Despesas</p>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(totalExpenses)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400 mb-1">Receitas</p>
            <p className="text-2xl font-bold text-emerald-400">
              {formatCurrency(totalIncomes)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400 mb-1">Saldo</p>
            <p className={`text-2xl font-bold ${monthBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(monthBalance)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400 mb-1">Meta</p>
            {monthGoal ? (
              <div>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(monthGoal.valor)}
                </p>
                {goalPercentage !== null && (
                  <div className="mt-2">
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          goalPercentage > 100
                            ? 'bg-red-500'
                            : goalPercentage > 80
                              ? 'bg-yellow-500'
                              : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(goalPercentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {goalPercentage}% utilizado
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-lg text-slate-500">Nenhuma meta</p>
            )}
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Gastos por categoria
            </h3>

            {categoriesData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-slate-500">
                Nenhuma despesa neste mês
              </div>
            ) : (
              <div className="w-full h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoriesData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {categoriesData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Evolução mensal
            </h3>

            {evolutionData.every((d) => d.amount === 0) ? (
              <div className="flex items-center justify-center h-64 text-slate-500">
                Nenhum dado nos últimos 6 meses
              </div>
            ) : (
              <div className="w-full h-64">
                <ResponsiveContainer>
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="month"
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(value: number) =>
                        value >= 1000
                          ? `${(value / 1000).toFixed(0)}k`
                          : value.toString()
                      }
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  )
}