import './App.css'
import useSync from './hooks/useSync'
import FormTarefa from './components/FormTarefa'
import useTarefas from './hooks/useTarefas'
import { useEffect } from 'react';


function App() {
const { tarefas,setTarefas, carregarTarefas, carregando, erro } = useTarefas();
const { salvarTarefa, isOnline } = useSync();

useEffect(() => {
  const atualizarTarefas = async () => {
    console.log('🔄 Recarregando tarefas após sincronização...')
    await carregarTarefas();    
  }
  window.addEventListener('tarefas-sincronizadas', atualizarTarefas)
  return () => {
    window.removeEventListener('tarefas-sincronizadas', atualizarTarefas)
  }
}, [carregarTarefas]);


useEffect(() => {
  const handleNovaTarefaLocal = (e) => {
    const nova = e.detail    
    setTarefas(prev => {
  const atualizado = [...prev, { ...nova }]  
  return atualizado
})
  }
  window.addEventListener('nova-tarefa-local', handleNovaTarefaLocal)
  return () => window.removeEventListener('nova-tarefa-local', handleNovaTarefaLocal)
}, []);

  return (
    <div>
      <h1>App Navegator</h1>
      <FormTarefa
      onSave = {carregarTarefas} 
       onAddLocal={(novaTarefa) => setTarefas(prev => [novaTarefa, ...prev])}
      salvarTarefa={salvarTarefa}
      />
      <div style={{ border: '2px solid red', padding: '1em', marginBottom: '1em' }}>
      <p>🧾 Total tarefas renderizadas: {tarefas.length}</p>
      <p>Última: {tarefas[tarefas.length - 1]?.descricao}</p>
    </div>
  {Array.isArray(tarefas) && tarefas.length > 0 ? (
    tarefas.map((tarefa, index) => (
      <div
        key={index}
        className='card-tarefa'      
      >
        <p>#{index + 1} — {tarefa.descricao}</p>
        <small>{tarefa.data}</small>
      </div>
    ))
  ) : (
    <p>📭 Nenhuma tarefa para exibir.</p>
  )}
  </div>
  )
}

export default App
