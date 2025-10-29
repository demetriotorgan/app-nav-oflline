import React from 'react';

export default function ListaTarefas({ tarefas }) {
  if (!Array.isArray(tarefas) || tarefas.length === 0) {
    return <p>📭 Nenhuma tarefa para exibir.</p>;
  }

  return (
    <div>
      {tarefas.map((tarefa, index) => (
        <div key={`${tarefa.data || index}-${index}`} className='card-tarefa'>
          <p>#{index + 1} — {tarefa.descricao}</p>
          <small>{tarefa.data}</small>
        </div>
      ))}
    </div>
  );
}
