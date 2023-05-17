import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LiveStream } from '@models/live-stream.entity';
import { AdminLiveStreamOption } from './dto/live-stream-option';
import { AdminLiveStreamDto, } from './dto/live-stream-dto';
import { User } from '@models/user.entity';
import { Language } from '@models/language.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';
import { LiveStreamComment } from '@common/database/models/live-stream-comment.entity';
import { Identifier } from 'sequelize';
import { Category } from '@common/database/models/category.entity';

@Injectable()
export class AdminLiveStreamService {  
  private readonly bucketOption: any;
  private readonly bucketPublicOption: any;

  constructor(
    @InjectModel(LiveStream)
    private readonly livestreamModel: typeof LiveStream,

    @InjectModel(LiveStreamComment)
    private readonly lsCommentModel: typeof LiveStreamComment,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = {
      targetBucket: BUCKET_NAME.LIVESTREAM,
      bucketBase: process.env.AWS_S3_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PRIVATE,
    };
    this.bucketPublicOption = {
      targetBucket: BUCKET_NAME.LIVESTREAM,
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    }
  }
    
  async add(
    data: Partial<LiveStream>,
    files: Express.Multer.File[],
  ): Promise<LiveStream>{

    const coverImageFile: Express.Multer.File = files[0];
    const previewVideoFile: Express.Multer.File = files[1];
    const previewVideoFileCompressed: Express.Multer.File = files[2];
    const fullVideoFile: Express.Multer.File = files[3];
    const fullVideoFileCompressed: Express.Multer.File = files[4];

    data.coverImage = await this.uploadService.uploadFileToBucket(coverImageFile, ASSET_TYPE.IMAGE, false, this.bucketPublicOption);
    
    data.previewVideo = await this.uploadService.uploadFileToBucket(previewVideoFile, ASSET_TYPE.VIDEO, false, this.bucketOption);
    data.previewVideoCompressed = await this.uploadService.uploadFileToBucket(previewVideoFileCompressed, ASSET_TYPE.VIDEO, false, this.bucketOption);

    data.fullVideo = await this.uploadService.uploadFileToBucket(fullVideoFile, ASSET_TYPE.VIDEO, false, this.bucketOption);
    data.fullVideoCompressed = await this.uploadService.uploadFileToBucket(fullVideoFileCompressed, ASSET_TYPE.VIDEO, false, this.bucketOption);

    const newLiveStream:LiveStream = await this.livestreamModel.create({
      coverImage: data.coverImage,
      title: data.title,
      singerId: data.singerId,
      creatorId: data.creatorId,
      categoryId: data.categoryId,
      duration: data.duration,
      releaseDate: data.releaseDate,
      previewVideo: data.previewVideo,
      previewVideoCompressed: data.previewVideoCompressed,
      fullVideo: data.fullVideo,
      fullVideoCompressed: data.fullVideoCompressed,
      shortDescription: data.shortDescription,
      lyrics: data.lyrics,
      description: data.description,
      isExclusive: data.isExclusive
    });

    const newItem = this.livestreamModel.findByPk(newLiveStream.id, {
      include: [
        { model: User, as: 'singer' },
        { model: User, as: 'creator' },
        { model: Language, as: 'language' },
        { model: Category, as: 'category' },
      ]
    });

    return newItem;
  }

  async update(
    data: Partial<LiveStream>,
    files: Express.Multer.File[],
  ): Promise<LiveStream> {
    const item = await this.livestreamModel.findByPk(data.id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    const coverImageFile: Express.Multer.File = files[0];
    const previewVideoFile: Express.Multer.File = files[1];
    const previewVideoFileCompressed: Express.Multer.File = files[2];
    const fullVideoFile: Express.Multer.File = files[3];
    const fullVideoFileCompressed: Express.Multer.File = files[4];

    if (coverImageFile?.size) {
      data.coverImage = await this.uploadService.uploadFileToBucket(coverImageFile, ASSET_TYPE.IMAGE, false, this.bucketPublicOption);
    }

    if (previewVideoFile?.size) {
      data.previewVideo = await this.uploadService.uploadFileToBucket(previewVideoFile, ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    if (previewVideoFileCompressed?.size) {
      data.previewVideoCompressed = await this.uploadService.uploadFileToBucket(previewVideoFileCompressed, ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    if (fullVideoFile?.size) {
      data.fullVideo = await this.uploadService.uploadFileToBucket(fullVideoFile, ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    if (fullVideoFileCompressed?.size) {
      data.fullVideoCompressed = await this.uploadService.uploadFileToBucket(fullVideoFileCompressed, ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    await item.update(data);
    const updatedItem = this.livestreamModel.findByPk(data.id, {
      include: [
        { model: User, as: 'singer' },
        { model: User, as: 'creator' },
        { model: Language, as: 'language' },
        { model: Category, as: 'category' },
      ]
    });

    return updatedItem;
  }

  async findAll(op: AdminLiveStreamOption): Promise<AdminLiveStreamDto> {
    const limit = Number(op.limit); // ensure limit is a number
    const page = Number(op.page);

    let orders: any = [];

    if (op.title) {
      orders.push(['title', op.title]);
    }

    if (op.categoryName) {
      orders.push([{ model: Category, as: 'category' }, 'name', op.categoryName]);
    }

    if (op.releaseDate) {
      orders.push(['releaseDate', op.releaseDate]);
    }

    if (op.artistName) {
      orders.push([{ model: User, as: 'artist' }, 'artistName', op.artistName]);
    }

    if (!orders.length) {
      orders.push(['createdAt', 'DESC']);
    }

    const livestreams: LiveStream[] = await this.livestreamModel.findAll({ 
      offset: (page - 1) * limit,
      limit: limit,
      order: orders,
      include: [
        { model: User, as: 'singer' },
        { model: User, as: 'creator' },
        { model: Language, as: 'language' },
        { model: Category, as: 'category' },
      ]
    });

    const totalItems = await this.livestreamModel.count();
    const pages: number = Math.ceil(totalItems / limit);

    const data: AdminLiveStreamDto = {
      pages,
      livestreams,
    };
    
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  }

  findOne(id: number): Promise<LiveStream> {
    return this.livestreamModel.findByPk(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.livestreamModel.findByPk(id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }
    await item.destroy();
  }

  async removeComments(data: any): Promise<void> {
    data.ids.forEach(async (commentId: Identifier) => {
      const comment = await this.lsCommentModel.findByPk(commentId);
      if (!comment) {
        throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
      }
      await comment.destroy();
    });
  }
}
