import { motion, useAnimation } from "framer-motion";
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { cn, registerSchema } from '@/lib/utils'
import { useAuthRegister } from '../../services/auth.service'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'

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

  const { mutate: registerUser, isLoading, error } = useAuthRegister(() => {
    toast.success('Registered successfully 🎉')
    navigate('/login')
  })

  const onSubmit = (data: RegisterData) => {
    registerUser(data, {
      onError: () =>
        toast.error(error?.response?.data?.message || 'Registration failed ❌')
    })
  }


  return (
    <Card
      className={cn(
        'relative  w-[450px] h-[470px] border border-transparent p-[2px] rounded-xl shadow-lg aspect-video isolate backdrop-blur-sm overflow-hidden'
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
          <CardTitle className="text-lg md:text-xl text-white">Create Account</CardTitle>
          <CardDescription className="text-xs md:text-sm text-zinc-300">
            Fill the form to register
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="px-6 grid gap-4 space-y-5">
            {/* Name */}
            <div className="grid gap-2 relative">
              <Label htmlFor="name">Name</Label>
              <Input className={`border !text-white ${errors.name ? 'border-rose-500' : ''}`} id="name" {...register('name')} />
              {errors.name && (
                <p className="text-rose-500 text-sm mt-1 absolute -bottom-6.5 text-left font-extralight">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2 relative">
              <Label htmlFor="email">Email</Label>
              <Input className={`border !text-white ${errors.email ? 'border-rose-500' : ''}`} id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-rose-500 text-sm mt-1 absolute -bottom-6.5 text-left font-extralight">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input className={`border ${errors.password ? 'border-rose-500' : ''}`} id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-rose-500 text-sm mt-1 absolute -bottom-6.5 text-left font-extralight">{errors.password.message}</p>
              )}
            </div>

          </CardContent>

          <CardFooter className="flex flex-col px-6 gap-3 mt-4">
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? 'Registering…' : 'Register'}
            </Button>

            <p className="text-sm text-white text-muted-foreground text-center">
              Already have an account?
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto ml-1 text-white underline cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </p>
          </CardFooter>
        </form>
      </div>
    </Card>
  )
}
