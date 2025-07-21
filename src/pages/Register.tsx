import RegisterForm from '../components/forms/RegisterForm'
import { DotBackground } from '@/components/DotBackground'

export default function Register() {
  return (

    <DotBackground>

      <div className="px-4 py-10 md:py-20">
        <div className="relative mx-auto container text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          <RegisterForm />

        </div>

      </div>
    </DotBackground>
  )
}
