import { MaterialIcons } from '@expo/vector-icons';

export interface Todo {
  id: string;
  name: string;
  date?: number;
  time?: number;
  notificationId?: string;
  isCompleted: number;
  categoryId?: string;
  updatedAt: number;
}

export interface Category {
  id?: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface Note {
  id: string;
  name: string;
  localPath: string;
  driveId?: string;
  parentId?: string;
  type: 'note';
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  localPath: string;
  driveId?: string;
  parentId?: string;
  type: 'folder';
  createdAt: number;
  updatedAt: number;
}

export type MaterialIconName = keyof typeof MaterialIcons.glyphMap;
