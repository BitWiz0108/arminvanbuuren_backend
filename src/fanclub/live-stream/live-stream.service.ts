import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LiveStream } from '@models/live-stream.entity';
import { CategoriesWithLiveStreams, LiveStreamCommentOption, LiveStreamOption, LiveStreamOptionForCategory } from './dto/live-stream-option';
import { FavoriteLiveStreamDoneDto, FavoriteLiveStreamDto } from './dto/favorite.dto';
import { Favorite } from '@models/favorite.entity';
import { LiveStreamAllDto, LiveStreamCommentsPaginatedDto, LiveStreamWithFavorite } from './dto/live-stream.dto';
import { User } from '@models/user.entity';
import { LiveStreamComment } from '@common/database/models/live-stream-comment.entity';
import { Plan } from '@common/database/models/plan.entity';
import { Category } from '@common/database/models/category.entity';

@Injectable()
export class LiveStreamService {
  constructor(
    @InjectModel(LiveStream)
    private readonly livestreamModel: typeof LiveStream,
    @InjectModel(Favorite)
    private readonly favoriteLiveStreamModel: typeof Favorite,
    @InjectModel(LiveStreamComment)
    private readonly commentModel: typeof LiveStreamComment,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
  ) {}

  async findAll(op: LiveStreamOption, req: any): Promise<LiveStreamAllDto> {
    let data: LiveStreamAllDto;

    const totalItems = await this.livestreamModel.findAll();

    let totalDuration = 0;

    totalItems.map(async item => {
      totalDuration += item.duration;
    });

    let options: any = {
      order: [['releaseDate', 'DESC']],
    };

    if (op.isExclusive != null) {
      options.where = {
        isExclusive: op.isExclusive,
      };
    }

    // if a user didn't subscribe, throw 403 exception
    const user = await this.userModel.findByPk(req.user.id, {
      include: [
        { model: Plan, as: 'plan', }
      ]
    });
    if (user.plan == null || Date.parse(user.planEndDate) < Date.now()) {
      if (op.isExclusive == true) {
        throw new HttpException("You didn't subscribe yet.", HttpStatus.FORBIDDEN);
      }
    }
    // end

    const allItems = await this.livestreamModel.findAll(options);

    const size = allItems.length;
    
    const items = await this.livestreamModel.findAll({
      offset: (op.page - 1) * op.limit,
      limit: op.limit,
      ...options,
      include: [
        { model: User, as: 'singer' },
        { model: User, as: 'creator' }
      ]
    });

    const promises = items.map(async item => {
      const someoneLikeIt = await this.favoriteLiveStreamModel.findOne({
        where: {
          livestreamId: item.id,
          userId: op.userId
        }
      });

      const livestream: LiveStreamWithFavorite = {
        id: item.id,
        coverImage: item.coverImage,
        previewVideo: item.previewVideo,
        previewVideoCompressed: item.previewVideoCompressed,
        fullVideo: item.fullVideo,
        fullVideoCompressed: item.fullVideoCompressed,
        title: item.title,
        lyrics: item.lyrics,
        singer: item.singer,
        creator: item.creator,
        duration: item.duration,
        shortDescription: item.shortDescription,
        description: item.description,
        isExclusive: item.isExclusive,
        releaseDate: item.releaseDate,
        isFavorite: someoneLikeIt ? true : false,
      };
    
      return livestream;
    });
    
    const livestreams = await Promise.all(promises);

    const pages = Math.ceil(size / op.limit);

    data = { 
      livestreams, 
      pages, 
      hours: totalDuration / 3600, 
      size: size
    };

    return data;
  }

  findOne({ livestreamId }): Promise<LiveStream> {
    return this.livestreamModel.findOne({
      where: {
        id: livestreamId,
      },
    });
  }

  async favorite(data: FavoriteLiveStreamDto) : Promise<any> {
    if (data.isFavorite) {
      const item = await this.favoriteLiveStreamModel.findOne({
        where: {
          userId: data.userId,
          livestreamId: data.livestreamId
        }
      });
      if (item) {
        throw new Error(`Item is already exist.`);
      } else {
        return await this.favoriteLiveStreamModel.create({
          userId: data.userId,
          livestreamId: data.livestreamId
        });
      }
    } else {
      const item = await this.favoriteLiveStreamModel.findOne({
        where: {
          userId: data.userId,
          livestreamId: data.livestreamId
        }
      });

      if (!item) {
        throw new Error(`Favorite not found.`);
      }

      await item.destroy();
      return new Promise((resolve, reject) => {
        resolve(new FavoriteLiveStreamDoneDto("success"))
      });
    }
  }

  async getComments(op: LiveStreamCommentOption): Promise<LiveStreamCommentsPaginatedDto> {
    const limit = Number(op.limit); // ensure limit is a number
    const page = Number(op.page);
    const comments: LiveStreamComment[] = await this.commentModel.findAll({ 
      offset: (page - 1) * limit, 
      limit: limit,
      order: [['createdAt', 'DESC']],
      where: {
        livestreamId: op.id,
      },
      include: [
        { model: User, as: 'author' },
      ]
    });

    const totalCommentsForLiveStream = await this.commentModel.findAll({
      where: {
        livestreamId: op.id,
      }
    });
    const pages: number = Math.ceil(totalCommentsForLiveStream.length / limit);

    const data : LiveStreamCommentsPaginatedDto = {
      pages: pages,
      comments: comments,
    };
    return data;
  }

  async addComment(data: Partial<LiveStreamComment>): Promise<LiveStreamComment> {
    const newComment = await this.commentModel.create({
      userId: data.userId,
      livestreamId: data.livestreamId,
      content: data.content,
    });
    
    const newItem = await this.commentModel.findByPk(newComment.id, {
      include: [
        { model: User, as: "author" }
      ]
    });

    return newItem;
  }

  async findAllLiveStreamsWithCategories(op: LiveStreamOption): Promise<CategoriesWithLiveStreams[]> {
    const allCategories = await this.categoryModel.findAll({ 
      include: [
        { model: User, as: 'creator' },
        { model: LiveStream, as: 'livestreams',
          include: [
            { model: User, as: 'singer' },
            { model: User, as: 'creator' }
          ]
        }
      ]
    });

    const categoryPromises = allCategories.map(async (category) => {
      const livestreams = category.livestreams;

      let totalDuration: number = 0;
      livestreams.map(livestream => {
        totalDuration += livestream.duration;
      })

      const ctg = {
        id: category.id,
        name: category.name,
        creator: category.creator,
        description: category.description,
        copyright: category.copyright,
        size: livestreams.length,
        hours: totalDuration / 3600,
        livestreams
      }
      return ctg;
    });

    const data = await Promise.all(categoryPromises);

    return data;
  }

  async findAllLivestreamsForCategory(op: LiveStreamOptionForCategory): Promise<LiveStream[]> {
    const livestreams: LiveStream[] = await this.livestreamModel.findAll({ 
      offset: (op.page - 1) * op.limit, 
      limit: op.limit,
      where: {
        isExclusive: op.isExclusive,
        categoryId: op.categoryId
      },
      include: [
        { model: User, as: 'singer' },
        { model: User, as: 'creator' },
      ]
    });

    return livestreams;
  }
}
