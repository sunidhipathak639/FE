// src/components/TaskList.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

type TaskListProps = {
  projectId: string;
  tasks: any[];
  setCreateTaskDialogOpen: (open: boolean) => void;
  setEditingTask: (task: any) => void;
  setEditTaskDialogOpen: (open: boolean) => void;
  setDeleteTaskDialogOpen: (open: boolean) => void;
  setSelectedTaskId: (id: string) => void;
  deleteComment:any;
  createComment:any;
  comments:any
};

const TaskList: React.FC<TaskListProps> = ({
  projectId,
  tasks,
  setCreateTaskDialogOpen,
  setEditingTask,
  setEditTaskDialogOpen,
  setDeleteTaskDialogOpen,
  setSelectedTaskId,
  deleteComment,
  createComment,
  comments
}) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center mb-8 p-4 bg-black rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-white tracking-wide">Tasks</h2>

        <Button
          onClick={() => setCreateTaskDialogOpen(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </Button>
      </div>

      {tasks
        .filter((task: any) => task.projectId === projectId)
        .map((task: any) => (
          <TaskCard
            key={task.id}
            task={task}
            setEditingTask={setEditingTask}
            setEditTaskDialogOpen={setEditTaskDialogOpen}
            setDeleteTaskDialogOpen={setDeleteTaskDialogOpen}
            setSelectedTaskId={setSelectedTaskId}
            deleteComment={deleteComment}
            createComment={createComment}
            comments={comments[task.id] || []}
          />
        ))}
        
    </div>
  );
};

export default TaskList;
