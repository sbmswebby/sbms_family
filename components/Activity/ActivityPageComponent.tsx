"use client"

import React, { useMemo } from "react"
import { useRouter } from "next/navigation"
import { VW_ActivityStats, Registration } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"

/**
 * Props for the root activities page
 */
interface ActivitiesRootPageComponentProps {
  activities: VW_ActivityStats[]
  allRegistrations: Registration[]
}

/**
 * Builds aggregated stats for each activity.
 * Computed once at the page level.
 */
const buildActivityStats = (
  activities: VW_ActivityStats[],
  registrations: Registration[]
): Record<string, { totalRegistrations: number; childCount: number }> => {
  const childrenMap: Record<string, string[]> = {}

  // Build parent → children lookup
  for (const activity of activities) {
    if (activity.parentId) {
      if (!childrenMap[activity.parentId]) {
        childrenMap[activity.parentId] = []
      }
      childrenMap[activity.parentId].push(activity.id)
    }
  }

  // Recursive descendant resolver
  const getDescendants = (id: string): string[] => {
    const directChildren = childrenMap[id] ?? []
    return directChildren.flatMap(childId => [
      childId,
      ...getDescendants(childId),
    ])
  }

  const stats: Record<string, { totalRegistrations: number; childCount: number }> = {}

  for (const activity of activities) {
    const descendantIds = getDescendants(activity.id)
    const relevantIds = [activity.id, ...descendantIds]

    stats[activity.id] = {
      childCount: descendantIds.length,
      totalRegistrations: registrations.filter(reg =>
        relevantIds.includes(reg.activityId)
      ).length,
    }
  }

  return stats
}

export const ActivitiesRootPageComponent: React.FC<
  ActivitiesRootPageComponentProps
> = ({ activities, allRegistrations }) => {
  const router = useRouter()

  /**
   * Only top-level activities are shown in the initial grid view
   */
  const rootActivities = useMemo(
    () => activities.filter(activity => activity.parentId === null),
    [activities]
  )

  /**
   * Compute aggregated activity statistics
   */
  const activityStats = useMemo(
    () => buildActivityStats(activities, allRegistrations),
    [activities, allRegistrations]
  )

  const handleClick = (slugOrId: string): void => {
    router.push(`/activities/${slugOrId}`)
  }

  return (
    <div className="min-h-screen bg-black">
      <ActivityGrid
        title="Activities"
        activities={rootActivities}
        activityStats={activityStats}
        /* We pass these global arrays so the Grid can filter 
           specific registration lists for the Modal 
        */
        allActivities={activities}
        allRegistrations={allRegistrations}
        onActivityClick={handleClick}
      />
    </div>
  )
}