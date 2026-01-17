"use client"

import React, { useEffect, useState, useCallback } from "react"
import { VW_ActivityStats } from "@/types/types"
import { ActivityGrid } from "@/components/Activity/ActivityGrid"
import { useRouter } from "next/navigation"
import { fetchAllActivities } from "@/components/Activity/ActivitiesApi"

export default function ActivitiesPage() {
  const router = useRouter()
  
  const [activities, setActivities] = useState<VW_ActivityStats[]>([])
  const [rootActivities, setRootActivities] = useState<VW_ActivityStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch and process data on mount - no try-finally for React Compiler
  useEffect(() => {
    let mounted = true;
    
    async function loadData() {
      const actData = await fetchAllActivities().catch((error) => {
        console.error("Failed to load activities:", error);
        return [];
      });
      
      if (!mounted) return;
      
      setActivities(actData);
      const roots = actData.filter((a) => a.parentId === null);
      setRootActivities(roots);
      setIsLoading(false);
    }
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Stable callback reference
  const handleActivityClick = useCallback((slug: string) => {
    router.push(`/activities/${slug}`);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 text-sm animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="bg-gray-900 p-6 rounded-full">
           <p className="text-gray-400 text-lg">No activities found.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-500 hover:text-blue-400 text-sm font-medium"
        >
          Click to refresh
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black py-10">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-10 px-10 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Activities
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Manage your event hierarchy, track registration counts, and monitor revenue at a glance.
          </p>
        </header>

        <ActivityGrid
          title="Top Level Events"
          activities={rootActivities}
          allActivities={activities} 
          onActivityClick={handleActivityClick}
        />
      </div>
    </main>
  )
}