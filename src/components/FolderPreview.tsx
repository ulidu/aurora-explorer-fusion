
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
      {/* Folder background */}
      <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg border-2 border-blue-300 dark:border-blue-600">
        <Folder size={64} className="text-blue-500 opacity-20 absolute inset-0" />
      </div>
      
      {/* Mini thumbnails of folder contents */}
      <div className="absolute inset-2 grid grid-cols-2 gap-0.5">
        {folderContents.map((item, index) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-sm flex items-center justify-center border border-gray-200 dark:border-gray-600">
            {item.type === 'folder' ? (
              <Folder size={8} className="text-blue-400" />
            ) : (
              getFileIcon(item, 8)
            )}
          </div>
        ))}
        {/* Fill empty slots */}
        {Array.from({ length: 4 - folderContents.length }).map((_, index) => (
          <div key={`empty-${index}`} className="bg-gray-50 dark:bg-gray-700 rounded-sm border border-gray-200 dark:border-gray-600" />
        ))}
      </div>
      
      {/* Folder count badge */}
      {folderContents.length > 0 && (
        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {folderContents.length}
        </div>
      )}
    </div>
  );
};
