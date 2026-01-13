"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Activity, Registration } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"

interface ActivitiesRootPageComponentProps {
  activities: Activity[]
  allRegistrations: Registration[] // Added to match the server fetch
}

export const ActivitiesRootPageComponent: React.FC<
  ActivitiesRootPageComponentProps
> = ({ activities, allRegistrations }) => {
  const router = useRouter()

  // Filter only top-level activities for the main display grid
  const rootActivities = activities.filter(
    (activity) => activity.parentId === null
  )

  const handleClick = (slug: string): void => {
    router.push(`/activities/${slug}`)
  }

  return (
    <div className="min-h-screen bg-black">
      <ActivityGrid
        title="Activities"
        activities={rootActivities}      // The filtered list to show as cards
        allActivities={activities}       // The full master list for counting sub-activity signups
        allRegistrations={allRegistrations} // The live registration data
        onActivityClick={handleClick}
      />
    </div>
  )
}