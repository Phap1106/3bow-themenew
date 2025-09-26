import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
export declare class MysqlService implements OnModuleInit, OnModuleDestroy {
    pool: mysql.Pool;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    select<T = any>(sql: string, params?: any[]): Promise<T[]>;
    first<T = any>(sql: string, params?: any[]): Promise<T | null>;
    run(sql: string, params?: any[]): Promise<mysql.ResultSetHeader>;
}
