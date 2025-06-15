
import { useState, useEffect } from 'react';
import { FileItem } from '../components/FileManager';

// Mock file system data
const generateMockFiles = (path: string): FileItem[] => {
  const baseFiles: FileItem[] = [
    {
      id: '1',
      name: 'Documents',
      type: 'folder',
      dateModified: new Date(2024, 0, 15),
      dateCreated: new Date(2024, 0, 1),
      path: `${path}/Documents`,
    },
    {
      id: '2',
      name: 'Pictures',
      type: 'folder',
      dateModified: new Date(2024, 1, 20),
      dateCreated: new Date(2024, 0, 5),
      path: `${path}/Pictures`,
    },
    {
      id: '3',
      name: 'Downloads',
      type: 'folder',
      dateModified: new Date(2024, 2, 10),
      dateCreated: new Date(2024, 0, 10),
      path: `${path}/Downloads`,
    },
    {
      id: '4',
      name: 'Project Proposal.pdf',
      type: 'file',
      size: 2540000,
      dateModified: new Date(2024, 2, 5),
      dateCreated: new Date(2024, 2, 5),
      path: `${path}/Project Proposal.pdf`,
      extension: 'pdf',
    },
    {
      id: '5',
      name: 'Meeting Notes.docx',
      type: 'file',
      size: 156000,
      dateModified: new Date(2024, 2, 8),
      dateCreated: new Date(2024, 2, 8),
      path: `${path}/Meeting Notes.docx`,
      extension: 'docx',
    },
    {
      id: '6',
      name: 'Presentation.pptx',
      type: 'file',
      size: 8920000,
      dateModified: new Date(2024, 2, 12),
      dateCreated: new Date(2024, 2, 12),
      path: `${path}/Presentation.pptx`,
      extension: 'pptx',
    },
    {
      id: '7',
      name: 'Screenshot 2024-03-15.png',
      type: 'file',
      size: 450000,
      dateModified: new Date(2024, 2, 15),
      dateCreated: new Date(2024, 2, 15),
      path: `${path}/Screenshot 2024-03-15.png`,
      extension: 'png',
    },
    {
      id: '8',
      name: 'Video Call.mp4',
      type: 'file',
      size: 125000000,
      dateModified: new Date(2024, 2, 18),
      dateCreated: new Date(2024, 2, 18),
      path: `${path}/Video Call.mp4`,
      extension: 'mp4',
    },
    {
      id: '9',
      name: 'Music Collection',
      type: 'folder',
      dateModified: new Date(2024, 1, 28),
      dateCreated: new Date(2024, 0, 15),
      path: `${path}/Music Collection`,
    },
    {
      id: '10',
      name: 'Archive.zip',
      type: 'file',
      size: 15600000,
      dateModified: new Date(2024, 2, 20),
      dateCreated: new Date(2024, 2, 20),
      path: `${path}/Archive.zip`,
      extension: 'zip',
    }
  ];

  return baseFiles;
};

export const useFileSystem = (initialPath: string) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState(initialPath);

  const navigate = async (path: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockFiles = generateMockFiles(path);
      setFiles(mockFiles);
      setCurrentPath(path);
    } catch (err) {
      setError('Failed to load directory contents');
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (name: string) => {
    try {
      const newFolder: FileItem = {
        id: Date.now().toString(),
        name,
        type: 'folder',
        dateModified: new Date(),
        dateCreated: new Date(),
        path: `${currentPath}/${name}`,
      };
      
      setFiles(prev => [...prev, newFolder]);
      return true;
    } catch (err) {
      setError('Failed to create folder');
      return false;
    }
  };

  const deleteItems = async (itemIds: string[]) => {
    try {
      setFiles(prev => prev.filter(file => !itemIds.includes(file.id)));
      return true;
    } catch (err) {
      setError('Failed to delete items');
      return false;
    }
  };

  const copyItems = async (itemIds: string[], destinationPath: string) => {
    try {
      // Simulate copy operation
      console.log('Copying items:', itemIds, 'to:', destinationPath);
      return true;
    } catch (err) {
      setError('Failed to copy items');
      return false;
    }
  };

  const moveItems = async (itemIds: string[], destinationPath: string) => {
    try {
      // Simulate move operation
      console.log('Moving items:', itemIds, 'to:', destinationPath);
      return true;
    } catch (err) {
      setError('Failed to move items');
      return false;
    }
  };

  useEffect(() => {
    navigate(initialPath);
  }, []);

  return {
    files,
    loading,
    error,
    currentPath,
    navigate,
    createFolder,
    deleteItems,
    copyItems,
    moveItems
  };
};
