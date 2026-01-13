import React, { useMemo } from "react"
import { Activity, Registration } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"

interface ActivitiesRootPageComponentProps {
  activities: Activity[]
  allRegistrations: Registration[] // Add this line
}

const  ActivitiesRootPageComponent: React.FC<ActivitiesRootPageComponentProps> = ({
  activities,
  allRegistrations,
}) => {
  /**
   * We still treat the 'activities' prop as the "master list" 
   * for the grid's internal calculations.
   */
  const rootActivities = useMemo(() => {
    return activities.filter((a) => a.parentId === null)
  }, [activities])

  return (
    <main className="min-h-screen bg-black py-10">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-10 px-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Activities
          </h1>
          <p className="mt-2 text-gray-400">
            Manage events, sub-activities, and track registrations.
          </p>
        </header>

        <ActivityGrid
          title="Root Events"
          activities={rootActivities} // The filtered list to display
          allActivities={activities}    // The master list for recursive counting
          allRegistrations={allRegistrations} // The master registration list
          onActivityClick={(slug) => {
            console.log("Navigate to:", slug)
          }}
        />
      </div>
    </main>
  )
}

export default ActivitiesRootPageComponent;