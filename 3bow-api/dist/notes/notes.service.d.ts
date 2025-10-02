import { Pool } from 'mysql2/promise';
export declare class NotesService {
    private readonly db;
    constructor(db: Pool);
    getNote(): Promise<any>;
    saveNote(content: string): Promise<any>;
}
