import './App.css'
import useSync from './hooks/useSync'
import FormTarefa from './components/FormTarefa'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios';

function App() {
const [tarefas, setTarefas] = useState([]);

const carregarTarefas = useCallback(async()=>{
  try {
  const response = await axios.get('https://api-navigator.vercel.app/listar-tarefas');
  setTarefas(response.data);
  // console.log(response.data);  
  } catch (error) {
   console.error('Erro ao carregar tarefas:', erro.message); 
  }  
},[]);

useEffect(()=>{
carregarTarefas();
},[carregarTarefas]);

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
