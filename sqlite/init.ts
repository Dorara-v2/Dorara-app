import * as SQLite from 'expo-sqlite';


export const initDB = async () => {
    const db = await SQLite.openDatabaseAsync('Dorara.db')
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            date INTEGER,
            notificationId TEXT,
            isCompleted INTEGER DEFAULT 0,
            categoryId TEXT,
            time INTEGER,
            updatedAt INTEGER
        );
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            color TEXT,
            icon TEXT 
        );
        CREATE TABLE IF NOT EXISTS folders (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            localPath TEXT,
            driveId TEXT,
            parentId TEXT,
            createdAt INTEGER,
            updatedAt INTEGER
        );
        CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            localPath TEXT,
            driveId TEXT,
            parentId TEXT,
            createdAt INTEGER,
            updatedAt INTEGER
        );
        CREATE TABLE IF NOT EXISTS note_sync (
            id TEXT,
            operation TEXT,
            updatedAt INTEGER,
            source TEXT
        );
        CREATE TABLE IF NOT EXISTS folder_sync (
            id TEXT,
            operation TEXT,
            updatedAt INTEGER,
            source TEXT
        );
        CREATE TABLE IF NOT EXISTS category_sync (
            id TEXT,
            operation TEXT,
            updatedAt INTEGER,
            source TEXT
        );
        CREATE TABLE IF NOT EXISTS todo_sync (
            id TEXT,
            operation TEXT,
            updatedAt INTEGER,
            source TEXT
        );
        `);
}