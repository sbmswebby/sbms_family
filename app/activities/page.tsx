"use client" // This must be at the very top

import React, { useMemo, useEffect, useState } from "react"
import { VW_ActivityStats, Registration } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"
import { useRouter } from "next/navigation"
import { fetchAllActivities, fetchAllRegistrations } from "@/components/Activity/ActivitiesApi"
import { buildActivityStats } from "@/components/Activity/ActivityUtils"

export default function ActivitiesPage() {
  const router = useRouter()
  
  // 1. State for data (since it's a client component)
  const [activities, setActivities] = useState<VW_ActivityStats[]>([])
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)

    const activityStats = useMemo(
      () => buildActivityStats(activities, allRegistrations),
      [activities, allRegistrations]
    )

  // 2. Fetch data on mount
  useEffect(() => {
    async function loadData() {
      try {
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

  // 3. Memoized filtering (Now 'activities' is defined in state)
  const rootActivities = useMemo(() => {
    return activities.filter((a) => a.parentId === null)
  }, [activities])

  // 4. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </div>
    )
  }

  // 5. Empty State
  if (activities.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">No activities found.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black py-10">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-10 px-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Activities
          </h1>
          <p className="mt-2 text-gray-400">
            Manage events, sub-activities, and track registrations.
          </p>
        </header>

        <ActivityGrid
          title="Root Events"
          activities={rootActivities}
          activityStats={activityStats} 
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