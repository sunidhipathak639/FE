import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { updateUser } from '@/services/user.service';

interface Props {
  open: boolean;
  onClose: () => void;
  user: { id: string; name: string; email: string; role: string };
  onUpdated: () => void;
}

const roleOptions = [
  'ADMIN',
  'PROJECT_MANAGER',
  'DEVELOPER',
  'TESTER',
  'VIEWER',
];

export default function EditUserDialog({ open, onClose, user, onUpdated }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: '',
    },
  });

  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);

const onSubmit = async (data: any) => {
  try {
    await updateUser(user.id, data); // ✅ clean and type-safe
    toast.success('User updated successfully!');
    onUpdated();
    onClose();
  } catch (err) {
    toast.error('Failed to update user');
  }
};
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl">Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name" className='text-black'>Name</Label>
            <Input
              id="name"
              placeholder="Enter full name"
              {...register('name', { required: 'Name is required' })}
              className="mt-1"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label className='text-black' htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label className='text-black' htmlFor="role">Role</Label>
            <Select
              onValueChange={(value) => setValue('role', value)}
              defaultValue={watch('role')}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className='bg-white text-black w-full'>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
