import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '@models/post.entity';
import { PostListOption, PostPartialDto, PostPayloadDto } from './dto/post-option.dto';
import { AdminPostPaginatedDto } from './dto/post.dto';
import { User } from '@models/user.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE, POST_FILE_TYPE } from '@common/constants';
import { Reply } from '@common/database/models/reply.entity';
import { Identifier } from 'sequelize/types/model';
import { PostFile } from '@common/database/models/post-files.entity';

@Injectable()
export class AdminPostService {
  private readonly bucketOption: any;

  constructor(
    @InjectModel(Post)
    private readonly postModel: typeof Post,

    @InjectModel(Reply)
    private readonly replyModel: typeof Reply,

    @InjectModel(PostFile)
    private readonly postFileModel: typeof PostFile,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = { 
      targetBucket: BUCKET_NAME.POST,
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    };
  }

  async add(data: PostPayloadDto, files: Express.Multer.File[]) : Promise<Post> {
    const newPost = await this.postModel.create({
      authorId: data.authorId,
      title: data.title,
      content: data.content,
    });

    const types = data.types.split(",");
    for (let i = 0; i < types.length; i ++) {
      let row: any = {};
      row.type = types[i];

      if (types[i] == POST_FILE_TYPE.IMAGE) {
        if (files[i * 2]?.size)
          row.file = await this.uploadService.uploadFileToBucket(files[i * 2], ASSET_TYPE.IMAGE, false, this.bucketOption);
        if (files[i * 2 + 1]?.size)
          row.fileCompressed = await this.uploadService.uploadFileToBucket(files[i * 2 + 1], ASSET_TYPE.IMAGE, false, this.bucketOption);
      }

      if (types[i] == POST_FILE_TYPE.VIDEO) {
        if (files[i * 2]?.size)
          row.file = await this.uploadService.uploadFileToBucket(files[i * 2], ASSET_TYPE.VIDEO, false, this.bucketOption);
        if (files[i * 2 + 1]?.size)
          row.fileCompressed = await this.uploadService.uploadFileToBucket(files[i * 2 + 1], ASSET_TYPE.VIDEO, false, this.bucketOption);
      }

      await this.postFileModel.create({
        postId: newPost.id,
        type: row.type,
        file: row.file,
        fileCompressed: row.fileCompressed,
      });
    }
    
    const newItem = await this.postModel.findByPk(newPost.id, {
      include: [
        { model: User, as: "author" },
        { model: PostFile, as: "files", },
      ]
    });

    return newItem;
  }

  async update(
    data: PostPartialDto,
    files: Express.Multer.File[]
  ): Promise<Post> {
    const item = await this.postModel.findByPk(data.id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    const ids = data.ids.split(",");
    const types = data.types.split(",");

    if (files.length > 0) {
      for (let i = 0; i < ids.length; i ++) {
        const postFileId = ids[i];
  
        if (postFileId) { // update file
          const postFile = await this.postFileModel.findByPk(postFileId);
  
          if (types[i] == '' || types[i] == undefined || types[i] == null) {
            await postFile.destroy();
            continue;
          }
    
          if (types[i] == POST_FILE_TYPE.IMAGE) {
            postFile.type = POST_FILE_TYPE.IMAGE;
            postFile.file = await this.uploadService.uploadFileToBucket(files[i * 2], ASSET_TYPE.IMAGE, false, this.bucketOption);
            postFile.fileCompressed = await this.uploadService.uploadFileToBucket(files[i * 2 + 1], ASSET_TYPE.IMAGE, false, this.bucketOption);
          }
    
          if (types[i] == POST_FILE_TYPE.VIDEO) {
            postFile.type = POST_FILE_TYPE.VIDEO;
            postFile.file = await this.uploadService.uploadFileToBucket(files[i * 2], ASSET_TYPE.VIDEO, false, this.bucketOption);
            postFile.fileCompressed = await this.uploadService.uploadFileToBucket(files[i * 2 + 1], ASSET_TYPE.VIDEO, false, this.bucketOption);
          }
    
          await postFile.save();
  
        } else { // add new file
          let row: any = {};
          row.type = types[i];
  
          if (types[i] == POST_FILE_TYPE.IMAGE) {
            if (files[i * 2]?.size)
              row.file = await this.uploadService.uploadFileToBucket(files[i * 2], ASSET_TYPE.IMAGE, false, this.bucketOption);
            if (files[i * 2 + 1]?.size)
              row.fileCompressed = await this.uploadService.uploadFileToBucket(files[i * 2 + 1], ASSET_TYPE.IMAGE, false, this.bucketOption);
          }
    
          if (types[i] == POST_FILE_TYPE.VIDEO) {
            if (files[i * 2]?.size)
              row.file = await this.uploadService.uploadFileToBucket(files[i * 2], ASSET_TYPE.VIDEO, false, this.bucketOption);
            if (files[i * 2 + 1]?.size)
              row.fileCompressed = await this.uploadService.uploadFileToBucket(files[i * 2 + 1], ASSET_TYPE.VIDEO, false, this.bucketOption);
          }
    
          await this.postFileModel.create({
            postId: data.id,
            type: row.type,
            file: row.file,
            fileCompressed: row.fileCompressed,
          });
        }
      }
    }

    await item.update(data);

    const updatedItem = this.postModel.findByPk(data.id, {
      include: [
        { model: User, as: 'author' },
        { model: PostFile, as: "files", },
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
      order: [[ 'id', 'DESC']],
      include: [
        { model: User, as: 'author' },
        { model: PostFile, as: "files", order: [['id', 'ASC']], include: [] },
      ]
    });

    posts.forEach((post: Post) => {
      post.files.sort((a: PostFile, b: PostFile) => a.id - b.id);
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

    const postFiles = await this.postFileModel.findAll({
      where: {
        postId: item.id,
      }
    });

    postFiles.map(async file => {
      await file.destroy();
    });

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
