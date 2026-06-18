// src/pages/SettingsPage.tsx
import { AppLayout } from '../layouts/AppLayout'
import { db } from '../database/db'
import { useState, useEffect, useRef } from 'react'
import type { Category } from '../types/category'
import type { CreditCard } from '../types/creditCard'

export function SettingsPage() {
  // ==================== ESTADOS ====================
  // Categorias
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Cartões de Crédito
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null)
  const [newCardName, setNewCardName] = useState('')
  const [showNewCardForm, setShowNewCardForm] = useState(false)
  const [deleteCardConfirm, setDeleteCardConfirm] = useState<string | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)

  // ==================== EFFECTS ====================
  useEffect(() => {
    loadCategories()
    loadCreditCards()
  }, [])

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ==================== FUNÇÕES DE CATEGORIAS ====================
  async function loadCategories() {
    const data = await db.categories.toArray()
    setCategories(data)
  }

  function startEdit(category: Category) {
    setEditing(category)
    setNewName(category.nome)
    setNewType(category.tipo || '')
    setShowNewForm(false)
    setOpenMenuId(null)
  }

  function cancelEdit() {
    setEditing(null)
    setNewName('')
    setNewType('')
  }

  async function saveEdit() {
    if (!editing?.uuid) return
    if (!newName.trim()) {
      alert('O nome da categoria é obrigatório.')
      return
    }

    await db.categories.update(editing.uuid, {
      nome: newName.trim(),
      tipo: newType.trim() || undefined,
      updated_at: new Date().toISOString(),
    })

    cancelEdit()
    loadCategories()
  }

  async function createCategory() {
    if (!newName.trim()) {
      alert('O nome da categoria é obrigatório.')
      return
    }

    const uuid = crypto.randomUUID()
    await db.categories.add({
      uuid,
      nome: newName.trim(),
      tipo: newType.trim() || undefined,
      criado_em: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    setNewName('')
    setNewType('')
    setShowNewForm(false)
    loadCategories()
  }

  async function deleteCategory(uuid: string) {
    await db.categories.delete(uuid)
    setDeleteConfirm(null)
    setOpenMenuId(null)
    loadCategories()
  }

  function requestDelete(uuid: string) {
    setDeleteConfirm(uuid)
    setOpenMenuId(null)
  }

  // ==================== FUNÇÕES DE CARTÕES ====================
  async function loadCreditCards() {
    const data = await db.credit_cards.toArray()
    setCreditCards(data)
  }

  async function createCreditCard() {
    if (!newCardName.trim()) {
      alert('Digite o nome do cartão.')
      return
    }

    await db.credit_cards.add({
      uuid: crypto.randomUUID(),
      nome: newCardName.trim(),
      criado_em: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    setNewCardName('')
    setShowNewCardForm(false)
    loadCreditCards()
  }

  async function deleteCreditCard(uuid: string) {
    if (!confirm(`Excluir o cartão "${creditCards.find(c => c.uuid === uuid)?.nome}"?`)) return
    await db.credit_cards.delete(uuid)
    setDeleteCardConfirm(null)
    loadCreditCards()
  }

  // ==================== RENDER ====================
  return (
    <AppLayout>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">Configurações</h2>
          <p className="mt-2 text-sm text-slate-400">
            Gerencie categorias, cartões e preferências do sistema.
          </p>
        </div>

        {/* ========== SEÇÃO: CATEGORIAS ========== */}
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Categorias</h3>
              <p className="text-sm text-slate-400 mt-1">
                {categories.length} categorias cadastradas
              </p>
            </div>
            <button
              onClick={() => {
                setShowNewForm(!showNewForm)
                setEditing(null)
                setDeleteConfirm(null)
                setNewName('')
                setNewType('')
              }}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
            >
              + Nova
            </button>
          </div>

          {/* Formulário nova categoria */}
          {showNewForm && (
            <div className="mb-4 flex flex-col sm:flex-row gap-3 rounded-xl border border-emerald-800 bg-emerald-950/30 p-4">
              <input
                type="text"
                placeholder="Nome da categoria"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                autoFocus
              />
              <input
                type="text"
                placeholder="Tipo (ex: Moradia)"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-40 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={createCategory}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setShowNewForm(false)}
                  className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de categorias */}
          <div className="flex flex-col">
            {categories.length === 0 ? (
              <p className="text-slate-500 text-sm py-8 text-center">
                Nenhuma categoria cadastrada.
              </p>
            ) : (
              categories.map((c) => (
                <div key={c.uuid} className="relative">
                  {/* Confirmação de exclusão */}
                  {deleteConfirm === c.uuid ? (
                    <div className="flex items-center gap-3 rounded-xl border border-red-800 bg-red-950/30 px-4 py-3 mb-1">
                      <span className="flex-1 text-sm text-red-300">
                        Excluir "{c.nome}"?
                      </span>
                      <button
                        onClick={() => deleteCategory(c.uuid)}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 transition-colors"
                      >
                        Sim
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-600 transition-colors"
                      >
                        Não
                      </button>
                    </div>
                  ) : editing?.uuid === c.uuid ? (
                    // Modo edição inline
                    <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-blue-800 bg-blue-950/30 px-4 py-3 mb-1">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-40 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                        placeholder="Tipo"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-lg bg-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Item normal
                    <div className="flex items-center gap-3 rounded-xl hover:bg-slate-800/50 px-4 py-3 transition-colors group">
                      <span
                        className="h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: c.cor || '#10b981' }}
                      />
                      <span className="flex-1 text-slate-100 text-sm font-medium">
                        {c.nome}
                      </span>
                      {c.tipo && (
                        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full hidden sm:block">
                          {c.tipo}
                        </span>
                      )}
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === c.uuid ? null : c.uuid)}
                          className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {openMenuId === c.uuid && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-slate-700 bg-slate-800 shadow-xl z-10 overflow-hidden"
                          >
                            <button
                              onClick={() => startEdit(c)}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700 transition-colors text-left"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => requestDelete(c.uuid)}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700 transition-colors text-left"
                            >
                              🗑 Excluir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </article>

        {/* ========== SEÇÃO: CARTÕES DE CRÉDITO ========== */}
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Cartões de Crédito</h3>
              <p className="text-sm text-slate-400 mt-1">
                {creditCards.length} cartões cadastrados
              </p>
            </div>
            <button
              onClick={() => setShowNewCardForm(!showNewCardForm)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
            >
              + Novo
            </button>
          </div>

          {/* Formulário novo cartão */}
          {showNewCardForm && (
            <div className="mb-4 flex flex-col sm:flex-row gap-3 rounded-xl border border-emerald-800 bg-emerald-950/30 p-4">
              <input
                type="text"
                placeholder="Nome do cartão (ex: Nubank)"
                value={newCardName}
                onChange={(e) => setNewCardName(e.target.value)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                autoFocus
              />
              <button
                onClick={createCreditCard}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => setShowNewCardForm(false)}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Lista de cartões */}
          <div className="flex flex-col">
            {creditCards.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">
                Nenhum cartão cadastrado.
              </p>
            ) : (
              creditCards.map((card) => (
                <div
                  key={card.uuid}
                  className="flex items-center justify-between rounded-xl hover:bg-slate-800/50 px-4 py-3 border-b border-slate-800/50 last:border-0"
                >
                  <span className="text-slate-100 text-sm font-medium">
                    {card.nome}
                  </span>
                  <button
                    onClick={() => deleteCreditCard(card.uuid)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </AppLayout>
  )
}