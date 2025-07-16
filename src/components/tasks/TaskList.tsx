// src/components/tasks/TaskList.tsx

import { useGetTasks } from '@/services/task.service'

export default function TaskList() {
  const { data: tasks, isLoading } = useGetTasks()

  if (isLoading) return <p>Loading tasks...</p>

  if (!tasks || tasks.length === 0) return <p>No tasks yet.</p>

  return (
    <ul className="space-y-2">
      {tasks.map((task: any) => (
        <li
          key={task.id}
          className="border p-4 rounded bg-white shadow-sm"
        >
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
        </li>
      ))}
    </ul>
  )
}
