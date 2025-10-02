"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("./db");
const router = (0, express_1.Router)();
const NOTE_ID = 'admin-note-singleton';
notes.get('/admin-notes', async (_req, res) => {
    const [rows] = await db_1.pool.query('SELECT content, updatedAt FROM note_text WHERE id = ?', [NOTE_ID]);
    const row = rows[0] || { content: '', updatedAt: null };
    res.json({ id: NOTE_ID, ...row });
});
notes.put('/admin-notes', async (req, res) => {
    const content = String(req.body?.content ?? '');
    await db_1.pool.query('UPDATE note_text SET content = ? WHERE id = ?', [content, NOTE_ID]);
    const [rows] = await db_1.pool.query('SELECT content, updatedAt FROM note_text WHERE id = ?', [NOTE_ID]);
    const row = rows[0] || { content: '', updatedAt: null };
    res.json({ id: NOTE_ID, ...row });
});
exports.default = notes;
//# sourceMappingURL=admin-notes.js.map