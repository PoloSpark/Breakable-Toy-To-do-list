import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';
import TodoForm from './TodoForm';
import { ITodo } from './TodoList';

const API_URL = 'http://localhost:9090/todos';

interface IProps {
  todo: ITodo;
  onClose: (todo: ITodo | null) => void;
  onRefresh: (todo: ITodo | null) => void;
}

const EditTodoDialog = ({ todo, onClose, onRefresh }: IProps) => {
  const handleSubmit = (data: ITodo) => {
    // PUT request to update the existing todo
    axios
      .put(`${API_URL}/${todo.id}`, {
        text: data.text,
        priority: data.priority,
        dueDate: data.dueDate || null,
      })
      .then(() => {
        onRefresh(todo); // Refresh the todo list
        onClose(todo); // Close the dialog
      })
      .catch((error) => {
        console.error('Failed to update todo', error);
      });
  };

  return (
    <Dialog open={true} onClose={() => onClose(todo)} fullWidth maxWidth="sm">
      <DialogTitle>Edit To-Do</DialogTitle>
      <DialogContent>
        <TodoForm todo={todo} onSubmit={() => handleSubmit(todo)} onClose={() => onClose(todo)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditTodoDialog;
