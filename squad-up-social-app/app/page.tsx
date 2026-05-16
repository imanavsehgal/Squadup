"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, MapPin, MessageCircle } from "lucide-react"

const squads = [
  {
    id: 1,
    title: "Football Match",
    category: "Sports",
    location: "College Ground",
    members: 8,
    maxMembers: 12,
    date: "Today, 5:00 PM",
  },
  {
    id: 2,
    title: "DSA Study Group",
    category: "Study",
    location: "Library",
    members: 4,
    maxMembers: 6,
    date: "Tomorrow, 3:00 PM",
  },
  {
    id: 3,
    title: "Movie Night",
    category: "Entertainment",
    location: "Hostel Common Room",
    members: 10,
    maxMembers: 15,
    date: "Friday, 8:00 PM",
  },
]

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [fullName, setFullName] = useState("")

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn")
    const savedFullName = localStorage.getItem("fullName") || "User"

    setIsLoggedIn(loggedIn === "true")
    setFullName(savedFullName)
  }, [])

  function handleLogout() {
    localStorage.removeItem("isLoggedIn")
    setIsLoggedIn(false)
    setFullName("")
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <Link href="/">
          <h1 className="text-2xl font-bold tracking-tight">SquadUp</h1>
        </Link>

        <div className="flex gap-3">
          {isLoggedIn ? (
            <>
              <span className="hidden md:flex items-center text-sm text-slate-300">
                Hi, {fullName}
              </span>

              <Link href="/explore">
                <Button variant="outline" className="text-black">
                  Explore
                </Button>
              </Link>

              <Link href="/create-squad">
                <Button>Create Squad</Button>
              </Link>

              <Link href="/profile">
                <Button variant="outline" className="text-black">
                  Profile
                </Button>
              </Link>

              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="text-black">
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
          Find people. Create squads. Join activities.
        </h2>

        <p className="mt-5 text-slate-300 text-lg">
          SquadUp helps students create and join groups for sports, study
          sessions, events, trips, and campus activities.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link href="/create-squad">
            <Button size="lg">Create Squad</Button>
          </Link>

          <Link href="/explore">
            <Button size="lg" variant="outline" className="text-black">
              Explore Squads
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 max-w-6xl mx-auto">
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <Users className="h-8 w-8 mb-2" />
            <CardTitle>Find Members</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            Connect with people who share the same interest.
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <Calendar className="h-8 w-8 mb-2" />
            <CardTitle>Create Events</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            Plan matches, study sessions, hangouts, and trips.
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <MapPin className="h-8 w-8 mb-2" />
            <CardTitle>Nearby Activities</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            Discover activities happening around your campus.
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <MessageCircle className="h-8 w-8 mb-2" />
            <CardTitle>Group Chat</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            Communicate with your squad before the event.
          </CardContent>
        </Card>
      </section>

      {/* Squad List */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold">Available Squads</h3>

          <Link href="/explore">
            <Button variant="outline" className="text-black">
              View All
            </Button>
          </Link>
        </div>

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

                <Button className="w-full mt-3">Join Squad</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}