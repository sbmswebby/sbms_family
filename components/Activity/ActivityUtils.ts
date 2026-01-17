//ActivityUtilis.ts


import { Registration, VW_ActivityStats } from "@/types/types";

export const buildActivityStats = (
  activities: VW_ActivityStats[],
  registrations: Registration[] // Kept for signature compatibility
): Record<string, { totalRegistrations: number; childCount: number }> => {
  const stats: Record<string, { totalRegistrations: number; childCount: number }> = {};

  activities.forEach(activity => {
    // We pull total from the new pre-calculated registrationCounts
    // But we still calculate childCount locally for the UI tree
    const childCount = activities.filter(a => a.parentId === activity.id).length;

    stats[activity.id] = {
      childCount: childCount,
      totalRegistrations: activity.registrationCounts.total,
    };
  });

  return stats;
};