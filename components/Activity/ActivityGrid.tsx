import React, { useState, useMemo } from "react"
import { Activity, Registration, groupRegistrationsByActivity } from "@/types/types"
import { ActivityCard } from "./ActivityCard"
import { RegistrationsModal } from "./RegistrationsModal"

interface ActivityGridProps {
  activities: Activity[]
  onActivityClick: (slug: string) => void
  title?: string
}

export const ActivityGrid: React.FC<ActivityGridProps> = ({
  activities = [],
  onActivityClick,
  title,
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)



  const selectedActivity = activities.find(a => a.id === selectedActivityId)


  return (
    <section className="m-10 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onClick={onActivityClick}
            onRegistrationsClick={(id) => setSelectedActivityId(id)}
          />
        ))}
      </div>

      {selectedActivity && (
        <RegistrationsModal
          activity={selectedActivity}
          onClose={() => setSelectedActivityId(null)}
          onAddRegistration={(id) => console.log("Add for", id)}
        />
      )}
    </section>
  )
}