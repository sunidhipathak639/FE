import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { registerSchema } from '@/lib/utils'
import { useAuthRegister } from '@/services/auth.service'
import { useNavigate } from 'react-router-dom'

type RegisterData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  })

  const navigate = useNavigate()
  const { mutate: registerUser, isLoading } = useAuthRegister(() => {
    navigate('/login')
  })

  const onSubmit = (data: RegisterData) => {
    registerUser(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4 p-6 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold text-center">Register</h2>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input type="text" {...register('name')} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input type="password" {...register('password')} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <select {...register('role')} className="w-full border border-gray-300 rounded px-3 py-2">
          <option value="">Select Role</option>
          <option value="ADMIN">Admin</option>
          <option value="PROJECT_MANAGER">Project Manager</option>
          <option value="DEVELOPER">Developer</option>
          <option value="TESTER">Tester</option>
          <option value="VIEWER">Viewer</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  )
}
