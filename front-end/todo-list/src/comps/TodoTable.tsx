import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
} from '@mui/material';
import { ITodo } from './TodoList';

interface IProps {
  todos: ITodo[];
  onEdit: React.Dispatch<React.SetStateAction<ITodo | null>> // (todo: ITodo | null) => void;
  onDelete: (id: number) => void;
  onStatusToggle: (id: number, done: boolean) => void;
}

const TodoTable = ({ todos, onEdit, onDelete, onStatusToggle }: IProps) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Done</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Priority</TableCell>
          <TableCell>Due Date</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {todos.map((todo) => (
          <TableRow key={todo.id}>
            <TableCell>
              <Checkbox
                checked={todo.done}
                onChange={() => onStatusToggle(todo.id, todo.done)}
              />
            </TableCell>
            <TableCell>{todo.text}</TableCell>
            <TableCell>{todo.priority}</TableCell>
            <TableCell>
              {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '-'}
            </TableCell>
            <TableCell>
              <Button onClick={() => onEdit(todo)}>Edit</Button>
              <Button color="error" onClick={() => onDelete(todo.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default TodoTable;
