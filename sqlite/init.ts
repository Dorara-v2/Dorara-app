import * as SQLite from 'expo-sqlite';


export const initDB = async () => {
    const db = await SQLite.openDatabaseAsync('Dorara.db')
    console.log(db)
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            date INTEGER,
            isCompleted INTEGER DEFAULT 0,
            categoryId TEXT,
            updatedAt INTEGER
        );
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            color TEXT,
            icon TEXT 
        );
        `);
}