import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';

interface Todo {
  id?: number;
  text: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
}

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (data: Todo) => void;
  onClose: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo = {} as Todo, onSubmit, onClose }) => {
  const [formValues, setFormValues] = useState<Todo>({
    text: todo.text || '',
    priority: todo.priority || 'LOW',
    dueDate: todo.dueDate || '',
  });

  useEffect(() => {
    if (todo) {
      setFormValues({
        text: todo.text || '',
        priority: todo.priority || 'LOW',
        dueDate: todo.dueDate || '',
      });
    }
  }, [todo]);

  const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
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
          onChange={() => handleChange}
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
