import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { loginSchema } from '@/lib/utils'
import { useAuthLogin } from '@/services/auth.service'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

type LoginData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const navigate = useNavigate()

  // login hook with role-based redirect
  const { mutate: login, isLoading } = useAuthLogin((user) => {
    toast.success('Login successful ✅')

    switch (user.role) {
      case 'ADMIN':
        navigate('/dashboard')
        break
      case 'PROJECT_MANAGER':
        navigate('/projects')
        break
      case 'DEVELOPER':
      case 'TESTER':
        navigate('/tasks')
        break
      case 'VIEWER':
        navigate('/users')
        break
      default:
        navigate('/dashboard')
    }
  })

  const onSubmit = (data: LoginData) => {
    login(data, {
      onError: () => toast.error('Invalid email or password ❌')
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-4 p-6 bg-white shadow rounded-md"
    >
      <h2 className="text-xl font-semibold text-center">Login</h2>

      {/* Email Field */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" {...register('email')} />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <Label htmlFor="password">Password</Label>
        <Input type="password" {...register('password')} />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" variant="ghost" className="w-full" disabled={isLoading}>
        {isLoading ? 'Logging in…' : 'Login'}
      </Button>
    </form>
  )
}
