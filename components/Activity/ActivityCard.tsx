import React from "react"
import { Activity } from "@/types/types"

interface ActivityCardProps {
  activity: Activity
  onClick: (slug: string) => void
  registrationCount?: number
  hasChildren?: boolean
}

const formatDateTime = (value: string): string => {
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

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
      className="
        group relative w-full overflow-hidden rounded-2xl
        border border-orange-200/40
        bg-gradient-to-br from-white via-orange-50 to-orange-100
        p-6 text-left
        shadow-lg transition-all duration-300
        hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(251,146,60,0.45)]
        focus:outline-none focus:ring-2 focus:ring-orange-400
      "
    >
      {/* Gradient glow overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 via-amber-300/10 to-transparent" />
      </div>

      {/* Header */}
      <div className="relative flex items-start justify-between gap-3">
        <h3 className="text-lg font-extrabold tracking-tight text-gray-900">
          {activity.name}
        </h3>

        {hasChildren && (
          <span className="shrink-0 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Sub Activities
          </span>
        )}
      </div>

      {/* Description */}
      {activity.description && (
        <p className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-gray-700">
          {activity.description}
        </p>
      )}

      {/* Divider */}
      <div className="relative my-4 h-px w-full bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

      {/* Timing */}
      {hasTiming && (
        <div className="relative flex items-center gap-2 text-sm text-gray-800">
          <span className="font-semibold text-orange-600">Time</span>
          <span className="text-gray-700">
            {formatDateTime(activity.startAt!)} →{" "}
            {formatDateTime(activity.endAt!)}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="relative mt-4 flex items-center justify-between">
        {typeof registrationCount === "number" ? (
          <span className="text-xs font-medium text-gray-600">
            {registrationCount} Registrations
          </span>
        ) : (
          <span className="text-xs font-medium text-orange-500">
            Explore Details →
          </span>
        )}

        {/* Hover arrow */}
        <span className="text-orange-500 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
          →
        </span>
      </div>
    </button>
  )
}
