import { Controller, Param, Body, Get, Post, UseGuards, Put, Delete, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrayerRequestService } from './prayer-request.service';
import { PrayerDto, PrayerReplyOptionDto, PrayerRequestPayloadDto } from './dto/prayer-request-option.dto';
import { PrayerRequest } from '@common/database/models/prayer-request.entity';
import { Roles } from '@common/modules/auth/roles.decorator';
import { PrayerReply } from '@common/database/models/prayer-reply.entity';

@ApiBearerAuth()
@ApiTags('Prayer Request')
@Controller(`${process.env.API_VERSION}/prayer-request`)
export class PrayerRequestController {
  constructor(private readonly prayerService: PrayerRequestService) {}

  @Roles()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: number, @Query('limit') limit: number, @Query('userId') userId: number
  ) {
    return this.prayerService.findAll({ page, limit, userId });
  }

  @Roles()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add(
    @Body() data: PrayerRequestPayloadDto,
  ) {
    return this.prayerService.add(data);
  }

  @Roles()
  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Body() data: Partial<PrayerRequest>,
  ) {
    const pr = await this.prayerService.update(data);
    return pr;
  }

  @Roles()
  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteItem(@Query('id') id: number, @Query('authorId') authorId: number) {
    await this.prayerService.remove(id, authorId);
  }

  @Roles()
  @Get('post')
  @HttpCode(HttpStatus.OK)
  async fetchPrayerRequestById(
    @Query('id') id: number,
  ) {
    return this.prayerService.fetchPrayerRequestById(id);
  }

  @Roles()
  @Post('replies')
  @HttpCode(HttpStatus.OK)
  async findAllReplies(@Body() data: PrayerReplyOptionDto) {
    return this.prayerService.findAllReplies(data);
  }

  @Roles()
  @Post('pray')
  @HttpCode(HttpStatus.OK)
  async prayIt(@Body() data: PrayerDto) {
    return this.prayerService.prayIt(data);
  }

  @Roles()
  @Post('reply')
  @HttpCode(HttpStatus.CREATED)
  async addReply(@Body() data: Partial<PrayerReply>) {
    return this.prayerService.addReply(data);
  }
}
