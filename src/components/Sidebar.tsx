
import React from 'react';
import { Home, HardDrive, Cloud, Star, Trash2, FolderOpen, Wifi, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  type: 'location' | 'favorite' | 'device';
  isExpanded?: boolean;
  children?: SidebarItem[];
}

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const sidebarItems: SidebarItem[] = [
    {
      id: 'home',
      name: 'Home',
      icon: <Home size={16} />,
      path: '/Users/username',
      type: 'location'
    },
    {
      id: 'desktop',
      name: 'Desktop',
      icon: <FolderOpen size={16} />,
      path: '/Users/username/Desktop',
      type: 'location'
    },
    {
      id: 'documents',
      name: 'Documents',
      icon: <FolderOpen size={16} />,
      path: '/Users/username/Documents',
      type: 'location'
    },
    {
      id: 'downloads',
      name: 'Downloads',
      icon: <FolderOpen size={16} />,
      path: '/Users/username/Downloads',
      type: 'location'
    },
    {
      id: 'icloud',
      name: 'iCloud Drive',
      icon: <Cloud size={16} />,
      path: '/Users/username/Library/Mobile Documents/com~apple~CloudDocs',
      type: 'device'
    },
    {
      id: 'applications',
      name: 'Applications',
      icon: <FolderOpen size={16} />,
      path: '/Applications',
      type: 'location'
    }
  ];

  const favorites = [
    { id: 'fav1', name: 'Projects', path: '/Users/username/Projects' },
    { id: 'fav2', name: 'Photos', path: '/Users/username/Pictures' },
  ];

  const devices = [
    { id: 'dev1', name: 'Macintosh HD', path: '/', icon: <HardDrive size={16} /> },
    { id: 'dev2', name: 'External Drive', path: '/Volumes/External', icon: <HardDrive size={16} /> },
  ];

  return (
    <div className="w-64 bg-white/40 dark:bg-black/30 backdrop-blur-lg border-r border-white/20 dark:border-white/10 flex flex-col">
      {/* Quick Access */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Access</h3>
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                currentPath === item.path
                  ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Favorites */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Favorites</h3>
          <Star size={14} className="text-gray-400" />
        </div>
        <div className="space-y-1">
          {favorites.map((fav) => (
            <button
              key={fav.id}
              onClick={() => onNavigate(fav.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                currentPath === fav.path
                  ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10"
              )}
            >
              <Star size={16} className="text-yellow-500" />
              <span>{fav.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Devices */}
      <div className="px-4 pb-4 flex-1">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">This Mac</h3>
        <div className="space-y-1">
          {devices.map((device) => (
            <button
              key={device.id}
              onClick={() => onNavigate(device.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                currentPath === device.path
                  ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10"
              )}
            >
              {device.icon}
              <span>{device.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Network */}
      <div className="px-4 pb-4 border-t border-white/20 dark:border-white/10 pt-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Network</h3>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-200">
          <Wifi size={16} />
          <span>Network Locations</span>
        </button>
      </div>
    </div>
  );
};
