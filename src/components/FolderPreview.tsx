
import React from 'react';
import { Folder } from 'lucide-react';
import { FileItem } from './FileManager';
import { getFileIcon } from '../utils/fileUtils';

interface FolderPreviewProps {
  file: FileItem;
  files: FileItem[];
}

export const FolderPreview: React.FC<FolderPreviewProps> = ({ file, files }) => {
  // Get first 4 files that would be inside this folder for preview
  const folderContents = files.filter(f => f.path.startsWith(file.path + '/') && f.path !== file.path).slice(0, 4);
  
  return (
    <div className="relative w-16 h-16 mx-auto mb-2">
      {/* Modern folder background with gradient and subtle shadow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 shadow-sm">
        {/* Folder icon with modern styling */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Folder 
            size={40} 
            className="text-blue-500 dark:text-blue-400 opacity-80" 
            fill="currentColor"
            fillOpacity="0.1"
          />
        </div>
      </div>
      
      {/* Content preview grid with modern styling */}
      {folderContents.length > 0 && (
        <div className="absolute inset-2 grid grid-cols-2 gap-0.5 p-1">
          {folderContents.map((item, index) => (
            <div 
              key={item.id} 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md flex items-center justify-center border border-gray-200/30 dark:border-gray-600/30 shadow-xs"
              style={{ 
                transform: `scale(${0.8 + index * 0.05})`,
                zIndex: 4 - index,
                opacity: 0.9 - index * 0.1
              }}
            >
              {item.type === 'folder' ? (
                <Folder size={6} className="text-blue-400 dark:text-blue-300" />
              ) : (
                <div className="scale-75">
                  {getFileIcon(item, 6)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Modern count badge */}
      {folderContents.length > 0 && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-md border border-white/20">
          {folderContents.length > 99 ? '99+' : folderContents.length}
        </div>
      )}
      
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/10 group-hover:to-blue-600/10 transition-all duration-300 pointer-events-none" />
    </div>
  );
};
