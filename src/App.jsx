import './App.css'
import useSync from './hooks/useSync'
import FormTarefa from './components/FormTarefa'


function App() {
  useSync() //ativa sincronização

  return (
    <div>
      <h1>App Navegator</h1>
      <FormTarefa />
      <p>Este app funciona offline e sincroniza automaticamente quando estiver online.</p>
    </div>
  )
}

export default App
