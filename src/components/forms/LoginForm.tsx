import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { cn, loginSchema } from '../../lib/utils'
import { useAuthLogin } from '../../services/auth.service'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'
import { useAuth } from '@/context/AuthContext'

type LoginData = z.infer<typeof loginSchema>

export default function LoginForm() {
    const { setUser, setToken } = useAuth() 

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const navigate = useNavigate()

  const { mutate: login, isLoading } = useAuthLogin((user) => {
    toast.success('Login successful ✅')
    setUser(user)
    // 🔄 Role-based redirection only (no unconditional navigate)
    switch (user.role) {
      case 'ADMIN':
        navigate('/dashboard')
        break
      case 'PROJECT_MANAGER':
        navigate('/projects')
        break
      case 'DEVELOPER':
        navigate('/projects')
      case 'TESTER':
        navigate('/projects')
        break
      case 'VIEWER':
        navigate('/dashboard')
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
    <Card
  className={cn(
    'relative w-[450px] h-[370px] border border-transparent p-[2px] rounded-xl shadow-lg aspect-video isolate backdrop-blur-sm overflow-hidden'
  )}
>
  {/* Fluid animated border background */}
  <motion.div
    animate={{
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: 'linear',
    }}
    className="absolute inset-0 rounded-[inherit] z-[-1] bg-[length:300%_300%] bg-gradient-to-r from-pink-500 via-blue-500 to-green-500"
  />

  {/* Main inner card content */}
  <div className="rounded-[inherit] bg-black/90 backdrop-blur-3xl w-full h-full flex flex-col gap-6 py-6">
    <CardHeader className="px-6">
      <CardTitle className="text-lg md:text-xl text-white">Login Account</CardTitle>
      <CardDescription className="text-xs md:text-sm text-zinc-300">
        Fill the form to register
      </CardDescription>
    </CardHeader>
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
            <CardContent className="px-6 grid gap-4 space-y-5">

      {/* Email Field */}
        <div className="grid gap-2 relative">
        <Label htmlFor="email">Email</Label>
        <Input type="email" {...register('email')} className='text-white' />
        {errors.email && (
          <p className="text-rose-500 text-sm mt-1 absolute -bottom-6.5 text-left font-extralight">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
        <div className="grid gap-2 relative">
        <Label htmlFor="password">Password</Label>
        <Input className='text-white' type="password" {...register('password')} />
        {errors.password && (
          <p className="text-rose-500 text-sm mt-1 absolute -bottom-6.5 text-left font-extralight">{errors.password.message}</p>
        )}
      </div>
            </CardContent>

    <CardFooter className="flex flex-col px-6 gap-3 mt-4">
      <Button type="submit" variant="ghost" className="w-full text-white curor" disabled={isLoading}>
        {isLoading ? 'Logging in…' : 'Login'}
      </Button>

        <p className="text-sm text-muted-foreground text-white text-center">
          Dont have an account?{' '}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto ml-1 text-white underline cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Sign Up
          </Button>
        </p>
      </CardFooter>

    </form>
      </div>
</Card>
  )
}
