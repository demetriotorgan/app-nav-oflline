// src/hooks/useTarefas.js
import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'

export default function useTarefas() {
  const [tarefas, setTarefas] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  // 🔄 Função para carregar tarefas do servidor
const carregarTarefas = useCallback(async () => {
  try {
    setCarregando(true)
    setErro(null)
    const response = await axios.get('https://api-navigator.vercel.app/listar-tarefas')
    const data = response.data

    // 🔎 Remove duplicatas por descricao + data
    const unicos = []
    const seen = new Set()

    for (const t of data) {
      const key = `${t.descricao}-${t.data}`
      if (!seen.has(key)) {
        seen.add(key)
        unicos.push(t)
      }
    }
    setTarefas(unicos)
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error.message)
    setErro(error)
  } finally {
    setCarregando(false)
  }
}, []);

  // 🔁 Carrega automaticamente ao montar o componente
  useEffect(() => {
    carregarTarefas();
  }, [carregarTarefas])

  // Retorna tudo que o App precisa
  return { tarefas, setTarefas, carregarTarefas, carregando, erro }
}
