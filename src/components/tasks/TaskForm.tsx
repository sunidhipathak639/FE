import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { useCreateTask } from '@/services/task.service'

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional()
})

type TaskFormData = z.infer<typeof taskSchema>

export default function TaskForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema)
  })

  const { mutate: createTask, isLoading } = useCreateTask()

  const onSubmit = (data: TaskFormData) => {
    createTask(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 rounded shadow">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input {...register('title')} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input {...register('description')} />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Task'}
      </Button>
    </form>
  )
}
