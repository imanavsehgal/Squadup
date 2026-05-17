"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Calendar,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const squads = [
   {
    id: 1,
    title: "Weekend Football",
    category: "Sports",
    location: "Local Ground",
    members: 8,
    maxMembers: 12,
    date: "Today, 5:00 PM",
  },
  {
    id: 2,
    title: "DSA Study Group",
    category: "Study",
    location: "Public Library",
    members: 4,
    maxMembers: 6,
    date: "Tomorrow, 3:00 PM",
  },
  {
    id: 3,
    title: "Movie Night",
    category: "Entertainment",
    location: "Community Lounge",
    members: 10,
    maxMembers: 15,
    date: "Friday, 8:00 PM",
  },
  {
    id: 4,
    title: "Morning Fitness Run",
    category: "Fitness",
    location: "City Park",
    members: 6,
    maxMembers: 10,
    date: "Saturday, 6:30 AM",
  },
  {
    id: 5,
    title: "Gaming Squad",
    category: "Gaming",
    location: "Online",
    members: 5,
    maxMembers: 8,
    date: "Tonight, 9:00 PM",
  },
  {
    id: 6,
    title: "Weekend Trip",
    category: "Travel",
    location: "Nearby Hills",
    members: 7,
    maxMembers: 12,
    date: "Sunday, 7:00 AM",
  },
]

const features = [
  {
    title: "Find Members",
    description: "Connect with people who share your interests.",
    icon: Users,
  },
  {
    title: "Create Events",
    description: "Plan matches, study sessions, trips, and hangouts.",
    icon: Calendar,
  },
  {
    title: "Nearby Activities",
    description: "Discover squads and activities happening around you.",
    icon: MapPin,
  },
  {
    title: "Group Chat",
    description: "Coordinate with your squad before the activity starts.",
    icon: MessageCircle,
  },
]

const steps = [
  {
    title: "Explore",
    description: "Browse active squads by category, time, and location.",
    icon: Search,
  },
  {
    title: "Join",
    description: "Pick a squad that matches your interest and availability.",
    icon: Users,
  },
  {
    title: "Show up",
    description: "Meet your squad and participate in the activity.",
    icon: Zap,
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
    localStorage.removeItem("fullName")
    setIsLoggedIn(false)
    setFullName("")
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
            {isLoggedIn ? (
              <>
                <span className="hidden items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 md:flex">
                  Hi, {fullName}
                </span>

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

                <Button onClick={handleLogout} variant="destructive">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-white/10 bg-white text-slate-950 hover:bg-slate-200"
                  >
                    Login
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-20 md:py-28">
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-10 top-32 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            <Sparkles className="h-4 w-4 text-indigo-300" />
            Build your circle faster with SquadUp's social activity matching app.
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight md:text-7xl">
            Find people. Create squads. Join activities.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            SquadUp helps people discover others, create activity groups, and
join sports, study sessions, events, trips, fitness, gaming, and local hangouts.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href={isLoggedIn ? "/create-squad" : "/signup"}>
              <Button
                size="lg"
                className="h-12 rounded-xl bg-indigo-500 px-7 text-white hover:bg-indigo-600"
              >
                Create Squad
              </Button>
            </Link>

            <Link href="/explore">
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-white/10 bg-white px-7 text-slate-950 hover:bg-slate-200"
              >
                Explore Squads
              </Button>
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-bold">25+</p>
              <p className="mt-1 text-sm text-slate-400">Active squads</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-bold">120+</p>
              <p className="mt-1 text-sm text-slate-400">Active members</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-bold">8</p>
              <p className="mt-1 text-sm text-slate-400">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 md:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon

          return (
            <Card
              key={feature.title}
              className="border-white/10 bg-white/[0.04] text-white shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <CardHeader>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-slate-300">
                {feature.description}
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* Squad List */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
              Available now
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Popular squads
            </h2>
            <p className="mt-2 max-w-2xl text-slate-400">
              Join an existing squad or create your own activity group.
            </p>
          </div>

          <Link href="/explore">
            <Button
              variant="outline"
              className="rounded-xl border-white/10 bg-white text-slate-950 hover:bg-slate-200"
            >
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {squads.map((squad) => (
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
                    Open
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
                      style={{
                        width: `${(squad.members / squad.maxMembers) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <Button className="mt-2 w-full rounded-xl bg-white text-slate-950 hover:bg-slate-200">
                  Join Squad
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-white/10 bg-white/[0.03] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
              Simple flow
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              How SquadUp works
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <Card
                  key={step.title}
                  className="border-white/10 bg-slate-950/70 text-white"
                >
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-5xl font-black text-white/10">
                        0{index + 1}
                      </span>
                    </div>

                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="text-sm leading-6 text-slate-300">
                    {step.description}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 p-8 text-center md:p-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to build your next squad?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Start with a small activity. Invite people, meet nearby, and keep
your plans organized in one place.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={isLoggedIn ? "/create-squad" : "/signup"}>
              <Button className="h-12 rounded-xl bg-white px-7 text-slate-950 hover:bg-slate-200">
                Get Started
              </Button>
            </Link>

            <Link href="/explore">
              <Button
                variant="outline"
                className="h-12 rounded-xl border-white/10 bg-slate-950 text-white hover:bg-slate-900"
              >
                Browse Squads
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-slate-400 md:flex-row md:items-center">
          <p>© 2026 SquadUp. Built for real-world communities.</p>

          <div className="flex gap-5">
            <Link href="/explore" className="hover:text-white">
              Explore
            </Link>
            <Link href="/create-squad" className="hover:text-white">
              Create Squad
            </Link>
            <Link href="/profile" className="hover:text-white">
              Profile
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}