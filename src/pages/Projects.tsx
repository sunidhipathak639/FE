// src/pages/Projects.tsx

import { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import {
  getAllProjects,
  createProject,
  deleteProject,
  updateProject
} from '@/services/project.service'
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

type Project = {
  id: string
  name: string
  description?: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await getAllProjects()
      setProjects(data)
    } catch (err) {
      toast.error( 'Error loading projects')
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
        toast.success('Project updated successfully' )
      } else {
        await createProject({ name, description })
        toast.success( 'Project created successfully' )
      }

      setOpen(false)
      setEditingProject(null)
      setName('')
      setDescription('')
      fetchProjects()
    } catch {
      toast.error( 'Error saving project')
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
        toast.success( 'Project deleted successfully' )
        fetchProjects()
      } catch {
        toast.error( 'Failed to delete project')
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button variant='ghost' onClick={() => setOpen(true)}>+ New Project</Button>
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
                <Button variant="outline" onClick={() => handleEdit(project)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog for Create/Update */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'New Project'}
            </DialogTitle>
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
            <Button type="button" onClick={handleSubmit}>
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
