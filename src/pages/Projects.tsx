// src/pages/Projects.tsx

import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
} from "@/services/project.service";
import { getComments, createComment } from "../services/comment.service";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  useTasks,
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
} from "../services/task.service";
import { Loader2 } from "lucide-react";

type Project = {
  id: string;
  name: string;
  description?: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedToId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { data: commentsData } = getComments();

  const [newComments, setNewComments] = useState<{ [taskId: string]: string }>(
    {}
  );
  const {
    data: tasksData,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useTasks();
  const { mutate: createTask, isPending: isTaskPending } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      toast.error("Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, { name, description });
        toast.success("Project updated successfully");
      } else {
        await createProject({ name, description });
        toast.success("Project created successfully");
      }

      setOpen(false);
      setEditingProject(null);
      setName("");
      setDescription("");
      fetchProjects();
    } catch {
      toast.error("Error saving project");
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description || "");
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        toast.success("Project deleted successfully");
        fetchProjects();
      } catch {
        toast.error("Failed to delete project");
      }
    }
  };

  const handleTaskSubmit = () => {
    if (selectedProjectId) {
      createTask({
        title: taskTitle,
        description: taskDescription,
        status: "PENDING",
        projectId: selectedProjectId,
        assignedToId: "f98b7f58-d659-4e63-a0a1-a09fe0b5f617",
      });
      resetTaskForm();
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setSelectedProjectId(task.projectId);
  };

  const handleUpdateTask = () => {
    if (editingTask && selectedProjectId) {
      updateTask({
        id: editingTask.id,
        data: {
          title: taskTitle,
          description: taskDescription,
          status: editingTask.status,
          projectId: selectedProjectId,
          assignedToId: editingTask.assignedToId,
        },
      });
      resetTaskForm();
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Delete this task?")) {
      deleteTask(taskId);
    }
  };

  const resetTaskForm = () => {
    setEditingTask(null);
    setTaskTitle("");
    setTaskDescription("");
  };

  const tasks = tasksData?.data || [];

  if (tasksLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="text-red-600 text-center mt-10">
        Failed to load tasks.
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button variant="ghost" onClick={() => setOpen(true)}>
          + New Project
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border rounded-md shadow-sm bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="ghost" onClick={() => handleEdit(project)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setSelectedProjectId(
                        selectedProjectId === project.id ? null : project.id
                      )
                    }
                  >
                    {selectedProjectId === project.id
                      ? "Hide Tasks"
                      : "Show Tasks"}
                  </Button>
                </div>
              </div>

              {selectedProjectId === project.id && (
                <div className="mt-4 space-y-4">
                  <h4 className="font-medium">Tasks</h4>
                  {tasks
                    .filter((task: Task) => task.projectId === project.id)
                    .map((task: Task) => (
                      <div
                        key={task.id}
                        className="p-4 border rounded-md shadow-sm bg-gray-50"
                      >
                        <h5 className="font-medium">{task.title}</h5>
                        <p className="text-sm text-gray-700">
                          {task.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Status: {task.status}
                        </p>
                        <div className="mt-2 space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditTask(task)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Delete
                          </Button>
                        </div>
                        {/* Add new comment input */}
                        <div className="mt-3 flex items-start gap-2">
                          <Input
                            className="w-full"
                            placeholder="Write a comment..."
                            value={newComments[task.id] || ""}
                            onChange={(e) =>
                              setNewComments((prev) => ({
                                ...prev,
                                [task.id]: e.target.value,
                              }))
                            }
                          />
                          <Button
                            variant="ghost"
                            onClick={async () => {
                              if (!newComments[task.id]?.trim()) return;

                              try {
                                await createComment({
                                  content: newComments[task.id],
                                  taskId: task.id,
                                  authorId:
                                    "f98b7f58-d659-4e63-a0a1-a09fe0b5f617", // dynamically replace later
                                });
                                toast.success("Comment added");
                                setNewComments((prev) => ({
                                  ...prev,
                                  [task.id]: "",
                                }));
                              } catch (err) {
                                toast.error("Failed to add comment");
                              }
                            }}
                          >
                            Post
                          </Button>
                        </div>

                        {commentsData
                          ?.filter((comment: any) => comment.taskId === task.id)
                          .map((comment: any) => (
                            <div
                              key={comment.id}
                              className="pl-4 border-l mt-2 text-sm text-gray-600"
                            >
                              <p>
                                <strong>{comment.author.name}:</strong>{" "}
                                {comment.content}
                              </p>
                            </div>
                          ))}
                      </div>
                    ))}

                  <div className="pt-4 border-t mt-4">
                    <h5 className="text-lg font-semibold mb-2">
                      {editingTask ? "Edit Task" : "Create a New Task"}
                    </h5>
                    <div className="space-y-2">
                      <Input
                        placeholder="Task Title"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                      />
                      <Input
                        placeholder="Task Description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                      />
                      <Button
                        onClick={
                          editingTask ? handleUpdateTask : handleTaskSubmit
                        }
                        disabled={isTaskPending}
                        variant="ghost"
                      >
                        {editingTask
                          ? isTaskPending
                            ? "Updating..."
                            : "Update Task"
                          : isTaskPending
                          ? "Creating..."
                          : "Create Task"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Project Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "New Project"}
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
            <Button type="button" variant="ghost" onClick={handleSubmit}>
              {editingProject ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
