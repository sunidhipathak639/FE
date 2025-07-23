import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Plus } from "lucide-react"; // Icon for creating tasks
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const CreateTaskDialog = ({ open, setOpen, handleTaskSubmit, taskTitle, setTaskTitle, taskDescription, setTaskDescription }: any) => (
  <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-md bg-gray-800 text-white rounded-xl shadow-xl p-6 transition-all transform duration-500 ease-in-out opacity-100 z-50">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-center">
          Create New Task
        </DialogTitle>
      </DialogHeader>
      <div className="mt-4">
        <Input
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="w-full p-4 rounded-lg bg-gray-700 text-white border-2 focus:ring-2 focus:ring-blue-500"
        />
        <Input
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="w-full p-4 mt-4 rounded-lg bg-gray-700 text-white border-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <DialogFooter className="mt-6">
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          className="w-auto border-gray-600 text-gray-400 hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          onClick={handleTaskSubmit}
          className="w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"
        >
          Create Task
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default CreateTaskDialog;
