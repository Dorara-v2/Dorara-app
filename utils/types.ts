

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