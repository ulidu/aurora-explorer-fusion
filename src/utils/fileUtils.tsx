import React from 'react';
import { File, Folder, Image, Video, Music, FileText, Archive } from 'lucide-react';
import { FileItem } from '../components/FileManager';

export const getFileIcon = (file: FileItem, size: number = 16) => {
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

export const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
