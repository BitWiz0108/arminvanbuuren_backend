import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.entity';
import { Identifier } from 'sequelize/types/model';
import { AdminPrayerRequestsPaginatedDto, PrayerRequestDto } from './dto/prayer-request.dto';
import { PrayerRequestApprovePayloadDto, PrayerRequestListOption } from './dto/prayer-request-option.dto';
import { PrayerRequest } from '@common/database/models/prayer-request.entity';
import { PrayerReply } from '@common/database/models/prayer-reply.entity';
import { MESSAGE } from '@common/constants';
import { Prayer } from '@common/database/models/prayer.entity';

@Injectable()
export class AdminPrayerRequestService {
  constructor(
    @InjectModel(PrayerRequest)
    private readonly prayerRequestModel: typeof PrayerRequest,

    @InjectModel(PrayerReply)
    private readonly replyModel: typeof PrayerReply,

  ) {}

  async add(data: Partial<PrayerRequest>) : Promise<PrayerRequest> {
    const newPR = await this.prayerRequestModel.create({
      authorId: data.authorId,
      title: data.title,
      isAnonymous: data.isAnonymous,
      content: data.content,
    });
    
    const newItem = await this.prayerRequestModel.findByPk(newPR.id, {
      include: [
        { model: User, as: "author" }
      ]
    });

    return newItem;
  }

  async update(
    data: Partial<PrayerRequest>,
  ): Promise<PrayerRequestDto> {
    const item = await this.prayerRequestModel.findByPk(data.id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    await item.update(data);
    const updatedItem = await this.prayerRequestModel.findByPk(data.id, {
      include: [
        { model: User, as: 'author' },
      ]
    });

    const ret: PrayerRequestDto = {
      id: updatedItem.id,
      author: updatedItem.author,
      isAnonymous: updatedItem.isAnonymous,
      isApproved: updatedItem.isApproved,
      title: updatedItem.title,
      content: updatedItem.content,
      numberOfPrays: updatedItem.prayedBy,
      createdAt: updatedItem.createdAt,
    }

    return ret;
  }

  async findAll(op: PrayerRequestListOption): Promise<AdminPrayerRequestsPaginatedDto> {
    const page = Number(op.page);
    const limit = Number(op.limit);

    const items = await this.prayerRequestModel.findAll({ 
      offset: (page - 1) * limit,
      limit: limit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'author' },
        { model: Prayer, as: 'prayers' },
      ]
    });

    const promises = items.map(async item => {
      const prayerRequest : PrayerRequestDto = {
        id: item.id,
        title: item.title,
        content: item.content,
        createdAt: item.createdAt,
        isAnonymous: item.isAnonymous,
        isApproved: item.isApproved,
        author: item.author,
        numberOfPrays: item.prayers?.length,
      };
      
      return prayerRequest;
    });

    const totalPrayerRequests = await this.prayerRequestModel.count();
    const pages = Math.ceil(totalPrayerRequests / op.limit);
    const prayerRequests = await Promise.all(promises);
    const data = {
      pages: pages,
      prayerRequests: prayerRequests,
    }
    return data;
  }

  async remove(id: number): Promise<void> {
    const item = await this.prayerRequestModel.findByPk(id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }
    await item.destroy();
  }

  async removeReplies(data: any): Promise<void> {
    data.ids.forEach(async (replyId: Identifier) => {
      const reply = await this.replyModel.findByPk(replyId);
      if (!reply) {
        throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
      }
      await reply.destroy();
    });
  }

  async approve(data: PrayerRequestApprovePayloadDto): Promise<void> {
    const item = await this.prayerRequestModel.findByPk(data.id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }
    item.isApproved = data.isApproved;
    await item.update(data);
  }
}
