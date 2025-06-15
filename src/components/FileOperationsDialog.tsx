
import React from 'react';
import { AlertTriangle, Copy, Move, Trash2 } from 'lucide-react';

interface FileOperationsDialogProps {
  operation: 'copy' | 'move' | 'delete';
  items: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const FileOperationsDialog: React.FC<FileOperationsDialogProps> = ({
  operation,
  items,
  onConfirm,
  onCancel
}) => {
  const getOperationInfo = () => {
    switch (operation) {
      case 'copy':
        return {
          icon: <Copy size={24} className="text-blue-500" />,
          title: 'Copy Files',
          message: `Are you sure you want to copy ${items.length} item${items.length > 1 ? 's' : ''}?`,
          confirmText: 'Copy',
          confirmClass: 'bg-blue-500 hover:bg-blue-600'
        };
      case 'move':
        return {
          icon: <Move size={24} className="text-orange-500" />,
          title: 'Move Files',
          message: `Are you sure you want to move ${items.length} item${items.length > 1 ? 's' : ''}?`,
          confirmText: 'Move',
          confirmClass: 'bg-orange-500 hover:bg-orange-600'
        };
      case 'delete':
        return {
          icon: <Trash2 size={24} className="text-red-500" />,
          title: 'Delete Files',
          message: `Are you sure you want to delete ${items.length} item${items.length > 1 ? 's' : ''}? This action cannot be undone.`,
          confirmText: 'Delete',
          confirmClass: 'bg-red-500 hover:bg-red-600'
        };
    }
  };

  const operationInfo = getOperationInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-4 mb-4">
          {operationInfo.icon}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {operationInfo.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {operationInfo.message}
            </p>
          </div>
        </div>

        {operation === 'delete' && (
          <div className="flex items-center gap-2 p-3 bg-red-50/50 dark:bg-red-900/20 rounded-lg mb-4">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">
              Items will be moved to Trash and can be restored later.
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70 rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 ${operationInfo.confirmClass}`}
          >
            {operationInfo.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
