import { useTasks, useCreateTask } from '../services/task.service'
import TaskForm from '../components/TaskForm'
import { Card } from '../components/ui/card'
import { Loader2 } from 'lucide-react'

export default function TasksPage() {
  const { data: tasksData, isLoading, isError } = useTasks()
  const { mutate: createTask, isPending } = useCreateTask()

  const handleSubmit = (formData: { title: string; description?: string }) => {
    createTask(formData)
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    )
  }

  // Handle error state
  if (isError) {
    return <div className="text-red-600 text-center mt-10">Failed to load tasks.</div>
  }

  // Extract tasks from the response (data is in tasksData?.data)
  const tasks = tasksData?.data || []

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Tasks</h1>

      <TaskForm onSubmit={handleSubmit} isLoading={isPending} />

      <div className="mt-8 space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-600 text-center">No tasks found.</p>
        ) : (
          tasks.map((task: any) => (
            <Card key={task.id} className="p-4">
              <h3 className="text-lg font-medium">{task.title}</h3>
              {task.description && <p className="text-sm text-gray-700">{task.description}</p>}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
