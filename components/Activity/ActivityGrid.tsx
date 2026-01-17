"use client"

import React, { useState, useMemo } from "react"
import { Activity, Registration } from "@/types/types"
import { ActivityCard } from "./ActivityCard"
import { RegistrationsModal } from "./RegistrationsModal"

interface ActivityGridProps {
  activities: Activity[]
  /** Pre-computed stats record mapping activityId -> stats */
  activityStats: Record<string, { totalRegistrations: number; childCount: number }>
  /** Required to filter the actual list of people for the modal */
  allActivities: Activity[]
  allRegistrations: Registration[]
  onActivityClick: (slugOrId: string) => void
  title?: string
}

export const ActivityGrid: React.FC<ActivityGridProps> = ({
  activities = [],
  activityStats = {},
  allActivities = [],
  allRegistrations = [],
  onActivityClick,
  title,
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)

  // 1. Find the activity object for the modal
  // We search allActivities in case the specific activity isn't in the current 'activities' slice
  const selectedActivity = useMemo(() => 
    allActivities.find(a => a.id === selectedActivityId),
    [selectedActivityId, allActivities]
  )

  // 2. Compute registrations for the modal (Non-recursive lookup)
  // We use the same logic as buildActivityStats but only for the selected node
  const modalRegistrations = useMemo(() => {
    if (!selectedActivityId) return []

    const getDescendantIds = (id: string): string[] => {
      const children = allActivities.filter(a => a.parentId === id)
      return children.flatMap(child => [child.id, ...getDescendantIds(child.id)])
    }

    const relevantIds = [selectedActivityId, ...getDescendantIds(selectedActivityId)]
    return allRegistrations.filter(reg => relevantIds.includes(reg.activityId))
  }, [selectedActivityId, allActivities, allRegistrations])

  return (
    <section className="m-10 space-y-6">
      {title && (
        <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            stats={activityStats[activity.id]}
            onClick={onActivityClick}
            onRegistrationsClick={(id) => setSelectedActivityId(id)}
          />
        ))}
      </div>

      {selectedActivity && (
        <RegistrationsModal
          activity={selectedActivity}
          registrations={modalRegistrations}
          onClose={() => setSelectedActivityId(null)}
          onAddRegistration={(id) => {
            console.log("Redirecting to registration for activity:", id)
          }}
        />
      )}
    </section>
  )
}