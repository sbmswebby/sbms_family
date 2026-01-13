import { ActivityPageBySlug } from "@/components/Activity/ActivityPageBySlug"
import { Activity, Registration } from "@/types/types"

/**
 * Activity detail page (dynamic route)
 * Corrected prop name from 'registrations' to 'allRegistrations'
 */
 async function ActivityPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // 1. Await params as required by Next.js App Router
  const { slug } = await params

  // 2. Fetch both activities and registrations
  const [activities, registrations] = await Promise.all([
    getActivitiesFromDB(),
    getRegistrationsFromDB(),
  ])

  return (
    <ActivityPageBySlug
      activities={activities}
      allRegistrations={registrations} // Updated this line
      slug={slug}
    />
  )
}

/**
 * Data Fetching Helpers
 */
async function getActivitiesFromDB(): Promise<Activity[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  // return db.activity.findMany() 
  return [] 
}

async function getRegistrationsFromDB(): Promise<Registration[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  // return db.registration.findMany()
  return []
}

export default ActivityPage;