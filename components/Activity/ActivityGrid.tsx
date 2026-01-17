"use client"

import React, { useState, useMemo, useEffect } from "react"
import { VW_ActivityStats, Registration } from "@/types/types"
import { ActivityCard } from "./ActivityCard"
import { RegistrationsModal } from "./RegistrationsModal"
import ActivityFilterBar from "./ActivityFilterBar"
import { fetchRegistrationsForActivity } from "./ActivitiesApi"
import { Inbox, SearchX, Loader2 } from "lucide-react"

interface ActivityGridProps {
  activities: VW_ActivityStats[]
  allActivities: VW_ActivityStats[]
  onActivityClick: (slugOrId: string) => void
  title?: string
}

export const ActivityGrid: React.FC<ActivityGridProps> = ({
  activities = [],
  allActivities = [],
  onActivityClick,
  title,
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [modalRegistrations, setModalRegistrations] = useState<Registration[]>([])
  const [isModalLoading, setIsModalLoading] = useState(false)

  // Initialize state with sorted data immediately
  const [displayActivities, setDisplayActivities] = useState<VW_ActivityStats[]>(() => 
    [...activities].sort((a, b) => {
      const dateA = a.startTime ? new Date(a.startTime).getTime() : 0;
      const dateB = b.startTime ? new Date(b.startTime).getTime() : 0;
      return dateB - dateA;
    })
  )

  // Fetch registrations only when modal is opened
  useEffect(() => {
    // Early return if no activity selected - state will reset naturally
    if (!selectedActivityId) return;

    let mounted = true;
    const activityId = selectedActivityId; // Capture non-null value

    async function loadModalData() {
      if (!mounted) return;
      
      setIsModalLoading(true)
      
      const data = await fetchRegistrationsForActivity(activityId).catch((error) => {
        console.error("Failed to load registrations for modal:", error)
        return []
      })
      
      if (!mounted) return;
      
      setModalRegistrations(data)
      setIsModalLoading(false)
    }

    loadModalData()
    
    return () => {
      mounted = false
    }
  }, [selectedActivityId])

  // Reset modal data when closing
  const handleCloseModal = () => {
    setSelectedActivityId(null)
    setModalRegistrations([])
    setIsModalLoading(false)
  }

  const selectedActivity = useMemo(() => 
    allActivities.find(a => a.id === selectedActivityId),
    [selectedActivityId, allActivities]
  )

  const isHardEmpty = activities.length === 0
  const isFilterEmpty = activities.length > 0 && displayActivities.length === 0

  return (
    <section className="py-6 space-y-6">
      {title && (
        <h2 className="px-10 text-2xl font-bold tracking-tight text-white">{title}</h2>
      )}

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
            stats={{
              totalRegistrations: activity.registrationCounts.total,
              childCount: allActivities.filter(a => a.parentId === activity.id).length
            }}
            onClick={onActivityClick}
            onRegistrationsClick={(id) => setSelectedActivityId(id)}
          />
        ))}

        {isHardEmpty && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border border-dashed border-gray-800 rounded-3xl bg-gray-900/20">
            <div className="bg-gray-800 p-4 rounded-full mb-4">
              <Inbox className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-gray-200 font-semibold">No Activities Found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs text-balance">
              There aren&apos;t any activities assigned to this section yet.
            </p>
          </div>
        )}

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
          onClose={handleCloseModal}
          onAddRegistration={(id) => console.log("Registering to:", id)}
        />
      )}

      {isModalLoading && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}
    </section>
  )
}