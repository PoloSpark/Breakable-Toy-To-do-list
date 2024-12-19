import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import HeaderFilters from './HeaderFilters';
import TodoTable from './TodoTable';
import NewTodoDialog from './NewTodoDialog';
import EditTodoDialog from './EditTodoDialog';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:9090/todos';

export interface ITodo{
  id: number;
  text: string; 
  priority: "HIGH" | "MEDIUM" | "LOW"; 
  done: boolean;
  dueDate: string;
}

export interface Filter {
  name?: string;
  priority?: string;
  status?: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<ITodo[]>([]);
  const [filters, setFilters] = useState<Filter>({ name: '', priority: '', status: '' });
  const [editTodo, setEditTodo] = useState<ITodo | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchTodos = () => {
    axios.get(`${API_URL}?size=100`).then((res) => {
      setTodos(res.data);
      setFilteredTodos(res.data);
    });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDelete = (id: number): void => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`${API_URL}/${id}/delete`).then(fetchTodos);
      }
    });
  };

  const handleFilter = (newFilters: { name: string, priority: string, status: string }): void => {
    const filtered: ITodo[] = todos.filter((todo: ITodo) => {
      const nameMatch: boolean = !newFilters.name || todo.text.includes(newFilters.name);
      const priorityMatch: boolean = !newFilters.priority || todo.priority === newFilters.priority;
      const statusMatch: boolean =
        newFilters.status === ''
          ? true
          : newFilters.status === 'true'
          ? todo.done
          : !todo.done;
      return nameMatch && priorityMatch && statusMatch;
    });
    setFilters(newFilters);
    setFilteredTodos(filtered);
  };

  return (
    <div>
      <HeaderFilters filters={filters} onFilterChange={handleFilter} />
      <Box marginTop={2}>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          + New To Do
        </Button>
      </Box>
      <TodoTable
        todos={filteredTodos}
        onEdit={setEditTodo}
        onDelete={handleDelete}
        onStatusToggle={(id: number, done: boolean) =>
          axios.put(`${API_URL}/${id}/${done ? 'undone' : 'done'}`).then(fetchTodos)
        }
      />
      {openDialog && <NewTodoDialog onClose={() => setOpenDialog(false)} onRefresh={fetchTodos} />}
      {editTodo && (
        <EditTodoDialog
          todo={editTodo}
          onClose={() => setEditTodo(null)}
          onRefresh={fetchTodos}
        />
      )}
    </div>
  );
};

export default TodoList;
