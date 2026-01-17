// app/activities/[slug]/page.tsx (Server Component)

import { ActivityPageBySlug } from "@/components/Activity/ActivityPageBySlug";
import { fetchAllActivities, fetchAllRegistrations } from "@/components/Activity/demoActivities";

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [activities, registrations] = await Promise.all([
    fetchAllActivities(),
    fetchAllRegistrations(),
  ]);

  return (
    <main className="min-h-screen bg-black">
      <ActivityPageBySlug
        activities={activities}
        allRegistrations={registrations} 
        slug={slug}
      />
    </main>
  );
}