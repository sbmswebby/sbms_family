// RegistrationsModal.tsx
"use client"

import React, { useMemo } from "react";
import { Activity, Registration } from "@/types/types";


interface RegistrationsModalProps {
  activity: Activity;
  onClose: () => void;
  onAddRegistration: (activityId: string) => void;
  /** * Passed down from the parent container after fetchAllActivities() 
   */
  allActivities: Activity[];
  /** * Passed down from the parent container after fetchAllRegistrations() 
   */
  allRegistrations: Registration[];
}

export const RegistrationsModal: React.FC<RegistrationsModalProps> = ({
  activity,
  onClose,
  onAddRegistration,
  allActivities,
  allRegistrations,
}) => {
  
  /**
   * Recursively finds all registrations for the current activity 
   * AND all its sub-activities (descendants).
   */
  const relevantRegistrations = useMemo(() => {
    // Safety check for empty data
    if (!allActivities.length || !allRegistrations.length) return [];

    const getDescendantIds = (parentIds: string[]): string[] => {
      const children = allActivities
        .filter((a) => a.parentId && parentIds.includes(a.parentId))
        .map((a) => a.id);
      
      if (children.length === 0) return [];
      return [...children, ...getDescendantIds(children)];
    };

    const targetIds = [activity.id, ...getDescendantIds([activity.id])];
    return allRegistrations.filter((reg) => targetIds.includes(reg.activityId));
  }, [activity.id, allActivities, allRegistrations]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg rounded-xl bg-gray-900 border border-gray-700 p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{activity.name}</h2>
            <p className="text-sm text-gray-400">
              {relevantRegistrations.length} registered participants
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {relevantRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl">👥</span>
              <p className="mt-2 text-sm text-gray-500 font-medium">No registrations yet</p>
            </div>
          ) : (
            relevantRegistrations.map((reg) => (
              <div key={reg.id} className="flex items-center justify-between gap-4 border-b border-gray-800 py-3 last:border-0 hover:bg-gray-800/50 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  {/* Avatar/Photo Support */}
                  {reg.person.photoUrl ? (
                    <img 
                      src={reg.person.photoUrl} 
                      alt={reg.person.name} 
                      className="w-10 h-10 rounded-full object-cover border border-gray-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-700">
                      {reg.person.name.charAt(0)}
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-100">{reg.person.name}</span>
                    <span className="text-gray-500 text-xs font-mono">{reg.person.phone}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`capitalize px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    reg.status === 'completed' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : reg.status === 'cancelled' || reg.status === 'no_show'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {reg.status.replace('_', ' ')}
                  </span>
                  <span className="text-gray-500 text-[10px] font-medium">{reg.registrationNumber}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition"
          >
            Close
          </button>
          <button
            onClick={() => onAddRegistration(activity.id)}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
          >
            Add Registration
          </button>
        </div>
      </div>
    </div>
  );
};