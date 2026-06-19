
import { useState, useEffect } from 'react'
import { db } from '../database/db'
import type { Category } from '../types/category'
import type { Transaction } from '../types/transaction'
import { PAYMENT_METHODS } from '../types/paymentMethod'
import type { PaymentMethodType } from '../types/paymentMethod'
import { createTransaction, getTransactionsByCompetence } from '../database/services/transactionsService'
import { AppLayout } from '../layouts/AppLayout'
import type { CreditCard } from '../types/creditCard'

export function TransactionsPage() {

// ==================== ESTADOS DO FORMULÁRIO ====================
const [descricao, setDescricao] = useState('')
const [valorTotal, setValorTotal] = useState<string>('')
const [categoriaUuid, setCategoriaUuid] = useState<string | null>(null)
const [dataCompra, setDataCompra] = useState('')
const [dataCompraDisplay, setDataCompraDisplay] = useState('') // <-- MÁSCARA
const [formaPagamento, setFormaPagamento] = useState<PaymentMethodType>('pix')
const [totalParcelas, setTotalParcelas] = useState<number>(2)
const [primeiraParcelaEm, setPrimeiraParcelaEm] = useState('')
const [primeiraParcelaEmDisplay, setPrimeiraParcelaEmDisplay] = useState('') // <-- MÁSCARA
const [observacao, setObservacao] = useState('')
const [cartaoUuid, setCartaoUuid] = useState<string | null>(null) 

// ==================== DADOS ====================
const [categorias, setCategorias] = useState<Category[]>([])
const [cartoes, setCartoes] = useState<CreditCard[]>([]) 
const [transacoes, setTransacoes] = useState<Transaction[]>([])

// ==================== ESTADOS DE UI ====================
const [salvando, setSalvando] = useState(false)
const [editando, setEditando] = useState<Transaction | null>(null)

// ==================== FILTROS ====================
const [filtroMes, setFiltroMes] = useState<number>(new Date().getMonth() + 1)
const [filtroAno, setFiltroAno] = useState<number>(new Date().getFullYear())

    useEffect(() => {
    loadCategorias()
    loadTransacoes()
    loadCartoes()
  }, [filtroMes, filtroAno])

  async function loadCategorias() {
    const data = await db.categories.toArray()
    setCategorias(data)
  }

  async function loadTransacoes() {
    const data = await getTransactionsByCompetence(filtroMes, filtroAno)
    setTransacoes(data)
  }

  async function loadCartoes() {
    const data = await db.credit_cards.toArray()
    setCartoes(data)
  }

  function parseValorMonetario(valor: string): number {
    const limpo = valor.replace(/[R$\s.]/g, '').replace(',', '.')
    return Number(limpo)
  }

  function formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function handleValorChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, '')
    const numero = Number(raw) / 100
    setValorTotal(formatarMoeda(numero))
  }

  async function salvarTransacao() {
    const valorNumerico = parseValorMonetario(valorTotal)

    if (!descricao || !valorNumerico || !categoriaUuid || !dataCompra) {
      alert('Preencha todos os campos obrigatórios!')
      return
    }

    if (formaPagamento === 'credito_parcelado' && totalParcelas < 2) {
      alert('Crédito parcelado precisa de pelo menos 2 parcelas.')
      return
    }

    setSalvando(true)

    try {
      if (editando?.uuid) {
        // Atualiza transação existente (agora com uuid)
        await db.transactions.update(editando.uuid, {
          descricao,
          valor: valorNumerico,
          categoria_uuid: categoriaUuid,
          data_compra: dataCompra,
          forma_pagamento: formaPagamento,
          observacao,
          updated_at: new Date().toISOString(),
        })
        setEditando(null)
      } else {
        await createTransaction({
          descricao,
          valor: valorNumerico,
          valor_total: valorNumerico,
          categoria_uuid: categoriaUuid, // <-- mudou
          data_compra: dataCompra,
          forma_pagamento: formaPagamento,
          total_parcelas: formaPagamento === 'credito_parcelado' ? totalParcelas : undefined,
          primeira_parcela_em: primeiraParcelaEm || undefined,
          observacao,
        })
      }

      setDescricao('')
      setValorTotal('')
      setCategoriaUuid(null)
      setDataCompra('')
      setFormaPagamento('pix')
      setTotalParcelas(2)
      setPrimeiraParcelaEm('')
      setObservacao('')

      await loadTransacoes()
      alert('Dados enviados com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar transação:', error)
      alert('Erro ao salvar transação. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  async function excluirTransacao(t: Transaction) {
    if (!t.uuid) return

    if (t.parcelado && t.installment_group_id) {
      const apagarTodas = confirm(
        'Esta transação faz parte de uma compra parcelada. Deseja apagar TODAS as parcelas?'
      )
      if (apagarTodas) {
        await db.transactions
          .where('installment_group_id')
          .equals(t.installment_group_id)
          .delete()
      } else {
        await db.transactions.delete(t.uuid) // <-- agora com uuid
      }
    } else {
      await db.transactions.delete(t.uuid) // <-- agora com uuid
    }

    await loadTransacoes()
  }

  function iniciarEdicao(t: Transaction) {
    setEditando(t)
    setDescricao(t.descricao)
    setValorTotal(formatarMoeda(t.valor))
    setCategoriaUuid(t.categoria_uuid) // <-- mudou
    setDataCompra(t.data_compra.split('T')[0])
    setFormaPagamento(t.forma_pagamento)
    setObservacao(t.observacao || '')
    if (t.total_parcelas) setTotalParcelas(t.total_parcelas)
    if (t.primeira_parcela_em) setPrimeiraParcelaEm(t.primeira_parcela_em.split('T')[0])
  }

  const valorParcelaPreview =
    formaPagamento === 'credito_parcelado' && totalParcelas > 1
      ? parseValorMonetario(valorTotal) / totalParcelas
      : 0

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]

  return (
    <AppLayout>
      <section className="mx-auto max-w-3xl p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-slate-100">Lançamentos</h2>

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-900/50 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-200">
            {editando ? 'Editar lançamento' : 'Novo lançamento'}
          </h3>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Descrição</label>
            <input
              type="text"
              placeholder="Ex: Compra do mês ou Serviço contratado"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Valor total</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="R$ 0,00"
              value={valorTotal}
              onChange={handleValorChange}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Categoria</label>
            <select
              value={categoriaUuid ?? ''}
              onChange={(e) => setCategoriaUuid(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Selecione a categoria</option>
              {categorias.map((c) => (
                <option key={c.uuid} value={c.uuid}> {/* <-- mudou */}
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Data da compra</label>
            <input
              type="date"
              value={dataCompra}
              onChange={(e) => setDataCompra(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Forma de pagamento</label>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value as PaymentMethodType)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {formaPagamento === 'credito_vista' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-400">
                Data da fatura
                <span className="ml-1 text-xs text-slate-500">(padrão: mês seguinte)</span>
              </label>
              <input
                type="date"
                value={primeiraParcelaEm}
                onChange={(e) => setPrimeiraParcelaEm(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {formaPagamento === 'credito_parcelado' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-400">Total de parcelas</label>
                <select
                  value={totalParcelas}
                  onChange={(e) => setTotalParcelas(Number(e.target.value))}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 24].map((n) => (
                    <option key={n} value={n}>
                      {n}x
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-400">
                  Data da primeira parcela
                  <span className="ml-1 text-xs text-slate-500">(se diferente da data da compra)</span>
                </label>
                <input
                  type="date"
                  value={primeiraParcelaEm}
                  onChange={(e) => setPrimeiraParcelaEm(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {valorParcelaPreview > 0 && (
                <div className="rounded-lg border border-emerald-800 bg-emerald-950/50 p-3">
                  <p className="text-sm text-emerald-300">
                    {totalParcelas}x de{' '}
                    <span className="font-semibold">{formatarMoeda(valorParcelaPreview)}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Total: {formatarMoeda(parseValorMonetario(valorTotal))}
                  </p>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Observação</label>
            <textarea
              placeholder="Opcional"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={2}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <button
            onClick={salvarTransacao}
            disabled={salvando}
            className="mt-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Salvar'}
          </button>

          {editando && (
            <button
              onClick={() => {
                setEditando(null)
                setDescricao('')
                setValorTotal('')
                setCategoriaUuid(null)
                setDataCompra('')
                setFormaPagamento('pix')
                setTotalParcelas(2)
                setPrimeiraParcelaEm('')
                setObservacao('')
              }}
              className="rounded-lg bg-slate-700 px-4 py-2.5 font-semibold text-slate-200 hover:bg-slate-600 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-100">Histórico</h3>
          <div className="flex gap-2">
            <select
              value={filtroMes}
              onChange={(e) => setFiltroMes(Number(e.target.value))}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            >
              {meses.map((nome, i) => (
                <option key={i} value={i + 1}>
                  {nome}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={filtroAno}
              onChange={(e) => setFiltroAno(Number(e.target.value))}
              className="w-24 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          {transacoes.length === 0 ? (
            <p className="text-slate-500 py-8 text-center">
              Nenhuma transação neste período.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {transacoes.map((t) => (
                <li
                  key={t.uuid} // <-- mudou
                  className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-slate-100 font-medium">{t.descricao}</span>
                    <span className="text-xs text-slate-400">
                      {categorias.find((c) => c.uuid === t.categoria_uuid)?.nome || '—'} {/* <-- mudou */}
                      {t.parcelado && ` · ${t.numero_parcela}/${t.total_parcelas}`}
                      {t.pago && ' · Pago'}
                      {t.observacao && ` · ${t.observacao}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-100 font-semibold">
                      {formatarMoeda(t.valor)}
                    </span>
                    <button
                      onClick={() => iniciarEdicao(t)}
                      className="rounded-lg bg-blue-600/20 px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-600/30 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirTransacao(t)}
                      className="rounded-lg bg-red-600/20 px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-600/30 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppLayout>
  )
}