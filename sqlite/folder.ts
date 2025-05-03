import { Folder } from "utils/types";
import { getDb } from "./init";


export const createFolderInDb = async (id: string, name: string, selectedFolder: Folder, folderId: string | null) => {
    const db = await getDb();
    await db.runAsync(
        `
                  INSERT INTO folders (
                      id, 
                      name, 
                      localPath, 
                      driveId, 
                      parentId, 
                      createdAt, 
                      updatedAt
                  ) VALUES (?, ?, ?, ?, ?, ?, ?)
              `,
        [
          id,
          name,
          selectedFolder.localPath + name + '/',
          folderId,
          selectedFolder.id,
          Date.now(),
          Date.now(),
        ]
      );
      await db.closeAsync();
}

export const deleteFolderInDb = async (id: string) => {
    const db = await getDb();
    await db.runAsync(
        `DELETE FROM folders WHERE id = ?`,
        [id]
      );
}

export const insertIntoFolderSync = async (id: string, operation: string, source: string) => {
    const db = await getDb();
    await db.runAsync(
        `
          INSERT INTO folder_sync (
              id, 
              operation, 
              updatedAt, 
              source
          ) VALUES (?, ?, ?, ?)
      `,
      [
        id,
        operation,
        Date.now(),
        source,
      ]
    );
    await db.closeAsync();
}

