//types.tsx
/**
 * Core Activity type used across the app
 * This represents a node in the activity tree
 */
export interface Activity {
  id: string
  name: string
  slug: string
  parentId: string | null

  description?: string

  /**
   * Activity schedule
   * ISO 8601 datetime strings
   * Example: "2026-03-10T10:00:00"
   */
  startAt?: string
  endAt?: string
}

/**
 * Registration for a leaf activity
 */
export interface Registration {
  id: string
  activityId: string
  fullName: string
  phoneNumber: string
  createdAt: string
}
