"use client";

import React, { useState } from "react";
import { VW_ActivityStats, Registration } from "@/types/types";
import { ensureFreeRegistrationLeaf } from "./ActivitiesApi";
import { UserPlus, X, Users } from "lucide-react";

interface RegistrationsModalProps {
  activity: VW_ActivityStats;
  onClose: () => void;
  onAddRegistration?: (activityId: string) => void; 
  registrations: Registration[];
}

export const RegistrationsModal: React.FC<RegistrationsModalProps> = ({
  activity,
  onClose,
  onAddRegistration,
  registrations = [],
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Helper to handle the special naming for non-tech users
  const isFreeReg = activity.name === 'free_registrations';
  const displayName = isFreeReg ? 'General Registrations' : activity.name;

  // Refactored to avoid Try/Catch/Finally for React Compiler compatibility
  const handleAddClick = async () => {
    setIsRedirecting(true);
    
    let targetId = activity.id;

    // If clicking "Add" on a folder, find/create the 'free_registrations' child
    if (activity.hasChildren && !isFreeReg) {
      const resolvedId = await ensureFreeRegistrationLeaf(activity);
      // If resolution fails (e.g. network error), we stop here
      if (!resolvedId) {
        setIsRedirecting(false);
        return;
      }
      targetId = resolvedId;
    }

    if (onAddRegistration) {
      onAddRegistration(targetId);
    } else {
      console.log("Redirecting registration to:", targetId);
    }
    
    setIsRedirecting(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isFreeReg ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{displayName}</h2>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                {registrations.length} Participants
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="mt-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {registrations.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-700" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No registrations found here</p>
            </div>
          ) : (
            <div className="space-y-1">
              {registrations.map((reg) => (
                <div key={reg.id} className="flex items-center justify-between gap-4 py-3 px-3 rounded-xl hover:bg-gray-800/40 border border-transparent hover:border-gray-800 transition-all">
                  <div className="flex items-center gap-3">
                    {reg.person.photoUrl ? (
                      <img 
                        src={reg.person.photoUrl} 
                        alt={reg.person.name} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-gray-300 border border-gray-600">
                        {reg.person.name.charAt(0)}
                      </div>
                    )}
                    
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-gray-100">{reg.person.name}</span>
                      <span className="text-gray-500 text-[11px] font-mono tracking-tighter">{reg.person.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <span className={`capitalize px-2 py-0.5 rounded-md text-[9px] font-bold border ${
                      reg.status === 'completed' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : reg.status === 'cancelled' || reg.status === 'no_show'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {reg.status.replace('_', ' ')}
                    </span>
                    <span className="text-gray-600 text-[10px] font-medium">{reg.registrationNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-500 max-w-[200px] text-center sm:text-left leading-relaxed">
            {activity.hasChildren && !isFreeReg 
              ? "Note: New registrations will be added to the 'General' bucket." 
              : "Registering directly to this activity."}
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none rounded-xl px-5 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddClick}
              disabled={isRedirecting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRedirecting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Add Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};