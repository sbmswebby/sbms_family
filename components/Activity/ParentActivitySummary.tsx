import React from "react"
import { Activity } from "@/types/types"

interface ParentActivitySummaryProps {
  activity: Activity
}

/**
 * Small summary shown above sub-activities
 * Different intent than ActivityCard → separate component
 */
export const ParentActivitySummary: React.FC<
  ParentActivitySummaryProps
> = ({ activity }) => {
  return (
    <section className="rounded-lg border p-4 bg-muted/40">
      <h1 className="text-2xl font-bold">{activity.name}</h1>

      {activity.description && (
        <p className="mt-2 text-sm text-muted-foreground">
          {activity.description}
        </p>
      )}
    </section>
  )
}
