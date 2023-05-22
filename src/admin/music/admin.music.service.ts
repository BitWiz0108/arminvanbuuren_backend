import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Music } from '@models/music.entity';
import { MusicOption } from './dto/music-option';
import { User } from '@models/user.entity';
import { Album } from '@models/album.entity';
import { MusicGenre } from '@common/database/models/music-genre.entity';
import { Language } from '@models/language.entity';
import { AdminMusicDto } from './dto/music.dto';
import * as sharp from 'sharp';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';

@Injectable()
export class AdminMusicService {
  private readonly bucketOption: any;
  private readonly bucketPublicOption: any;

  constructor(
    @InjectModel(Music)
    private readonly musicModel: typeof Music,

    private uploadService: UploadToS3Service,
  ) {
    this.bucketOption = {
      targetBucket: BUCKET_NAME.MUSIC,
      bucketBase: process.env.AWS_S3_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PRIVATE,
    };

    this.bucketPublicOption = {
      targetBucket: BUCKET_NAME.MUSIC,
      bucketBase: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
      acl: BUCKET_ACL_TYPE.PUBLIC_READ,
    }
  }

  async add(
    data: Partial<Music>,
    files: Express.Multer.File[],
  ): Promise<Music>{

    const musicFile: Express.Multer.File = files[0];
    const musicCompressedFile: Express.Multer.File = files[1];
    const coverImageFile: Express.Multer.File = files[2];

    data.coverImage = await this.uploadService.uploadFileToBucket(coverImageFile, ASSET_TYPE.IMAGE, false, this.bucketPublicOption);

    data.musicFile = await this.uploadService.uploadFileToBucket(musicFile, ASSET_TYPE.MUSIC, false, this.bucketOption);
    data.musicFileCompressed = await this.uploadService.uploadFileToBucket(musicCompressedFile, ASSET_TYPE.MUSIC, false, this.bucketOption);
    
    const newMusicItem: Music = await this.musicModel.create({
      userId: data.userId,
      coverImage: data.coverImage,
      musicFile: data.musicFile,
      musicFileCompressed: data.musicFileCompressed,
      isExclusive: data.isExclusive,
      albumId: data.albumId,
      duration: data.duration,
      title: data.title,
      musicGenreId: data.musicGenreId,
      languageId: data.languageId,
      copyright: data.copyright,
      lyrics: data.lyrics,
      description: data.description,
      releaseDate: data.releaseDate
    });

    const newItem = await this.musicModel.findByPk(newMusicItem.id, {
      include: [
        { model: Album, as: 'album' },
        { model: MusicGenre, as: 'musicGenre' },
        { model: User, as: 'singer' },
        { model: Language, as: 'language' },
      ]
    });
    
    return newItem;
  }

  async update(
    data: Partial<Music>,
    files: Express.Multer.File[],
  ): Promise<Music> {
    const item = await this.musicModel.findByPk(data.id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    const musicFile: Express.Multer.File = files[0];
    const musicCompressedFile: Express.Multer.File = files[1];
    const coverImageFile: Express.Multer.File = files[2];

    if (musicFile?.size) { // if musicFile exists
      data.musicFile = await this.uploadService.uploadFileToBucket(musicFile, ASSET_TYPE.MUSIC, false, this.bucketOption);
    }

    if (musicCompressedFile?.size) { // if musicFile exists
      data.musicFileCompressed = await this.uploadService.uploadFileToBucket(musicCompressedFile, ASSET_TYPE.MUSIC, false, this.bucketOption);
    }

    if (coverImageFile?.size) { // if imageFile exists
      data.coverImage = await this.uploadService.uploadFileToBucket(coverImageFile, ASSET_TYPE.IMAGE, false, this.bucketPublicOption);
    }

    await item.update(data);
    const updatedItem = this.musicModel.findByPk(data.id, {
      include: [
        { model: Album, as: 'album' },
        { model: MusicGenre, as: 'musicGenre' },
        { model: User, as: 'singer' },
        { model: Language, as: 'language' },
      ]
    });

    return updatedItem;
  }

  async findAll(op: MusicOption): Promise<AdminMusicDto> {
    const limit = Number(op.limit); // ensure limit is a number
    const page = Number(op.page);
    let orders: any = [];
    if (op.albumName) {
      orders.push([{ model: Album, as: 'album' }, 'name', op.albumName]);
    }
    if (op.title) {
      orders.push(['title', op.title]);
    }
    if (op.artistName) {
      orders.push([{ model: User, as: 'singer' }, 'artistName', op.artistName]);
    }
    if (op.releaseDate) {
      orders.push(['releaseDate', op.releaseDate]);
    }

    if (!orders.length) {
      orders.push(['releaseDate', 'DESC']);
    }

    const musics: Music[] = await this.musicModel.findAll({ 
      offset: (page - 1) * limit, 
      limit: limit,
      order: orders,
      include: [
        { model: Album, as: 'album' },
        { model: MusicGenre, as: 'musicGenre' },
        { model: User, as: 'singer' },
        { model: Language, as: 'language' },
      ]
    });

    const totalItems = await this.musicModel.count();
    const pages: number = Math.ceil(totalItems / limit);

    const data: AdminMusicDto = {
      pages,
      musics,
    };
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  }

  findOne(id: number): Promise<Music> {
    return this.musicModel.findByPk(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.musicModel.findByPk(id);
    if (!item) {
      throw new HttpException(`Music with id ${id} not found.`, HttpStatus.BAD_REQUEST);
    }
    await item.destroy();
  }
}
