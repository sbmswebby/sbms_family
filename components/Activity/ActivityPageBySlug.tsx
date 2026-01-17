"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { VW_ActivityStats, Registration } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"
import { RegistrationsModal } from "@/components/Activity/RegistrationsModal"
import { buildActivityStats } from "./ActivityUtils"

interface ActivityPageBySlugProps {
  activities: VW_ActivityStats[]
  allRegistrations: Registration[]
  slug: string
}



export const ActivityPageBySlug: React.FC<ActivityPageBySlugProps> = ({
  activities,
  allRegistrations,
  slug,
}) => {
  const router = useRouter()
  const [userClosedModal, setUserClosedModal] = useState(false)

  const currentActivity = useMemo(() => {
    return activities.find(
      activity => activity.slug === slug || activity.id === slug
    ) ?? null
  }, [activities, slug])

  const activityStats = useMemo(
    () => buildActivityStats(activities, allRegistrations),
    [activities, allRegistrations]
  )

  /**
   * Filter the specific registrations for the current activity (and descendants)
   * This is passed to the Modal to avoid recursion inside the Modal.
   */
  const currentRegistrations = useMemo(() => {
    if (!currentActivity) return []
    
    // Helper to find descendants specifically for the current activity
    const getDescendantIds = (parentId: string): string[] => {
      return activities
        .filter(a => a.parentId === parentId)
        .flatMap(child => [child.id, ...getDescendantIds(child.id)])
    }

    const targetIds = [currentActivity.id, ...getDescendantIds(currentActivity.id)]
    return allRegistrations.filter(reg => targetIds.includes(reg.activityId))
  }, [currentActivity, activities, allRegistrations])

  const activitiesToShow = useMemo(() => {
    if (!currentActivity) return []
    const children = activities.filter(a => a.parentId === currentActivity.id)
    
    return children.length > 0 
      ? children 
      : activities.filter(a => a.parentId === currentActivity.parentId && a.id !== currentActivity.id)
  }, [activities, currentActivity])

  if (!currentActivity) return null

  const isLeaf = activityStats[currentActivity.id]?.childCount === 0

  return (
    <section className="relative space-y-6 p-4 md:p-10">
      <header>
        <h1 className="text-3xl font-bold text-white">
          {currentActivity.name}
        </h1>
        <p className="text-gray-400">
          {isLeaf ? "Event Details & Registrations" : "Select a sub-activity"}
        </p>
      </header>

      <ActivityGrid
        activities={activitiesToShow}
        activityStats={activityStats}
        // Required by updated Grid to handle its internal Modal logic
        allActivities={activities}
        allRegistrations={allRegistrations}
        onActivityClick={(newSlug) => {
          setUserClosedModal(false)
          router.push(`/activities/${newSlug}`)
        }}
      />

      {isLeaf && !userClosedModal && (
        <RegistrationsModal
          activity={currentActivity}
          registrations={currentRegistrations} // Passing computed array instead of global arrays
          onClose={() => {
            setUserClosedModal(true)
            router.back()
          }}
          onAddRegistration={(id: string) => {
            console.log("Registering for activity:", id)
          }}
        />
      )}
    </section>
  )
}