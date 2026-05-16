"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
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
    title: "Football Match",
    category: "Sports",
    location: "College Ground",
    members: 8,
    maxMembers: 12,
    date: "Today, 5:00 PM",
    joined: false,
  },
  {
    id: 2,
    title: "DSA Study Group",
    category: "Study",
    location: "Library",
    members: 4,
    maxMembers: 6,
    date: "Tomorrow, 3:00 PM",
    joined: false,
  },
  {
    id: 3,
    title: "Movie Night",
    category: "Entertainment",
    location: "Hostel Common Room",
    members: 10,
    maxMembers: 15,
    date: "Friday, 8:00 PM",
    joined: false,
  },
]

export default function ExplorePage() {
  const [squads, setSquads] = useState<Squad[]>([])

  useEffect(() => {
    const savedSquads = JSON.parse(localStorage.getItem("squads") || "[]")
    setSquads([...savedSquads, ...defaultSquads])
  }, [])

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
      <nav className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <Link href="/">
          <h1 className="text-2xl font-bold">SquadUp</h1>
        </Link>

        <div className="flex gap-3">
  <Link href="/create-squad">
    <Button>Create Squad</Button>
  </Link>

  <Link href="/profile">
    <Button variant="outline" className="text-black">
      Profile
    </Button>
  </Link>

  <Link href="/">
    <Button variant="outline" className="text-black">
      Home
    </Button>
  </Link>
</div>
      </nav>

      <section className="px-6 py-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Explore Squads</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {squads.map((squad) => (
            <Card key={squad.id} className="bg-slate-900 border-slate-800 text-white">
              <CardHeader>
                <CardTitle>{squad.title}</CardTitle>
                <p className="text-sm text-slate-400">{squad.category}</p>
              </CardHeader>

              <CardContent className="space-y-3 text-slate-300">
                <p>📍 {squad.location}</p>
                <p>🕒 {squad.date}</p>
                <p>
                  👥 {squad.members}/{squad.maxMembers} members
                </p>

                {squad.description && (
                  <p className="text-sm text-slate-400">{squad.description}</p>
                )}

                <Button
                  onClick={() => handleJoin(squad.id)}
                  disabled={squad.joined || squad.members >= squad.maxMembers}
                  className="w-full mt-3"
                >
                  {squad.joined ? "Joined" : "Join Squad"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}