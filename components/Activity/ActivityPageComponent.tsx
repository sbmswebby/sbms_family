"use client"

import React, { useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Activity } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"

interface ActivitiesRootPageComponentProps {
  activities: Activity[]
}

export const ActivitiesRootPageComponent: React.FC<
  ActivitiesRootPageComponentProps
> = ({ activities }) => {
  const router = useRouter()

  const rootActivities = useMemo(
    () => activities.filter((activity) => activity.parentId === null),
    [activities]
  )

  const handleActivityClick = useCallback(
    (slug: string) => {
      router.push(`/activities/${slug}`)
    },
    [router]
  )

  const handleLogoClick = () => {
    router.push("/")
  }

  const handleSignUpClick = () => {
    router.push("/signup")
  }

  const handleSignInClick = () => {
    router.push("/signin")
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519744792095-2f2205e87b6f')",
        }}
      />

      {/* Dark + Orange overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-orange-900/80 to-orange-700/70" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-20">
        {/* Header */}
        <div className="mb-14 flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex items-center gap-4 focus:outline-none"
          >
            {/* Logo */}
            <div className="relative h-16 w-16 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/images/image.jpeg"
                alt="SBMS Logo"
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(251,146,60,0.6)]"
                priority
              />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              SBMS <span className="text-orange-400">Family</span>
            </h1>
          </button>

          {/* Sign In / Sign Up buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSignInClick}
              className="rounded-full bg-orange-600 px-6 py-2 text-white transition-colors hover:bg-orange-500"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUpClick}
              className="rounded-full border-2 border-orange-600 px-6 py-2 text-orange-600 transition-colors hover:bg-orange-600 hover:text-white"
            >
              Sign Up
            </button>
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-orange-200 drop-shadow-md text-center sm:text-left">
          Fashion, beauty & makeup experiences crafted to inspire elegance
        </p>

        {/* Glass container */}
        <div className="mt-10 rounded-3xl bg-white/95 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-lg sm:p-12">
          {rootActivities.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-orange-300">
              <p className="font-medium text-orange-600">
                No activities available yet.
              </p>
            </div>
          ) : (
            <ActivityGrid
              activities={rootActivities}
              onActivityClick={handleActivityClick}
            />
          )}
        </div>
      </div>

      {/* Glow effects */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-500/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
    </section>
  )
}
