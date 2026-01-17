import { supabase } from "@/lib/supabaseClient";
import { VW_ActivityStats, Registration } from "@/types/types";

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Fetches all activities directly from the stats view.
 */
export const fetchAllActivities = async (): Promise<VW_ActivityStats[]> => {
  // Querying the view directly is more efficient
  const { data, error } = await supabase
    .from('vw_activity_stats')
    .select('*');

  if (error || !data) {
    console.error("Error fetching activities from view:", error);
    return [];
  }

  // Determine children based on the parent_activity_id presence in the set
  const checkHasChildren = (id: string) => 
    data.some(item => item.parent_activity_id === id);

  return data.map((item) => {
    // Use organization_code + slug if available, otherwise name
    const generatedSlug = item.organization_code 
      ? `${item.organization_code}-${slugify(item.activity_name)}` 
      : slugify(item.activity_name);

    return {
      id: item.activity_id,
      name: item.activity_name,
      slug: generatedSlug,
      description: item.description,
      parentId: item.parent_activity_id,
      hasChildren: checkHasChildren(item.activity_id),
      activityType: item.activity_type,
      startTime: item.start_time ? new Date(item.start_time) : null,
      endTime: item.end_time ? new Date(item.end_time) : null,
      status: item.status as VW_ActivityStats['status'],
      registrationCounts: {
        total: Number(item.total_registrations || 0),
        registered: Number(item.registered_count || 0),
        completed: Number(item.completed_count || 0),
        cancelled: Number(item.cancelled_count || 0),
        noShow: Number(item.no_show_count || 0),
      },
      revenue: {
        total: Number(item.total_revenue || 0),
        paidRegistrations: Number(item.paid_registrations || 0),
      }
    };
  });
};

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