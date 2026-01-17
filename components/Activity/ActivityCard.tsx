"use client"

import React from "react"
import { Activity } from "@/types/types"

interface ActivityCardProps {
  activity: Activity
  onClick: (slugOrId: string) => void
  onRegistrationsClick?: (activityId: string) => void
  stats?: {
    totalRegistrations: number
    childCount: number
  }
}

/**
 * Logic to determine the relative time hint
 */
const getRelativeHint = (start: Date, end: Date): string | null => {
  const now = new Date()
  
  // Ongoing: Current time is between start and end
  if (now >= start && now <= end) return "Ongoing"

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const activityDate = new Date(start)
  activityDate.setHours(0, 0, 0, 0)

  if (activityDate.getTime() === today.getTime()) return "Today"
  if (activityDate.getTime() === tomorrow.getTime()) return "Tomorrow"

  return null
}

const formatDateTime = (value: Date): string => {
  return value.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

const statusStyles: Record<Activity["status"], string> = {
  live: "text-green-500 font-semibold",
  draft: "text-gray-500",
  completed: "text-blue-500",
  cancelled: "text-red-500",
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onClick,
  onRegistrationsClick,
  stats,
}) => {
  const hasTiming = activity.startTime !== null && activity.endTime !== null
  const isLeafActivity = !activity.hasChildren

  // Calculate hint if timing exists
  const timeHint = hasTiming 
    ? getRelativeHint(new Date(activity.startTime!), new Date(activity.endTime!)) 
    : null

  const handleMainClick = () => {
    const targetIdentifier = activity.slug || activity.id
    onClick(targetIdentifier)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleMainClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleMainClick()
      }}
      className="w-full rounded-xl border border-gray-800 bg-gray-900 p-4 text-left transition hover:bg-gray-800/50 cursor-pointer shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold leading-tight text-gray-100 truncate flex-1">
          {activity.name}
        </h3>
        <span
          className="text-xs shrink-0"
          title={isLeafActivity ? "Leaf activity" : "Has sub activities"}
        >
          {isLeafActivity ? "🎯" : "📁"}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex flex-col gap-1 text-gray-400 min-w-0 flex-1">
          <span className="font-mono truncate">
            {hasTiming 
              ? formatDateTime(new Date(activity.startTime!)) 
              : "Time not set"}
          </span>
          
          <div className="flex items-center gap-1.5 truncate">
            <span className={`capitalize ${statusStyles[activity.status]}`}>
              {activity.status}
            </span>
            {timeHint && (
              <>
                <span className="text-gray-700">•</span>
                <span className="text-blue-400 font-medium">{timeHint}</span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRegistrationsClick?.(activity.id)
          }}
          className="flex items-center gap-1.5 shrink-0 rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs font-bold text-gray-200 hover:bg-gray-700 hover:border-gray-600 transition-all active:scale-95"
          title="View registrations"
        >
          <span className="text-blue-400">👤</span>
          <span>{stats?.totalRegistrations ?? 0}</span>
        </button>
      </div>
    </div>
  )
}