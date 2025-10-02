import { Body, Controller, Get, Put } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('admin/notes')
export class NotesController {
  constructor(private readonly svc: NotesService) {}

  @Get()
  async get() {
    return this.svc.getNote();
  }

  @Put()
  async put(@Body() body: { content: string }) {
    return this.svc.saveNote(body?.content ?? '');
  }
}