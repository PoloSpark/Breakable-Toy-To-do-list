import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';
import TodoForm from './TodoForm';

const API_URL = 'http://localhost:9090/todos';

const NewTodoDialog = ({ onClose, onRefresh }: { onClose: any, onRefresh: any }) => {

  
  const handleSubmit = (data: { text: string, priority: string, dueDate?: string | null }) => {
    // POST request to create a new todo
    axios
      .post(API_URL, {
        text: data.text,
        priority: data.priority,
        dueDate: data.dueDate || null,
      })
      .then(() => {
        onRefresh(); // Refresh the todo list
        onClose(); // Close the dialog
      })
      .catch((error) => {
        console.error('Failed to create todo', error);
      });
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New To-Do</DialogTitle>
      <DialogContent>
        <TodoForm onSubmit={handleSubmit} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default NewTodoDialog;
