import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
} from "@/services/project.service";
import { createComment, getCommentsByTask } from "@/services/comment.service";
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
import { Edit, Loader2, MessageCircle, Plus, Trash } from "lucide-react";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import DeleteDialog from "@/components/DeleteDialog";
import EditTaskDialog from "@/components/EditTaskDialog";
import DeleteDialogTask from "@/components/DeleteDialogTask";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const { user } = useAuth();
  const [commentsByTask, setCommentsByTask] = useState<Record<string, any[]>>(
    {}
  );
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
  const handleToggleProject = async (projectId: string) => {
    const isSame = selectedProjectId === projectId;
    setSelectedProjectId(isSame ? null : projectId);

    if (!isSame) {
      const relatedTasks = tasks.filter((t) => t.projectId === projectId);
      for (const task of relatedTasks) {
        try {
          const comments = await getCommentsByTask(task.id);
          setCommentsByTask((prev) => ({ ...prev, [task.id]: comments }));
        } catch (error) {
          toast.error(`Failed to fetch comments for task: ${task.title}`);
        }
      }
    }
  };

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
      fetchProjects(); // refetch updated list
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

  const handleDeleteClick = (id: string) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  };
  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully");
      fetchProjects(); // refresh project list
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

  const handleTaskSubmit = async () => {
    if (!selectedProjectId || !taskTitle) return;

    try {
      await createTask({
        title: taskTitle,
        description: taskDescription,
        status: "PENDING",
        projectId: selectedProjectId,
        assignedToId: user?.id || "", // dynamic instead of hardcoded
      });
      setCreateTaskDialogOpen(false);
      toast.success("Task created successfully");
      resetTaskForm();
    } catch {
      toast.error("Failed to create task");
    }
  };
  const handleUpdateTask = async () => {
    if (!editingTask || !taskTitle.trim()) return;

    try {
      await updateTask({
        id: editingTask.id,
        title: taskTitle,
        description: taskDescription,
      });

      toast.success("Task updated successfully");
      setEditTaskDialogOpen(false);
      resetTaskForm();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };
  const handleDeleteTask = async () => {
    if (!selectedTaskId) return;

    try {
      await deleteTask(selectedTaskId);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setDeleteTaskDialogOpen(false);
      setSelectedTaskId(null);
    }
  };

  const resetTaskForm = () => {
    setEditingTask(null);
    setTaskTitle("");
    setTaskDescription("");
  };

  const tasks = tasksData?.data || [];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-600 text-white border-yellow-500";
      case "IN_PROGRESS":
        return "bg-blue-600 text-white border-blue-500";
      case "COMPLETED":
        return "bg-green-600 text-white border-green-500";
      default:
        return "bg-gray-700 text-white border-gray-500";
    }
  };

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
      <div className="flex justify-between items-center mb-8 p-4 bg-black rounded-lg shadow-lg">
        {/* Title Section */}
        <h2 className="text-3xl font-semibold text-white tracking-wide">
          Projects
        </h2>
       
          <Button
            onClick={() => setOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 bg-white/20  text-black rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out "
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-2xl text-gray-100">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-200">{project.description}</p>
                </div>
                <div className="space-x-3">
                
                      <Button
                        variant="ghost"
                        onClick={() => handleEdit(project)}
                        className="text-blue-500 hover:bg-blue-700 p-2 rounded-full transition duration-300"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteClick(project.id)}
                        className="text-red-500 hover:bg-red-700 p-2 rounded-full transition duration-300"
                      >
                        <Trash className="w-5 h-5" />
                      </Button>
                
                  <Button
                    variant="ghost"
                    onClick={() => handleToggleProject(project.id)}
                    className="text-white cursor-pointer p-2 rounded-full transition duration-300"
                  >
                    {selectedProjectId === project.id
                      ? "Hide Tasks"
                      : "Show Tasks"}
                  </Button>
                </div>
              </div>

              {/* Tasks Section */}
              {selectedProjectId === project.id && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center mb-8 p-4 bg-black rounded-lg shadow-lg">
                    {/* Title Section */}
                    <h2 className="text-3xl font-semibold text-white tracking-wide">
                      Tasks
                    </h2>

                    <Button
                      onClick={() => setCreateTaskDialogOpen(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      New Task
                    </Button>
                  </div>

                  {tasks
                    .filter((task: Task) => task.projectId === project.id)
                    .map((task: Task) => (
                      <div
                        key={task.id}
                        className="p-4 bg-black/50 rounded-sm  shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="text-lg font-semibold text-white">
                              {task.title}
                            </h5>
                            <p className="text-sm text-gray-300">
                              {task.description}
                            </p>
               
                              <div className="flex items-center gap-2 mt-2">
                                <label className="text-sm font-medium text-white">
                                  Status:
                                </label>
                                <select
                                  className={`p-1 rounded-md text-sm border focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                                    task.status
                                  )}`}
                                  value={task.status}
                                  onChange={(e) => {
                                    const newStatus = e.target.value;
                                    updateTask({
                                      id: task.id,
                                      taskData: { status: newStatus },
                                    });
                                  }}
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="IN_PROGRESS">
                                    IN_PROGRESS
                                  </option>
                                  <option value="COMPLETED">COMPLETED</option>
                                </select>
                              </div>
                              {/* <p
                                className={`text-xs font-semibold ${
                                  task.status === "PENDING"
                                    ? "text-yellow-500"
                                    : task.status === "IN_PROGRESS"
                                    ? "text-blue-500"
                                    : task.status === "COMPLETED"
                                    ? "text-green-500"
                                    : "text-gray-500"
                                }`}
                              >
                                Status: {task.status}
                              </p> */}
             
                          </div>
                          <div className="space-x-3">
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditingTask(task); // ✅ Set the task to be edited
                                setTaskTitle(task.title); // ✅ Prefill form values
                                setTaskDescription(task.description); // ✅ Prefill form values
                                setEditTaskDialogOpen(true); // ✅ Open dialog
                              }}
                              className="text-blue-500 hover:bg-blue-700 p-2 rounded-full transition duration-300"
                            >
                              <Edit className="w-5 h-5" />
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedTaskId(task.id); // ✅ Set the task id
                                setDeleteTaskDialogOpen(true); // ✅ Then open the dialog
                              }}
                              className="text-red-500 hover:bg-red-700 p-2 rounded-full transition duration-300"
                            >
                              <Trash className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        {/* Add new comment input */}
                        <div className="mt-4 flex items-center gap-3">
                          <Input
                            className="w-full p-3 bg-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                              const content = newComments[task.id]?.trim();
                              if (!content) return;

                              try {
                                await createComment({
                                  taskId: task.id,
                                  content,
                                });
                                const updated = await getCommentsByTask(
                                  task.id
                                );
                                setCommentsByTask((prev) => ({
                                  ...prev,
                                  [task.id]: updated,
                                }));
                                toast.success("Comment added");
                                setNewComments((prev) => ({
                                  ...prev,
                                  [task.id]: "",
                                }));
                              } catch {
                                toast.error("Failed to add comment");
                              }
                            }}
                            className="text-blue-500 hover:bg-blue-700 p-2 rounded-full transition duration-300"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </Button>
                        </div>

                        {/* Display comments */}
                        {commentsByTask[task.id]?.map((comment: any) => (
                          <div
                            key={comment.id}
                            className="pl-6 mt-2 text-sm text-gray-300 border-l-2 border-blue-500"
                          >
                            <p>
                              <strong>{comment.author?.name || "User"}:</strong>{" "}
                              {comment.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Project Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{/* Trigger for the dialog */}</DialogTrigger>
        <DialogContent className="sm:max-w-md bg-gray-800 text-white rounded-xl shadow-xl p-6 transition-all transform duration-500 ease-in-out opacity-100 z-50">
          <div className="relative">
            {/* Header Section */}
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-semibold text-center flex items-center justify-center">
                {editingProject ? <>Edit Project</> : <>New Project</>}
              </DialogTitle>
            </DialogHeader>

            {/* Project Name */}
            <div className="space-y-6">
              <Input
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-lg bg-gray-700 text-white border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg"
              />

              {/* Description */}
              <Input
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 rounded-lg bg-gray-700 text-white border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg"
              />
            </div>

            {/* Footer Section with Buttons */}
            <DialogFooter className="mt-8 flex justify-between space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)} // Close the dialog
                className="w-full sm:w-auto border-gray-600 text-gray-400 hover:bg-gray-700 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="solid"
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-300"
              >
                {editingProject ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      <CreateTaskDialog
        open={createTaskDialogOpen}
        setOpen={setCreateTaskDialogOpen}
        handleTaskSubmit={handleTaskSubmit}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
      />
      <EditTaskDialog
        open={editTaskDialogOpen}
        setOpen={setEditTaskDialogOpen}
        handleUpdateTask={handleUpdateTask} // ← changed here
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
      />

      <DeleteDialogTask
        open={deleteTaskDialogOpen}
        setOpen={setDeleteTaskDialogOpen}
        handleDelete={handleDeleteTask} // ← changed here
        itemType="Task"
        itemId={selectedTaskId}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        handleDelete={handleConfirmDelete}
        itemType="Project"
        itemId={selectedItemId}
      />
    </DashboardLayout>
  );
}
