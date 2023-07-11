import { Controller, Param, Body, Get, Post, Query, HttpCode, HttpStatus, Req, Delete, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@common-modules/auth/role.enum';
import { Roles } from '@common-modules/auth/roles.decorator';
import { LiveStreamService } from './live-stream.service';
import { LiveStreamCommentOption, LiveStreamOption, LiveStreamOptionForCategory, LivestreamByTitle } from './dto/live-stream-option';
import { FavoriteLiveStreamDto } from './dto/favorite.dto';
import { LiveStreamComment } from '@common/database/models/live-stream-comment.entity';

@ApiBearerAuth()
@ApiTags('Live Stream')
@Controller(`${process.env.API_VERSION}/live-stream`)
export class LiveStreamController {
  constructor(private readonly livestreamService: LiveStreamService) {}

  @Roles()
  @Post('list')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Body() data: LiveStreamOption,
    @Req() req
  ) {
    return this.livestreamService.findAll(data, req);
  }

  @Roles()
  @Post('get-by-title')
  @HttpCode(HttpStatus.OK)
  async findOneByTitle(
    @Body() data: LivestreamByTitle
  ) {
    return this.livestreamService.findOneByTitle(data);
  }

  @Roles()
  @Post('favorite')
  @HttpCode(HttpStatus.OK)
  async likeIt(@Body() data: FavoriteLiveStreamDto ) {
    return this.livestreamService.favorite(data);
  }

  @Roles()
  @Post('comments')
  @HttpCode(HttpStatus.OK)
  async getComments(@Body() data: LiveStreamCommentOption) {
    return this.livestreamService.getComments(data);
  }

  @Roles()
  @Post('comment')
  @HttpCode(HttpStatus.CREATED)
  async addComment(@Body() data: Partial<LiveStreamComment>) {
    return this.livestreamService.addComment(data);
  }

  @Roles()
  @Post('category/list')
  @HttpCode(HttpStatus.OK)
  async findAllLiveStreamsWithCategories(@Body() data: LiveStreamOption) {
    return this.livestreamService.findAllLiveStreamsWithCategories(data);
  }

  @Roles()
  @Post('category/live-stream/list')
  @HttpCode(HttpStatus.OK)
  async findAllLivestreamsForCategory(@Body() data: LiveStreamOptionForCategory) {
    return this.livestreamService.findAllLivestreamsForCategory(data);
  }

  @Roles()
  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteComment(@Query('id') commentId: number, @Query('userId') userId: number) {
    await this.livestreamService.removeComment(commentId, userId);
  }

  @Roles()
  @Put('comment')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateComment(@Body() data: Partial<LiveStreamComment>) {
    return this.livestreamService.updateComment(data);
  }
}
