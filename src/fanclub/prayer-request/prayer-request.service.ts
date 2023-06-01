import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.entity';
import { Identifier } from 'sequelize/types/model';
import { PrayerRequestsPaginatedDto, PrayerRequestDto, PrayerRequestWithRepliesDto, PrayerReplyPaginatedDto, PrayDoneDto } from './dto/prayer-request.dto';
import { PrayerDto, PrayerReplyOptionDto, PrayerRequestListOption } from './dto/prayer-request-option.dto';
import { PrayerRequest } from '@common/database/models/prayer-request.entity';
import { PrayerReply } from '@common/database/models/prayer-reply.entity';
import { MESSAGE } from '@common/constants';
import { Prayer } from '@common/database/models/prayer.entity';

@Injectable()
export class PrayerRequestService {
  constructor(
    @InjectModel(PrayerRequest)
    private readonly prayerRequestModel: typeof PrayerRequest,

    @InjectModel(PrayerReply)
    private readonly replyModel: typeof PrayerReply,

    @InjectModel(Prayer)
    private readonly prayerModel: typeof Prayer,

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
  ): Promise<PrayerRequest> {
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

    return updatedItem;
  }

  async findAll(op: PrayerRequestListOption): Promise<PrayerRequestsPaginatedDto> {
    const page = Number(op.page);
    const limit = Number(op.limit);
    const userId = Number(op.userId);

    const items = await this.prayerRequestModel.findAll({
      offset: (page - 1) * limit,
      limit: limit,
      order: [['createdAt', 'DESC']],
      where: {
        isApproved: true,
      },
      include: [
        { model: User, as: 'author' },
        { model: Prayer, as: 'prayers' },
      ]
    });

    const promises = items.map(async item => {
      const youPrayIt = await this.prayerModel.findOne({
        where: {
          prayerRequestId: item.id,
          userId: userId
        }
      });

      const prayerRequest : PrayerRequestDto = {
        id: item.id,
        title: item.title,
        content: item.content,
        createdAt: item.createdAt,
        isAnonymous: item.isAnonymous,
        author: item.author,
        isPraying: youPrayIt ? true : false,
        numberOfPrays: item.prayedBy,
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

  async remove(id: number, authorId: number): Promise<void> {
    const item = await this.prayerRequestModel.findByPk(id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }
    if (item.authorId != authorId) {
      throw new HttpException(MESSAGE.FAILED_ACCESS_ITEM, HttpStatus.FORBIDDEN);
    }
    await item.destroy();
  }

  async fetchPrayerRequestById(id: number): Promise<PrayerRequestWithRepliesDto> {
    const pr = await this.prayerRequestModel.findByPk(id, {
      include: [
        { model: PrayerReply, as: 'replies', include: [{ model: User, as: 'replier' }] },
        { model: User, as: 'author' },
        { model: Prayer, as: 'prayers' },
      ]
    });

    if (!pr) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    const prWithReplies : PrayerRequestWithRepliesDto = {
      id: pr.id,
      title: pr.title,
      content: pr.content,
      createdAt: pr.createdAt,
      author: pr.author,
      numberOfPrays: pr.prayedBy,
      replies: pr.replies,
      isAnonymous: pr.isAnonymous,
    };

    return prWithReplies;
  }

  async findAllReplies(op: PrayerReplyOptionDto) : Promise<PrayerReplyPaginatedDto> {
    const replies = await this.replyModel.findAll({ 
      offset: (op.page - 1) * op.limit,
      limit: op.limit,
      where: {
        prayerRequestId: op.prayerRequestId,
      },
      include: [
        { model: User, as: 'replier' },
      ],
      order: [['createdAt', 'DESC']]
    });

    const totalReplies = await this.replyModel.count({
      where: {
        prayerRequestId: op.prayerRequestId
      }
    });

    const data : PrayerReplyPaginatedDto = {
      pages: Math.ceil(totalReplies / op.limit),
      replies: replies
    };

    return data;
  }

  async prayIt(data: PrayerDto) : Promise<any> {
    if (data.isPraying) {
      const item = await this.prayerModel.findOne({
        where: {
          userId: data.userId,
          prayerRequestId: data.prayerRequestId
        }
      });
      if (item) {
        throw new HttpException('You already prayed this.', HttpStatus.BAD_REQUEST);
      } else {
        return await this.prayerModel.create({
          userId: data.userId,
          prayerRequestId: data.prayerRequestId
        });
      }
    } else {
      const item = await this.prayerModel.findOne({
        where: {
          userId: data.userId,
          prayerRequestId: data.prayerRequestId
        }
      });

      if (!item) {
        throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
      }

      await item.destroy();
      return new Promise((resolve, reject) => {
        resolve(new PrayDoneDto("success"))
      });
    }
  }

  async addReply(data: Partial<PrayerReply>) : Promise<PrayerReply> {
    const newReply = await this.replyModel.create({
      replierId: data.replierId,
      prayerRequestId: data.prayerRequestId,
      isAnonymous: data.isAnonymous,
      content: data.content
    });

    const newItem = await this.replyModel.findByPk(newReply.id, {
      include: [
        { model: User, as: "replier"}
      ]
    })

    return newItem;
  }
}
