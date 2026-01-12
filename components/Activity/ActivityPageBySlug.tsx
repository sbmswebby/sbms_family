"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Activity, Registration } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"
import { ParentActivitySummary } from "@/components/Activity/ParentActivitySummary"
import { ActivityRegistrationSection } from "@/components/Activity/ActivityRegistrationSection"

interface ActivityPageBySlugProps {
  activities: Activity[]
  registrations: Registration[] // all registrations in the system (can be filtered by leaf)
  slug: string
}

/**
 * Renders an activity page based on URL slug
 * - Shows parent summary
 * - Shows sub-activities if present
 * - Shows registrations if this is a leaf activity
 */
export const ActivityPageBySlug: React.FC<ActivityPageBySlugProps> = ({
  activities,
  registrations,
  slug,
}) => {
  const router = useRouter()

  // Find the current activity based on the slug
  const currentActivity =
    activities.find((activity) => activity.slug === slug) ?? null

  if (!currentActivity) {
    return (
      <p className="text-center py-12 text-gray-500">
        Activity not found for slug: <strong>{slug}</strong>
      </p>
    )
  }

  // Filter out children of this activity
  const children = activities.filter(
    (activity) => activity.parentId === currentActivity.id
  )

  const isLeaf = children.length === 0

  // Handler to navigate to a child activity
  const handleClick = (childSlug: string): void => {
    router.push(`/activities/${childSlug}`)
  }

  // Filter registrations for this leaf activity
  const activityRegistrations = isLeaf
    ? registrations.filter((r) => r.activityId === currentActivity.id)
    : []

  return (
    <section className="space-y-8">
      <ParentActivitySummary activity={currentActivity} />

      {children.length > 0 && (
        <ActivityGrid
          title="Sub Activities"
          activities={children}
          onActivityClick={handleClick}
        />
      )}

      {isLeaf && (
        <ActivityRegistrationSection
          activityId={currentActivity.id}
          registrations={activityRegistrations}
        />
      )}
    </section>
  )
}
