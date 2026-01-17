"use client"

import React, { useState, useMemo } from "react"
import { VW_ActivityStats, Registration } from "@/types/types"
import { ActivityCard } from "./ActivityCard"
import { RegistrationsModal } from "./RegistrationsModal"
import ActivityFilterBar from "./ActivityFilterBar"
import { Inbox, SearchX } from "lucide-react"

interface ActivityGridProps {
  activities: VW_ActivityStats[]
  allActivities: VW_ActivityStats[]
  allRegistrations: Registration[]
  onActivityClick: (slugOrId: string) => void
  title?: string
}

export const ActivityGrid: React.FC<ActivityGridProps> = ({
  activities = [],
  allActivities = [],
  allRegistrations = [],
  onActivityClick,
  title,
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
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

  // Determine which empty state to show
  const isHardEmpty = activities.length === 0
  const isFilterEmpty = activities.length > 0 && displayActivities.length === 0

  return (
    <section className="py-6 space-y-6">
      {title && (
        <h2 className="px-10 text-2xl font-bold tracking-tight text-white">{title}</h2>
      )}

      {/* 1. Filter Bar (No longer needs activityStats) */}
      {!isHardEmpty && (
        <ActivityFilterBar 
          activities={activities} 
          onFilterChange={setDisplayActivities} 
        />
      )}

      <div className="px-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            // Passing stats directly from the activity object
            stats={{
              totalRegistrations: activity.registrationCounts.total,
              childCount: allActivities.filter(a => a.parentId === activity.id).length
            }}
            onClick={onActivityClick}
            onRegistrationsClick={(id) => setSelectedActivityId(id)}
          />
        ))}

        {/* Hard Empty State */}
        {isHardEmpty && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border border-dashed border-gray-800 rounded-3xl bg-gray-900/20">
            <div className="bg-gray-800 p-4 rounded-full mb-4">
              <Inbox className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-gray-200 font-semibold">No Activities Found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs text-balance">
              There aren`t any activities assigned to this section yet.
            </p>
          </div>
        )}

        {/* Filter Empty State */}
        {isFilterEmpty && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border border-dashed border-gray-800 rounded-3xl bg-gray-900/20">
            <div className="bg-blue-500/10 p-4 rounded-full mb-4">
              <SearchX className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-gray-200 font-semibold">No matches found</h3>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your filters or search terms.
            </p>
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