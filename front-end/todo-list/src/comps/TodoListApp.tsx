import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Types
interface Task {
  id: number;
  name: string;
  priority: 'low' | 'medium' | 'high';
  done: boolean;
  dueDate: string;
  createdAt: string;
}

const TaskDashboard = () => {
  // Sample data
  const [tasks] = useState<Task[]>([
    {
      id: 1,
      name: "Complete project proposal",
      priority: "high",
      done: false,
      dueDate: "2024-12-25",
      createdAt: "2024-12-15"
    },
    {
      id: 2,
      name: "Review documentation",
      priority: "medium",
      done: true,
      dueDate: "2024-12-20",
      createdAt: "2024-12-10"
    }
  ]);

  // Search states
  const [nameSearch, setNameSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    const matchesName = task.name.toLowerCase().includes(nameSearch.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'done' ? task.done : !task.done);
    return matchesName && matchesPriority && matchesStatus;
  });

  // Calculate averages
  const calculateAverages = () => {
    const now = new Date();
    const avgTime = tasks.reduce((acc, task) => {
      const created = new Date(task.createdAt);
      return acc + (now.getTime() - created.getTime());
    }, 0) / tasks.length;

    const avgByPriority: { [key: string]: number } = {
      low: 0,
      medium: 0,
      high: 0
    };

    ['low', 'medium', 'high'].forEach(priority => {
      const priorityTasks = tasks.filter(t => t.priority === priority);
      if (priorityTasks.length) {
        avgByPriority[priority] = priorityTasks.reduce((acc, task) => {
          const created = new Date(task.createdAt);
          return acc + (now.getTime() - created.getTime());
        }, 0) / priorityTasks.length;
      }
    });

    return { avgTime, avgByPriority };
  };

  const { avgTime, avgByPriority } = calculateAverages();

  // Priority chip color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search Component */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <TextField
          label="Search by name"
          variant="outlined"
          size="small"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          style={{ width: '250px' }}
        />
        <FormControl size="small" style={{ minWidth: '150px' }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="all">All Priorities</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" style={{ minWidth: '150px' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="done">Done</MenuItem>
            <MenuItem value="undone">Undone</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Table Component */}
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: '16px' }}
        >
          New Task
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      color={getPriorityColor(task.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.done ? 'Done' : 'Pending'}
                      color={task.done ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Statistics Component */}
      <Card>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Typography variant="h6" gutterBottom>
                Average Time of Tasks
              </Typography>
              <Typography>
                {Math.round(avgTime / (1000 * 60 * 60 * 24))} days
              </Typography>
            </div>
            <div>
              <Typography variant="h6" gutterBottom>
                Average Time by Priority
              </Typography>
              <Typography>
                High: {Math.round(avgByPriority.high / (1000 * 60 * 60 * 24))} days
              </Typography>
              <Typography>
                Medium: {Math.round(avgByPriority.medium / (1000 * 60 * 60 * 24))} days
              </Typography>
              <Typography>
                Low: {Math.round(avgByPriority.low / (1000 * 60 * 60 * 24))} days
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDashboard;