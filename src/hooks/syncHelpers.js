import axios from 'axios'
import { listarLocal, removerLocal, salvarLocal } from '../services/db'

const API_URL = 'https://api-navigator.vercel.app/salvar-tarefa'

// Cria payload padrão de tarefa
export const criarPayload = (tarefa) => ({
  descricao: tarefa.descricao,
  data: tarefa.data || new Date().toISOString(),
})

// Sincroniza um item do local para o servidor
export const syncItem = async (item) => {
  if (!item.descricao || typeof item.descricao !== 'string' || item.descricao.trim() === '') {
    console.warn('⚠️ Ignorando tarefa inválida localmente armazenada:', item)
    await removerLocal(item.id)
    return
  }

  const payload = criarPayload(item)
  try {
    const res = await axios.post(API_URL, payload)
    if (res.status === 201) {
      await removerLocal(item.id || item._id || item.descricao)
      console.log(`✅ Tarefa sincronizada: ${item.descricao}`)
    } else {
      console.warn(`⚠️ Tarefa ${item.id} não sincronizada (status ${res.status})`)
    }
  } catch (erro) {
    console.error(`❌ Erro ao sincronizar tarefa ${item.id}:`, erro.message)
  }
}

// Salva tarefa localmente (modo offline)
export const salvarOffline = async (payload) => {
  console.log('📴 Offline — salvando tarefa localmente...')
  await salvarLocal(payload)
  window.dispatchEvent(new CustomEvent('nova-tarefa-local', { detail: payload }))
}

// Salva tarefa online (modo online), chamando sync para pendentes
export const salvarOnline = async (payload, sync) => {
  try {
    const res = await axios.post(API_URL, payload)
    if (res.status === 201) {
      console.log('✅ Tarefa salva diretamente no servidor!')
    } else {
      console.warn('⚠️ Resposta inesperada do servidor:', res.status)
    }
    await sync()
  } catch (erro) {
    console.error('⚠️ Falha ao salvar online, salvando localmente...', erro.message)
    await salvarOffline(payload)
  }
}

// Lista todas as tarefas pendentes e retorna
export const listarPendentes = async () => {
  const pendentes = await listarLocal()
  return pendentes || []
}
