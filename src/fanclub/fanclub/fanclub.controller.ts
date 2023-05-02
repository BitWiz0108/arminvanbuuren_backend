import { Controller, Param, Body, Get, Post, HttpCode, HttpStatus, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@common-modules/auth/role.enum';
import { Roles } from '@common-modules/auth/roles.decorator';
import { FanclubService } from './fanclub.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FavoritePostDto, PostOptionDto, ReplyOptionDto } from './dto/fanclub.dto';
import { Reply } from '@models/reply.entity';

@ApiBearerAuth()
@ApiTags('Fanclub')
@Controller(`${process.env.API_VERSION}/fanclub`)
export class FanclubController {
    constructor(private readonly fanclubService: FanclubService) {}

    @Roles()
    @Post('artist')
    @HttpCode(HttpStatus.OK)
    async artistInfo() {
      return this.fanclubService.getArtistInfo();
    }

    @Roles()
    @Get('post')
    @HttpCode(HttpStatus.OK)
    async getPostDetailed(
      @Query('id') id: number,
      @Query('userId') userId: number
    ) {
      return this.fanclubService.getPostDetailed({ id, userId });
    }

    @Roles()
    @Post('posts')
    @HttpCode(HttpStatus.OK)
    async findAllPosts(
      @Body() data: PostOptionDto,
    ) {
      return this.fanclubService.findAllPosts(data);
    }

    @Roles()
    @Post('reply')
    @HttpCode(HttpStatus.CREATED)
    async addReply(@Body() data: Partial<Reply>) {
      return this.fanclubService.addReply(data);
    }

    @Roles()
    @Post('replies')
    @HttpCode(HttpStatus.OK)
    async findAllReplies(@Body() data: ReplyOptionDto) {
      return this.fanclubService.findAllReplies(data);
    }

    @Roles()
    @Post('favorite')
    @HttpCode(HttpStatus.OK)
    async likeIt(@Body() data: FavoritePostDto) {
      return this.fanclubService.favorite(data);
    }
}
