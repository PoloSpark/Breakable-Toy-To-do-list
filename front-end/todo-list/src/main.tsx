import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TaskDashboard from './comps/TodoListApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskDashboard />
  </StrictMode>,
)
