import React from "react"
import { Activity } from "@/types/types"
import { ActivityCard } from "./ActivityCard"

interface ActivityGridProps {
  activities: Activity[]
  title?: string
  onActivityClick: (slug: string) => void
}

/**
 * Renders activities in a grid
 * ❌ No routing
 * ❌ No business logic
 */
export const ActivityGrid: React.FC<ActivityGridProps> = ({
  activities,
  title,
  onActivityClick,
}) => {
  if (activities.length === 0) return null

  return (
    <section className="space-y-4">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onClick={onActivityClick}
          />
        ))}
      </div>
    </section>
  )
}
