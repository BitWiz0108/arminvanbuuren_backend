import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminPlaylistService } from './admin.playlist.service';
import { AdminGuard } from '@admin/admin.guard';
import { Playlist } from '@models/playlist.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AddMusicToPlaylistInputArg } from './dto/playlist.dto';

@ApiBearerAuth()
@ApiTags('Admin Playlist')
@UseGuards(AdminGuard)
@Controller(`${process.env.API_VERSION}/admin/playlist`)
export class AdminPlaylistController {
  constructor(private readonly playlistService: AdminPlaylistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('searchKey') searchKey: string
  ) {
    return this.playlistService.findAll({ searchKey });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPlaylist(@Body() data: Partial<Playlist>) {
    const result = await this.playlistService.add(data);
    return result;
  }

  @Post('item')
  @HttpCode(HttpStatus.ACCEPTED)
  async addMusicsToPlaylist(@Body() data: AddMusicToPlaylistInputArg) {
    const result = await this.playlistService.addMusicsToPlaylist(data);
    return result;
  }

  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  async deletePlaylist(@Query('id') id: number) {
    await this.playlistService.remove(id);
  }

  @Delete('item')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteMusic(@Query('id') id: number, @Query('musicId') musicId: number) {
    return await this.playlistService.removeMusic(id, musicId);
  }
}
