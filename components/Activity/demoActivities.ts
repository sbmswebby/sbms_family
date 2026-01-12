// demoActivities.ts 
import { Activity, Registration } from "@/types/types"

/**
 * Demo activity data
 * This represents a flattened tree structure
 * Parent-child relationships are resolved via parentId
 */
// demoActivities.ts

/**
 * Demo activity data
 * Flattened tree structure
 */
export const DEMO_ACTIVITIES: Activity[] = [
  // =====================
  // ROOT EVENTS
  // =====================
  {
    id: "event-1",
    name: "Fashion Expo 2026",
    slug: "fashion-expo-2026",
    parentId: null,
    description: "Annual fashion exhibition",
    startAt: "2026-03-10T09:00:00",
    endAt: "2026-03-12T18:00:00",
  },
  {
    id: "event-2",
    name: "Makeup Masterclass",
    slug: "makeup-masterclass",
    parentId: null,
    description: "Hands-on makeup workshops",
    startAt: "2026-04-05T10:00:00",
    endAt: "2026-04-05T17:00:00",
  },

  // =====================
  // SUB ACTIVITIES
  // =====================
  {
    id: "sub-1",
    name: "Ramp Walk",
    slug: "ramp-walk",
    parentId: "event-1",
    description: "Live ramp walk performances",
    startAt: "2026-03-10T16:00:00",
    endAt: "2026-03-10T20:00:00",
  },
  {
    id: "sub-2",
    name: "Designer Talks",
    slug: "designer-talks",
    parentId: "event-1",
    description: "Talks by leading designers",
    startAt: "2026-03-11T11:00:00",
    endAt: "2026-03-11T15:00:00",
  },

  // =====================
  // LEAF ACTIVITIES
  // =====================
  {
    id: "org-1",
    name: "Elite Fashion Academy",
    slug: "elite-fashion-academy",
    parentId: "sub-1",
    startAt: "2026-03-10T16:00:00",
    endAt: "2026-03-10T17:30:00",
  },
  {
    id: "org-2",
    name: "Runway Studio",
    slug: "runway-studio",
    parentId: "sub-1",
    startAt: "2026-03-10T18:00:00",
    endAt: "2026-03-10T19:30:00",
  },

  {
    id: "leaf-1",
    name: "Bridal Makeup Session",
    slug: "bridal-makeup-session",
    parentId: "event-2",
    startAt: "2026-04-05T13:00:00",
    endAt: "2026-04-05T15:00:00",
  },
]



// demoRegistrations

export const DEMO_REGISTRATIONS: Registration[] = [
  {
    id: "reg-1",
    activityId: "org-1",
    fullName: "Aisha Khan",
    phoneNumber: "9876543210",
    createdAt: "2026-01-01",
  },
  {
    id: "reg-2",
    activityId: "org-1",
    fullName: "Neha Sharma",
    phoneNumber: "9123456780",
    createdAt: "2026-01-02",
  },
]
