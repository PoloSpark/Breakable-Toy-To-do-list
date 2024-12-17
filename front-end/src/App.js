import './App.css';
import React, { useState, useEffect, useReducer } from 'react';
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
import { FormControl, InputLabel, Select, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TableSortLabel, TablePagination, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useStore } from './store';

const priorityValues = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

const initalState = {
  activityName: '',
  priority: '',
  dueDate: null,
}

const newTaskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVITY_NAME':
      return { ...state, activityName: action.payload };
    case 'SET_PRIORITY':
      return { ...state, priority: action.payload };
    case 'SET_DUE_DATE':
      return { ...state, dueDate: action.payload };
    case 'RESET':
      return initalState;
    default:
      return state;
  }
};

function App() {
  // utilizan zustand para compartir el estado global
  const { open, edit, setOpen, setEdit } = useStore();

  // utilizan useReducer para manejar el estado de la nueva tarea
  const [newTaskState, dispatch] = useReducer(newTaskReducer, initalState);
  const { activityName, priority, dueDate } = newTaskState;

  // utilizan useState para manejar el estado de la lista de tareas
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [todos, setTodos] = useState([]);
  const [renderer, setRenderer] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Name');
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const paginatedData = todos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const [editId, setEditId] = useState("");

  console.log({page});

  const handleEditOpen = (id, text, priority, dueDate) => {
    // setActivityName(text);
    // setPriority(priority);
    // setDueDate(dayjs(dueDate));
    setEditId(id)
    setEdit(true);
  }

  const handleEditClose = () => {
    setEdit(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log(newTaskState);
    axios.post('http://localhost:9090/todos', {
      text: activityName,
      dueDate: dueDate,
      priority: priority,
    }).catch(function (error) {
      console.log(error);
    });
    dispatch({ type: 'RESET' });
    setOpen(false);
    setRenderer(true)
  };

  const toggleDone = (id, currentStatus) => {
    if (currentStatus === true) {
      axios.put(`http://localhost:9090/todos/${id}/undone`, { done: !currentStatus })
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.map(todo =>
              todo.id === id ? { ...todo, done: !currentStatus } : todo
            )
          );
        })
        .catch((error) => console.error('Error updating status:', error));
    }
    axios.post(`http://localhost:9090/todos/${id}/done`, { done: !currentStatus })
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
        axios.put(`http://localhost:9090/todos/${id}/delete`)
          .catch((error) => console.error('Error deleting todo:', error));
      }
      setRenderer(true);
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

  const filterTodos = (todos, nameFilter, priorityFilter, doneFilter) => {
    return todos.filter(todo => {
      const nameMatch = nameFilter
        ? todo.text === nameFilter
        : true;

      const priorityLevels = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
      const priorityMatch = priorityFilter
        ? priorityLevels[todo.priority] === priorityLevels[priorityFilter]
        : true;

      const doneMatch = doneFilter !== undefined
        ? todo.done === doneFilter
        : true;

      return nameMatch && priorityMatch && doneMatch;
    });
  };

  const handleSearch = () => {
    const filteredTodos = filterTodos(todos, name, priority, status);
    setTodos(filteredTodos);
  };

  const handleChangePage = (event, newPage) => {
    console.log(event, newPage);
    setPage(newPage);
  };

  // const handleSubmitEdit = () => {
  //   axios.put(`http://localhost:9090/todos/${editId}`, {
  //     text: activityName,
  //     dueDate: dueDate,
  //     priority: priority,
  //   }).catch(function (error) {
  //     console.log(error);
  //   });
  //   setActivityName("");
  //   setPriority("");
  //   setDueDate(null);
  //   setEdit(false);
  //   setRenderer(true)
  // }

  useEffect(() => {
    axios.get('http://localhost:9090/todos?size=100')
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  
  useEffect(() => {
    axios.get(`http://localhost:9090/todos?size=100`)
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
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FormControl variant="outlined" sx={{ width: 150 }}>
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={priority}
                onChange={(e) => {}}
                label="Priority"
              >
                <MenuItem value=""><em>Ninguno</em></MenuItem>
                <MenuItem value="LOW">LOW</MenuItem>
                <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                <MenuItem value="HIGH">HIGH</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ width: 150 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value === '' ? undefined : e.target.value === 'true')}
                label="Status"
              >
                <MenuItem value=""><em>Todos</em></MenuItem>
                <MenuItem value="true">Done</MenuItem>
                <MenuItem value="false">Undone</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" color="primary" onClick={handleSearch}>
              Buscar
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
                  <TableCell><TableSortLabel active={orderBy === 'dueDate'} direction={orderBy === dueDate ? order : 'asc'} onClick={() => handleSortRequest('dueDate')}>Due Date</TableSortLabel></TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((todo) => (
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
                        onClick={() => handleEditOpen(todo.id, todo.text, todo.priority, todo.dueDate)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        sx={{ marginLeft: 2 }}
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
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={todos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
        </div>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Add a new To-Do"}</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              autoFocus
              margin="dense"
              label="Task Name"
              fullWidth
              value={activityName}
              onChange={(e) => {
                dispatch({ type: 'SET_ACTIVITY_NAME', payload: e.target.value });
              }}
              required
            />
            <TextField
              select
              margin="dense"
              label="Priority"
              fullWidth
              value={priority}
              onChange={(e) => {
                dispatch({ type: 'SET_PRIORITY', payload: e.target.value });
              }}
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
                onChange={(newValue) => {
                  dispatch({ type: 'SET_DUE_DATE', payload: newValue });
                }}
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

      {/* <Dialog open={edit} onClose={handleEditClose}>
        <DialogTitle>{"Edit a To-Do"}</DialogTitle>
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
          <Button onClick={handleSubmitEdit} color="primary">
            Save
          </Button>
          <Button onClick={handleEditClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
}

export default App;