"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Activity, Registration } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"
import { ParentActivitySummary } from "@/components/Activity/ParentActivitySummary"
import { ActivityRegistrationSection } from "@/components/Activity/ActivityRegistrationSection"

interface ActivityPageBySlugProps {
  activities: Activity[]
  registrations: Registration[]
  slug: string
}

export const ActivityPageBySlug: React.FC<ActivityPageBySlugProps> = ({
  activities,
  registrations,
  slug,
}) => {
  const router = useRouter()

  const currentActivity =
    activities.find((activity) => activity.slug === slug) ?? null

  if (!currentActivity) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="rounded-xl bg-red-50 px-6 py-4 text-red-700 shadow-md">
          Activity not found for slug: <strong>{slug}</strong>
        </p>
      </div>
    )
  }

  const children = activities.filter(
    (activity) => activity.parentId === currentActivity.id
  )

  const isLeaf = children.length === 0

  const handleClick = (childSlug: string) => {
    router.push(`/activities/${childSlug}`)
  }

  const activityRegistrations = isLeaf
    ? registrations.filter((r) => r.activityId === currentActivity.id)
    : []

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-75"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521335629791-ce4aec67dd47')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-orange-900/70 to-black/90" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 space-y-16">
        {/* Hero Section */}
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg">
            {currentActivity.name}
          </h1>
          {currentActivity.description && (
            <p className="mt-4 max-w-2xl mx-auto text-lg text-orange-200 drop-shadow-md">
              {currentActivity.description}
            </p>
          )}
        </header>

        {/* Parent Summary – Glass Card */}
        <section className="rounded-3xl bg-white/90 backdrop-blur-lg p-8 shadow-lg transition hover:shadow-orange-400/30 text-gray-900">
          <ParentActivitySummary activity={currentActivity} />
        </section>

        {/* Children Section */}
        {children.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white drop-shadow-md">
              Explore Sub Activities
            </h2>
            <div className="rounded-3xl bg-white/90 backdrop-blur-lg p-8 shadow-lg transition hover:shadow-orange-400/20 text-gray-900">
              <ActivityGrid activities={children} onActivityClick={handleClick} />
            </div>
          </section>
        )}

        {/* Registrations Section */}
        {isLeaf && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white drop-shadow-md">
              Registrations
            </h2>
            <div className="rounded-3xl bg-white/90 backdrop-blur-lg p-8 shadow-lg text-gray-900">
              <ActivityRegistrationSection
                activityId={currentActivity.id}
                registrations={activityRegistrations}
              />
            </div>
          </section>
        )}
      </div>

      {/* Glow Effects */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-500/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
    </section>
  )
}
