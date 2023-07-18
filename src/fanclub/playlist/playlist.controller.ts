import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlaylistService } from './playlist.service';
import { Playlist } from '@models/playlist.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AddMusicToPlaylistInputArg } from './dto/playlist.dto';

@ApiBearerAuth()
@ApiTags('Playlist')
@Controller(`${process.env.API_VERSION}/playlist`)
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('userId') userId: number
  ) {
    return this.playlistService.findAll({ userId });
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
  async deletePlaylist(@Query('id') id: number, @Query('userId') userId: number) {
    await this.playlistService.remove(id, userId);
  }

  @Delete('item')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteMusic(@Query('id') id: number, @Query('musicId') musicId: number, @Query('userId') userId: number) {
    return await this.playlistService.removeMusic({ id, musicId, userId });
  }
}
