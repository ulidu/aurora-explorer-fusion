
import React, { useMemo } from 'react';
import { Folder } from 'lucide-react';
import { FileItem } from './FileManager';
import { FileExplorerToolbar } from './FileExplorerToolbar';
import { FileGridView } from './FileGridView';
import { FileListView } from './FileListView';
import { FileDetailsView } from './FileDetailsView';

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
      <FileExplorerToolbar
        itemCount={filteredAndSortedFiles.length}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {/* File List */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'grid' && (
          <FileGridView
            files={filteredAndSortedFiles}
            allFiles={files}
            selectedItems={selectedItems}
            onItemClick={handleItemClick}
            onItemDoubleClick={handleItemDoubleClick}
            onContextMenu={onContextMenu}
          />
        )}

        {viewMode === 'list' && (
          <FileListView
            files={filteredAndSortedFiles}
            selectedItems={selectedItems}
            onItemClick={handleItemClick}
            onItemDoubleClick={handleItemDoubleClick}
            onContextMenu={onContextMenu}
          />
        )}

        {viewMode === 'details' && (
          <FileDetailsView
            files={filteredAndSortedFiles}
            selectedItems={selectedItems}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onItemClick={handleItemClick}
            onItemDoubleClick={handleItemDoubleClick}
            onContextMenu={onContextMenu}
            onSort={handleSort}
          />
        )}

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
