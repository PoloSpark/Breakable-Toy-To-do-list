import { useEffect, useState } from 'react';
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
import axios from 'axios';

// Types
interface Task {
    id: number;
    text: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    done: boolean;
    dueDate: string;
    createdAt: string;
}

export interface Filter {
    name?: string;
    priority?: string;
    status?: string;
}

const API_URL = 'http://localhost:9090/todos';


const TaskDashboard = () => {
    // Sample data
    const [tasks, setTasks] = useState<Task[]>([]);

    // Search states
    const [nameSearch, setNameSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filtered tasks
    const filteredTasks = tasks.filter(task => {
        const matchesName = task.text.toLowerCase().includes(nameSearch.toLowerCase());
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'done' ? task.done : !task.done);
        return matchesName && matchesPriority && matchesStatus;
    });

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_URL}?size=100`);
            const data = response.data;

            const mappedTasks: Task[] = data.map((item: any) => ({
                id: item.id,
                text: item.text,
                priority: item.priority,
                done: item.done,
                dueDate: item.dueDate,
                createdAt: item.createdAt,
            }));

            setTasks(mappedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
        //console.log('Tasks:', tasks);
    }, []);

    // Calculate averages
    const calculateAverages = () => {
        const now = new Date();
        const avgTime = tasks.reduce((acc, task) => {
            const created = new Date(task.createdAt);
            return acc + (now.getTime() - created.getTime());
        }, 0) / tasks.length;

        const avgByPriority: { [key: string]: number } = {
            LOW: 0,
            MEDIUM: 0,
            HIGH: 0
        };

        ['LOW', 'MEDIUM', 'HIGH'].forEach(priority => {
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
            case 'HIGH': return 'error';
            case 'MEDIUM': return 'warning';
            case 'LOW': return 'success';
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
                                    <TableCell>{task.text}</TableCell>
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