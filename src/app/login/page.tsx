'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { signIn } from '@/app/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    try {
      const result = await signIn(form)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
    } catch {
      // redirect throws NEXT_REDIRECT — that's expected
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md bg-surface rounded-xl border border-surface-border p-8">
          <h1 className="text-2xl font-bold text-accent text-center mb-6">Welcome Back, Sailor</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-error text-sm bg-error/10 rounded-lg p-3">{error}</p>}

            <div>
              <label className="block text-accent text-sm font-medium mb-1">Email</label>
              <input name="email" type="email" required className="w-full px-3 py-2 bg-[#1C1C1C] text-foreground border border-surface-border rounded-lg focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="block text-accent text-sm font-medium mb-1">Password</label>
              <input name="password" type="password" required className="w-full px-3 py-2 bg-[#1C1C1C] text-foreground border border-surface-border rounded-lg focus:border-accent focus:outline-none" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="flex justify-between text-sm">
              <Link href="/signup" className="text-accent hover:text-accent-hover underline">Create account</Link>
              <button type="button" className="text-foreground-muted hover:text-foreground-secondary cursor-not-allowed">Forgot password?</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
