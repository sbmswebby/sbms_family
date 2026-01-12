import { ActivityPageBySlug } from "@/components/Activity/ActivityPageBySlug"
import { DEMO_ACTIVITIES, DEMO_REGISTRATIONS } from "@/components/Activity/demoActivities"
import { Activity } from "@/types/types"

/**
 * Activity detail page (dynamic route)
 * Each slug represents a NEW page and NEW navigation context
 */
export default async function ActivityPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  /**
   * ✅ IMPORTANT
   * params is async in App Router
   */
  const { slug } = await params

  console.log("URL slug:", slug)

  const activities: Activity[] = await getActivitiesFromDB()

  return (
    <ActivityPageBySlug
          activities={activities}
          slug={slug} registrations={DEMO_REGISTRATIONS}     />
  )
}


async function getActivitiesFromDB(): Promise<Activity[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return DEMO_ACTIVITIES
}