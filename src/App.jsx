import './App.css'
import useSync from './hooks/useSync'
import FormTarefa from './components/FormTarefa'
import useTarefas from './hooks/useTarefas'

function App() {
const { tarefas, carregarTarefas, carregando, erro } = useTarefas();
useSync() //ativa sincronização

  return (
    <div>
      <h1>App Navegator</h1>
      <FormTarefa
      onSave = {carregarTarefas} 
      />
      {tarefas.length > 0 ? 
      tarefas.map((tarefa, index)=>(
        <div key={index} className='card-tarefa'>
          <p>{tarefa.descricao}</p>
          <small>{tarefa.data}</small>
        </div> 
      ))      
      : (<p>Sem Tarefas para exibir</p>)}
    </div>
  )
}

export default App
