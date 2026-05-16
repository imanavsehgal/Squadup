"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateSquadPage() {
  const router = useRouter()
  const [isCheckingLogin, setIsCheckingLogin] = useState(true)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn")

    if (loggedIn !== "true") {
      router.push("/login")
    } else {
      setIsCheckingLogin(false)
    }
  }, [router])

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [maxMembers, setMaxMembers] = useState("")
  const [description, setDescription] = useState("")

  function handleCreateSquad() {
    if (!title || !category || !location || !date || !maxMembers) {
      alert("Please fill all required fields")
      return
    }

    const newSquad = {
      id: Date.now(),
      title,
      category,
      location,
      members: 1,
      maxMembers: Number(maxMembers),
      date,
      description,
      joined: true,
    }

    const existingSquads = JSON.parse(localStorage.getItem("squads") || "[]")
    const updatedSquads = [newSquad, ...existingSquads]

    localStorage.setItem("squads", JSON.stringify(updatedSquads))

    router.push("/explore")
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

          <Link href="/">
            <Button variant="outline" className="text-black">
              Home
            </Button>
          </Link>
        </div>
      </nav>

      <section className="px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Create Squad</h1>

          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle>Squad Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md bg-slate-800 border border-slate-700 px-4 py-3 outline-none"
                placeholder="Squad title"
              />

              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md bg-slate-800 border border-slate-700 px-4 py-3 outline-none"
                placeholder="Category e.g. Sports, Study, Event"
              />

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md bg-slate-800 border border-slate-700 px-4 py-3 outline-none"
                placeholder="Location"
              />

              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md bg-slate-800 border border-slate-700 px-4 py-3 outline-none"
                placeholder="Date and time"
              />

              <input
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                type="number"
                className="w-full rounded-md bg-slate-800 border border-slate-700 px-4 py-3 outline-none"
                placeholder="Maximum members"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md bg-slate-800 border border-slate-700 px-4 py-3 outline-none min-h-32"
                placeholder="Description"
              />

              <Button onClick={handleCreateSquad} className="w-full">
                Create Squad
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}