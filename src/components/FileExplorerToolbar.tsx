
import React from 'react';
import { Grid, List, Columns } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileExplorerToolbarProps {
  itemCount: number;
  viewMode: 'list' | 'grid' | 'details';
  onViewModeChange: (mode: 'list' | 'grid' | 'details') => void;
}

export const FileExplorerToolbar: React.FC<FileExplorerToolbarProps> = ({
  itemCount,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white/10 dark:bg-black/10 backdrop-blur-sm border-b border-white/20 dark:border-white/10">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {itemCount} items
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onViewModeChange('list')}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            viewMode === 'list'
              ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
              : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/10"
          )}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => onViewModeChange('grid')}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            viewMode === 'grid'
              ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
              : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/10"
          )}
        >
          <Grid size={16} />
        </button>
        <button
          onClick={() => onViewModeChange('details')}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            viewMode === 'details'
              ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
              : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/10"
          )}
        >
          <Columns size={16} />
        </button>
      </div>
    </div>
  );
};
