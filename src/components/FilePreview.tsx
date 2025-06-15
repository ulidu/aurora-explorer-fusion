
import React from 'react';
import { FileItem } from './FileManager';
import { getFileIcon } from '../utils/fileUtils';

interface FilePreviewProps {
  file: FileItem;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const ext = file.extension?.toLowerCase();
  
  return (
    <div className="relative w-16 h-16 mx-auto mb-2">
      {/* File background */}
      <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-sm">
        {/* File icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {getFileIcon(file, 48)}
        </div>
      </div>
      
      {/* Extension label */}
      {ext && (
        <div className="absolute -bottom-1 -right-1 bg-gray-700 dark:bg-gray-900 text-white text-xs rounded px-1 py-0.5 font-medium uppercase shadow-sm">
          {ext}
        </div>
      )}
      
      {/* File type specific overlays */}
      {ext && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext) && (
        <div className="absolute inset-1 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 rounded opacity-50" />
      )}
      {ext && ['mp4', 'avi', 'mov', 'mkv'].includes(ext) && (
        <div className="absolute inset-1 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded opacity-50" />
      )}
      {ext && ['mp3', 'wav', 'flac', 'aac'].includes(ext) && (
        <div className="absolute inset-1 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 rounded opacity-50" />
      )}
    </div>
  );
};
