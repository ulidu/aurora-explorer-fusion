
import React, { useState, useMemo } from 'react';
import { Grid, List, Columns, ChevronDown, ChevronUp, File, Folder, Image, FileText, Music, Video, Archive, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { FileItem } from './FileManager';

interface FileExplorerProps {
  files: FileItem[];
  loading: boolean;
  error: string | null;
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  onNavigate: (path: string) => void;
  onContextMenu: (e: React.MouseEvent, items: string[]) => void;
  viewMode: 'list' | 'grid' | 'details';
  onViewModeChange: (mode: 'list' | 'grid' | 'details') => void;
  sortBy: 'name' | 'size' | 'date' | 'type';
  onSortChange: (sort: 'name' | 'size' | 'date' | 'type') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  searchQuery: string;
}

const getFileIcon = (file: FileItem) => {
  if (file.type === 'folder') return <Folder size={16} className="text-blue-500" />;
  
  const ext = file.extension?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
      return <Image size={16} className="text-green-500" />;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'mkv':
      return <Video size={16} className="text-purple-500" />;
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return <Music size={16} className="text-orange-500" />;
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText size={16} className="text-red-500" />;
    case 'zip':
    case 'rar':
    case '7z':
      return <Archive size={16} className="text-yellow-500" />;
    default:
      return <File size={16} className="text-gray-500" />;
  }
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  loading,
  error,
  selectedItems,
  onSelectionChange,
  onNavigate,
  onContextMenu,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  searchQuery
}) => {
  const filteredAndSortedFiles = useMemo(() => {
    let filtered = files;
    
    // Filter by search query
    if (searchQuery) {
      filtered = files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort files
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
        case 'date':
          comparison = a.dateModified.getTime() - b.dateModified.getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    // Folders first
    return sorted.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return 0;
    });
  }, [files, searchQuery, sortBy, sortOrder]);

  const handleSort = (newSortBy: 'name' | 'size' | 'date' | 'type') => {
    if (sortBy === newSortBy) {
      onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(newSortBy);
      onSortOrderChange('asc');
    }
  };

  const handleItemClick = (file: FileItem, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      const newSelection = selectedItems.includes(file.id)
        ? selectedItems.filter(id => id !== file.id)
        : [...selectedItems, file.id];
      onSelectionChange(newSelection);
    } else if (e.shiftKey && selectedItems.length > 0) {
      // Range select
      const lastSelected = selectedItems[selectedItems.length - 1];
      const lastIndex = filteredAndSortedFiles.findIndex(f => f.id === lastSelected);
      const currentIndex = filteredAndSortedFiles.findIndex(f => f.id === file.id);
      
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      const rangeSelection = filteredAndSortedFiles.slice(start, end + 1).map(f => f.id);
      
      onSelectionChange(rangeSelection);
    } else {
      // Single select
      onSelectionChange([file.id]);
    }
  };

  const handleItemDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      onNavigate(file.path);
    }
    // For files, would typically open with default application
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading files</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/10 dark:bg-black/10 backdrop-blur-sm border-b border-white/20 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredAndSortedFiles.length} items
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              viewMode === 'list'
                ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/10"
            )}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              viewMode === 'grid'
                ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/10"
            )}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('details')}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              viewMode === 'details'
                ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/10"
            )}
          >
            <Columns size={16} />
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'details' && (
          <div className="sticky top-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-b border-white/20 dark:border-white/10">
            <div className="grid grid-cols-[1fr,100px,150px,100px] gap-4 px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              <button
                onClick={() => handleSort('name')}
                className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Name
                {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
              </button>
              <button
                onClick={() => handleSort('size')}
                className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Size
                {sortBy === 'size' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
              </button>
              <button
                onClick={() => handleSort('date')}
                className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Date Modified
                {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
              </button>
              <button
                onClick={() => handleSort('type')}
                className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Type
                {sortBy === 'type' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
              </button>
            </div>
          </div>
        )}

        <div className={cn(
          "p-4",
          viewMode === 'grid' && "grid grid-cols-auto-fill gap-4",
          viewMode === 'list' && "space-y-1",
          viewMode === 'details' && "space-y-0"
        )}>
          {filteredAndSortedFiles.map((file) => (
            <div
              key={file.id}
              className={cn(
                "group transition-all duration-200 rounded-lg",
                selectedItems.includes(file.id)
                  ? "bg-blue-500/20 ring-2 ring-blue-500/50"
                  : "hover:bg-white/30 dark:hover:bg-white/10",
                viewMode === 'grid' && "p-3 text-center",
                viewMode === 'list' && "flex items-center gap-3 px-3 py-2",
                viewMode === 'details' && "grid grid-cols-[1fr,100px,150px,100px] gap-4 px-4 py-2 text-sm"
              )}
              onClick={(e) => handleItemClick(file, e)}
              onDoubleClick={() => handleItemDoubleClick(file)}
              onContextMenu={(e) => onContextMenu(e, [file.id])}
            >
              {viewMode === 'grid' && (
                <>
                  <div className="flex justify-center mb-2">
                    {getFileIcon(file)}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {file.size ? formatFileSize(file.size) : ''}
                  </div>
                </>
              )}

              {viewMode === 'list' && (
                <>
                  {getFileIcon(file)}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(file.dateModified)} • {file.size ? formatFileSize(file.size) : ''}
                    </div>
                  </div>
                </>
              )}

              {viewMode === 'details' && (
                <>
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
                </>
              )}
            </div>
          ))}
        </div>

        {filteredAndSortedFiles.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Folder size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {searchQuery ? 'No files match your search' : 'This folder is empty'}
              </p>
              {searchQuery && (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Try adjusting your search terms
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
