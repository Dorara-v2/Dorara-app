import { Folder } from "utils/types";
import { getDb } from "./init";



export const createNoteInDb = async (id: string, name: string, selectedFolder: Folder, driveId: string | null) => {
    const db = await getDb();
    await db.runAsync(
        `
                  INSERT INTO notes (
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
          selectedFolder.localPath + name + '.md',
          driveId,
          selectedFolder.id,
          Date.now(),
          Date.now(),
        ]
      );
      await db.closeAsync();
}

export const deleteNoteInDb = async (id: string) => {
    const db = await getDb();
    await db.runAsync(
        `DELETE FROM notes WHERE id = ?`,
        [id]
      );
}

export const insertIntoNoteSync = async (id: string, operation: string, source: string) => {
    const db = await getDb();
    await db.runAsync(
        `
          INSERT INTO note_sync (
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