// demoActivities.ts
import { Activity, Registration } from "@/types/types"

/**
 * Demo activity data
 * Flattened hierarchy using parentId
 * Dates are real Date objects (UI-safe)
 */
export const DEMO_ACTIVITIES: Activity[] = [
  // =====================
  // ROOT ACTIVITIES
  // =====================
  {
    id: "event-1",
    name: "Fashion Expo 2026",
    slug: "fashion-expo-2026",
    parentId: null,
    hasChildren: true,
    startTime: new Date("2026-03-10T09:00:00"),
    endTime: new Date("2026-03-12T18:00:00"),
    status: "live",
  },
  {
    id: "event-2",
    name: "Makeup Masterclass",
    slug: "makeup-masterclass",
    parentId: null,
    hasChildren: true,
    startTime: new Date("2026-04-05T10:00:00"),
    endTime: new Date("2026-04-05T17:00:00"),
    status: "draft",
  },

  // =====================
  // SUB ACTIVITIES
  // =====================
  {
    id: "sub-1",
    name: "Ramp Walk",
    slug: "ramp-walk",
    parentId: "event-1",
    hasChildren: true,
    startTime: new Date("2026-03-10T16:00:00"),
    endTime: new Date("2026-03-10T20:00:00"),
    status: "live",
  },
  {
    id: "sub-2",
    name: "Designer Talks",
    slug: "designer-talks",
    parentId: "event-1",
    hasChildren: false,
    startTime: new Date("2026-03-11T11:00:00"),
    endTime: new Date("2026-03-11T15:00:00"),
    status: "completed",
    registrationCounts: {
      total: 0,
      registered: 0,
      completed: 0,
      cancelled: 0,
    },
  },

  // =====================
  // LEAF ACTIVITIES
  // =====================
  {
    id: "org-1",
    name: "Elite Fashion Academy",
    slug: "elite-fashion-academy",
    parentId: "sub-1",
    hasChildren: false,
    startTime: new Date("2026-03-10T16:00:00"),
    endTime: new Date("2026-03-10T17:30:00"),
    status: "live",
    registrationCounts: {
      total: 2,
      registered: 2,
      completed: 0,
      cancelled: 0,
    },
  },
  {
    id: "org-2",
    name: "Runway Studio",
    slug: "runway-studio",
    parentId: "sub-1",
    hasChildren: false,
    startTime: new Date("2026-03-10T18:00:00"),
    endTime: new Date("2026-03-10T19:30:00"),
    status: "live",
    registrationCounts: {
      total: 1,
      registered: 1,
      completed: 0,
      cancelled: 0,
    },
  },
  {
    id: "leaf-1",
    name: "Bridal Makeup Session",
    slug: "bridal-makeup-session",
    parentId: "event-2",
    hasChildren: false,
    startTime: new Date("2026-04-05T13:00:00"),
    endTime: new Date("2026-04-05T15:00:00"),
    status: "draft",
    registrationCounts: {
      total: 0,
      registered: 0,
      completed: 0,
      cancelled: 0,
    },
  },
]


/**
 * Demo registration data
 * Each registration belongs to a leaf activity
 */
export const DEMO_REGISTRATIONS: Registration[] = [
  {
    id: "reg-1",
    activityId: "org-1",
    registrationNumber: "REG-001",
    person: {
      name: "Aisha Khan",
      phone: "9876543210",
    },
    status: "registered",
    registeredAt: new Date("2026-01-01T10:30:00"),
  },
  {
    id: "reg-2",
    activityId: "org-1",
    registrationNumber: "REG-002",
    person: {
      name: "Neha Sharma",
      phone: "9123456780",
    },
    status: "registered",
    registeredAt: new Date("2026-01-02T11:15:00"),
  },
  {
    id: "reg-3",
    activityId: "org-2",
    registrationNumber: "REG-003",
    person: {
      name: "Ritika Verma",
      phone: "9988776655",
    },
    status: "registered",
    registeredAt: new Date("2026-01-03T14:00:00"),
  },
]

export const getChildActivities = (
  activities: Activity[],
  parentId: string | null
): Activity[] => {
  return activities.filter(
    (activity) => activity.parentId === parentId
  )
}

/**
 * Returns all registrations for a given leaf activity
 */
export const getRegistrationsForActivity = (
  registrations: Registration[],
  activityId: string
): Registration[] => {
  return registrations.filter(
    (registration) => registration.activityId === activityId
  )
}

/**
 * Returns registration count summary for a given activity
 */
export const getRegistrationCountsForActivity = (
  registrations: Registration[],
  activityId: string
): {
  total: number
  registered: number
  completed: number
  cancelled: number
} => {
  const activityRegistrations = registrations.filter(
    (registration) => registration.activityId === activityId
  )

  return {
    total: activityRegistrations.length,
    registered: activityRegistrations.filter(
      (r) => r.status === "registered"
    ).length,
    completed: activityRegistrations.filter(
      (r) => r.status === "completed"
    ).length,
    cancelled: activityRegistrations.filter(
      (r) => r.status === "cancelled"
    ).length,
  }
}
