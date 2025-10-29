import React, { useState } from 'react'


const FormTarefa = ({onSave,onAddLocal,salvarTarefa }) => {
  const [tarefa, setTarefa] = useState('')
  const [status, setStatus] = useState('')

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
// 🔹 Atualiza imediatamente a tela
     if (onAddLocal){      
       onAddLocal(novaTarefa)
     }
      setStatus('✅ Tarefa salva com sucesso (local ou online)');
      setTarefa('');

    try {
      await salvarTarefa(novaTarefa)
     if (navigator.onLine && onSave) {
      await onSave() // recarrega do servidor após sincronizar
    }    
      // if(onSave) onSave();
      
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
