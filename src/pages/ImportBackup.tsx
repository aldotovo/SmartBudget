
import { useState } from 'react'
import { db } from '../database/db'
import type { Transaction } from '../types/transaction'
import type { Category } from '../types/category'
import type { Meta } from '../types/meta'
import { useUser } from '../contexts/UserContext'

interface BackupData {
  exportado_em: string
  usuario?: string
  residencia?: string
  total_transacoes: number
  total_categorias: number
  dados: {
    transactions: Transaction[]
    categories: Category[]
    metas: Meta[]
  }
}

export function ImportBackupPage() {
  const { userUuid } = useUser()
  const [status, setStatus] = useState<'idle' | 'preview' | 'importing' | 'done' | 'error'>('idle')
  const [preview, setPreview] = useState<BackupData | null>(null)
  const [message, setMessage] = useState('')

  // Lê arquivo selecionado
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data: BackupData = JSON.parse(event.target?.result as string)

        // Valida estrutura mínima
        if (!data.dados || !data.dados.transactions) {
          throw new Error('Arquivo inválido')
        }

        setPreview(data)
        setStatus('preview')
        setMessage('')
      } catch {
        setStatus('error')
        setMessage('Arquivo inválido. Selecione um backup do SmartBudget.')
      }
    }

    reader.readAsText(file)
  }

  // Executa importação (PRESERVANDO UUIDs)
  async function handleImport() {
    if (!preview) return

    setStatus('importing')

    try {
      const agora = new Date().toISOString()

      // 1. Importa categorias (preservando UUID)
      for (const cat of preview.dados.categories) {
        // Se a categoria não tiver uuid, gera um (backward compatibility)
        const uuid = cat.uuid || crypto.randomUUID()

        // Verifica se já existe pelo UUID
        const exists = await db.categories.get(uuid)
        if (!exists) {
          await db.categories.add({
            uuid,
            nome: cat.nome,
            tipo: cat.tipo || '',
            cor: cat.cor || '',
            icone: cat.icone || '',
            criado_em: cat.criado_em || agora,
            updated_at: agora,
          })
        } else {
          // Se já existe, atualiza (upsert)
          await db.categories.update(uuid, {
            nome: cat.nome,
            tipo: cat.tipo || '',
            cor: cat.cor || '',
            icone: cat.icone || '',
            updated_at: agora,
          })
        }
      }

      // 2. Importa transações (PRESERVANDO UUID)
      for (const tx of preview.dados.transactions) {
        // Garante que tem uuid
        const uuid = tx.uuid || crypto.randomUUID()

        // Verifica se já existe pelo UUID
        const exists = await db.transactions.get(uuid)
        if (!exists) {
          // Insere com o UUID original
          await db.transactions.add({
            ...tx,
            uuid,
            sync_status: 'pending', // Marca como pendente para enviar à nuvem
            criado_em: tx.criado_em || agora,
            updated_at: agora,
          })
        } else {
          // Se já existe, atualiza (preservando dados)
          await db.transactions.update(uuid, {
            ...tx,
            updated_at: agora,
          })
        }
      }

      // 3. Importa metas (PRESERVANDO UUID)
      for (const meta of preview.dados.metas) {
        const uuid = meta.uuid || crypto.randomUUID()

        // Verifica se já existe pelo UUID ou competência
        const exists = await db.metas.get(uuid)
        const existsByCompetencia = await db.metas.where('competencia').equals(meta.competencia).first()

        if (!exists && !existsByCompetencia) {
          await db.metas.add({
            uuid,
            user_uuid: userUuid,
            competencia: meta.competencia,
            valor: meta.valor,
            criado_em: meta.criado_em || agora,
            updated_at: agora,
          })
        } else if (exists) {
          // Atualiza pelo UUID
          await db.metas.update(uuid, {
            competencia: meta.competencia,
            valor: meta.valor,
            updated_at: agora,
          })
        }
        // Se existe por competência mas não por UUID, atualiza o UUID
        else if (existsByCompetencia && !exists) {
          await db.metas.update(existsByCompetencia.uuid, {
            competencia: meta.competencia,
            valor: meta.valor,
            updated_at: agora,
          })
        }
      }

      setStatus('done')
      setMessage(
        `Importado: ${preview.dados.transactions.length} transações, ${preview.dados.categories.length} categorias.`
      )
    } catch (error) {
      console.error('Erro na importação:', error)
      setStatus('error')
      setMessage('Erro ao importar. Tente novamente.')
    }
  }

  function handleReset() {
    setStatus('idle')
    setPreview(null)
    setMessage('')
  }

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="text-2xl font-bold text-slate-100 mb-2">Importar Backup</h2>
      <p className="text-sm text-slate-400 mb-6">
        Importe um arquivo JSON exportado do SmartBudget para visualizar os dados neste dispositivo.
      </p>

      {/* Estado inicial: selecionar arquivo */}
      {status === 'idle' && (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
          <p className="text-slate-400 mb-4">
            Selecione o arquivo de backup (.json)
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="block mx-auto text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:font-medium hover:file:bg-emerald-500 file:transition-colors file:cursor-pointer"
          />
        </div>
      )}

      {/* Preview do backup */}
      {status === 'preview' && preview && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Pré-visualização</h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Exportado em:</span>
              <span className="text-slate-200">
                {new Date(preview.exportado_em).toLocaleDateString('pt-BR')}
              </span>
            </div>
            {preview.residencia && (
              <div className="flex justify-between">
                <span className="text-slate-400">Residência:</span>
                <span className="text-slate-200">{preview.residencia}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Transações:</span>
              <span className="text-slate-200">{preview.total_transacoes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Categorias:</span>
              <span className="text-slate-200">{preview.total_categorias}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleImport}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-500 transition-colors"
            >
              Importar
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg bg-slate-700 px-4 py-2.5 text-slate-200 hover:bg-slate-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Importando */}
      {status === 'importing' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">Importando dados...</p>
        </div>
      )}

      {/* Concluído */}
      {status === 'done' && (
        <div className="rounded-2xl border border-emerald-800 bg-emerald-950/30 p-8 text-center">
          <p className="text-emerald-400 text-lg font-semibold mb-2">Importação concluída</p>
          <p className="text-slate-400 text-sm mb-4">{message}</p>
          <button
            onClick={handleReset}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            Importar outro
          </button>
        </div>
      )}

      {/* Erro */}
      {status === 'error' && (
        <div className="rounded-2xl border border-red-800 bg-red-950/30 p-8 text-center">
          <p className="text-red-400 text-lg font-semibold mb-2">Erro</p>
          <p className="text-slate-400 text-sm mb-4">{message}</p>
          <button
            onClick={handleReset}
            className="rounded-lg bg-slate-700 px-4 py-2.5 text-slate-200 hover:bg-slate-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  )
}