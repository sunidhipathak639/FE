// src/services/project.service.ts

import api from '@/lib/axios'

// GET all projects
export const getAllProjects = async () => {
  const response = await api.get('/projects')
  return response.data
}

// GET a single project by ID
export const getProjectById = async (id: string) => {
  const response = await api.get(`/projects/${id}`)
  return response.data
}

// CREATE a new project
export const createProject = async (projectData: {
  name: string
  description?: string
}) => {
  const response = await api.post('/projects', projectData)
  return response.data
}

// UPDATE a project by ID
export const updateProject = async (
  id: string,
  updatedData: {
    name?: string
    description?: string
  }
) => {
  const response = await api.put(`/projects/${id}`, updatedData)
  return response.data
}

// DELETE a project by ID
export const deleteProject = async (id: string) => {
  const response = await api.delete(`/projects/${id}`)
  return response.data
}
