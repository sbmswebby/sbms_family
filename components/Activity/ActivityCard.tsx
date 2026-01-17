"use client"

import React from "react"
import { VW_ActivityStats } from "@/types/types"
import { Calendar, Users, Folder, Target, Clock } from "lucide-react"

interface ActivityCardProps {
  activity: VW_ActivityStats
  onClick: (slugOrId: string) => void
  onRegistrationsClick?: (activityId: string) => void
  stats?: {
    totalRegistrations: number
    childCount: number
  }
}

const getRelativeHint = (start: Date, end: Date): string | null => {
  const now = new Date()
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

const statusStyles: Record<string, string> = {
  live: "text-green-500 font-semibold",
  draft: "text-gray-500",
  completed: "text-blue-500",
  cancelled: "text-red-500",
  published: "text-purple-400",
  archived: "text-gray-600",
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onClick,
  onRegistrationsClick,
  stats,
}) => {
  const isFreeReg = activity.name === 'free_registrations';
  const hasTiming = activity.startTime !== null && activity.endTime !== null;
  const isLeafActivity = !activity.hasChildren;

  const timeHint = hasTiming 
    ? getRelativeHint(new Date(activity.startTime!), new Date(activity.endTime!)) 
    : null;

  const handleMainClick = () => {
    onClick(activity.slug || activity.id);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleMainClick}
      className={`group relative w-full rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm p-5 ${
        isFreeReg 
          ? "bg-blue-600/5 border-blue-500/30 hover:bg-blue-600/10 hover:border-blue-500/50" 
          : "bg-gray-900 border-gray-800 hover:bg-gray-800/60 hover:border-gray-700"
      }`}
    >
      {/* Top Section: Title & Icon */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1">
             {isFreeReg ? (
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                 System Bucket
               </span>
             ) : (
               <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                 {activity.activityType || 'Activity'}
               </span>
             )}
          </div>
          <h3 className={`text-lg font-bold leading-tight truncate ${isFreeReg ? 'text-blue-100' : 'text-gray-100'}`}>
            {isFreeReg ? "General Registrations" : activity.name}
          </h3>
        </div>
        
        <div className={`shrink-0 p-2 rounded-xl ${isFreeReg ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
          {isFreeReg ? <Users className="w-5 h-5" /> : isLeafActivity ? <Target className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
        </div>
      </div>

      {/* Middle Section: Description (if system bucket) */}
      {isFreeReg && (
        <p className="mt-2 text-xs text-blue-300/60 line-clamp-1 italic">
          Default bucket for direct entries
        </p>
      )}

      {/* Bottom Section: Metadata & Registration Counter */}
      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5 text-[11px]">
          <div className="flex items-center gap-1.5 text-gray-400 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>{hasTiming ? formatDateTime(new Date(activity.startTime!)) : "No date set"}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`capitalize flex items-center gap-1 ${statusStyles[activity.status] || 'text-gray-400'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {activity.status}
            </span>
            {timeHint && (
              <span className="flex items-center gap-1 text-blue-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                {timeHint}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRegistrationsClick?.(activity.id);
          }}
          className={`flex items-center gap-2 shrink-0 rounded-xl px-4 py-2 text-xs font-black transition-all active:scale-95 border ${
            isFreeReg 
              ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-900/40" 
              : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{stats?.totalRegistrations ?? 0}</span>
        </button>
      </div>
    </div>
  )
}