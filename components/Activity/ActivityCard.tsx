import React, { useMemo } from "react"
import { Activity, Registration } from "@/types/types"
import { DEMO_ACTIVITIES, DEMO_REGISTRATIONS } from "@/components/Activity/demoActivities"

interface ActivityCardProps {
  activity: Activity
  onClick: (slug: string) => void
  onRegistrationsClick?: (activityId: string) => void
  // Add these to allow aggregation
  allActivities?: Activity[]
  allRegistrations?: Registration[]
}

/**
 * Formats a Date into a readable UI string
 * Forced to en-US to prevent hydration mismatches between Server and Client
 */
const formatDateTime = (value: Date): string => {
  return value.toLocaleString("en-US", { // Force locale
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // Force 12-hour format (4:00 PM) instead of 16:00
  })
}

const statusStyles: Record<Activity["status"], string> = {
  live: "text-green-600",
  draft: "text-muted-foreground",
  completed: "text-blue-600",
  cancelled: "text-red-600",
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onClick,
  onRegistrationsClick,
  allActivities = DEMO_ACTIVITIES,
  allRegistrations = DEMO_REGISTRATIONS,
}) => {
  const hasTiming = activity.startTime !== null && activity.endTime !== null
  const isLeafActivity = !activity.hasChildren

  /**
   * RECURSIVE AGGREGATION
   * Finds registrations for this activity AND all its descendants
   */
  const totalRegistrations = useMemo(() => {
    const getDescendantIds = (parentIds: string[]): string[] => {
      const children = allActivities
        .filter((a) => a.parentId && parentIds.includes(a.parentId))
        .map((a) => a.id)
      
      if (children.length === 0) return []
      return [...children, ...getDescendantIds(children)]
    }

    const targetIds = [activity.id, ...getDescendantIds([activity.id])]
    
    return allRegistrations.filter((reg) => targetIds.includes(reg.activityId)).length
  }, [activity.id, allActivities, allRegistrations])

  return (
<div
      role="button" // Accessibility: tells screen readers this acts like a button
      tabIndex={0}  // Accessibility: makes it focusable via keyboard
      onClick={() => onClick(activity.slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(activity.slug);
      }}
      className="w-full rounded-xl border bg-background p-4 text-left transition hover:bg-muted cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold leading-tight">
          {activity.name}
        </h3>
        <span
          className="text-xs text-muted-foreground"
          title={isLeafActivity ? "Leaf activity" : "Has sub activities"}
        >
          {isLeafActivity ? "🎯" : "📁"}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          {hasTiming && (
            <span>
              {formatDateTime(activity.startTime!)} →{" "}
              {formatDateTime(activity.endTime!)}
            </span>
          )}
          <span className={`capitalize ${statusStyles[activity.status]}`}>
            {activity.status}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRegistrationsClick?.(activity.id)
          }}
          className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium hover:bg-secondary transition-colors"
          title="View registrations"
        >
          <span>👤</span>
          <span>{totalRegistrations}</span>
        </button>
      </div>
    </div>
  )
}