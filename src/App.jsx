import './App.css'
import FormTarefa from './components/FormTarefa'
import ListaTarefas from './components/ListarTarefas';
import useTarefas from './hooks/useTarefas'
import useSync from './hooks/useSync'
import useEventListener from './hooks/useEventListener';
import TarefaInfo from './components/TarefaInfo';

function App() {
const { tarefas, setTarefas, carregarTarefas, carregando, erro } = useTarefas();
const { salvarTarefa, isOnline } = useSync();

 // Função para adicionar tarefa localmente (topo da lista)
  const adicionarTarefaLocal = (nova) => {
    setTarefas(prev => [nova, ...prev]);
  };

  // Listener para tarefas sincronizadas do servidor
  useEventListener('tarefas-sincronizadas', async () => {
    console.log('🔄 Recarregando tarefas após sincronização...');
    await carregarTarefas();
  });

// Listener para novas tarefas adicionadas offline
  useEventListener('nova-tarefa-local', (e) => {
    adicionarTarefaLocal(e.detail);
  });

 return (
    <div>
      <h1>App Navegator</h1>
      <FormTarefa
        onSave={carregarTarefas}        
        salvarTarefa={salvarTarefa}
      />      
      <TarefaInfo 
        tarefas={tarefas}  
        isOnline={isOnline}       
      />
      <ListaTarefas tarefas={tarefas} />
    </div>
  );
}

export default App
