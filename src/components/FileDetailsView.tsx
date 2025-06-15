
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FileItem } from './FileManager';
import { getFileIcon, formatFileSize, formatDate } from '../utils/fileUtils';
import { cn } from '../lib/utils';

interface FileDetailsViewProps {
  files: FileItem[];
  selectedItems: string[];
  sortBy: 'name' | 'size' | 'date' | 'type';
  sortOrder: 'asc' | 'desc';
  onItemClick: (file: FileItem, e: React.MouseEvent) => void;
  onItemDoubleClick: (file: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, items: string[]) => void;
  onSort: (sortBy: 'name' | 'size' | 'date' | 'type') => void;
}

export const FileDetailsView: React.FC<FileDetailsViewProps> = ({
  files,
  selectedItems,
  sortBy,
  sortOrder,
  onItemClick,
  onItemDoubleClick,
  onContextMenu,
  onSort
}) => {
  return (
    <div className="flex-1">
      {/* Header */}
      <div className="sticky top-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-b border-white/20 dark:border-white/10">
        <div className="grid grid-cols-[1fr,100px,150px,100px] gap-4 px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400">
          <button
            onClick={() => onSort('name')}
            className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Name
            {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
          </button>
          <button
            onClick={() => onSort('size')}
            className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Size
            {sortBy === 'size' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
          </button>
          <button
            onClick={() => onSort('date')}
            className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Date Modified
            {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
          </button>
          <button
            onClick={() => onSort('type')}
            className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Type
            {sortBy === 'type' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-0">
        {files.map((file) => (
          <div
            key={file.id}
            className={cn(
              "group transition-all duration-200 rounded-lg grid grid-cols-[1fr,100px,150px,100px] gap-4 px-4 py-2 text-sm",
              selectedItems.includes(file.id)
                ? "bg-blue-500/20 ring-2 ring-blue-500/50"
                : "hover:bg-white/30 dark:hover:bg-white/10"
            )}
            onClick={(e) => onItemClick(file, e)}
            onDoubleClick={() => onItemDoubleClick(file)}
            onContextMenu={(e) => onContextMenu(e, [file.id])}
          >
            <div className="flex items-center gap-3">
              {getFileIcon(file)}
              <span className="font-medium text-gray-900 dark:text-white truncate">
                {file.name}
              </span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {file.size ? formatFileSize(file.size) : '—'}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {formatDate(file.dateModified)}
            </div>
            <div className="text-gray-600 dark:text-gray-400 capitalize">
              {file.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
