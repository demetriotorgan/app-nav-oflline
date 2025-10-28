import { useEffect } from 'react'
import axios from 'axios'
import { listarLocal, removerLocal } from '../services/db'

export default function useSync() {
  useEffect(() => {
    async function sync() {
      // Só executa se estiver online
      if (!navigator.onLine) return

      try {
        const pendentes = await listarLocal()
        if (pendentes.length === 0) {
          console.log('📭 Nenhuma tarefa pendente para sincronizar.')
          return
        }

        console.log(`🔄 Sincronizando ${pendentes.length} tarefas pendentes...`)

        for (const item of pendentes) {
          try {
            // Payload compatível com o backend
            const payload = {
              descricao: item.descricao, // campo exigido pelo backend
              data: item.data || new Date().toISOString(), // fallback caso falte data
            }

            const response = await axios.post(
              'https://api-navigator.vercel.app/salvar-tarefa',
              payload
            )

            if (response.status === 201) {
              await removerLocal(item.id)
              console.log(`✅ Tarefa sincronizada: ${item.descricao}`)
            } else {
              console.warn(`⚠️ Tarefa ${item.id} não sincronizada (status: ${response.status})`)
            }
          } catch (erro) {
            console.error(`❌ Erro ao sincronizar tarefa ${item.id}:`, erro.message)
          }
        }

        console.log('🎉 Sincronização concluída.')
      } catch (erro) {
        console.error('❌ Erro geral durante sincronização:', erro.message)
      }
    }

    // dispara sincronização ao voltar online
    window.addEventListener('online', sync)

    // tenta sincronizar assim que o app carrega (caso já esteja online)
    sync()

    return () => window.removeEventListener('online', sync)
  }, [])
}
