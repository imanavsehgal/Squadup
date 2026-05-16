"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Squad = {
  id: number
  title: string
  category: string
  location: string
  members: number
  maxMembers: number
  date: string
  description?: string
  joined: boolean
}

export default function ProfilePage() {
  const router = useRouter()

  const [squads, setSquads] = useState<Squad[]>([])
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [isCheckingLogin, setIsCheckingLogin] = useState(true)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn")

    if (loggedIn !== "true") {
      router.push("/login")
      return
    }

    const savedFullName = localStorage.getItem("fullName") || "SquadUp User"
    const savedUsername = localStorage.getItem("username") || "user"
    const savedSquads = JSON.parse(localStorage.getItem("squads") || "[]")

    setFullName(savedFullName)
    setUsername(savedUsername)
    setSquads(savedSquads)
    setIsCheckingLogin(false)
  }, [router])

  function handleLogout() {
    localStorage.removeItem("isLoggedIn")
    router.push("/")
  }

  if (isCheckingLogin) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-300">Checking login...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <Link href="/">
          <h1 className="text-2xl font-bold">SquadUp</h1>
        </Link>

        <div className="flex gap-3">
          <Link href="/explore">
            <Button>Explore</Button>
          </Link>

          <Link href="/create-squad">
            <Button variant="outline" className="text-black">
              Create Squad
            </Button>
          </Link>
        </div>
      </nav>

      <section className="px-6 py-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Profile</h1>
            <p className="text-slate-400 mt-2">
              Logged in as {fullName} (@{username})
            </p>
          </div>

          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle>Total Created Squads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{squads.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle>Joined Squads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {squads.filter((squad) => squad.joined).length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-400 font-medium">Active</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4">My Created Squads</h2>

        {squads.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardContent className="py-8 text-slate-400">
              You have not created any squad yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {squads.map((squad) => (
              <Card key={squad.id} className="bg-slate-900 border-slate-800 text-white">
                <CardHeader>
                  <CardTitle>{squad.title}</CardTitle>
                  <p className="text-sm text-slate-400">{squad.category}</p>
                </CardHeader>

                <CardContent className="space-y-2 text-slate-300">
                  <p>📍 {squad.location}</p>
                  <p>🕒 {squad.date}</p>
                  <p>
                    👥 {squad.members}/{squad.maxMembers} members
                  </p>

                  {squad.description && (
                    <p className="text-sm text-slate-400">{squad.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}