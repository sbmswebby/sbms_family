"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Home } from "lucide-react" // Added for breadcrumbs
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

  // 2. Hierarchy-aware Breadcrumb Logic
  const breadcrumbs = useMemo(() => {
    if (!currentActivity) return []

    const trail: VW_ActivityStats[] = []
    let pointer: VW_ActivityStats | undefined = currentActivity

    while (pointer) {
      trail.unshift(pointer) // Add to the beginning of the array
      pointer = activities.find(a => a.id === pointer?.parentId)
    }

    return trail
  }, [currentActivity, activities])

  // 3. Compute registrations specifically for this activity (including descendants)
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

  // 4. Determine what to show in the grid
  const activitiesToShow = useMemo(() => {
    if (!currentActivity) return []
    const children = activities.filter(a => a.parentId === currentActivity.id)
    
    return children.length > 0 
      ? children 
      : activities.filter(a => a.parentId === currentActivity.parentId && a.id !== currentActivity.id)
  }, [activities, currentActivity])

  if (!currentActivity) return null

  const isLeaf = !currentActivity.hasChildren

  return (
    <section className="relative space-y-6 p-4 md:p-10">
      
      {/* --- 1.5 Breadcrumbs Integration --- */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4 overflow-x-auto whitespace-nowrap pb-2">
        <button 
          onClick={() => router.push('/activities')}
          className="hover:text-white transition-colors flex items-center gap-1"
        >
          
          <span className="flex"><Home className="w-4 h-4" /><p className="w-1"> </p>All Activities</span>
        </button>
        
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.id}>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <button
              onClick={() => {
                if (crumb.id !== currentActivity.id) {
                  setUserClosedModal(false);
                  router.push(`/activities/${crumb.slug}`);
                }
              }}
              disabled={crumb.id === currentActivity.id}
              className={`transition-colors truncate max-w-[150px] ${
                crumb.id === currentActivity.id 
                  ? "text-blue-400 font-semibold cursor-default" 
                  : "hover:text-white"
              }`}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </nav>

      <header className="max-w-4xl space-y-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            {currentActivity.name}
          </h1>
          <p className="text-blue-400 font-medium text-sm uppercase tracking-wider">
            {isLeaf ? "Event Details & Registrations" : "Activity Category"}
          </p>
        </div>

        {currentActivity.description && (
          <div className="bg-gray-900/50 border-l-4 border-blue-600 p-6 rounded-r-2xl">
            <p className="text-gray-300 leading-relaxed italic sm:text-sm md:text-xl">
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