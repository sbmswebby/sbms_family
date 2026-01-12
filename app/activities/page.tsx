import { ActivitiesRootPageComponent } from "@/components/Activity/ActivityPageComponent"
import { Activity } from "@/types/types"
import { DEMO_ACTIVITIES } from "@/components/Activity/demoActivities"

/**
 * Server-side page
 * Responsible ONLY for data fetching
 * No hierarchy or UI logic here
 */
export default async function ActivitiesPage({
  params,
}: {
  params: { slug?: string }
}) {
  const activities: Activity[] = await getActivitiesFromDB()

  return (
    <ActivitiesRootPageComponent
      activities={activities}
    />
  )
}

/**
 * Temporary mock DB function
 */
async function getActivitiesFromDB(): Promise<Activity[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return DEMO_ACTIVITIES
}
