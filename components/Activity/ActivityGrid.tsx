"use client"

import React, { useState } from "react"
import { Activity, Registration } from "@/types/types"
import { ActivityCard } from "./ActivityCard"
import { RegistrationsModal } from "./RegistrationsModal"

interface ActivityGridProps {
  /** The specific activities to display in this grid (can be filtered) */
  activities: Activity[]
  /** The full list of all activities (for recursive counting) */
  allActivities: Activity[]
  /** The full list of all registrations (for recursive counting) */
  allRegistrations: Registration[]
  onActivityClick: (slug: string) => void
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

  // Find the full activity object for the modal
  const selectedActivity = allActivities.find(a => a.id === selectedActivityId)

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
            allActivities={allActivities}
            allRegistrations={allRegistrations}
            onClick={onActivityClick}
            onRegistrationsClick={(id) => setSelectedActivityId(id)}
          />
        ))}
      </div>

      {selectedActivity && (
        <RegistrationsModal
          activity={selectedActivity}
          allActivities={allActivities}
          allRegistrations={allRegistrations}
          onClose={() => setSelectedActivityId(null)}
          onAddRegistration={(id) => {
            console.log("Redirecting to registration for activity:", id)
            // Logic for opening add registration form goes here
          }}
        />
      )}
    </section>
  )
}