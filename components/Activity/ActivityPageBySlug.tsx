"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
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

  const currentActivity = useMemo(() => {
    return activities.find(
      activity => activity.slug === slug || activity.id === slug
    ) ?? null
  }, [activities, slug])

  // 1. Breadcrumbs logic (Depth > 2)
  const breadcrumbs = useMemo(() => {
    if (!currentActivity) return []
    const trail: VW_ActivityStats[] = []
    let pointer: VW_ActivityStats | undefined = currentActivity
    while (pointer) {
      trail.unshift(pointer)
      pointer = activities.find(a => a.id === pointer?.parentId)
    }
    return trail
  }, [currentActivity, activities])

  // 2. Sorting to keep "free_registrations" at the top
  const activitiesToShow = useMemo(() => {
    if (!currentActivity) return []
    const children = activities.filter(a => a.parentId === currentActivity.id)
    
    const baseList = children.length > 0 
      ? children 
      : activities.filter(a => a.parentId === currentActivity.parentId && a.id !== currentActivity.id)

    return [...baseList].sort((a, b) => {
      if (a.name === 'free_registrations') return -1;
      if (b.name === 'free_registrations') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [activities, currentActivity])

  // 3. Current level registrations
  const currentRegistrations = useMemo(() => {
    if (!currentActivity) return []
    return allRegistrations.filter(reg => reg.activityId === currentActivity.id)
  }, [currentActivity, allRegistrations])

  if (!currentActivity) return null

  // It's a leaf if it has no children OR if it's the special system bucket
  const isLeaf = !currentActivity.hasChildren || currentActivity.name === 'free_registrations'

  return (
    <section className="relative space-y-6 p-4 md:p-10">
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4 overflow-x-auto whitespace-nowrap">
        <button onClick={() => router.push('/activities')} className="hover:text-white flex items-center gap-1">
          <span className="flex"><Home className="w-4 h-4" /><p className="w-1"> </p>All Activities</span>
        </button>
        {breadcrumbs.map((crumb) => (
          <React.Fragment key={crumb.id}>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <button
              onClick={() => router.push(`/activities/${crumb.slug}`)}
              className={crumb.id === currentActivity.id ? "text-blue-400 font-bold" : "hover:text-white"}
            >
              {crumb.name === 'free_registrations' ? 'General' : crumb.name}
            </button>
          </React.Fragment>
        ))}
      </nav>

      <header>
        <h1 className="text-4xl font-extrabold text-white">{currentActivity.name === 'free_registrations' ? 'General Registrations' : currentActivity.name}</h1>
        {currentActivity.description && (
          <p className="mt-4 text-gray-400 italic border-l-2 border-blue-500 pl-4">{currentActivity.description}</p>
        )}
      </header>

      <div className="pt-8 border-t border-gray-800">
        <ActivityGrid
          activities={activitiesToShow}
          allActivities={activities}
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
        />
      )}
    </section>
  )
}