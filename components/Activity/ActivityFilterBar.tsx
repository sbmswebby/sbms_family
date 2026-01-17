"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Filter, RotateCcw, 
  ArrowUpAz, ArrowDownAz, 
  ChevronDown, ChevronUp
} from "lucide-react";
import { VW_ActivityStats } from "@/types/types";

interface ActivityFilterBarProps {
  activities: VW_ActivityStats[];
  onFilterChange: (filtered: VW_ActivityStats[]) => void;
}

export type SortField = "name" | "startTime" | "registrations";
export type SortOrder = "asc" | "desc";

export default function ActivityFilterBar({
  activities = [],
  onFilterChange,
}: ActivityFilterBarProps) {
  // Primary States
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "parent" | "leaf">("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  // Sort States
  const [sortField, setSortField] = useState<SortField>("startTime");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const lastFilteredRef = useRef("");

  useEffect(() => {
    const timer = setTimeout(() => {
      let filtered = [...activities];

      // 1. Text Search (Now includes Description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(a => 
          a.name.toLowerCase().includes(q) || 
          a.slug.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q))
        );
      }

      // 2. Status Filter (Matches your new interface status union)
      if (statusFilter !== "all") {
        filtered = filtered.filter(a => a.status === statusFilter);
      }

      // 3. Type Filter (Parent vs Leaf)
      if (typeFilter === "parent") filtered = filtered.filter(a => a.hasChildren);
      if (typeFilter === "leaf") filtered = filtered.filter(a => !a.hasChildren);

      // 4. Date Range Filter
      if (dateRange.start) {
        filtered = filtered.filter(a => a.startTime && new Date(a.startTime) >= new Date(dateRange.start));
      }
      if (dateRange.end) {
        filtered = filtered.filter(a => a.startTime && new Date(a.startTime) <= new Date(dateRange.end));
      }

      // 5. Advanced Sorting (Simplified: uses built-in registrationCounts)
      filtered.sort((a, b) => {
        let comparison = 0;
        if (sortField === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortField === "startTime") {
          comparison = new Date(a.startTime || 0).getTime() - new Date(b.startTime || 0).getTime();
        } else if (sortField === "registrations") {
          comparison = (a.registrationCounts?.total || 0) - (b.registrationCounts?.total || 0);
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });

      const serialized = JSON.stringify(filtered.map(f => f.id)) + sortField + sortOrder;
      if (lastFilteredRef.current !== serialized) {
        lastFilteredRef.current = serialized;
        onFilterChange(filtered);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, typeFilter, dateRange, sortField, sortOrder, activities, onFilterChange]);

  const resetFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setDateRange({ start: "", end: "" });
    setSearchQuery("");
  };

  const isFilterActive = statusFilter !== "all" || typeFilter !== "all" || dateRange.start || dateRange.end;

  return (
    <div className="space-y-4 px-10">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, slug or description..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
          />
        </div>

        <div className="flex gap-2">
          {/* Sort Menu */}
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="bg-transparent pl-3 pr-2 py-2 text-sm text-gray-300 outline-none cursor-pointer hover:bg-gray-800"
            >
              <option value="startTime">Sort by Date</option>
              <option value="name">Sort A-Z</option>
              <option value="registrations">Most Registered</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 border-l border-gray-800 hover:bg-gray-800 transition-colors"
            >
              {sortOrder === "asc" ? <ArrowUpAz className="w-4 h-4 text-blue-400" /> : <ArrowDownAz className="w-4 h-4 text-blue-400" />}
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
              showFilters || isFilterActive ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-900 border-gray-800 text-gray-400"
            }`}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Panel */}
      {showFilters && (
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Filters</h3>
            <button onClick={resetFilters} className="text-xs text-red-400 flex items-center gap-1 hover:underline">
              <RotateCcw className="w-3 h-3" /> Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Lifecycle Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Structure Filter */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">View Type</label>
              <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
                {(['all', 'parent', 'leaf'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`flex-1 py-2 text-[11px] font-medium rounded-lg capitalize transition-all ${
                      typeFilter === t ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {t === 'all' ? 'All Items' : t === 'parent' ? 'Folders' : 'Events'}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-1/2 bg-gray-800 border border-gray-700 rounded-xl p-2 text-xs text-white outline-none focus:border-blue-500"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-1/2 bg-gray-800 border border-gray-700 rounded-xl p-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}