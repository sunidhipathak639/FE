import React, { useState } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import TaskForm from '@/components/tasks/TaskForm'

export default function Tasks() {
  const [showForm, setShowForm] = useState(false)

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Close' : 'Add Task'}
        </button>
      </div>

      {showForm && <TaskForm />}
    </DashboardLayout>
  )
}
