'use client'

import { createContext, useContext } from 'react'

interface UserContextType {
  username: string | null
  rank: string | null
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType>({
  username: null,
  rank: null,
  isAuthenticated: false,
})

export function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode
  user: UserContextType
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}
