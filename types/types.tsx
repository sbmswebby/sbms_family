//types.tsx

/**
 * UI-safe Activity model
 * Derived from vw_activity_stats + activities
 */
export interface VW_ActivityStats {
  id: string
  name: string
  slug: string

  parentId: string | null
  hasChildren: boolean

  startTime: Date | null
  endTime: Date | null
  status: "draft" | "live" | "completed" | "cancelled"

  registrationCounts?: {
    total: number
    registered: number
    completed: number
    cancelled: number
  }
}

/**
 * Registration shown in UI
 * Derived from vw_user_activity_details
 */
/**
 * Registration shown in UI
 * Derived from vw_user_activity_details
 */
export interface Registration {
  id: string

  /**
   * Leaf activity this registration belongs to
   */
  activityId: string

  registrationNumber: string

  person: {
    name: string
    phone: string
    photoUrl?: string
  }

  status: "registered" | "completed" | "cancelled" | "no_show"

  registeredAt: Date
}


/**
 * UI-safe Registration model
 * Derived from vw_user_activity_details
 */
export interface Registration {
  id: string

  /**
   * Human-readable registration number
   * Example: "FE26-0123"
   */
  registrationNumber: string

  /**
   * Activity this registration belongs to
   */
  activityId: string

  /**
   * Minimal person info for operators
   */
  person: {
    name: string
    phone: string
    photoUrl?: string
  }

  /**
   * Registration lifecycle state
   */
  status: "registered" | "completed" | "cancelled" | "no_show"

  /**
   * When the user was registered
   */
  registeredAt: Date
}

/**
 * Registrations grouped by activity
 * Key = activityId
 */
export type RegistrationsByActivity = Record<
  string,
  Registration[]
>

/**
 * Groups registrations by activityId
 *
 * This function is:
 * - Pure
 * - Deterministic
 * - UI-only
 *
 * Parents aggregate at render time, not here
 */
export const groupRegistrationsByActivity = (
  registrations: Registration[] = [] // Default to empty array
): RegistrationsByActivity => {
  // Guard clause for extra safety
  if (!registrations) return {};

  return registrations.reduce<RegistrationsByActivity>(
    (accumulator, registration) => {
      const activityId = registration.activityId

      if (!accumulator[activityId]) {
        accumulator[activityId] = []
      }

      accumulator[activityId].push(registration)

      return accumulator
    },
    {}
  )
}
