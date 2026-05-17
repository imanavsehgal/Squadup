"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Calendar,
  Filter,
  Home,
  MapPin,
  Plus,
  Search,
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

const defaultSquads: Squad[] = [
  {
    id: 1,
    title: "Weekend Football",
    category: "Sports",
    location: "Local Ground",
    members: 8,
    maxMembers: 12,
    date: "Today, 5:00 PM",
    joined: false,
  },
  {
    id: 2,
    title: "DSA Study Group",
    category: "Study",
    location: "Public Library",
    members: 4,
    maxMembers: 6,
    date: "Tomorrow, 3:00 PM",
    joined: false,
  },
  {
    id: 3,
    title: "Movie Night",
    category: "Entertainment",
    location: "Community Lounge",
    members: 10,
    maxMembers: 15,
    date: "Friday, 8:00 PM",
    joined: false,
  },
  {
    id: 4,
    title: "Morning Fitness Run",
    category: "Fitness",
    location: "City Park",
    members: 6,
    maxMembers: 10,
    date: "Saturday, 6:30 AM",
    joined: false,
  },
  {
    id: 5,
    title: "Gaming Squad",
    category: "Gaming",
    location: "Online",
    members: 5,
    maxMembers: 8,
    date: "Tonight, 9:00 PM",
    joined: false,
  },
  {
    id: 6,
    title: "Weekend Trip",
    category: "Travel",
    location: "Nearby Hills",
    members: 7,
    maxMembers: 12,
    date: "Sunday, 7:00 AM",
    joined: false,
  },
]

const categories = [
  "All",
  "Sports",
  "Study",
  "Entertainment",
  "Fitness",
  "Gaming",
  "Travel",
]

export default function ExplorePage() {
  const [squads, setSquads] = useState<Squad[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const savedSquads = JSON.parse(localStorage.getItem("squads") || "[]")
    setSquads([...savedSquads, ...defaultSquads])
  }, [])

  const filteredSquads = useMemo(() => {
    return squads.filter((squad) => {
      const matchesSearch =
        squad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        squad.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        squad.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategory === "All" || squad.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [squads, searchTerm, selectedCategory])

  function handleJoin(id: number) {
    const updatedSquads = squads.map((squad) =>
      squad.id === id && !squad.joined && squad.members < squad.maxMembers
        ? { ...squad, members: squad.members + 1, joined: true }
        : squad
    )

    setSquads(updatedSquads)

    const customSquads = updatedSquads.filter((squad) => squad.id > 1000)
    localStorage.setItem("squads", JSON.stringify(customSquads))
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

            <Link href="/create-squad">
              <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                <Plus className="mr-2 h-4 w-4" />
                Create Squad
              </Button>
            </Link>

            <Link href="/profile">
              <Button
                variant="outline"
                className="border-white/10 bg-white text-slate-950 hover:bg-slate-200"
              >
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b border-white/10 px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
              Explore
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Find your next squad
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">
              Browse active squads for sports, study, entertainment, fitness,
              gaming, travel, and local activities.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, category, or location..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                      selectedCategory === category
                        ? "bg-indigo-500 text-white"
                        : "bg-white text-slate-950 hover:bg-slate-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <Filter className="h-4 w-4" />
              Showing {filteredSquads.length} of {squads.length} squads
            </div>
          </div>
        </div>
      </section>

      {/* Squad Grid */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        {filteredSquads.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
              <Search className="h-7 w-7" />
            </div>

            <h2 className="text-2xl font-bold">No squads found</h2>
            <p className="mx-auto mt-3 max-w-md text-slate-400">
              Try a different search term or category filter.
            </p>

            <Link href="/create-squad">
              <Button className="mt-6 bg-indigo-500 text-white hover:bg-indigo-600">
                Create a Squad
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredSquads.map((squad) => {
              const isFull = squad.members >= squad.maxMembers
              const progress = Math.min(
                (squad.members / squad.maxMembers) * 100,
                100
              )

              return (
                <Card
                  key={squad.id}
                  className="overflow-hidden border-white/10 bg-slate-900/80 text-white shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:bg-slate-900"
                >
                  <CardHeader>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-300">
                        {squad.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          isFull
                            ? "bg-red-500/15 text-red-300"
                            : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        {isFull ? "Full" : "Open"}
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

                    <Button
                      onClick={() => handleJoin(squad.id)}
                      disabled={squad.joined || isFull}
                      className={`mt-2 w-full rounded-xl ${
                        squad.joined
                          ? "bg-emerald-500 text-white hover:bg-emerald-500"
                          : "bg-white text-slate-950 hover:bg-slate-200"
                      }`}
                    >
                      {squad.joined
                        ? "Joined"
                        : isFull
                          ? "Squad Full"
                          : "Join Squad"}
                    </Button>
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