import { Controller, Param, Body, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@common-modules/auth/role.enum';
import { Roles } from '@common-modules/auth/roles.decorator';
import { MusicService } from './music.service';
import { MusicOption, MusicOptionForAlbum } from './dto/music-option';
import { FavoriteMusicDto } from './dto/favorite.dto';

@ApiBearerAuth()
@ApiTags('Live Stream')
@Controller(`${process.env.API_VERSION}/music`)
export class MusicController {
    constructor(private readonly musicService: MusicService) {}

    @Roles()
    @Post('list')
    @HttpCode(HttpStatus.OK)
    async findAllMusics(@Body() data: MusicOption) {
      return this.musicService.findAllMusics(data);
    }

    @Roles()
    @Post('album/list')
    @HttpCode(HttpStatus.OK)
    async findAllMusicsWithAlbums(@Body() data: MusicOption) {
      return this.musicService.findAllMusicsWithAlbums(data);
    }

    @Roles()
    @Post('album/music/list')
    @HttpCode(HttpStatus.OK)
    async findAllMusicsForAlbum(@Body() data: MusicOptionForAlbum) {
      return this.musicService.findAllMusicsForAlbum(data);
    }

    // @Roles(Role.Fan)
    @Post('favorite')
    @HttpCode(HttpStatus.OK)
    async likeIt(@Body() data: FavoriteMusicDto) {
      return this.musicService.favorite(data);
    }
}
