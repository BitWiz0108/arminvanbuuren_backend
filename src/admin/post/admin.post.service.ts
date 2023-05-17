import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '@models/post.entity';
import { PostListOption, PostPartialDto, PostPayloadDto } from './dto/post-option.dto';
import { AdminPostPaginatedDto } from './dto/post.dto';
import { User } from '@models/user.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE, POST_TYPE } from '@common/constants';
import { Reply } from '@common/database/models/reply.entity';
import { Identifier } from 'sequelize/types/model';

@Injectable()
export class AdminPostService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(Post)
    private readonly postModel: typeof Post,

    @InjectModel(Reply)
    private readonly replyModel: typeof Reply,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = { 
      targetBucket: BUCKET_NAME.POST,
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    };
  }

  async add(data: Partial<Post>, files: Express.Multer.File[]) : Promise<Post> {
    if (data.type == POST_TYPE.IMAGE) {
      if (files[0]?.size)
        data.image = await this.uploadService.uploadFileToBucket(files[0], ASSET_TYPE.IMAGE, false, this.bucketOption);
      if (files[1]?.size)
        data.imageCompressed = await this.uploadService.uploadFileToBucket(files[1], ASSET_TYPE.IMAGE, false, this.bucketOption);
    }
    
    if (data.type == POST_TYPE.VIDEO) {
      if (files[0]?.size)
        data.video = await this.uploadService.uploadFileToBucket(files[0], ASSET_TYPE.VIDEO, false, this.bucketOption);
      if (files[1]?.size)
        data.videoCompressed = await this.uploadService.uploadFileToBucket(files[1], ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    const newPost = await this.postModel.create({
      type: data.type,
      image: data.image ? data.image : null,
      imageCompressed: data.imageCompressed ? data.imageCompressed : null,
      video: data.video ? data.video : null,
      videoCompressed: data.videoCompressed ? data.videoCompressed : null,
      authorId: data.authorId,
      title: data.title,
      content: data.content,
    });
    
    const newItem = await this.postModel.findByPk(newPost.id, {
      include: [
        { model: User, as: "author" }
      ]
    });

    return newItem;
  }

  async update(
    data: Partial<Post>,
    files: Express.Multer.File[]
  ): Promise<Post> {
    const item = await this.postModel.findByPk(data.id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    if (data.type == POST_TYPE.IMAGE) {
      if (files[0]?.size)
        data.image = await this.uploadService.uploadFileToBucket(files[0], ASSET_TYPE.IMAGE, false, this.bucketOption);
      if (files[1]?.size)
        data.imageCompressed = await this.uploadService.uploadFileToBucket(files[1], ASSET_TYPE.IMAGE, false, this.bucketOption);
    }
    
    if (data.type == POST_TYPE.VIDEO) {
      if (files[0]?.size)
        data.video = await this.uploadService.uploadFileToBucket(files[0], ASSET_TYPE.VIDEO, false, this.bucketOption);
      if (files[1]?.size)
        data.videoCompressed = await this.uploadService.uploadFileToBucket(files[1], ASSET_TYPE.VIDEO, false, this.bucketOption);
    }

    await item.update(data);
    const updatedItem = this.postModel.findByPk(data.id, {
      include: [
        { model: User, as: 'author' },
      ]
    });

    return updatedItem;
  }

  async findAll(op: PostListOption): Promise<AdminPostPaginatedDto> {
    const limit = Number(op.limit); // ensure limit is a number
    const page = Number(op.page);
    const posts: Post[] = await this.postModel.findAll({ 
      offset: (page - 1) * limit, 
      limit: limit,
      include: [
        { model: User, as: 'author' },
      ]
    });

    const totalItems = await this.postModel.count();
    const pages: number = Math.ceil(totalItems / limit);

    const data : AdminPostPaginatedDto = {
      pages: pages,
      posts: posts,
    };
    return data;
  }

  async remove(id: number): Promise<void> {
    const item = await this.postModel.findByPk(id);
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
}
