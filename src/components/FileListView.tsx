
import React from 'react';
import { FileItem } from './FileManager';
import { getFileIcon, formatFileSize, formatDate } from '../utils/fileUtils';
import { cn } from '../lib/utils';

interface FileListViewProps {
  files: FileItem[];
  selectedItems: string[];
  onItemClick: (file: FileItem, e: React.MouseEvent) => void;
  onItemDoubleClick: (file: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, items: string[]) => void;
}

export const FileListView: React.FC<FileListViewProps> = ({
  files,
  selectedItems,
  onItemClick,
  onItemDoubleClick,
  onContextMenu
}) => {
  return (
    <div className="p-4 space-y-1">
      {files.map((file) => (
        <div
          key={file.id}
          className={cn(
            "group transition-all duration-200 rounded-lg flex items-center gap-3 px-3 py-2",
            selectedItems.includes(file.id)
              ? "bg-blue-500/20 ring-2 ring-blue-500/50"
              : "hover:bg-white/30 dark:hover:bg-white/10"
          )}
          onClick={(e) => onItemClick(file, e)}
          onDoubleClick={() => onItemDoubleClick(file)}
          onContextMenu={(e) => onContextMenu(e, [file.id])}
        >
          {getFileIcon(file)}
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {file.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(file.dateModified)} • {file.size ? formatFileSize(file.size) : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
