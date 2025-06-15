
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
    <div className="relative w-20 h-20 mx-auto mb-3">
      {/* Main folder container with modern styling */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-blue-100/60 to-blue-200/40 dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-800/20 rounded-2xl border border-blue-200/40 dark:border-blue-700/30 backdrop-blur-sm shadow-lg">
        
        {/* Content preview - show actual file icons in a modern grid */}
        {folderContents.length > 0 ? (
          <div className="absolute inset-3 grid grid-cols-2 gap-1 p-1">
            {folderContents.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm border border-white/50 dark:border-gray-700/50 transition-all duration-200"
                style={{ 
                  transform: `scale(${0.85 + index * 0.03}) translateZ(${index * 2}px)`,
                  zIndex: 4 - index,
                }}
              >
                {item.type === 'folder' ? (
                  <Folder size={10} className="text-blue-500 dark:text-blue-400" />
                ) : (
                  <div className="scale-75">
                    {getFileIcon(item, 10)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty folder - show folder icon */
          <div className="absolute inset-0 flex items-center justify-center">
            <Folder 
              size={32} 
              className="text-blue-400/70 dark:text-blue-300/70" 
              strokeWidth={1.5}
            />
          </div>
        )}
        
        {/* Folder tab at the top for depth */}
        <div className="absolute -top-1 left-2 right-4 h-3 bg-gradient-to-r from-blue-200/60 to-blue-300/40 dark:from-blue-800/40 dark:to-blue-700/30 rounded-t-xl border-t border-l border-r border-blue-300/40 dark:border-blue-600/30" />
      </div>
      
      {/* File count badge with modern styling */}
      {folderContents.length > 0 && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-semibold shadow-lg border-2 border-white dark:border-gray-800">
          {folderContents.length > 99 ? '99+' : folderContents.length}
        </div>
      )}
      
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/0 via-transparent to-blue-600/0 group-hover:from-blue-400/20 group-hover:to-blue-600/10 transition-all duration-300 pointer-events-none" />
      
      {/* Bottom shadow for depth */}
      <div className="absolute inset-x-1 -bottom-1 h-2 bg-blue-900/10 dark:bg-blue-400/5 rounded-b-2xl blur-sm" />
    </div>
  );
};
