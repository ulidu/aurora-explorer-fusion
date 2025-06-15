
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Folder, 
  File, 
  Image, 
  Video, 
  Music, 
  FileText, 
  Archive,
  Plus, 
  X, 
  Grid, 
  List, 
  Columns,
  ChevronDown, 
  ChevronUp,
  Copy, 
  Scissors, 
  Trash2, 
  Edit, 
  Eye, 
  Share, 
  FolderPlus, 
  Settings, 
  Star, 
  Tag,
  AlertTriangle,
  Move,
  Search,
  Home,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

// Types
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

// Utility functions
const getFileIcon = (file: FileItem, size: number = 16) => {
  if (file.type === 'folder') return <Folder size={size} className="text-blue-500" />;
  
  const ext = file.extension?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
      return <Image size={size} className="text-green-500" />;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'mkv':
      return <Video size={size} className="text-purple-500" />;
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return <Music size={size} className="text-orange-500" />;
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText size={size} className="text-red-500" />;
    case 'zip':
    case 'rar':
    case '7z':
      return <Archive size={size} className="text-yellow-500" />;
    default:
      return <File size={size} className="text-gray-500" />;
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

// Sample data
const generateSampleFiles = (): FileItem[] => {
  return [
    {
      id: '1',
      name: 'Documents',
      type: 'folder',
      dateModified: new Date('2024-01-15'),
      dateCreated: new Date('2024-01-01'),
      path: '/Users/username/Documents'
    },
    {
      id: '2',
      name: 'Pictures',
      type: 'folder',
      dateModified: new Date('2024-01-10'),
      dateCreated: new Date('2024-01-01'),
      path: '/Users/username/Pictures'
    },
    {
      id: '3',
      name: 'report.pdf',
      type: 'file',
      size: 2048576,
      dateModified: new Date('2024-01-14'),
      dateCreated: new Date('2024-01-14'),
      path: '/Users/username/report.pdf',
      extension: 'pdf'
    },
    {
      id: '4',
      name: 'photo.jpg',
      type: 'file',
      size: 1024000,
      dateModified: new Date('2024-01-12'),
      dateCreated: new Date('2024-01-12'),
      path: '/Users/username/photo.jpg',
      extension: 'jpg'
    },
    {
      id: '5',
      name: 'music.mp3',
      type: 'file',
      size: 5242880,
      dateModified: new Date('2024-01-11'),
      dateCreated: new Date('2024-01-11'),
      path: '/Users/username/music.mp3',
      extension: 'mp3'
    }
  ];
};

// File Preview Component
const FilePreview: React.FC<{ file: FileItem }> = ({ file }) => {
  const ext = file.extension?.toLowerCase();
  
  return (
    <div className="relative w-16 h-16 mx-auto mb-2">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="absolute inset-0 flex items-center justify-center">
          {getFileIcon(file, 32)}
        </div>
      </div>
      
      {ext && (
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-900 dark:to-black text-white text-xs rounded-md px-1.5 py-0.5 font-medium uppercase shadow-md border border-white/10">
          {ext}
        </div>
      )}
      
      {ext && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext) && (
        <div className="absolute inset-1 bg-gradient-to-br from-green-100/50 to-green-200/30 dark:from-green-900/20 dark:to-green-800/10 rounded-lg" />
      )}
      {ext && ['mp4', 'avi', 'mov', 'mkv'].includes(ext) && (
        <div className="absolute inset-1 bg-gradient-to-br from-purple-100/50 to-purple-200/30 dark:from-purple-900/20 dark:to-purple-800/10 rounded-lg" />
      )}
      {ext && ['mp3', 'wav', 'flac', 'aac'].includes(ext) && (
        <div className="absolute inset-1 bg-gradient-to-br from-orange-100/50 to-orange-200/30 dark:from-orange-900/20 dark:to-orange-800/10 rounded-lg" />
      )}
      
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-400/0 to-gray-600/0 group-hover:from-gray-400/5 group-hover:to-gray-600/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

// Folder Preview Component
const FolderPreview: React.FC<{ file: FileItem; files: FileItem[] }> = ({ file, files }) => {
  const folderContents = files.filter(f => f.path.startsWith(file.path + '/') && f.path !== file.path).slice(0, 4);
  
  return (
    <div className="relative w-20 h-20 mx-auto mb-3">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-blue-100/60 to-blue-200/40 dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-800/20 rounded-2xl border border-blue-200/40 dark:border-blue-700/30 backdrop-blur-sm shadow-lg">
        
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
          <div className="absolute inset-0 flex items-center justify-center">
            <Folder 
              size={32} 
              className="text-blue-400/70 dark:text-blue-300/70" 
              strokeWidth={1.5}
            />
          </div>
        )}
        
        <div className="absolute -top-1 left-2 right-4 h-3 bg-gradient-to-r from-blue-200/60 to-blue-300/40 dark:from-blue-800/40 dark:to-blue-700/30 rounded-t-xl border-t border-l border-r border-blue-300/40 dark:border-blue-600/30" />
      </div>
      
      {folderContents.length > 0 && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-semibold shadow-lg border-2 border-white dark:border-gray-800">
          {folderContents.length > 99 ? '99+' : folderContents.length}
        </div>
      )}
      
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/0 via-transparent to-blue-600/0 group-hover:from-blue-400/20 group-hover:to-blue-600/10 transition-all duration-300 pointer-events-none" />
      <div className="absolute inset-x-1 -bottom-1 h-2 bg-blue-900/10 dark:bg-blue-400/5 rounded-b-2xl blur-sm" />
    </div>
  );
};

