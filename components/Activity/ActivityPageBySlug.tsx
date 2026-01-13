"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Activity, Registration } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"
import { RegistrationsModal } from "@/components/Activity/RegistrationsModal"

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
  const [isModalOpen, setIsModalOpen] = useState(true)

  const currentActivity = activities.find((a) => a.slug === slug) ?? null

  if (!currentActivity) {
    return <p className="text-center py-12">Activity not found.</p>
  }

  // 1. Logic Change: If this is a leaf, find its siblings to keep the grid full.
  // If it's a parent, find its children.
  const isLeaf = !currentActivity.hasChildren
  
  const activitiesToShow = isLeaf 
    ? activities.filter(a => a.parentId === currentActivity.parentId) // Show siblings
    : activities.filter(a => a.parentId === currentActivity.id)       // Show children

  return (
    <section className="relative space-y-6">
      <header className="px-4">
        <h1 className="text-2xl font-bold tracking-tight">{currentActivity.name}</h1>
        <p className="text-sm text-muted-foreground">
          {isLeaf ? "Viewing participants" : "Select a sub-activity"}
        </p>
      </header>

      {/* 2. The Grid is now always visible with relevant context */}
      {activitiesToShow.length > 0 && (
        <ActivityGrid
          activities={activitiesToShow}
          onActivityClick={(childSlug) => {
            setIsModalOpen(true); // Ensure modal opens if clicking a sibling
            router.push(`/activities/${childSlug}`);
          }}
        />
      )}

      {/* 3. The Modal overlays the grid without hiding it */}
      {isLeaf && isModalOpen && (
        <RegistrationsModal
          activity={currentActivity}
          allActivities={activities}
          allRegistrations={registrations}
          onClose={() => {
            setIsModalOpen(false)
            // Go back to the parent level visually
            router.back()
          }}
          onAddRegistration={(id) => console.log("Add for:", id)}
        />
      )}
    </section>
  )
}