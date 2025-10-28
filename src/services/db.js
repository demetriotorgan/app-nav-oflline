import { openDB } from 'idb'

export async function getDB() {
  return openDB('meu_app_db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('agendamentos')) {
        db.createObjectStore('agendamentos', { keyPath: 'id', autoIncrement: true })
      }
    },
  })
}

export async function salvarLocal(data) {
  const db = await getDB()
  await db.put('agendamentos', data)
}

export async function listarLocal() {
  const db = await getDB()
  return await db.getAll('agendamentos')
}

export async function removerLocal(id) {
  const db = await getDB()
  await db.delete('agendamentos', id)
}
