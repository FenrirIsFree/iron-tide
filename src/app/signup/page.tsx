'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { signUp } from '@/app/actions/auth'

export default function SignUpPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const username = form.get('username') as string
    const password = form.get('password') as string
    const confirmPassword = form.get('confirmPassword') as string

    // Client validation
    if (username.length < 3) { setError('Username must be at least 3 characters'); setLoading(false); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Invalid email address'); setLoading(false); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); setLoading(false); return }

    const result = await signUp(form)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md bg-surface rounded-xl border border-surface-border p-8">
          <h1 className="text-2xl font-bold text-accent text-center mb-6">Join The Iron Tide</h1>

          {success ? (
            <div className="text-center space-y-4">
              <p className="text-success font-medium">✅ Check your email to confirm your account</p>
              <Link href="/login" className="text-accent hover:text-accent-hover underline">Go to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-error text-sm bg-error/10 rounded-lg p-3">{error}</p>}

              <div>
                <label className="block text-accent text-sm font-medium mb-1">Email</label>
                <input name="email" type="email" required className="w-full px-3 py-2 bg-[#1C1C1C] text-foreground border border-surface-border rounded-lg focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="block text-accent text-sm font-medium mb-1">Username</label>
                <input name="username" type="text" required minLength={3} className="w-full px-3 py-2 bg-[#1C1C1C] text-foreground border border-surface-border rounded-lg focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="block text-accent text-sm font-medium mb-1">Password</label>
                <input name="password" type="password" required minLength={6} className="w-full px-3 py-2 bg-[#1C1C1C] text-foreground border border-surface-border rounded-lg focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="block text-accent text-sm font-medium mb-1">Confirm Password</label>
                <input name="confirmPassword" type="password" required className="w-full px-3 py-2 bg-[#1C1C1C] text-foreground border border-surface-border rounded-lg focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="block text-accent text-sm font-medium mb-1">In-Game Name <span className="text-foreground-muted">(optional)</span></label>
                <input name="inGameName" type="text" className="w-full px-3 py-2 bg-[#1C1C1C] text-foreground border border-surface-border rounded-lg focus:border-accent focus:outline-none" />
              </div>

              <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <p className="text-center text-foreground-secondary text-sm">
                Already have an account? <Link href="/login" className="text-accent hover:text-accent-hover underline">Login</Link>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
