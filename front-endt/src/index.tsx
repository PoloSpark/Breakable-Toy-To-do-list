import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import TodoList from '../../front-end/todo-list/src/comps/TodoList'


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <TodoList />
  </React.StrictMode>
);
