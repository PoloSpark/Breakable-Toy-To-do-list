import './App.css';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FormControl, InputLabel, Select, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TableSortLabel } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const priorityValues = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

function App() {
  const [open, setOpen] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [todos, setTodos] = useState([]);
  const [renderer, setRenderer] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Name')

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    axios.post('http://localhost:8080/todos', {
      text: activityName,
      dueDate: dueDate,
      priority: priority,
    }).catch(function (error) {
      console.log(error);
    });
    setOpen(false);
    setRenderer(true)
  };

  const handleSearch = () => {
    console.log(name, priority, status);
  };

  const toggleDone = (id, currentStatus) => {
    if (currentStatus === true) {
      axios.put(`http://localhost:8080/todos/${id}/undone`, { done: !currentStatus })
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.map(todo =>
              todo.id === id ? { ...todo, done: !currentStatus } : todo
            )
          );
        })
        .catch((error) => console.error('Error updating status:', error));
    }
    axios.post(`http://localhost:8080/todos/${id}/done`, { done: !currentStatus })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, done: !currentStatus } : todo
          )
        );
      })
      .catch((error) => console.error('Error updating status:', error));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:8080/todos/${id}/delete`)
          .catch((error) => console.error('Error deleting todo:', error));
      }
    });
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedTodos = [...todos].sort((a, b) => {
      let comparison = 0;

      if (property === 'priority') {
        comparison = priorityValues[b[property]] - priorityValues[a[property]];
      } else if (property === 'dueDate') {
        comparison = a[property].localeCompare(b[property]);
      } else {
        comparison = (a[property] < b[property]) ? -1 : 1;
      }

      return isAsc ? comparison : -comparison;
    });

    setTodos(sortedTodos);
  };

  
  useEffect(() => {
    axios.get('http://localhost:8080/todos')
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/todos')
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      setRenderer(false)
  }, [renderer]);

  return (
    <div className='App-header'>
      <div className='grid-container'>
        <div className='grid-filter'>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Nombre"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FormControl variant="outlined" sx={{ width: 150 }}>
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                label="Prioridad"
              >
                <MenuItem value=""><em>Ninguno</em></MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ width: 150 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Estado"
              >
                <MenuItem value=""><em>Todos</em></MenuItem>
                <MenuItem value="done">Done</MenuItem>
                <MenuItem value="undone">Undone</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </Box>
        </div>
        <div className='grid-item'>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            + New To Do
          </Button>
        </div>
        <div className='grid-table'>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Done</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell><TableSortLabel active={orderBy === 'priority'} direction={orderBy === priority ? order : 'asc'} onClick={() => handleSortRequest('priority')}>Priority</TableSortLabel></TableCell>
                  <TableCell><TableSortLabel active={orderBy === 'dueDate'} direction={orderBy === dueDate ? order: 'asc'} onClick={() => handleSortRequest('dueDate')}>Due Date</TableSortLabel></TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todos.map((todo) => (
                  <TableRow key={todo.id}>
                    <TableCell>
                      <Checkbox
                        checked={todo.done}
                        onChange={() => toggleDone(todo.id, todo.done)}
                      />
                    </TableCell>
                    <TableCell>{todo.text}</TableCell>
                    <TableCell>{todo.priority}</TableCell>
                    <TableCell>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Edit />}
                        onClick={() => { }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(todo.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Add a new To-Do"}</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              autoFocus
              margin="dense"
              label="Activity Name"
              fullWidth
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              required
            />
            <TextField
              select
              margin="dense"
              label="Priority"
              fullWidth
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <MenuItem value="LOW">LOW</MenuItem>
              <MenuItem value="MEDIUM">MEDIUM</MenuItem>
              <MenuItem value="HIGH">HIGH</MenuItem>
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                value={dueDate}
                onChange={(newValue) => setDueDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
              />
            </LocalizationProvider>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;