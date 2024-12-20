import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box, SelectChangeEvent } from '@mui/material';
import { Task } from './TodoListApp';

interface TodoFormProps {
  todo?: Task;
  onSubmit: (data: Task) => void;
  onClose: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo = {} as Task, onSubmit, onClose }) => {
  const [formValues, setFormValues] = useState<Task>({
    id: todo.id || '',
    text: todo.text || '',
    priority: todo.priority || 'LOW',
    done: todo.done || false,
    doneDate: todo.doneDate || '',
    dueDate: todo.dueDate || '',
    creationDate: todo.creationDate || '',
  });

  const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name!]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Task Name"
        name="text"
        value={formValues.text}
        onChange={handleChange}
        required
      />
      <FormControl>
        <InputLabel>Priority</InputLabel>
        <Select
          name="priority"
          value={formValues.priority}
          onChange={handleChange}
          required
        >
          <MenuItem value="LOW">LOW</MenuItem>
          <MenuItem value="MEDIUM">MEDIUM</MenuItem>
          <MenuItem value="HIGH">HIGH</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Due Date"
        type="date"
        name="dueDate"
        value={formValues.dueDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        required
      />
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default TodoForm;
