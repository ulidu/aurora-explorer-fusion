
import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  currentPath: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange, currentPath }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="px-4 py-2 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-b border-white/20 dark:border-white/10">
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className={cn(
          "flex-1 flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-lg",
          isFocused
            ? "bg-white/60 dark:bg-black/40 ring-2 ring-blue-500/50"
            : "bg-white/40 dark:bg-black/30 hover:bg-white/50 dark:hover:bg-black/40"
        )}>
          <Search size={16} className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder={`Search in ${currentPath.split('/').pop() || 'Root'}...`}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="p-1 hover:bg-white/30 dark:hover:bg-white/10 rounded-full transition-all duration-200"
            >
              <X size={14} className="text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-lg",
            showFilters
              ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
              : "bg-white/40 dark:bg-black/30 hover:bg-white/50 dark:hover:bg-black/40 text-gray-700 dark:text-gray-300"
          )}
        >
          <Filter size={16} />
          <span className="text-sm font-medium">Filters</span>
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-3 p-4 bg-white/50 dark:bg-black/40 backdrop-blur-lg rounded-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                File Type
              </label>
              <select className="w-full px-3 py-1 bg-white/60 dark:bg-black/50 rounded-lg text-sm border border-white/20 dark:border-white/10">
                <option>All Types</option>
                <option>Documents</option>
                <option>Images</option>
                <option>Videos</option>
                <option>Audio</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Modified
              </label>
              <select className="w-full px-3 py-1 bg-white/60 dark:bg-black/50 rounded-lg text-sm border border-white/20 dark:border-white/10">
                <option>Any Time</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Size
              </label>
              <select className="w-full px-3 py-1 bg-white/60 dark:bg-black/50 rounded-lg text-sm border border-white/20 dark:border-white/10">
                <option>Any Size</option>
                <option>Small (&lt; 1 MB)</option>
                <option>Medium (1-100 MB)</option>
                <option>Large (&gt; 100 MB)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <select className="w-full px-3 py-1 bg-white/60 dark:bg-black/50 rounded-lg text-sm border border-white/20 dark:border-white/10">
                <option>Current Folder</option>
                <option>Include Subfolders</option>
                <option>This Mac</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
