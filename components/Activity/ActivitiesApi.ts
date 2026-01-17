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
 * Optimized to reduce iterations and create immutable data.
 */
export const fetchAllActivities = async (): Promise<VW_ActivityStats[]> => {
  const { data, error } = await supabase
    .from('vw_activity_stats')
    .select('*')
    .order('start_time', { ascending: false }); // Sort at DB level

  if (error || !data) {
    console.error("Error fetching activities from view:", error);
    return [];
  }

  // Build hasChildren map in single pass
  const childrenMap = new Map<string, boolean>();
  for (const item of data) {
    if (item.parent_activity_id) {
      childrenMap.set(item.parent_activity_id, true);
    }
  }

  // Map once with O(1) lookup
  return data.map((item) => {
    const generatedSlug = item.organization_code 
      ? `${item.organization_code}-${slugify(item.activity_name)}` 
      : slugify(item.activity_name);

    return {
      id: item.activity_id,
      name: item.activity_name,
      slug: generatedSlug,
      description: item.description,
      parentId: item.parent_activity_id,
      hasChildren: childrenMap.has(item.activity_id),
      activityType: item.activity_type,
      organizationId: item.organization_id, 
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

export async function ensureFreeRegistrationLeaf(parentActivity: VW_ActivityStats): Promise<string> {
  const { data: existing, error: fetchError } = await supabase
    .from('activities')
    .select('id')
    .eq('parent_activity_id', parentActivity.id)
    .eq('name', 'free_registrations')
    .maybeSingle();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from('activities')
    .insert({
      name: 'free_registrations',
      parent_activity_id: parentActivity.id,
      organization_id: parentActivity.organizationId,
      status: 'published',
      type: 'session',
      description: 'System-generated bucket for direct registrations'
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export const fetchRegistrationsForActivity = async (activityId: string): Promise<Registration[]> => {
  const { data, error } = await supabase
    .from('vw_user_activity_details')
    .select('*')
    .eq('activity_id', activityId)
    .order('registration_time', { ascending: false });

  if (error) throw error;
  
  return data.map(reg => ({
    id: reg.id,
    activityId: reg.activity_id,
    registrationNumber: reg.display_registration_number,
    person: {
      name: reg.user_name,
      phone: reg.user_phone,
      photoUrl: reg.user_photo
    },
    status: reg.status,
    registeredAt: new Date(reg.registration_time)
  }));
};