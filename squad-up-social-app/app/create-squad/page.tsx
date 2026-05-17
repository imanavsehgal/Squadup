"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Home,
  Info,
  MapPin,
  Plus,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const categories = [
  "Sports",
  "Study",
  "Entertainment",
  "Fitness",
  "Gaming",
  "Travel",
  "Events",
  "Other",
]

export default function CreateSquadPage() {
  const router = useRouter()
  const [isCheckingLogin, setIsCheckingLogin] = useState(true)

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Sports")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [maxMembers, setMaxMembers] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [isCreated, setIsCreated] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn")

    if (loggedIn !== "true") {
      router.push("/login")
    } else {
      setIsCheckingLogin(false)
    }
  }, [router])

  function resetError() {
    if (error) {
      setError("")
    }
  }

  function handleCreateSquad() {
    resetError()

    if (!title.trim()) {
      setError("Please enter a squad title.")
      return
    }

    if (!category.trim()) {
      setError("Please select a category.")
      return
    }

    if (!location.trim()) {
      setError("Please enter a location.")
      return
    }

    if (!date.trim()) {
      setError("Please enter a date and time.")
      return
    }

    if (!maxMembers.trim()) {
      setError("Please enter the maximum members.")
      return
    }

    const maxMembersNumber = Number(maxMembers)

    if (Number.isNaN(maxMembersNumber) || maxMembersNumber < 2) {
      setError("Maximum members must be at least 2.")
      return
    }

    const newSquad = {
      id: Date.now(),
      title: title.trim(),
      category,
      location: location.trim(),
      members: 1,
      maxMembers: maxMembersNumber,
      date: date.trim(),
      description: description.trim(),
      joined: true,
    }

    const existingSquads = JSON.parse(localStorage.getItem("squads") || "[]")
    const updatedSquads = [newSquad, ...existingSquads]

    localStorage.setItem("squads", JSON.stringify(updatedSquads))

    setIsCreated(true)

    setTimeout(() => {
      router.push("/explore")
    }, 900)
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
              <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                Explore
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-12 lg:grid-cols-[1fr_420px]">
        {/* Form */}
        <div>
          <Link
            href="/explore"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>

          <div className="mb-8">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
              Create
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Create a new squad
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Add the details people need before joining your activity.
            </p>
          </div>

          <Card className="border-white/10 bg-slate-900/80 text-white shadow-xl shadow-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Plus className="h-5 w-5 text-indigo-300" />
                Squad details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {isCreated && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Squad created. Redirecting to Explore...
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Squad title *
                </label>
                <input
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value)
                    resetError()
                  }}
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
                  placeholder="Example: Weekend Football"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value)
                    resetError()
                  }}
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none focus:border-indigo-400"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Location *
                  </label>
                  <input
                    value={location}
                    onChange={(event) => {
                      setLocation(event.target.value)
                      resetError()
                    }}
                    className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
                    placeholder="Example: City Park"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Date and time *
                  </label>
                  <input
                    value={date}
                    onChange={(event) => {
                      setDate(event.target.value)
                      resetError()
                    }}
                    className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
                    placeholder="Example: Saturday, 6 PM"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Maximum members *
                </label>
                <input
                  value={maxMembers}
                  onChange={(event) => {
                    setMaxMembers(event.target.value)
                    resetError()
                  }}
                  type="number"
                  min="2"
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
                  placeholder="Example: 10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-32 w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
                  placeholder="Add rules, meeting details, or anything people should know."
                />
              </div>

              <Button
                onClick={handleCreateSquad}
                disabled={isCreated}
                className="h-12 w-full rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
              >
                {isCreated ? "Creating..." : "Create Squad"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <aside className="lg:pt-[154px]">
          <Card className="sticky top-24 border-white/10 bg-white/[0.04] text-white shadow-xl shadow-black/20">
            <CardHeader>
              <CardTitle>Live preview</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-300">
                    {category || "Category"}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                    Open
                  </span>
                </div>

                <h2 className="text-xl font-bold">
                  {title || "Your squad title"}
                </h2>

                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{location || "Location"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{date || "Date and time"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>1/{maxMembers || "?"} members</span>
                  </div>

                  {description && (
                    <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-slate-400">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-300">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" />
                <p>
                  Created squads are saved in your browser for now. Backend
                  database connection can be added later.
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  )
}