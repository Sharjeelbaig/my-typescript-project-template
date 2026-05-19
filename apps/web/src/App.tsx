import { useMemo } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { ShieldCheck } from 'lucide-react'
import { auth } from './firebase'

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

type FormData = z.infer<typeof formSchema>

const HealthStatus = () => {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/public/health`)
      if (!res.ok) {
        throw new Error('API health request failed')
      }
      return (await res.json()) as { success: boolean; data: { status: string } }
    },
  })

  if (healthQuery.isLoading) return <p className="text-sm text-slate-500">Checking API...</p>
  if (healthQuery.isError) return <p className="text-sm text-red-600">API unavailable.</p>
  return <p className="text-sm text-green-700">API status: {healthQuery.data?.data.status ?? 'unknown'}</p>
}

const AppContent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (values: FormData) => {
    await signInWithEmailAndPassword(auth, values.email, values.password)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-6 px-4 py-10">
      <header className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm">
          <ShieldCheck className="h-4 w-4" />
          Firebase + Hono + Neon + Ollama Cloud boilerplate
        </div>
        <h1 className="text-3xl font-bold tracking-tight">MVP Starter</h1>
        <p className="text-slate-600">Default stack for Upwork/Fiverr/Freelancer style projects.</p>
      </header>

      <HealthStatus />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-slate-200 p-4">
        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            {...register('email')}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
          {errors.email ? <span className="text-xs text-red-600">{errors.email.message}</span> : null}
        </label>

        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            {...register('password')}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
          {errors.password ? (
            <span className="text-xs text-red-600">{errors.password.message}</span>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}

function App() {
  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App
