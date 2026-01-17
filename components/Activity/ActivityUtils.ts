//ActivityUtilis.ts

import { Registration, VW_ActivityStats } from "@/types/types";


export const buildActivityStats = (
  activities: VW_ActivityStats[],
  registrations: Registration[]
): Record<string, { totalRegistrations: number; childCount: number }> => {
  const childrenMap: Record<string, string[]> = {}

  for (const activity of activities) {
    if (activity.parentId) {
      if (!childrenMap[activity.parentId]) childrenMap[activity.parentId] = []
      childrenMap[activity.parentId].push(activity.id)
    }
  }

  const getDescendants = (id: string): string[] => {
    const directChildren = childrenMap[id] ?? []
    return directChildren.flatMap(childId => [
      childId,
      ...getDescendants(childId),
    ])
  }

  const stats: Record<string, { totalRegistrations: number; childCount: number }> = {}

  for (const activity of activities) {
    const descendantIds = getDescendants(activity.id)
    const relevantIds = [activity.id, ...descendantIds]

    stats[activity.id] = {
      childCount: descendantIds.length,
      totalRegistrations: registrations.filter(reg =>
        relevantIds.includes(reg.activityId)
      ).length,
    }
  }

  return stats
}