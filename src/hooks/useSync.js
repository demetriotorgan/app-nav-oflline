import { useEffect, useCallback } from 'react'
import axios from 'axios'
import { listarLocal, removerLocal, salvarLocal } from '../services/db'

export default function useSync() {
  // Função de sincronização — envia pendentes para o servidor
  const sync = useCallback(async () => {
    if (!navigator.onLine) return

    try {
      const pendentes = await listarLocal()
      if (pendentes.length === 0) {
        console.log('📭 Nenhuma tarefa pendente para sincronizar.')
        return
      }

      console.log(`🔄 Sincronizando ${pendentes.length} tarefas pendentes...`)

      for (const item of pendentes) {
        const payload = {
          descricao: item.descricao,
          data: item.data || new Date().toISOString(),
        }

        try {
          const response = await axios.post(
            'https://api-navigator.vercel.app/salvar-tarefa',
            payload
          )

          if (response.status === 201) {
            await removerLocal(item.id)
            console.log(`✅ Tarefa sincronizada: ${item.descricao}`)
          } else {
            console.warn(`⚠️ Tarefa ${item.id} não sincronizada (status ${response.status})`)
          }
        } catch (erro) {
          console.error(`❌ Erro ao sincronizar tarefa ${item.id}:`, erro.message)
        }
      }

      console.log('🎉 Sincronização concluída.')
    } catch (erro) {
      console.error('❌ Erro geral durante sincronização:', erro.message)
    }
  }, [])

  // Função para salvar uma nova tarefa
  const salvarTarefa = useCallback(
    async (novaTarefa) => {
      const payload = {
        descricao: novaTarefa.descricao,
        data: novaTarefa.data || new Date().toISOString(),
      }

      if (navigator.onLine) {
        try {
          const response = await axios.post(
            'https://api-navigator.vercel.app/salvar-tarefa',
            payload
          )
          if (response.status === 201) {
            console.log('✅ Tarefa salva diretamente no servidor!')
          } else {
            console.warn('⚠️ Resposta inesperada do servidor:', response.status)
          }

          // mesmo online, pode tentar limpar pendentes antigos
          await sync()
        } catch (erro) {
          console.error('⚠️ Falha ao salvar online, salvando localmente...', erro.message)
          await salvarLocal(payload)
        }
      } else {
        console.log('📴 Offline — salvando tarefa localmente...')
        await salvarLocal(payload)
      }
    },
    [sync]
  )

  // Quando voltar online, sincroniza automaticamente
  useEffect(() => {
    window.addEventListener('online', sync)
    sync() // tenta sincronizar logo que o app carrega
    return () => window.removeEventListener('online', sync)
  }, [sync])

  // Retorna a função de salvar para ser usada em qualquer componente
  return { salvarTarefa }
}
