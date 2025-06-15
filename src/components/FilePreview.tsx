
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
      {/* Modern file background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        {/* File icon with modern positioning */}
        <div className="absolute inset-0 flex items-center justify-center">
          {getFileIcon(file, 32)}
        </div>
      </div>
      
      {/* Modern extension label */}
      {ext && (
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-900 dark:to-black text-white text-xs rounded-md px-1.5 py-0.5 font-medium uppercase shadow-md border border-white/10">
          {ext}
        </div>
      )}
      
      {/* File type specific modern overlays */}
      {ext && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext) && (
        <div className="absolute inset-1 bg-gradient-to-br from-green-100/50 to-green-200/30 dark:from-green-900/20 dark:to-green-800/10 rounded-lg" />
      )}
      {ext && ['mp4', 'avi', 'mov', 'mkv'].includes(ext) && (
        <div className="absolute inset-1 bg-gradient-to-br from-purple-100/50 to-purple-200/30 dark:from-purple-900/20 dark:to-purple-800/10 rounded-lg" />
      )}
      {ext && ['mp3', 'wav', 'flac', 'aac'].includes(ext) && (
        <div className="absolute inset-1 bg-gradient-to-br from-orange-100/50 to-orange-200/30 dark:from-orange-900/20 dark:to-orange-800/10 rounded-lg" />
      )}
      
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-400/0 to-gray-600/0 group-hover:from-gray-400/5 group-hover:to-gray-600/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
};
