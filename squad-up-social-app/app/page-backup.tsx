"use client"

import { useState, useEffect, useCallback } from "react"

// Types
interface User {
  username: string
  password: string
  firstName: string
  lastName: string
  bio: string
  avatarColor: string
  postsCount: number
  joinedCount: number
  acceptedCount: number
}

interface Call {
  id: number
  user: Omit<User, "password" | "postsCount" | "joinedCount" | "acceptedCount">
  note: string
  status: "pending" | "accepted" | "declined"
}

interface Post {
  id: number
  body: string
  category: string
  slots: number
  remainingSlots: number
  author: Omit<User, "password" | "postsCount" | "joinedCount" | "acceptedCount">
  createdAt: number
  calls: Call[]
}

interface Notification {
  id: number
  message: string
  postId: number | null
  read: boolean
  createdAt: number
}

// Constants
const AVATAR_COLORS = [
  "#e53935", "#d81b60", "#8e24aa", "#5e35b1",
  "#3949ab", "#1e88e5", "#039be5", "#00acc1",
  "#00897b", "#43a047", "#7cb342", "#c0ca33"
]

const CATEGORY_ICONS: Record<string, string> = {
  sports: "Sports",
  food: "Food",
  study: "Study",
  music: "Music",
  movies: "Movies",
  travel: "Travel",
  gaming: "Gaming",
  fitness: "Fitness",
  chill: "Chill",
  other: "Other"
}

const FAKE_USERS = [
  { username: "alex_fit", firstName: "Alex", lastName: "Kumar", avatarColor: "#e53935", bio: "Fitness enthusiast" },
  { username: "priya_music", firstName: "Priya", lastName: "Sharma", avatarColor: "#8e24aa", bio: "Music lover" },
  { username: "rahul_games", firstName: "Rahul", lastName: "Gupta", avatarColor: "#3949ab", bio: "Gamer" },
  { username: "sneha_foodie", firstName: "Sneha", lastName: "Patel", avatarColor: "#00897b", bio: "Foodie" },
  { username: "amit_travel", firstName: "Amit", lastName: "Singh", avatarColor: "#039be5", bio: "Traveler" },
  { username: "neha_study", firstName: "Neha", lastName: "Verma", avatarColor: "#d81b60", bio: "Student" }
]

const AI_SUGGESTIONS: Record<string, string[]> = {
  sports: [
    "Looking for cricket partners at Tau Devi Lal Stadium in Gurugram this evening. Need 5 players for a friendly match!",
    "Anyone up for a tennis session at DLF Golf and Country Club? Beginner-friendly!",
    "Planning a football match at Leisure Valley Park, Gurugram at 5 PM. Need 6 more players!"
  ],
  food: [
    "Let's try the famous Amritsari Kulcha at Kake Di Hatti in Ludhiana! Looking for fellow foodies",
    "Exploring the new Italian place at Cyber Hub, Gurugram tonight. Anyone want to join?",
    "Street food trail at Sector 29, Gurugram - momos, chaat, and more! Who's hungry?"
  ],
  study: [
    "UPSC study group at Punjab Agricultural University Library, Ludhiana. Looking for serious aspirants!",
    "Coding bootcamp prep at 91springboard, Gurugram. Let's crack DSA together!",
    "MBA entrance prep at British Council Library. Need 3 study partners!"
  ],
  music: [
    "Jam session at The Piano Man, Gurugram. Bringing my guitar - looking for vocalists!",
    "Bollywood karaoke night at Vapour Bar, Gurugram. Let's sing our hearts out!",
    "Classical music enthusiasts - attending Sufi night at Punjab Naatshala, Ludhiana!"
  ],
  movies: [
    "Catching the late-night show at Elante Mall, Chandigarh. Who's in?",
    "Marvel movie marathon at my place in DLF Phase 3. Popcorn provided!",
    "Art film screening at Tagore Theatre, Chandigarh. Looking for cinephiles!"
  ],
  travel: [
    "Weekend road trip to Kasauli from Ludhiana! Scenic drives and good vibes",
    "Trekking to Naina Devi Temple - leaving from Gurugram Saturday morning!",
    "Exploring the Golden Temple in Amritsar this Sunday. Need travel buddies!"
  ],
  gaming: [
    "LAN party at my place in Sector 56, Gurugram. Valorant tournament!",
    "Board game night at Cafe Wanderlust, Ludhiana. Catan and more!",
    "FIFA tournament at gaming cafe in Cyber City. Cash prizes!"
  ],
  fitness: [
    "Morning yoga at Central Park, Gurugram at 6 AM. All levels welcome!",
    "CrossFit session at Cult Fit, Sector 29. Looking for workout partners!",
    "Cycling group ride from Ludhiana to Khanna and back. 40km route!"
  ],
  chill: [
    "Rooftop chai and sunset at SkyLoft, Gurugram. Let's unwind!",
    "Book club meetup at The Reader's Cafe, Ludhiana. Currently reading Sapiens!",
    "Stargazing at Damdama Lake, Gurugram. Bringing telescope!"
  ],
  other: [
    "Photography walk at Lodhi Gardens, Delhi. Capture the autumn colors!",
    "Volunteering at animal shelter in Gurugram this weekend. Help needed!",
    "Art workshop at Punjab Kala Bhawan, Ludhiana. Learn watercolors!"
  ]
}

