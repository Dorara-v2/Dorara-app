import { MaterialIcons } from "@expo/vector-icons";


export interface Todo {
    id: string;
    name: string;
    date?: number;
    time?: number;
    isCompleted: number;
    categoryId?: string;
    updatedAt: number;
}


export interface Category {
    id?: string;
    name?: string;
    color?: string;
    icon?: string;
}

export type MaterialIconName = keyof typeof MaterialIcons.glyphMap