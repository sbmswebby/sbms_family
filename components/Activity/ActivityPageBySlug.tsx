"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { VW_ActivityStats, Registration } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"
import { RegistrationsModal } from "@/components/Activity/RegistrationsModal"

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

  // 1. Identify the current activity
  const currentActivity = useMemo(() => {
    return activities.find(
      activity => activity.slug === slug || activity.id === slug
    ) ?? null
  }, [activities, slug])

  // 2. Compute registrations specifically for this activity (including descendants)
  const currentRegistrations = useMemo(() => {
    if (!currentActivity) return []
    
    const getDescendantIds = (parentId: string): string[] => {
      return activities
        .filter(a => a.parentId === parentId)
        .flatMap(child => [child.id, ...getDescendantIds(child.id)])
    }

    const targetIds = [currentActivity.id, ...getDescendantIds(currentActivity.id)]
    return allRegistrations.filter(reg => targetIds.includes(reg.activityId))
  }, [currentActivity, activities, allRegistrations])

  // 3. Determine what to show in the grid (Children or Siblings)
  const activitiesToShow = useMemo(() => {
    if (!currentActivity) return []
    const children = activities.filter(a => a.parentId === currentActivity.id)
    
    return children.length > 0 
      ? children 
      : activities.filter(a => a.parentId === currentActivity.parentId && a.id !== currentActivity.id)
  }, [activities, currentActivity])

  if (!currentActivity) return null

  // A Leaf has no children based on the current data set
  const isLeaf = !currentActivity.hasChildren

  return (
    <section className="relative space-y-8 p-4 md:p-10">
      <header className="max-w-4xl space-y-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            {currentActivity.name}
          </h1>
          <p className="text-blue-400 font-medium text-sm uppercase tracking-wider">
            {isLeaf ? "Event Details & Registrations" : "Activity Category"}
          </p>
        </div>

        {/* 4. Description displayed here */}
        {currentActivity.description && (
          <div className="bg-gray-900/50 border-l-4 border-blue-600 p-6 rounded-r-2xl">
            <p className="text-gray-300 leading-relaxed text-lg italic">
              {currentActivity.description}
            </p>
          </div>
        )}
      </header>

      <div className="pt-4 border-t border-gray-800">
        <h2 className="text-xl font-semibold text-gray-200 mb-6 px-10">
          {currentActivity.hasChildren ? "Sub-Activities" : "Related Activities"}
        </h2>
        <ActivityGrid
          activities={activitiesToShow}
          allActivities={activities}
          allRegistrations={allRegistrations}
          onActivityClick={(newSlug) => {
            setUserClosedModal(false)
            router.push(`/activities/${newSlug}`)
          }}
        />
      </div>

      {isLeaf && !userClosedModal && (
        <RegistrationsModal
          activity={currentActivity}
          registrations={currentRegistrations}
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