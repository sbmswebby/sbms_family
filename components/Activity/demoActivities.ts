import { supabase } from "@/lib/supabaseClient";
import { Activity, Registration } from "@/types/types";


/**
 * Fetches all activities from Supabase.
 * Maps DB columns (parent_activity_id) to UI types (parentId).
 */
export const fetchAllActivities = async (): Promise<Activity[]> => {
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      vw_activity_stats!activity_id (
        total_registrations,
        registered_count,
        completed_count,
        cancelled_count
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching activities:", error);
    return [];
  }

  // Helper to determine if an activity has children based on the current set
  const checkHasChildren = (id: string) => data.some(item => item.parent_activity_id === id);

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.short_code || item.id,
    parentId: item.parent_activity_id,
    hasChildren: checkHasChildren(item.id),
    startTime: item.start_time ? new Date(item.start_time) : null,
    endTime: item.end_time ? new Date(item.end_time) : null,
    status: item.status as Activity['status'],
    registrationCounts: item.vw_activity_stats?.[0] ? {
      total: Number(item.vw_activity_stats[0].total_registrations),
      registered: Number(item.vw_activity_stats[0].registered_count),
      completed: Number(item.vw_activity_stats[0].completed_count),
      cancelled: Number(item.vw_activity_stats[0].cancelled_count),
    } : { total: 0, registered: 0, completed: 0, cancelled: 0 }
  }));
};

/**
 * Fetches all registrations from the detailed view.
 */
export const fetchAllRegistrations = async (): Promise<Registration[]> => {
  const { data, error } = await supabase
    .from('vw_user_activity_details')
    .select('*')
    .order('registration_time', { ascending: false });

  if (error) {
    console.error("Error fetching registrations:", error);
    return [];
  }

  return data.map((reg) => ({
    id: reg.id,
    activityId: reg.activity_id,
    registrationNumber: reg.display_registration_number || `REG-${reg.registration_number}`,
    person: {
      name: reg.user_name,
      phone: reg.user_phone,
      photoUrl: reg.user_photo,
    },
    status: reg.status as Registration['status'],
    registeredAt: new Date(reg.registration_time),
  }));
};

/**
 * Filters activities by parentId.
 */
export const getChildActivities = (
  activities: Activity[],
  parentId: string | null
): Activity[] => {
  return activities.filter((activity) => activity.parentId === parentId);
};

/**
 * Returns all registrations for a given activity.
 */
export const getRegistrationsForActivity = (
  registrations: Registration[],
  activityId: string
): Registration[] => {
  return registrations.filter((reg) => reg.activityId === activityId);
};

/**
 * Returns registration count summary for a given activity.
 * Note: While fetchAllActivities brings this data from a view, 
 * this utility remains for runtime filtering/re-calculation.
 */
export const getRegistrationCountsForActivity = (
  registrations: Registration[],
  activityId: string
) => {
  const filtered = registrations.filter((r) => r.activityId === activityId);

  return {
    total: filtered.length,
    registered: filtered.filter((r) => r.status === "registered").length,
    completed: filtered.filter((r) => r.status === "completed").length,
    cancelled: filtered.filter((r) => r.status === "cancelled").length,
  };
};