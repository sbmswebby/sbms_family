import React from "react"
import { Registration } from "@/types/types"

interface ActivityRegistrationSectionProps {
  activityId: string
  registrations: Registration[]
}

/**
 * Registration UI
 * Rendered ONLY for leaf activities
 * - Lists all current registrations (name + phone)
 * - Has a placeholder "Add Registration" button
 */
export const ActivityRegistrationSection: React.FC<
  ActivityRegistrationSectionProps
> = ({ activityId, registrations }) => {
  return (
    <section className="rounded-lg border p-4 space-y-4 bg-white shadow-sm">
      <h2 className="text-xl font-semibold">Registrations</h2>

      {registrations.length > 0 ? (
        <ul className="space-y-2">
          {registrations.map((reg) => (
            <li
              key={reg.id}
              className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
              // TODO: onClick could open a modal with more details
            >
              <span className="font-medium">{reg.person.name}</span>
              <span className="text-sm text-gray-500">{reg.person.phone}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm">No registrations yet.</p>
      )}

      <button
        type="button"
        className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 transition"
      >
        Add Registration
      </button>

      <p className="text-xs text-muted-foreground">
        Activity ID: {activityId}
      </p>
    </section>
  )
}
