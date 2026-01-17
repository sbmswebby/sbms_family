"use client"

import React, { useMemo } from "react"
import { useRouter } from "next/navigation"
import { VW_ActivityStats, Registration } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"

interface ActivitiesRootPageComponentProps {
  activities: VW_ActivityStats[]
  allRegistrations: Registration[]
}

export const ActivitiesRootPageComponent: React.FC<
  ActivitiesRootPageComponentProps
> = ({ activities, allRegistrations }) => {
  const router = useRouter()

  /**
   * Only top-level activities are shown in the initial grid view.
   * We filter these here to pass to the "display" list of the grid.
   */
  const rootActivities = useMemo(
    () => activities.filter(activity => activity.parentId === null),
    [activities]
  )

  /**
   * We no longer need the complex buildActivityStats function because 
   * registrationCounts are now pre-calculated in the VW_ActivityStats object.
   * * Note: The ActivityGrid will calculate the childCount on-the-fly 
   * during mapping using the 'allActivities' prop.
   */

  const handleClick = (slugOrId: string): void => {
    // If you are using the new slug strategy, slugOrId will be the friendly string
    router.push(`/activities/${slugOrId}`)
  }

  return (
    <div className="min-h-screen bg-black">
      <ActivityGrid
        title="Activities"
        activities={rootActivities}
        /* Passing 'activities' as 'allActivities' allows the grid 
          to resolve hierarchies and counts for the Modal.
        */
        allActivities={activities}
        allRegistrations={allRegistrations}
        onActivityClick={handleClick}
      />
    </div>
  )
}