
import React from 'react';
import { ChevronRight, Home, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface BreadcrumbNavProps {
  path: string;
  onNavigate: (path: string) => void;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ path, onNavigate }) => {
  const pathSegments = path.split('/').filter(Boolean);
  const [history, setHistory] = React.useState<string[]>([path]);
  const [historyIndex, setHistoryIndex] = React.useState(0);

  const handleNavigateUp = () => {
    const parentPath = pathSegments.slice(0, -1).join('/') || '/';
    onNavigate(parentPath);
  };

  const handleNavigateBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onNavigate(history[newIndex]);
    }
  };

  const handleNavigateForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onNavigate(history[newIndex]);
    }
  };

  const handleRefresh = () => {
    // Trigger refresh by re-navigating to current path
    onNavigate(path);
  };

  React.useEffect(() => {
    // Add to history when path changes
    const newHistory = [...history.slice(0, historyIndex + 1), path];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [path]);

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-b border-white/20 dark:border-white/10">
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleNavigateBack}
          disabled={historyIndex === 0}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            historyIndex === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/10"
          )}
        >
          <ArrowLeft size={16} />
        </button>
        
        <button
          onClick={handleNavigateForward}
          disabled={historyIndex === history.length - 1}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            historyIndex === history.length - 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/10"
          )}
        >
          <ArrowRight size={16} />
        </button>

        <button
          onClick={handleNavigateUp}
          disabled={pathSegments.length === 0}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            pathSegments.length === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/10"
          )}
          title="Up one level"
        >
          ↑
        </button>

        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-200"
          title="Refresh"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="h-6 w-px bg-white/20 dark:bg-white/10"></div>

      {/* Breadcrumb Path */}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300"
        >
          <Home size={14} />
        </button>

        {pathSegments.map((segment, index) => {
          const segmentPath = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;

          return (
            <React.Fragment key={index}>
              <ChevronRight size={14} className="text-gray-400" />
              <button
                onClick={() => onNavigate(segmentPath)}
                className={cn(
                  "px-2 py-1 rounded text-sm font-medium transition-all duration-200 truncate max-w-[120px]",
                  isLast
                    ? "text-gray-900 dark:text-white bg-white/20 dark:bg-white/10"
                    : "text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10"
                )}
              >
                {segment}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Path Input (Alternative view) */}
      <div className="flex items-center gap-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {pathSegments.length} items
        </div>
      </div>
    </div>
  );
};
