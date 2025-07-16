import { useGetTasks } from '@/services/task.service'
import TaskForm from '@/components/TaskForm'
import { Card } from "@/components/ui/card" 
import { Loader2 } from 'lucide-react'

export default function TasksPage() {
  const { data: tasks, isLoading, isError } = useGetTasks()

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tasks</h1>

      {/* Task Creation Form */}
      <TaskForm />

      {/* Task List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
          </div>
        )}

        {isError && (
          <p className="text-red-500 text-center">Failed to load tasks.</p>
        )}

        {tasks && tasks.length === 0 && (
          <p className="text-center text-gray-500">No tasks available.</p>
        )}

        {tasks?.map((task) => (
          <Card key={task.id} className="p-4 shadow-sm">
            <h3 className="font-medium">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
