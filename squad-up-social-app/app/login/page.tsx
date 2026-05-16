"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleLogin() {
    if (!username || !password) {
      alert("Please enter username and password")
      return
    }

    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("username", username)

    const existingFullName = localStorage.getItem("fullName")

    if (!existingFullName) {
      localStorage.setItem("fullName", username)
    }

    router.push("/explore")
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <Link href="/">
          <h1 className="text-2xl font-bold">SquadUp</h1>
        </Link>

        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>
      </nav>

      <section className="flex items-center justify-center px-6 py-20">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <CardTitle className="text-3xl">Login</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-4 py-3 outline-none"
              placeholder="Username"
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-4 py-3 outline-none"
              placeholder="Password"
            />

            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}