export default function SquadUp() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [users, setUsers] = useState<Record<string, User>>({
    demo: {
      username: "demo",
      password: "demo123",
      firstName: "Demo",
      lastName: "User",
      bio: "Just exploring SquadUp! Looking for fun activities.",
      avatarColor: "#1e88e5",
      postsCount: 0,
      joinedCount: 0,
      acceptedCount: 0
    }
  })
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loginError, setLoginError] = useState("")
  const [signupError, setSignupError] = useState("")

  // Form state
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupFirstName, setSignupFirstName] = useState("")
  const [signupLastName, setSignupLastName] = useState("")
  const [signupUsername, setSignupUsername] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupBio, setSignupBio] = useState("")
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0])

  // App state

  const [currentView, setCurrentView] = useState<"feed" | "myPosts" | "newPost" | "profile">("feed")
  const [posts, setPosts] = useState<Post[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all")
  const [showNotifications, setShowNotifications] = useState(false)

  // New post form
  const [postTitle, setPostTitle] = useState("")
  const [postBody, setPostBody] = useState("")
  const [postCategory, setPostCategory] = useState("sports")
  const [postLocation, setPostLocation] = useState("")
  const [postDate, setPostDate] = useState("")
  const [postTime, setPostTime] = useState("")
  const [postSlots, setPostSlots] = useState(2)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  // Join modal
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joiningPostId, setJoiningPostId] = useState<number | null>(null)
  const [joinNote, setJoinNote] = useState("")

  // Edit profile
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editFirstName, setEditFirstName] = useState("")
  const [editLastName, setEditLastName] = useState("")
  const [editBio, setEditBio] = useState("")
  const [editColor, setEditColor] = useState("")

  // Add notification helper
  const addNotification = useCallback((message: string, postId: number | null) => {
    setNotifications(prev => [{
      id: Date.now(),
      message,
      postId,
      read: false,
      createdAt: Date.now()
    }, ...prev])
  }, [])

  // Seed posts on login
  const seedPosts = useCallback((user: User) => {
    const now = Date.now()
    const samplePosts: Post[] = [
      { id: 1, body: "Going for a morning run at Leisure Valley Park in Gurugram at 6:30 AM tomorrow. Need 2 running buddies!", category: "fitness", slots: 2, remainingSlots: 2, author: FAKE_USERS[0], createdAt: now - 3600000, calls: [] },
      { id: 2, body: "Anyone up for trying the new South Indian place at Cyber Hub tonight? Looking for 3 more foodies!", category: "food", slots: 3, remainingSlots: 3, author: FAKE_USERS[3], createdAt: now - 7200000, calls: [] },
      { id: 3, body: "Planning a weekend trip to Kasauli from Ludhiana. Need 4 travel companions. Leaving Saturday morning!", category: "travel", slots: 4, remainingSlots: 4, author: FAKE_USERS[4], createdAt: now - 10800000, calls: [] },
      { id: 4, body: "Study group for CAT prep at British Library, Sector 17, Chandigarh. Looking for 2 serious aspirants!", category: "study", slots: 2, remainingSlots: 2, author: FAKE_USERS[5], createdAt: now - 14400000, calls: [] },
      { id: 5, body: "Valorant squad needed! Playing ranked tonight from 9 PM. Need 3 more players. Discord: rahul#1234", category: "gaming", slots: 3, remainingSlots: 3, author: FAKE_USERS[2], createdAt: now - 18000000, calls: [] },
      { id: 6, body: "Open mic night at The Piano Man Jazz Club in Gurugram! Looking for 2 people to jam with", category: "music", slots: 2, remainingSlots: 2, author: FAKE_USERS[1], createdAt: now - 21600000, calls: [] },
      { id: 7, body: "Movie night at Ambience Mall - watching the new Marvel movie at 8 PM. 3 tickets left!", category: "movies", slots: 3, remainingSlots: 3, author: FAKE_USERS[0], createdAt: now - 86400000 - 3600000, calls: [] },
      { id: 8, body: "Just chilling at Galleria Market rooftop cafe. Anyone free to hang out?", category: "chill", slots: 2, remainingSlots: 2, author: FAKE_USERS[1], createdAt: now - 1800000, calls: [] },
      { id: 9, body: "Looking for partners for evening badminton at DLF Club, Gurugram. 3 slots available!", category: "sports", slots: 3, remainingSlots: 3, author: { username: user.username, firstName: user.firstName, lastName: user.lastName, avatarColor: user.avatarColor, bio: user.bio }, createdAt: now - 5400000, calls: [] }
    ]
    setPosts(samplePosts)
  }, [])

  // Login handler
  const handleLogin = () => {
    if (!loginUsername || !loginPassword) {
      setLoginError("Please fill in all fields")
      return
    }
    const user = users[loginUsername]
    if (!user || user.password !== loginPassword) {
      setLoginError("Invalid username or password")
      return
    }
    setCurrentUser({ ...user, postsCount: 1 })
    setIsLoggedIn(true)
    seedPosts(user)
    setLoginError("")
  }

  // Signup handler
  const handleSignup = () => {
    if (!signupFirstName || !signupLastName || !signupUsername || !signupPassword) {
      setSignupError("Please fill in all required fields")
      return
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters")
      return
    }
    if (users[signupUsername]) {
      setSignupError("Username already taken")
      return
    }
    const newUser: User = {
      username: signupUsername,
      password: signupPassword,
      firstName: signupFirstName,
      lastName: signupLastName,
      bio: signupBio,
      avatarColor: selectedColor,
      postsCount: 1,
      joinedCount: 0,
      acceptedCount: 0
    }
    setUsers(prev => ({ ...prev, [signupUsername]: newUser }))
    setCurrentUser(newUser)
    setIsLoggedIn(true)
    seedPosts(newUser)
    setSignupError("")
  }

  // Logout
  const handleLogout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    setPosts([])
    setNotifications([])
    setCurrentView("feed")
    setLoginUsername("")
    setLoginPassword("")
  }

  // Time helpers
  const isPostExpired = (post: Post) => Date.now() - post.createdAt > 24 * 60 * 60 * 1000

  const getTimeLeft = (post: Post) => {
    const elapsed = Date.now() - post.createdAt
    const remaining = 24 * 60 * 60 * 1000 - elapsed
    if (remaining <= 0) return "Expired"
    const hours = Math.floor(remaining / (60 * 60 * 1000))
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  // Create post
  const createPost = () => {
  if (!postTitle.trim() || !postBody.trim() || !postLocation.trim() || !postDate || !postTime || !currentUser) return

  const fullBody = `${postTitle.trim()}

${postBody.trim()}

📍 ${postLocation.trim()}
🗓️ ${postDate}
⏰ ${postTime}`

  const newPost: Post = {
    id: Date.now(),
    body: fullBody,
    category: postCategory,
    slots: postSlots,
    remainingSlots: postSlots,
    author: {
      username: currentUser.username,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      avatarColor: currentUser.avatarColor,
      bio: currentUser.bio
    },
    createdAt: Date.now(),
    calls: []
  }

  setPosts(prev => [newPost, ...prev])
  setCurrentUser(prev => prev ? { ...prev, postsCount: prev.postsCount + 1 } : null)

  setPostTitle("")
  setPostBody("")
  setPostLocation("")
  setPostDate("")
  setPostTime("")
  setPostSlots(2)
  setAiSuggestions([])

  addNotification("Your plan was posted!", newPost.id)
  setCurrentView("feed")
}

  // Join request
  const openJoinModal = (postId: number) => {
    setJoiningPostId(postId)
    setJoinNote("")
    setShowJoinModal(true)
  }

  const submitJoinRequest = () => {
    if (!joiningPostId || !currentUser) return
    setPosts(prev => prev.map(post => {
      if (post.id === joiningPostId) {
        return {
          ...post,
          calls: [...post.calls, {
            id: Date.now(),
            user: { username: currentUser.username, firstName: currentUser.firstName, lastName: currentUser.lastName, avatarColor: currentUser.avatarColor, bio: currentUser.bio },
            note: joinNote,
            status: "pending"
          }]
        }
      }
      return post
    }))
    setCurrentUser(prev => prev ? { ...prev, joinedCount: prev.joinedCount + 1 } : null)
    setShowJoinModal(false)
  }

  // Accept/decline calls
  const acceptCall = (postId: number, callId: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId && post.remainingSlots > 0) {
        return {
          ...post,
          remainingSlots: post.remainingSlots - 1,
          calls: post.calls.map(call => 
            call.id === callId ? { ...call, status: "accepted" as const } : call
          )
        }
      }
      return post
    }))
    setCurrentUser(prev => prev ? { ...prev, acceptedCount: prev.acceptedCount + 1 } : null)
  }

  const declineCall = (postId: number, callId: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          calls: post.calls.map(call => 
            call.id === callId ? { ...call, status: "declined" as const } : call
          )
        }
      }
      return post
    }))
  }

  // AI suggestions
  const getAISuggestions = () => {
    setAiLoading(true)
    setTimeout(() => {
      setAiSuggestions(AI_SUGGESTIONS[postCategory] || AI_SUGGESTIONS.other)
      setAiLoading(false)
    }, 1500)
  }

  // Edit profile
  const saveProfile = () => {
    if (!editFirstName || !editLastName || !currentUser) return
    const updated = {
      ...currentUser,
      firstName: editFirstName,
      lastName: editLastName,
      bio: editBio,
      avatarColor: editColor || currentUser.avatarColor
    }
    setCurrentUser(updated)
    setUsers(prev => ({ ...prev, [updated.username]: updated }))
    setShowEditProfile(false)
    addNotification("Profile updated!", null)
  }

  // Initialize edit form
  useEffect(() => {
    if (currentUser && showEditProfile) {
      setEditFirstName(currentUser.firstName)
      setEditLastName(currentUser.lastName)
      setEditBio(currentUser.bio)
      setEditColor(currentUser.avatarColor)
    }
  }, [showEditProfile, currentUser])

  // Simulate incoming call
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      const timeout = setTimeout(() => {
        const userPost = posts.find(p => p.author.username === currentUser.username)
        if (userPost) {
          const caller = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)]
          setPosts(prev => prev.map(post => {
            if (post.id === userPost.id) {
              return {
                ...post,
                calls: [...post.calls, {
                  id: Date.now(),
                  user: caller,
                  note: "Hey! Would love to join you!",
                  status: "pending"
                }]
              }
            }
            return post
          }))
          addNotification(`${caller.firstName} wants to join your plan!`, userPost.id)
        }
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [isLoggedIn, currentUser, posts.length, addNotification])

  // Update timers
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts(prev => [...prev])
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Notification helpers
  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const goToPost = (postId: number | null, notifId: number) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n))
    setShowNotifications(false)
    if (postId) {
      const post = posts.find(p => p.id === postId)
      if (post?.author.username === currentUser?.username) {
        setCurrentView("myPosts")
      } else {
        setCurrentView("feed")
      }
    }
  }

  // Auth Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-800 p-5">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
          {!showSignup ? (
            <>
              <h1 className="text-3xl font-bold text-emerald-600 text-center mb-2">SquadUp</h1>
              <p className="text-gray-500 text-center mb-6">Find your squad for any activity</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={e => setLoginUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
                <button
                  onClick={handleLogin}
                  className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => { setShowSignup(true); setLoginError("") }}
                  className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Create Account
                </button>
              </div>
              <p className="text-gray-400 text-sm text-center mt-4">Demo: username &quot;demo&quot;, password &quot;demo123&quot;</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-emerald-600 text-center mb-2">Join SquadUp</h1>
              <p className="text-gray-500 text-center mb-6">Create your account</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={signupFirstName}
                      onChange={e => setSignupFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={signupLastName}
                      onChange={e => setSignupLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={signupUsername}
                    onChange={e => setSignupUsername(e.target.value)}
                    placeholder="Choose username"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password (min 6 characters)</label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio (optional)</label>
                  <textarea
                    value={signupBio}
                    onChange={e => setSignupBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar Color</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                          selectedColor === color ? "ring-2 ring-offset-2 ring-gray-800" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                {signupError && <p className="text-red-500 text-sm text-center">{signupError}</p>}
                <button
                  onClick={handleSignup}
                  className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Create Account
                </button>
                <button
                  onClick={() => { setShowSignup(false); setSignupError("") }}
                  className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Main App
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Topbar */}
      <header className="bg-white px-5 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-emerald-600">SquadUp</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-2xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-semibold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl w-80 max-h-96 overflow-y-auto z-50">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold">Notifications</h3>
                  <button onClick={markAllRead} className="text-emerald-600 text-sm">Mark all read</button>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.slice(0, 20).map(n => (
                    <button
                      key={n.id}
                      onClick={() => goToPost(n.postId, n.id)}
                      className={`w-full p-4 border-b text-left hover:bg-gray-50 ${!n.read ? "bg-emerald-50" : ""}`}
                    >
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <span className="text-xs text-gray-400">{getTimeAgo(n.createdAt)}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setCurrentView("profile")}
            className="w-10 h-10 rounded-full text-white font-semibold text-lg"
            style={{ backgroundColor: currentUser?.avatarColor }}
          >
            {currentUser?.firstName.charAt(0)}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-5 pb-24 max-w-2xl mx-auto w-full">
        {/* Feed View */}
        {currentView === "feed" && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg">No plans yet. Be the first to create one!</p>
              </div>
            ) : (
              [...posts].sort((a, b) => b.createdAt - a.createdAt).map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  isExpired={isPostExpired(post)}
                  timeLeft={getTimeLeft(post)}
                  showCalls={false}
                  onJoin={openJoinModal}
                  onAccept={acceptCall}
                  onDecline={declineCall}
                />
              ))
            )}
          </div>
        )}

        {/* My Posts View */}
        {currentView === "myPosts" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-5">My Plans</h2>
            <div className="space-y-4">
              {posts.filter(p => p.author.username === currentUser?.username).length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-lg">You haven&apos;t created any plans yet.</p>
                </div>
              ) : (
                posts
                  .filter(p => p.author.username === currentUser?.username)
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      isExpired={isPostExpired(post)}
                      timeLeft={getTimeLeft(post)}
                      showCalls={true}
                      onJoin={openJoinModal}
                      onAccept={acceptCall}
                      onDecline={declineCall}
                    />
                  ))
              )}
            </div>
          </div>
        )}

       {/* New Post View */}
{currentView === "newPost" && (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Create New Plan</h2>
      <p className="text-sm text-gray-500 mt-1">
        Add clear details so the right people can join your plan.
      </p>
    </div>

    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Plan Title
        </label>
        <input
          type="text"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="Example: Evening badminton session"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
          placeholder="Describe the activity, skill level, cost, meeting point, or anything important..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={postCategory}
            onChange={(e) => setPostCategory(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
          >
            {Object.entries(CATEGORY_ICONS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Open Slots
          </label>
          <input
            type="number"
            value={postSlots}
            onChange={(e) => setPostSlots(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            min={1}
            max={20}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={postLocation}
          onChange={(e) => setPostLocation(e.target.value)}
          placeholder="Example: DLF Club, Gurugram"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={postDate}
            onChange={(e) => setPostDate(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            value={postTime}
            onChange={(e) => setPostTime(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
        <div className="flex gap-3 flex-wrap items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Need help writing?</h3>
            <p className="text-sm text-gray-500">Generate quick ideas based on your selected category.</p>
          </div>

          <button
            onClick={getAISuggestions}
            disabled={aiLoading}
            className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {aiLoading ? "Generating..." : "AI Ideas"}
          </button>
        </div>

        {aiLoading && (
          <div className="flex items-center gap-2 text-gray-500 mt-3">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin" />
            <span>Getting suggestions...</span>
          </div>
        )}

        {aiSuggestions.length > 0 && (
          <div className="mt-4 space-y-2">
            {aiSuggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => {
                  setPostTitle(suggestion.split(".")[0] || "New Plan")
                  setPostBody(suggestion)
                  setAiSuggestions([])
                }}
                className="w-full p-3 bg-white rounded-lg text-left text-sm text-gray-700 hover:ring-2 hover:ring-emerald-600 transition-shadow"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={createPost}
        disabled={
          !postTitle.trim() ||
          !postBody.trim() ||
          !postLocation.trim() ||
          !postDate ||
          !postTime
        }
        className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Post Plan
      </button>
    </div>
  </div>
)}

        {/* Profile View */}
        {currentView === "profile" && currentUser && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {currentUser.firstName.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{currentUser.firstName} {currentUser.lastName}</h2>
            <p className="text-gray-400 mb-3">@{currentUser.username}</p>
            <p className="text-gray-600 mb-6">{currentUser.bio || "No bio yet"}</p>
            
            <div className="flex justify-center gap-8 py-5 border-y mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{currentUser.postsCount}</p>
                <p className="text-sm text-gray-400">Plans Posted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{currentUser.joinedCount}</p>
                <p className="text-sm text-gray-400">Plans Joined</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{currentUser.acceptedCount}</p>
                <p className="text-sm text-gray-400">Calls Accepted</p>
              </div>
            </div>

            <button
              onClick={() => setShowEditProfile(!showEditProfile)}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors mb-3"
            >
              Edit Profile
            </button>

            {showEditProfile && (
              <div className="text-left mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={e => setEditFirstName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={e => setEditLastName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar Color</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                          editColor === color ? "ring-2 ring-offset-2 ring-gray-800" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={saveProfile}
                  className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full py-3 bg-gray-100 text-red-500 font-semibold rounded-xl hover:bg-gray-200 transition-colors mt-5"
            >
              Log Out
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex z-50">
        {[
          { view: "feed" as const, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Feed" },
          { view: "myPosts" as const, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>, label: "My Plans" },
          { view: "newPost" as const, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>, label: "New Plan" },
          { view: "profile" as const, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: "Profile" }
        ].map(item => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
              currentView === item.view ? "text-emerald-600" : "text-gray-400"
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Request to Join</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Add a note (optional)</label>
              <textarea
                value={joinNote}
                onChange={e => setJoinNote(e.target.value)}
                placeholder="Introduce yourself or add details..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitJoinRequest}
                className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Post Card Component
function PostCard({
  post,
  currentUser,
  isExpired,
  timeLeft,
  showCalls,
  onJoin,
  onAccept,
  onDecline
}: {
  post: Post
  currentUser: User | null
  isExpired: boolean
  timeLeft: string
  showCalls: boolean
  onJoin: (postId: number) => void
  onAccept: (postId: number, callId: number) => void
  onDecline: (postId: number, callId: number) => void
}) {
  const isOwn = post.author.username === currentUser?.username
  const hasJoined = post.calls.some(c => c.user.username === currentUser?.username && c.status === "accepted")
  const hasPending = post.calls.some(c => c.user.username === currentUser?.username && c.status === "pending")
  const pendingCalls = post.calls.filter(c => c.status === "pending")

  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${
        isOwn ? "border-l-emerald-600" : "border-l-transparent"
      } ${isExpired ? "opacity-50 grayscale-[0.5]" : ""}`}
    >
      <div className="flex items-center mb-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-3"
          style={{ backgroundColor: post.author.avatarColor }}
        >
          {post.author.firstName.charAt(0)}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">{post.author.firstName} {post.author.lastName}</h4>
          <span className="text-sm text-gray-400">@{post.author.username}</span>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full">
          {CATEGORY_ICONS[post.category]}
        </span>
      </div>
      <p className="text-gray-800 leading-relaxed mb-4">{post.body}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {timeLeft}
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {post.remainingSlots}/{post.slots} slots
          </span>
        </div>
        {!isOwn && !isExpired && (
          hasJoined ? (
            <button disabled className="px-5 py-2 bg-gray-200 text-gray-500 font-semibold rounded-lg cursor-not-allowed">
              Joined
            </button>
          ) : hasPending ? (
            <button disabled className="px-5 py-2 bg-gray-200 text-gray-500 font-semibold rounded-lg cursor-not-allowed">
              Pending
            </button>
          ) : post.remainingSlots > 0 ? (
            <button
              onClick={() => onJoin(post.id)}
              className="px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Join
            </button>
          ) : (
            <button disabled className="px-5 py-2 bg-gray-200 text-gray-500 font-semibold rounded-lg cursor-not-allowed">
              Full
            </button>
          )
        )}
      </div>

      {/* Incoming Calls Section */}
      {showCalls && pendingCalls.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h5 className="text-sm font-medium text-gray-600 mb-3">Incoming Requests ({pendingCalls.length})</h5>
          <div className="space-y-2">
            {pendingCalls.map(call => (
              <div key={call.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: call.user.avatarColor }}
                >
                  {call.user.firstName.charAt(0)}
                </div>
                <div className="flex-1 ml-3">
                  <h5 className="text-sm font-medium text-gray-800">{call.user.firstName} {call.user.lastName}</h5>
                  <p className="text-sm text-gray-500">{call.note ? `"${call.note}"` : "No note"}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAccept(post.id, call.id)}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onDecline(post.id, call.id)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-300"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
