/**
 * UI-safe Activity model
 * Derived from vw_activity_stats
 */
export interface VW_ActivityStats {
  id: string
  name: string
  slug: string
  description: string | null
  
  parentId: string | null
  hasChildren: boolean
  activityType: string // From a.type
  
  organizationId:string

  startTime: Date | null
  endTime: Date | null
  // Aligned with DB check: status = any (array['draft', 'published', 'archived'])
  // Note: Your view uses a.status, which your table check defines as follows:
  status: "draft" | "published" | "archived" | "live" | "completed" | "cancelled"

  registrationCounts: {
    total: number
    registered: number
    completed: number
    cancelled: number
    noShow: number
  }
  
  revenue?: {
    total: number
    paidRegistrations: number
  }
}

/**
 * Registration shown in UI
 */
export interface Registration {
  id: string
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

export type RegistrationsByActivity = Record<string, Registration[]>

export const groupRegistrationsByActivity = (
  registrations: Registration[] = []
): RegistrationsByActivity => {
  if (!registrations) return {};
  return registrations.reduce<RegistrationsByActivity>((acc, reg) => {
    const activityId = reg.activityId
    if (!acc[activityId]) acc[activityId] = []
    acc[activityId].push(reg)
    return acc
  }, {})
}

export interface UserProfile {
  id: string;
  full_name: string;
  whatsapp_number: string;
  supabase_auth_id?: string | null;
  profile_photo_url?: string | null;
  profession_id?: string | null;
  state_id?: string | null;
  city_id?: string | null;
  instagram_handle?: string | null;
  created_at: string;
}