
import React from 'react';
import { FileItem } from './FileManager';
import { FolderPreview } from './FolderPreview';
import { FilePreview } from './FilePreview';
import { formatFileSize } from '../utils/fileUtils';
import { cn } from '../lib/utils';

interface FileGridViewProps {
  files: FileItem[];
  allFiles: FileItem[];
  selectedItems: string[];
  onItemClick: (file: FileItem, e: React.MouseEvent) => void;
  onItemDoubleClick: (file: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, items: string[]) => void;
}

export const FileGridView: React.FC<FileGridViewProps> = ({
  files,
  allFiles,
  selectedItems,
  onItemClick,
  onItemDoubleClick,
  onContextMenu
}) => {
  return (
    <div className="p-6 grid grid-cols-auto-fill gap-8">
      {files.map((file) => (
        <div
          key={file.id}
          className={cn(
            "group transition-all duration-300 rounded-xl p-4 text-center cursor-pointer hover:scale-105",
            selectedItems.includes(file.id)
              ? "bg-blue-500/15 ring-2 ring-blue-500/60 shadow-lg"
              : "hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-md"
          )}
          onClick={(e) => onItemClick(file, e)}
          onDoubleClick={() => onItemDoubleClick(file)}
          onContextMenu={(e) => onContextMenu(e, [file.id])}
        >
          {file.type === 'folder' ? (
            <FolderPreview file={file} files={allFiles} />
          ) : (
            <FilePreview file={file} />
          )}
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-full mt-2">
            {file.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {file.size ? formatFileSize(file.size) : ''}
          </div>
        </div>
      ))}
    </div>
  );
};
