import { NotesService } from './notes.service';
export declare class NotesController {
    private readonly svc;
    constructor(svc: NotesService);
    get(): Promise<any>;
    put(body: {
        content: string;
    }): Promise<any>;
}
