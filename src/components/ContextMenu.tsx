
import React from 'react';
import { Copy, Scissors, Trash2, Edit, Eye, Share, FolderPlus, FileText, Settings, Star, Tag } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  items: string[];
  onAction: (action: 'copy' | 'move' | 'delete', items: string[]) => void;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onAction, onClose }) => {
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
