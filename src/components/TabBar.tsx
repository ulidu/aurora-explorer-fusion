
import React from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Tab } from './FileManager';

interface TabBarProps {
  tabs: Tab[];
  onTabChange: (tabId: string) => void;
  onNewTab: () => void;
  onCloseTab: (tabId: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, onTabChange, onNewTab, onCloseTab }) => {
  return (
    <div className="flex items-center bg-white/30 dark:bg-black/20 backdrop-blur-lg border-b border-white/20 dark:border-white/10 px-2 py-1">
      <div className="flex items-center gap-1 flex-1 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-t-lg min-w-[120px] max-w-[200px] group transition-all duration-200",
              tab.isActive
                ? "bg-white/50 dark:bg-black/30 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/10"
            )}
          >
            <button
              onClick={() => onTabChange(tab.id)}
              className="flex-1 text-left text-sm font-medium truncate"
            >
              {tab.title}
            </button>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-600 p-1 rounded transition-all duration-200"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <button
        onClick={onNewTab}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-200 text-gray-600 dark:text-gray-400"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
