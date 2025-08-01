import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { getAllUsers } from '@/services/user.service';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { Pencil, Trash2 } from 'lucide-react';
import EditUserDialog from '@/components/EditUserDialog';
import { toast } from 'react-toastify';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

  // Fetch users and handle errors
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      // toast.success('Users fetched successfully ✅');
    } catch (error) {
      // console.error('Error fetching users', error);
      // toast.error('Failed to fetch users ❌');
    }
    setLoading(false);
  };

  // Delete user and handle success/error
  const deleteUser = async (id: string) => {
    try {
      setDeletingUserId(id);
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success('User deleted successfully ✅');
    } catch (error) {
      console.error('Delete failed', error);
      toast.error('Failed to delete user ❌');
    } finally {
      setDeletingUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Users</h2>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-10" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-700 overflow-hidden shadow-md">
          <div className="grid grid-cols-4 bg-gray-800 p-3 font-semibold text-white">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Actions</div>
          </div>

          <AnimatePresence>
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-4 p-3 border-t border-gray-700 text-white hover:bg-gray-900"
              >
                <div>{user.name}</div>
                <div>{user.email}</div>
                <div>{user.role}</div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditUser(user)}
                  >
                    <Pencil className="w-4 h-4 cursor-pointer" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteUser(user.id)}
                    disabled={deletingUserId === user.id}
                  >
                    <Trash2 className="w-4 h-4 cursor-pointer" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      {editUser && (
        <EditUserDialog
          open={!!editUser}
          onClose={() => setEditUser(null)}
          user={editUser}
          onUpdated={fetchUsers}
        />
      )}
    </DashboardLayout>
  );
}
