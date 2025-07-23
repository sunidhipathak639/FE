import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"; 
import { Trash } from "lucide-react"; // Import the Trash icon
import { Button } from "./ui/button";

const DeleteDialog = ({ open, setOpen, handleDelete, itemType, itemId }: any) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="sm:max-w-md bg-black text-white rounded-lg shadow-xl p-6 transition-all duration-300">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-center">
          <Trash className="inline-block w-6 h-6 mr-2" />
          Delete {itemType}?
        </DialogTitle>
      </DialogHeader>
      <div className="mt-4 text-sm text-center">
        Are you sure you want to delete this {itemType}? This action is permanent and cannot be undone.
      </div>
      <DialogFooter className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          className="w-auto border-gray-600 text-gray-400 hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleDelete(itemId)}
          className="w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white"
        >
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteDialog;
