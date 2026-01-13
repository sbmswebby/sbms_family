import React from "react"
import { Registration, Activity } from "@/types/types"

interface RegistrationRowProps {
  registration: Registration
  activity?: Activity
  onEdit?: (registrationId: string) => void
  onClick?: (registrationId: string) => void
}

const statusColors: Record<Registration["status"], string> = {
  registered: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-gray-100 text-gray-800",
}

export const RegistrationRow: React.FC<RegistrationRowProps> = ({
  registration,
  activity,
  onEdit,
  onClick,
}) => {
  return (
    <div
      className="flex items-center justify-between gap-3 p-3 border-b hover:bg-muted cursor-pointer"
      onClick={() => onClick?.(registration.id)}
    >
      {/* Left: Avatar + Name + Profession */}
      <div className="flex items-center gap-3">
        {registration.person.photoUrl ? (
          <img
            src={registration.person.photoUrl}
            alt={registration.person.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-xs font-medium">
            {registration.person.name[0]}
          </div>
        )}
        <div className="flex flex-col text-sm">
          <span className="font-medium">{registration.person.name}</span>
          {registration.person.phone && (
            <span className="text-muted-foreground">{registration.person.phone}</span>
          )}
        </div>
      </div>

      {/* Right: Registration metadata */}
      <div className="flex items-center gap-2 text-sm">
        {registration.registrationNumber && (
          <span className="text-muted-foreground">
            #{registration.registrationNumber}
          </span>
        )}
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[registration.status]}`}
        >
          {registration.status}
        </span>

        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(registration.id)
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}
