"use client"

import React, { useState, useMemo } from "react"
import { VW_ActivityStats, Registration } from "@/types/types"
import { ActivityCard } from "./ActivityCard"
import { RegistrationsModal } from "./RegistrationsModal"
import ActivityFilterBar from "./ActivityFilterBar" // Import the new bar

interface ActivityGridProps {
  activities: VW_ActivityStats[]
  activityStats: Record<string, { totalRegistrations: number; childCount: number }>
  allActivities: VW_ActivityStats[]
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
  // New state to hold filtered/sorted results
  const [displayActivities, setDisplayActivities] = useState<VW_ActivityStats[]>(activities)

  const selectedActivity = useMemo(() => 
    allActivities.find(a => a.id === selectedActivityId),
    [selectedActivityId, allActivities]
  )

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
    <section className="py-6 space-y-6">
      {title && (
        <h2 className="px-10 text-2xl font-bold tracking-tight text-white">{title}</h2>
      )}

      {/* 1. Integration of the Filter Bar */}
      <ActivityFilterBar 
        activities={activities} 
        activityStats={activityStats}
        onFilterChange={setDisplayActivities} 
      />

      {/* 2. The Grid */}
      <div className="px-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            stats={activityStats[activity.id]}
            onClick={onActivityClick}
            onRegistrationsClick={(id) => setSelectedActivityId(id)}
          />
        ))}

        {/* Empty State */}
        {displayActivities.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500">No activities found matching your filters.</p>
          </div>
        )}
      </div>

      {selectedActivity && (
        <RegistrationsModal
          activity={selectedActivity}
          registrations={modalRegistrations}
          onClose={() => setSelectedActivityId(null)}
          onAddRegistration={(id) => console.log("Registering:", id)}
        />
      )}
    </section>
  )
}