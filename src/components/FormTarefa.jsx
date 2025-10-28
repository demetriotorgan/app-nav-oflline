import React, { useState } from 'react'
import useSync from '../hooks/useSync'

const FormTarefa = () => {
  const [tarefa, setTarefa] = useState('')
  const [status, setStatus] = useState('')
  const { salvarTarefa } = useSync()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!tarefa.trim()) {
      setStatus('Digite uma tarefa antes de salvar')
      return
    }

    const novaTarefa = {
      descricao: tarefa.trim(),
      data: new Date().toISOString(),
    }

    try {
      await salvarTarefa(novaTarefa)
      setStatus('✅ Tarefa salva com sucesso (local ou online)')
      setTarefa('')
    } catch (erro) {
      console.error('Erro ao salvar tarefa:', erro)
      setStatus('❌ Erro ao salvar tarefa.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Adicionar Tarefa</h2>

      <input
        type="text"
        placeholder="Digite uma tarefa..."
        value={tarefa}
        onChange={(e) => setTarefa(e.target.value)}
      />

      <button type="submit">Salvar</button>

      {status && <p>{status}</p>}
    </form>
  )
}

export default FormTarefa
