import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';
import TodoForm from './TodoForm';
import { API_URL, Task } from './TodoListApp';

interface IProps {
  todo: Task;
  onClose: () => void;
  onRefresh: () => void;
}

const EditTodoDialog = ({ todo, onClose, onRefresh }: IProps) => {
  const handleSubmit = (data: Task) => {
    // PUT request to update the existing todo
    //console.log('data', data);
    axios
      .put(`${API_URL}/${todo.id}`, {
        text: data.text,
        priority: data.priority,
        dueDate: data.dueDate,
      })
      .then(() => {
        onRefresh(); // Refresh the todo list
        onClose(); // Close the dialog
      })
      .catch((error) => {
        console.error('Failed to update todo', error);
      });
  };

  return (
    <Dialog open={true} onClose={() => onClose()} fullWidth maxWidth="sm">
      <DialogTitle>Edit To-Do</DialogTitle>
      <DialogContent>
        <TodoForm todo={todo} onSubmit={handleSubmit} onClose={() => onClose()} />
      </DialogContent>
    </Dialog>
  );
};

export default EditTodoDialog;
