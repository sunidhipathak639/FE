// src/components/TaskForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateTask } from '../services/task.service'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

export default function TaskForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  })

  const { mutate: createTask, isLoading } = useCreateTask()

  const onSubmit = (data: TaskFormData) => {
    createTask(data, {
      onSuccess: () => reset(),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-md bg-white shadow">
      <Input placeholder="Task Title" {...register('title')} />
      {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}

      <Textarea placeholder="Description (optional)" {...register('description')} />
      {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Task'}
      </Button>
    </form>
  )
}
