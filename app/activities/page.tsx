"use client"

import React, { useMemo, useEffect, useState } from "react"
import { VW_ActivityStats, Registration } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"
import { useRouter } from "next/navigation"
import { fetchAllActivities, fetchAllRegistrations } from "@/components/Activity/ActivitiesApi"

export default function ActivitiesPage() {
  const router = useRouter()
  
  // 1. State for data
  const [activities, setActivities] = useState<VW_ActivityStats[]>([])
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 2. Fetch data on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Fetching the optimized data directly from the DB views
        const [actData, regData] = await Promise.all([
          fetchAllActivities(),
          fetchAllRegistrations()
        ])
        setActivities(actData ?? [])
        setAllRegistrations(regData ?? [])
      } catch (error) {
        console.error("Failed to load activities:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // 3. Memoized filtering
  // Root activities are those where parentId is null
  const rootActivities = useMemo(() => {
    return activities.filter((a) => a.parentId === null)
  }, [activities])

  // 4. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 text-sm animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // 5. Empty State (Handled by ActivityGrid internally as well, but this is a global fallback)
  if (activities.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="bg-gray-900 p-6 rounded-full">
           <p className="text-gray-400 text-lg">No activities found.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-500 hover:text-blue-400 text-sm font-medium"
        >
          Click to refresh
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black py-10">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-10 px-10 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Activities
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Manage your event hierarchy, track registration counts, and monitor revenue at a glance.
          </p>
        </header>

        {/* Note: We no longer pass 'activityStats'. 
          Each 'activity' object inside 'rootActivities' already contains 
          its own registrationCounts and revenue data.
        */}
        <ActivityGrid
          title="Top Level Events"
          activities={rootActivities}
          allActivities={activities} 
          allRegistrations={allRegistrations} 
          onActivityClick={(slug) => {
            router.push(`/activities/${slug}`)
          }}
        />
      </div>
    </main>
  )
}