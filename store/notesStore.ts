import { Folder, Note } from "utils/types";
import { create } from "zustand";



interface NotesStore {
    notes: Note[]
    setNotes: (notes: Note[]) => void
    addNote: (note: Note) => void
    removeNote: (noteId: string) => void
    updateNote: (noteId: string, updatedNote: Partial<Note>) => void
    folders: Folder[]
    setFolders: (folders: Folder[]) => void
    addFolder: (folder: Folder) => void
    removeFolder: (folderId: string) => void
    updateFolder: (folderId: string, updatedFolder: Partial<Folder>) => void
}

export const useNotesStore = create<NotesStore>((set) => ({
    notes: [],
    setNotes: (notes) => set({ notes }),
    addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
    removeNote: (noteId) => set((state) => ({ notes: state.notes.filter((note) => note.id !== noteId) })),
    updateNote: (noteId, updatedNote) =>
        set((state) => ({
            notes: state.notes.map((note) => (note.id === noteId ? { ...note, ...updatedNote } : note)),
        })),
    folders: [],
    setFolders: (folders) => set({ folders }),
    addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
    removeFolder: (folderId) =>
        set((state) => ({ folders: state.folders.filter((folder) => folder.id !== folderId) })),
    updateFolder: (folderId, updatedFolder) =>
        set((state) => ({
            folders: state.folders.map((folder) =>
                folder.id === folderId ? { ...folder, ...updatedFolder } : folder
            ),
        }))
}))