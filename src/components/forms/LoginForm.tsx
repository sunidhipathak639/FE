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
  const { mutate: login, isLoading } = useAuthLogin(() => {
    navigate('/dashboard')
  })

  const onSubmit = (data: LoginData) => {
    login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4 p-6 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold text-center">Login</h2>
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
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  )
}
