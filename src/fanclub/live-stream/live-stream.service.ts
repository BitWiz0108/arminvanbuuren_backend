import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LiveStream } from '@models/live-stream.entity';
import { CategoriesWithLiveStreams, LiveStreamCommentOption, LiveStreamOption, LiveStreamOptionForCategory, LivestreamByTitle } from './dto/live-stream-option';
import { FavoriteLiveStreamDoneDto, FavoriteLiveStreamDto } from './dto/favorite.dto';
import { Favorite } from '@models/favorite.entity';
import { LiveStreamAllDto, LiveStreamCommentsPaginatedDto, LiveStreamWithFavorite } from './dto/live-stream.dto';
import { User } from '@models/user.entity';
import { LiveStreamComment } from '@common/database/models/live-stream-comment.entity';
import { Plan } from '@common/database/models/plan.entity';
import { Category } from '@common/database/models/category.entity';
import { CategoryLivestream } from '@common/database/models/category-livestream.entity';
import { Op } from 'sequelize';
import { MESSAGE } from '@common/constants';

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
    @InjectModel(CategoryLivestream)
    private readonly categoryLivestreamModel: typeof CategoryLivestream,

  ) {}

  async findAll(op: LiveStreamOption, req: any): Promise<LiveStreamAllDto> {
    let data: LiveStreamAllDto;

    const totalItems = await this.livestreamModel.findAll();

    let totalDuration = 0;

    totalItems.map(async item => {
      totalDuration += item.duration;
    });

    let options: any = {
      order: [
        ['releaseDate', 'DESC'],
        ['title', 'ASC'],
      ],
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

    const size = Number(await this.livestreamModel.count(options));
    
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
      const iLikeIt = await this.favoriteLiveStreamModel.count({
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
        isFavorite: iLikeIt > 0,
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

  async findOneByTitle(data: LivestreamByTitle): Promise<LiveStream[]> {
    const livestreams: LiveStream[] = [];

    const currentLivestream = await this.livestreamModel.findOne({
      where: {
        title: {
          [Op.like]: `%${data.title}%`
        },
      }
    });
    if (data.hasMemebership == false && currentLivestream.isExclusive) {
      throw new HttpException(MESSAGE.FAILED_ACCESS_ITEM, HttpStatus.BAD_REQUEST);
    }

    let options: any = {
      order: [[ 'createdAt', 'ASC' ]],
    };

    if (data.hasMemebership == false) {
      options.where = {
        isExclusive: false,
      };
    }

    const allLivestreams = await this.livestreamModel.findAll(options);

    const totalListSize = Number(await this.livestreamModel.count(options));

    const currentIndex = allLivestreams.findIndex(livestream => livestream.id === currentLivestream.id );

    let prevLivestream: any = null;
    let nextLivestream: any = null;

    if (totalListSize >= 3) {
      nextLivestream = allLivestreams[(currentIndex + 1) % totalListSize];
      prevLivestream = allLivestreams[(currentIndex - 1 + totalListSize) % totalListSize];
    } else {
      if (currentIndex > 0) prevLivestream = allLivestreams[currentIndex - 1];
      if (currentIndex < totalListSize - 1) nextLivestream = allLivestreams[currentIndex + 1];
    }
    livestreams.push(prevLivestream);
    livestreams.push(currentLivestream);
    livestreams.push(nextLivestream);
    return livestreams;
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
      order: [
        ['releaseDate', 'DESC'],
      ],
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
      category.livestreams.sort((a: LiveStream, b: LiveStream) => {
        if (b.releaseDate > a.releaseDate) return 1;
        else if (b.releaseDate < a.releaseDate) return -1;
        else {
          if (a.title > b.title) return 1;
          else if (a.title < b.title) return -1;
          else return 0;
        }
      });

      const size = await this.categoryLivestreamModel.count({
        where: {
          categoryId: category.id,
        }
      });

      let totalDuration: number = 0;
      category.livestreams.map(livestream => {
        totalDuration += livestream.duration;
      })

      // pagination
      const livestreams = category.livestreams.slice((op.page - 1) * op.limit, op.page * op.limit);

      const ctg = {
        id: category.id,
        name: category.name,
        creator: category.creator,
        description: category.description,
        copyright: category.copyright,
        size: size,
        hours: totalDuration / 3600,
        livestreams
      }
      return ctg;
    });

    const data = await Promise.all(categoryPromises);

    return data;
  }

  async findAllLivestreamsForCategory(op: LiveStreamOptionForCategory): Promise<LiveStream[]> {
    const category = await this.categoryModel.findByPk(op.categoryId, {
      include: [
        { model: LiveStream, as: 'livestreams',
          where: {
            isExclusive: op.isExclusive,
          },
          include: [
            { model: User, as: 'singer', },
            { model: User, as: 'creator', },
          ]
        }
      ]
    });

    category.livestreams.sort((a: LiveStream, b: LiveStream) => {
      if (b.releaseDate > a.releaseDate) return 1;
      else if (b.releaseDate < a.releaseDate) return -1;
      else {
        if (a.title > b.title) return 1;
        else if (a.title < b.title) return -1;
        else return 0;
      }
    });

    const livestreams = category.livestreams.slice((op.page - 1) * op.limit, op.page * op.limit);

    return livestreams;
  }
}
