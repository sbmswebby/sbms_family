"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Activity } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"

interface ActivitiesRootPageComponentProps {
  activities: Activity[]
}

export const ActivitiesRootPageComponent: React.FC<
  ActivitiesRootPageComponentProps
> = ({ activities }) => {
  const router = useRouter()

  const rootActivities = activities.filter(
    (activity) => activity.parentId === null
  )

  const handleClick = (slug: string): void => {
    router.push(`/activities/${slug}`)
  }

  return (
    <ActivityGrid
      title="Activities"
      activities={rootActivities}
      onActivityClick={handleClick}
    />
  )
}
