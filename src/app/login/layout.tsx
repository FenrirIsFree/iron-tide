import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login — The Iron Tide',
  description: 'Sign in to your Iron Tide account.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
