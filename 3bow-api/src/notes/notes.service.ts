import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'mysql2/promise';

const NOTE_ID = 'admin-note-singleton';

@Injectable()
export class NotesService {
  constructor(@Inject('DB_POOL') private readonly db: Pool) {}

  async getNote() {
    const [rows] = await this.db.query('SELECT content, updatedAt FROM note_text WHERE id = ?', [NOTE_ID]);
    const row: any = (rows as any[])[0] || { content: '', updatedAt: null };
    return { id: NOTE_ID, ...row };
  }

  async saveNote(content: string) {
    await this.db.query('UPDATE note_text SET content = ? WHERE id = ?', [content ?? '', NOTE_ID]);
    const [rows] = await this.db.query('SELECT content, updatedAt FROM note_text WHERE id = ?', [NOTE_ID]);
    const row: any = (rows as any[])[0] || { content: '', updatedAt: null };
    return { id: NOTE_ID, ...row };
  }
}