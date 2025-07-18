import { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import {
  getAllProjects,
  createProject,
  deleteProject,
  updateProject
} from '@/services/project.service'
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '../services/task.service' // Import task services
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog'
import { toast } from 'react-toastify'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Loader2 } from 'lucide-react'

type Project = {
  id: string
  name: string
  description?: string
}

type Task = {
  id: string
  title: string
  description: string
  status: string
  assignedToId: string
  createdAt: string
  updatedAt: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const { data: tasksData, isLoading: tasksLoading, isError: tasksError } = useTasks() // Get tasks
  const { mutate: createTask, isPending: isTaskPending } = useCreateTask() // Create task
  const { mutate: updateTask } = useUpdateTask() // Update task
  const { mutate: deleteTask } = useDeleteTask() // Delete task

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await getAllProjects()
      setProjects(data)
    } catch (err) {
      toast.error('Error loading projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleSubmit = async () => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, { name, description })
        toast.success('Project updated successfully')
      } else {
        await createProject({ name, description })
        toast.success('Project created successfully')
      }

      setOpen(false)
      setEditingProject(null)
      setName('')
      setDescription('')
      fetchProjects()
    } catch {
      toast.error('Error saving project')
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setName(project.name)
    setDescription(project.description || '')
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id)
        toast.success('Project deleted successfully')
        fetchProjects()
      } catch {
        toast.error('Failed to delete project')
      }
    }
  }

  const handleTaskSubmit = () => {
    if (selectedProjectId) {
      createTask({
        title: taskTitle,
        description: taskDescription,
        status: 'PENDING', // Default status, you can modify if needed
        projectId: selectedProjectId,
        assignedToId: 'f98b7f58-d659-4e63-a0a1-a09fe0b5f617' // Example assigned user ID
      })
      setTaskTitle('')
      setTaskDescription('')
    }
  }

  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task)
    setTaskTitle(task.title)
    setTaskDescription(task.description)
  }

  const handleTaskUpdate = () => {
    if (selectedTask) {
      updateTask({
        id: selectedTask.id,
        data: {
          title: taskTitle,
          description: taskDescription,
          status: selectedTask.status, // Keeping the existing status
        },
      })
      setTaskTitle('')
      setTaskDescription('')
      setSelectedTask(null)
    }
  }

  const handleTaskDelete = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId)
      setSelectedTask(null)
    }
  }

  const tasks = tasksData?.data || []

  if (tasksLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    )
  }

  if (tasksError) {
    return <div className="text-red-600 text-center mt-10">Failed to load tasks.</div>
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button variant="ghost" onClick={() => setOpen(true)}>
          + New Project
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border rounded-md shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <p className="text-sm text-gray-500">{project.description}</p>
              </div>
              <div className="space-x-2">
                <Button variant="ghost" onClick={() => handleEdit(project)}>
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => handleDelete(project.id)}>
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  Show Tasks
                </Button>
              </div>

              {/* Display Tasks for the selected project */}
              {selectedProjectId === project.id && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Tasks</h4>
                  <div className="space-y-2">
                    {tasks
                      .filter((task: Task) => task.projectId === project.id) // Filter tasks for this project
                      .map((task: Task) => (
                        <div key={task.id} className="p-4 border rounded-md shadow-sm">
                          <h5 className="font-medium">{task.title}</h5>
                          <p className="text-sm text-gray-700">{task.description}</p>
                          <p className="text-xs text-gray-500">Status: {task.status}</p>
                          <Button
                            variant="ghost"
                            onClick={() => handleTaskEdit(task)}
                          >
                            Edit Task
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleTaskDelete(task.id)}
                          >
                            Delete Task
                          </Button>
                        </div>
                      ))}
                  </div>

                  {/* Task Creation Form */}
                  <div className="mt-4">
                    <h5 className="text-lg font-semibold">Create a New Task</h5>
                    <div className="space-y-4">
                      <Input
                        placeholder="Task Title"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                      />
                      <Input
                        placeholder="Task Description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                      />
                      <Button
                        onClick={handleTaskSubmit}
                        variant="ghost"
                        disabled={isTaskPending}
                      >
                        {isTaskPending ? 'Creating Task...' : 'Create Task'}
                      </Button>
                    </div>
                  </div>

                  {/* Task Edit Form */}
                  {selectedTask && (
                    <div className="mt-4 space-y-4">
                      <h5 className="text-lg font-semibold">Edit Task</h5>
                      <div className="space-y-4">
                        <Input
                          placeholder="Task Title"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                        />
                        <Input
                          placeholder="Task Description"
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                        />
                        <Button onClick={handleTaskUpdate} variant="ghost">
                          Update Task
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dialog for Create/Update Project */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'New Project'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="ghost" onClick={handleSubmit}>
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
