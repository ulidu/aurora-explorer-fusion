
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TabBar } from './TabBar';
import { BreadcrumbNav } from './BreadcrumbNav';
import { FileExplorer } from './FileExplorer';
import { SearchBar } from './SearchBar';
import { ContextMenu } from './ContextMenu';
import { FileOperationsDialog } from './FileOperationsDialog';
import { useFileSystem } from '../hooks/useFileSystem';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  dateModified: Date;
  dateCreated: Date;
  path: string;
  extension?: string;
  icon?: string;
  isHidden?: boolean;
}

export interface Tab {
  id: string;
  title: string;
  path: string;
  isActive: boolean;
}

const FileManager = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Home', path: '/Users/username', isActive: true }
  ]);
  const [currentPath, setCurrentPath] = useState('/Users/username');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'details'>('details');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: string[] } | null>(null);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [fileOperation, setFileOperation] = useState<'copy' | 'move' | 'delete' | null>(null);
  
  const { files, loading, error, navigate, createFolder, deleteItems, copyItems, moveItems } = useFileSystem(currentPath);

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setTabs(tabs.map(t => ({ ...t, isActive: t.id === tabId })));
      setCurrentPath(tab.path);
      navigate(tab.path);
    }
  };

  const handleNewTab = (path: string = '/Users/username') => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: path.split('/').pop() || 'Root',
      path,
      isActive: true
    };
    setTabs([...tabs.map(t => ({ ...t, isActive: false })), newTab]);
    setCurrentPath(path);
    navigate(path);
  };

  const handleCloseTab = (tabId: string) => {
    if (tabs.length === 1) return;
    
    const remainingTabs = tabs.filter(t => t.id !== tabId);
    const wasActive = tabs.find(t => t.id === tabId)?.isActive;
    
    if (wasActive && remainingTabs.length > 0) {
      remainingTabs[0].isActive = true;
      setCurrentPath(remainingTabs[0].path);
      navigate(remainingTabs[0].path);
    }
    
    setTabs(remainingTabs);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    navigate(path);
    
    // Update current tab
    setTabs(tabs.map(t => t.isActive ? { ...t, path, title: path.split('/').pop() || 'Root' } : t));
  };

  const handleContextMenu = (e: React.MouseEvent, itemIds: string[]) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: itemIds
    });
  };

  const handleFileOperation = (operation: 'copy' | 'move' | 'delete', items: string[]) => {
    setFileOperation(operation);
    setSelectedItems(items);
    setShowFileDialog(true);
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Glassmorphism background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-black/20 backdrop-blur-xl"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Tab Bar */}
        <TabBar 
          tabs={tabs}
          onTabChange={handleTabChange}
          onNewTab={handleNewTab}
          onCloseTab={handleCloseTab}
        />

        {/* Search Bar */}
        <SearchBar 
          query={searchQuery}
          onQueryChange={setSearchQuery}
          currentPath={currentPath}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            currentPath={currentPath}
            onNavigate={handleNavigate}
          />

          {/* Main File Area */}
          <div className="flex-1 flex flex-col bg-white/30 dark:bg-black/20 backdrop-blur-lg border-l border-white/20 dark:border-white/10">
            {/* Breadcrumb Navigation */}
            <BreadcrumbNav 
              path={currentPath}
              onNavigate={handleNavigate}
            />

            {/* File Explorer */}
            <FileExplorer
              files={files}
              loading={loading}
              error={error}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              onNavigate={handleNavigate}
              onContextMenu={handleContextMenu}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onAction={handleFileOperation}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* File Operations Dialog */}
      {showFileDialog && fileOperation && (
        <FileOperationsDialog
          operation={fileOperation}
          items={selectedItems}
          onConfirm={() => {
            // Handle file operations
            setShowFileDialog(false);
            setFileOperation(null);
          }}
          onCancel={() => {
            setShowFileDialog(false);
            setFileOperation(null);
          }}
        />
      )}
    </div>
  );
};

export default FileManager;