// Context Menu Component
const ContextMenu: React.FC<{
  x: number;
  y: number;
  items: string[];
  onAction: (action: 'copy' | 'move' | 'delete', items: string[]) => void;
  onClose: () => void;
}> = ({ x, y, items, onAction, onClose }) => {
  const menuItems = [
    { icon: <Eye size={14} />, label: 'Quick Look', action: 'quicklook' as const },
    { icon: <Edit size={14} />, label: 'Rename', action: 'rename' as const },
    { type: 'separator' },
    { icon: <Copy size={14} />, label: 'Copy', action: 'copy' as const },
    { icon: <Scissors size={14} />, label: 'Cut', action: 'cut' as const },
    { type: 'separator' },
    { icon: <Star size={14} />, label: 'Add to Favorites', action: 'favorite' as const },
    { icon: <Tag size={14} />, label: 'Tag...', action: 'tag' as const },
    { icon: <Share size={14} />, label: 'Share...', action: 'share' as const },
    { type: 'separator' },
    { icon: <FolderPlus size={14} />, label: 'New Folder', action: 'newfolder' as const },
    { icon: <FileText size={14} />, label: 'New Document', action: 'newfile' as const },
    { type: 'separator' },
    { icon: <Trash2 size={14} />, label: 'Move to Trash', action: 'delete' as const, danger: true },
    { icon: <Settings size={14} />, label: 'Get Info', action: 'info' as const }
  ];

  const handleAction = (action: string) => {
    switch (action) {
      case 'copy':
        onAction('copy', items);
        break;
      case 'cut':
        onAction('move', items);
        break;
      case 'delete':
        onAction('delete', items);
        break;
      default:
        console.log(`Action: ${action}`, items);
    }
    onClose();
  };

  return (
    <div
      className="fixed z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 dark:border-white/10 py-2 min-w-[200px]"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={index} className="h-px bg-white/20 dark:bg-white/10 my-1 mx-2" />;
        }

        return (
          <button
            key={index}
            onClick={() => handleAction(item.action)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/30 dark:hover:bg-white/10 ${
              item.danger 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// Main All-in-One File Manager Component
const AllInOneFileManager = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Home', path: '/Users/username', isActive: true }
  ]);
  const [currentPath, setCurrentPath] = useState('/Users/username');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'details'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: string[] } | null>(null);
  const [files] = useState<FileItem[]>(generateSampleFiles());

  const filteredAndSortedFiles = useMemo(() => {
    let filtered = files;
    
    if (searchQuery) {
      filtered = files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
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
    
    return sorted.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return 0;
    });
  }, [files, searchQuery, sortBy, sortOrder]);

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setTabs(tabs.map(t => ({ ...t, isActive: t.id === tabId })));
      setCurrentPath(tab.path);
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
  };

  const handleCloseTab = (tabId: string) => {
    if (tabs.length === 1) return;
    
    const remainingTabs = tabs.filter(t => t.id !== tabId);
    const wasActive = tabs.find(t => t.id === tabId)?.isActive;
    
    if (wasActive && remainingTabs.length > 0) {
      remainingTabs[0].isActive = true;
      setCurrentPath(remainingTabs[0].path);
    }
    
    setTabs(remainingTabs);
  };

  const handleItemClick = (file: FileItem, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const newSelection = selectedItems.includes(file.id)
        ? selectedItems.filter(id => id !== file.id)
        : [...selectedItems, file.id];
      setSelectedItems(newSelection);
    } else if (e.shiftKey && selectedItems.length > 0) {
      const lastSelected = selectedItems[selectedItems.length - 1];
      const lastIndex = filteredAndSortedFiles.findIndex(f => f.id === lastSelected);
      const currentIndex = filteredAndSortedFiles.findIndex(f => f.id === file.id);
      
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      const rangeSelection = filteredAndSortedFiles.slice(start, end + 1).map(f => f.id);
      
      setSelectedItems(rangeSelection);
    } else {
      setSelectedItems([file.id]);
    }
  };

  const handleItemDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath(file.path);
      setTabs(tabs.map(t => t.isActive ? { ...t, path: file.path, title: file.name } : t));
    }
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
    console.log(`${operation} operation on items:`, items);
    setContextMenu(null);
  };

  const pathSegments = currentPath.split('/').filter(Boolean);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-black/20 backdrop-blur-xl"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Tab Bar */}
        <div className="flex items-center bg-white/30 dark:bg-black/20 backdrop-blur-lg border-b border-white/20 dark:border-white/10 px-2 py-1">
          <div className="flex items-center gap-1 flex-1 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-t-lg min-w-[120px] max-w-[200px] group transition-all duration-200",
                  tab.isActive
                    ? "bg-white/50 dark:bg-black/30 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/10"
                )}
              >
                <button
                  onClick={() => handleTabChange(tab.id)}
                  className="flex-1 text-left text-sm font-medium truncate"
                >
                  {tab.title}
                </button>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseTab(tab.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-600 p-1 rounded transition-all duration-200"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={() => handleNewTab()}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-200 text-gray-600 dark:text-gray-400"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-b border-white/20 dark:border-white/10">
          <div className="flex items-center gap-3 bg-white/30 dark:bg-black/30 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white/20 dark:bg-black/20 backdrop-blur-lg border-r border-white/20 dark:border-white/10 p-4">
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 text-gray-900 dark:text-white">
                <Home size={16} />
                <span>Home</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 text-gray-900 dark:text-white">
                <Folder size={16} />
                <span>Documents</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 text-gray-900 dark:text-white">
                <Image size={16} />
                <span>Pictures</span>
              </button>
            </div>
          </div>

          {/* File Explorer */}
          <div className="flex-1 flex flex-col bg-white/30 dark:bg-black/20 backdrop-blur-lg">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/10 dark:bg-black/10 backdrop-blur-sm border-b border-white/20 dark:border-white/10">
              <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Home size={14} />
              </button>
              {pathSegments.map((segment, index) => (
                <React.Fragment key={index}>
                  <ChevronRight size={12} className="text-gray-400" />
                  <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    {segment}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/10 dark:bg-black/10 backdrop-blur-sm border-b border-white/20 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredAndSortedFiles.length} items
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode('list')}
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
                  onClick={() => setViewMode('grid')}
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
                  onClick={() => setViewMode('details')}
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
              {viewMode === 'grid' && (
                <div className="p-6 grid grid-cols-auto-fill gap-6">
                  {filteredAndSortedFiles.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        "group transition-all duration-300 rounded-2xl p-4 text-center cursor-pointer hover:scale-[1.02]",
                        "min-w-[140px] max-w-[160px]",
                        selectedItems.includes(file.id)
                          ? "bg-blue-50/80 dark:bg-blue-950/30 ring-2 ring-blue-400/60 shadow-xl backdrop-blur-sm"
                          : "hover:bg-white/60 dark:hover:bg-white/5 hover:shadow-lg hover:backdrop-blur-sm"
                      )}
                      onClick={(e) => handleItemClick(file, e)}
                      onDoubleClick={() => handleItemDoubleClick(file)}
                      onContextMenu={(e) => handleContextMenu(e, [file.id])}
                    >
                      {file.type === 'folder' ? (
                        <FolderPreview file={file} files={files} />
                      ) : (
                        <FilePreview file={file} />
                      )}
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-full mt-3 px-1">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {file.size ? formatFileSize(file.size) : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'list' && (
                <div className="p-4 space-y-1">
                  {filteredAndSortedFiles.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        "group transition-all duration-200 rounded-lg flex items-center gap-3 px-3 py-2",
                        selectedItems.includes(file.id)
                          ? "bg-blue-500/20 ring-2 ring-blue-500/50"
                          : "hover:bg-white/30 dark:hover:bg-white/10"
                      )}
                      onClick={(e) => handleItemClick(file, e)}
                      onDoubleClick={() => handleItemDoubleClick(file)}
                      onContextMenu={(e) => handleContextMenu(e, [file.id])}
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
              )}

              {viewMode === 'details' && (
                <div className="flex-1">
                  <div className="sticky top-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm border-b border-white/20 dark:border-white/10">
                    <div className="grid grid-cols-[1fr,100px,150px,100px] gap-4 px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                      <div>Name</div>
                      <div>Size</div>
                      <div>Date Modified</div>
                      <div>Type</div>
                    </div>
                  </div>
                  <div className="space-y-0">
                    {filteredAndSortedFiles.map((file) => (
                      <div
                        key={file.id}
                        className={cn(
                          "group transition-all duration-200 rounded-lg grid grid-cols-[1fr,100px,150px,100px] gap-4 px-4 py-2 text-sm",
                          selectedItems.includes(file.id)
                            ? "bg-blue-500/20 ring-2 ring-blue-500/50"
                            : "hover:bg-white/30 dark:hover:bg-white/10"
                        )}
                        onClick={(e) => handleItemClick(file, e)}
                        onDoubleClick={() => handleItemDoubleClick(file)}
                        onContextMenu={(e) => handleContextMenu(e, [file.id])}
                      >
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
                      </div>
                    ))}
                  </div>
                </div>
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
    </div>
  );
};

export default AllInOneFileManager;
