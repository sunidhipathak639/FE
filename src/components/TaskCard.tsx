// src/components/TaskCard.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import CommentSection from "./CommentSection";

type TaskCardProps = {
  task: any;
  setEditingTask: (task: any) => void;
  setEditTaskDialogOpen: (open: boolean) => void;
  setDeleteTaskDialogOpen: (open: boolean) => void;
  setSelectedTaskId: (id: string) => void;
  deleteComment: any;
  createComment: any;
  comments: any;
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  setEditingTask,
  setEditTaskDialogOpen,
  setDeleteTaskDialogOpen,
  setSelectedTaskId,
  deleteComment,
  createComment,
  comments,
}) => {
  return (
    <div
      key={task.id}
      className="p-4 bg-black/50 rounded-sm shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-center">
        <div>
          <h5 className="text-lg font-semibold text-white">{task.title}</h5>
          <p className="text-sm text-gray-300">{task.description}</p>

          <div className="flex items-center gap-2 mt-2">
            <label className="text-sm font-medium text-white">Status:</label>
            <select
              className={`p-1 rounded-md text-sm border focus:ring-2 focus:ring-blue-500`}
              value={task.status}
              onChange={(e) => {
                const newStatus = e.target.value;
                // Update task status here
              }}
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        </div>

        <div className="space-x-3">
          <Button
            size="sm"
            onClick={() => {
              setEditingTask(task);
              setEditTaskDialogOpen(true);
            }}
            className="text-blue-500 hover:bg-blue-700 p-2 rounded-full transition duration-300"
          >
            <Edit className="w-5 h-5" />
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setSelectedTaskId(task.id);
              setDeleteTaskDialogOpen(true);
            }}
            className="text-red-500 hover:bg-red-700 p-2 rounded-full transition duration-300"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <CommentSection
        taskId={task.id}
        comments={comments}
        createComment={createComment}
        deleteComment={deleteComment}
      />
    </div>
  );
};

export default TaskCard;
