import React from 'react'

const TarefaInfo = ({tarefas, isOnline}) => {
  const statusEstilo = {
    color: isOnline ? 'green' : 'red',
    fontWeight: 'bold',
  }

  return (
   <div
      style={{
        border: '2px solid #ccc',
        borderRadius: '10px',
        padding: '1em',
        marginBottom: '1em',
        background: '#fafafa',
      }}
    >
           <p>🧾 Total tarefas renderizadas: {tarefas.length}</p>
           <p>Última: {tarefas[tarefas.length - 1]?.descricao}</p>
           <p>
        🌐 Status: <span style={statusEstilo}>{isOnline ? <img src="/online.gif" className='status-icone'/> : <img src="/offline.gif" className='status-icone' />}</span>
      </p>
    </div>
  )
}

export default TarefaInfo