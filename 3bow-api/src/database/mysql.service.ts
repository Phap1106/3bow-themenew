// src/database/mysql.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MysqlService implements OnModuleInit, OnModuleDestroy {
  pool!: mysql.Pool;

  async onModuleInit() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      timezone: '+07:00',
      charset: 'utf8mb4_unicode_ci',
    });

    // test connection
    const conn = await this.pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('[MySQL] Connected');
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  /**
   * SELECT helper
   * Trả về mảng record đã ép kiểu T (không trả về field packets để khỏi vướng generic)
   */
  async select<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(sql, params);
    return rows as unknown as T[];
  }

  /**
   * SELECT one helper
   */
  async first<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(sql, params);
    const r = rows as unknown as T[];
    return r.length ? r[0] : null;
  }

  /**
   * INSERT/UPDATE/DELETE helper
   * Trả về ResultSetHeader (có affectedRows, insertId, ...)
   */
  async run(sql: string, params?: any[]): Promise<mysql.ResultSetHeader> {
    const [res] = await this.pool.execute<mysql.ResultSetHeader>(sql, params);
    return res;
  }
}
