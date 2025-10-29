import { useEffect, useCallback, useState } from 'react'
import { syncItem, salvarOffline, salvarOnline, listarPendentes, criarPayload } from './syncHelpers'

export default function useSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const sync = useCallback(async () => {    
    if (!navigator.onLine) return

    try {
      const pendentes = await listarPendentes()
      if (!pendentes.length) {
        console.log('📭 Nenhuma tarefa pendente para sincronizar.')
        return
      }

      console.log(`🔄 Sincronizando ${pendentes.length} tarefas pendentes...`)
      for (const item of pendentes) {
        await syncItem(item)
      }
      console.log('🎉 Sincronização concluída.')
      window.dispatchEvent(new Event('tarefas-sincronizadas'))
    } catch (erro) {
      console.error('❌ Erro geral durante sincronização:', erro.message)
    }
  }, [])

  const salvarTarefa = useCallback(
    async (novaTarefa) => {
      const payload = criarPayload(novaTarefa)
      if (navigator.onLine) {
        await salvarOnline(payload, sync)
      } else {
        await salvarOffline(payload)
      }
    },
    [sync]
  )

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    window.addEventListener('online', sync)
    sync() // tenta sincronizar logo que o app carrega
    return () => {
      window.removeEventListener('online', sync)
      
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [sync])

  return { salvarTarefa, isOnline }
}
