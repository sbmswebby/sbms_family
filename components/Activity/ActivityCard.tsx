import React from "react"
import { Activity } from "@/types/types"

interface ActivityCardProps {
  activity: Activity

  /**
   * Called when the card is clicked
   * Parent decides how navigation works
   */
  onClick: (slug: string) => void

  /**
   * Optional registration count
   * Only passed for leaf activities
   */
  registrationCount?: number

  /**
   * Whether this activity has children
   * Used only for UI hints
   */
  hasChildren?: boolean
}

/**
 * Format ISO datetime string into a readable format
 * Example: "10 Mar 2026, 4:00 PM"
 */
const formatDateTime = (value: string): string => {
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

/**
 * Displays a single activity card
 */
export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onClick,
  registrationCount,
  hasChildren = false,
}) => {
  const hasTiming = Boolean(activity.startAt && activity.endAt)

  return (
    <button
      type="button"
      onClick={() => onClick(activity.slug)}
      className="w-full text-left rounded-lg border p-4 transition hover:bg-muted"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">{activity.name}</h3>

        {hasChildren && (
          <span className="shrink-0 text-xs rounded-full bg-muted px-2 py-0.5">
            Has sub activities
          </span>
        )}
      </div>

      {/* Description */}
      {activity.description && (
        <p className="mt-1 text-sm text-muted-foreground">
          {activity.description}
        </p>
      )}

      {/* Timing */}
      {hasTiming && (
        <div className="mt-3 text-sm flex items-center gap-2 text-muted-foreground">
          <span className="font-medium text-foreground">Time:</span>
          <span>
            {formatDateTime(activity.startAt!)} →{" "}
            {formatDateTime(activity.endAt!)}
          </span>
        </div>
      )}

      {/* Registration count (leaf only) */}
      {typeof registrationCount === "number" && (
        <p className="mt-2 text-xs text-muted-foreground">
          Registrations: {registrationCount}
        </p>
      )}
    </button>
  )
}
