"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Home,
  LogOut,
  MapPin,
  Plus,
  ShieldCheck,
  Trophy,
  User,
  Users,
} from "lucide-react"

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

  const joinedSquads = useMemo(
    () => squads.filter((squad) => squad.joined),
    [squads]
  )

  const totalMembers = useMemo(
    () => squads.reduce((total, squad) => total + squad.members, 0),
    [squads]
  )

  function handleLogout() {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("fullName")
    localStorage.removeItem("username")
    router.push("/")
  }

  if (isCheckingLogin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 text-slate-300">
          Checking login...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-950">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">SquadUp</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant="outline"
                className="border-white/10 bg-white text-slate-950 hover:bg-slate-200"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>

            <Link href="/explore">
              <Button
                variant="outline"
                className="border-white/10 bg-white text-slate-950 hover:bg-slate-200"
              >
                Explore
              </Button>
            </Link>

            <Link href="/create-squad">
              <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                <Plus className="mr-2 h-4 w-4" />
                Create Squad
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-12">
        {/* Header */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 to-cyan-500/10 p-8">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-950">
              <User className="h-8 w-8" />
            </div>

            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
              Profile
            </p>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              {fullName}
            </h1>

            <p className="mt-3 text-lg text-slate-300">@{username}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Active account
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                <Trophy className="h-4 w-4 text-indigo-300" />
                Squad creator
              </span>
            </div>
          </div>

          <Card className="border-white/10 bg-slate-900/80 text-white shadow-xl shadow-black/20">
            <CardHeader>
              <CardTitle>Account actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Link href="/create-squad">
                <Button className="h-11 w-full rounded-xl bg-indigo-500 text-white hover:bg-indigo-600">
                  Create New Squad
                </Button>
              </Link>

              <Link href="/explore">
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-xl border-white/10 bg-white text-slate-950 hover:bg-slate-200"
                >
                  Explore Squads
                </Button>
              </Link>

              <Button
                onClick={handleLogout}
                variant="destructive"
                className="h-11 w-full rounded-xl"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card className="border-white/10 bg-white/[0.04] text-white">
            <CardHeader>
              <CardTitle className="text-base text-slate-300">
                Created Squads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-black">{squads.length}</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] text-white">
            <CardHeader>
              <CardTitle className="text-base text-slate-300">
                Joined Squads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-black">{joinedSquads.length}</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] text-white">
            <CardHeader>
              <CardTitle className="text-base text-slate-300">
                Total Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-black">{totalMembers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Created Squads */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
              Your activity
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              My Created Squads
            </h2>
            <p className="mt-2 text-slate-400">
              Squads created from this browser are shown here.
            </p>
          </div>
        </div>

        {squads.length === 0 ? (
          <Card className="border-white/10 bg-slate-900/80 text-white">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
                <Plus className="h-7 w-7" />
              </div>

              <h3 className="text-2xl font-bold">No squads created yet</h3>
              <p className="mx-auto mt-3 max-w-md text-slate-400">
                Create your first squad and it will appear in your profile.
              </p>

              <Link href="/create-squad">
                <Button className="mt-6 bg-indigo-500 text-white hover:bg-indigo-600">
                  Create Squad
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {squads.map((squad) => {
              const progress = Math.min(
                (squad.members / squad.maxMembers) * 100,
                100
              )

              return (
                <Card
                  key={squad.id}
                  className="overflow-hidden border-white/10 bg-slate-900/80 text-white shadow-xl shadow-black/20"
                >
                  <CardHeader>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-300">
                        {squad.category}
                      </span>

                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                        Created
                      </span>
                    </div>

                    <CardTitle className="text-xl">{squad.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{squad.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{squad.date}</span>
                    </div>

                    {squad.description && (
                      <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-slate-400">
                        {squad.description}
                      </p>
                    )}

                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                        <span>Members</span>
                        <span>
                          {squad.members}/{squad.maxMembers}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}