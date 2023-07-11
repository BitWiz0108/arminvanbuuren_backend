import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Music } from '@models/music.entity';
import { MusicInputArg, MusicOption } from './dto/music-option';
import { User } from '@models/user.entity';
import { Album } from '@models/album.entity';
import { MusicGenre } from '@common/database/models/music-genre.entity';
import { Language } from '@models/language.entity';
import { AdminMusicDto, MusicWithAlbumIds } from './dto/music.dto';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';
import { AlbumMusic } from '@common/database/models/album-music.entity';
import { Op } from 'sequelize';

@Injectable()
export class AdminMusicService {
  private readonly bucketOption: any;
  private readonly bucketPublicOption: any;

  constructor(
    @InjectModel(Music)
    private readonly musicModel: typeof Music,

    @InjectModel(AlbumMusic)
    private readonly albumMusicModel: typeof AlbumMusic,

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
    data: MusicInputArg,
    files: Express.Multer.File[],
  ): Promise<Music>{

    const musicFile: Express.Multer.File = files[0];
    const musicCompressedFile: Express.Multer.File = files[1];
    const coverImageFile: Express.Multer.File = files[2];
    const videoBackgroundFile: Express.Multer.File = files[3];
    const videoBackgroundFileCompressed: Express.Multer.File = files[4];

    if (musicFile?.size) { // if musicFile exists
      data.musicFile = await this.uploadService.uploadFileToBucket(musicFile, ASSET_TYPE.MUSIC, false, this.bucketOption);
    }

    if (musicCompressedFile?.size) { // if musicFile exists
      data.musicFileCompressed = await this.uploadService.uploadFileToBucket(musicCompressedFile, ASSET_TYPE.MUSIC, false, this.bucketOption);
    }

    if (coverImageFile?.size) { // if imageFile exists
      data.coverImage = await this.uploadService.uploadFileToBucket(coverImageFile, ASSET_TYPE.IMAGE, false, this.bucketPublicOption);
    }

    if (videoBackgroundFile?.size) { // if videoBackgroundFile exists
      data.videoBackground = await this.uploadService.uploadFileToBucket(videoBackgroundFile, ASSET_TYPE.VIDEO, false, this.bucketPublicOption);
    }

    if (videoBackgroundFileCompressed?.size) { // if videoBackgroundFileCompressed exists
      data.videoBackgroundCompressed = await this.uploadService.uploadFileToBucket(videoBackgroundFileCompressed, ASSET_TYPE.VIDEO, false, this.bucketPublicOption);
    }

    const newMusicItem: Music = await this.musicModel.create({
      userId: data.userId,
      coverImage: data.coverImage,
      musicFile: data.musicFile,
      musicFileCompressed: data.musicFileCompressed,
      videoBackground: data.videoBackground,
      videoBackgroundCompressed: data.videoBackgroundCompressed,
      isExclusive: data.isExclusive,
      duration: data.duration,
      title: data.title,
      musicGenreId: data.musicGenreId,
      languageId: data.languageId,
      copyright: data.copyright,
      lyrics: data.lyrics,
      description: data.description,
      releaseDate: data.releaseDate
    });
    
    const albumIds = data.albumIds.split(",");

    const promises = albumIds.map(async albumId => {
      await this.albumMusicModel.create({
        musicId: newMusicItem.id,
        albumId: Number(albumId),
      });
    });

    await Promise.all(promises);

    const newItem = await this.musicModel.findByPk(newMusicItem.id, {
      include: [
        { model: Album, as: 'albums' },
        { model: MusicGenre, as: 'musicGenre' },
        { model: User, as: 'singer' },
        { model: Language, as: 'language' },
      ]
    });

    return newItem;
  }

  async update(
    data: MusicInputArg,
    files: Express.Multer.File[],
  ): Promise<Music> {
    const item = await this.musicModel.findByPk(data.id, {
      include: [
        { model: Album, as: 'albums' }
      ]
    });
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    const promises = item.albums.map(async album => {
      const album_music = await this.albumMusicModel.findOne({
        where: {
          musicId: item.id,
          albumId: album.id,
        }
      });
      if (!album_music) {
        throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
      }
      await album_music.destroy();
    });

    await Promise.all(promises);

    const musicFile: Express.Multer.File = files[0];
    const musicCompressedFile: Express.Multer.File = files[1];
    const coverImageFile: Express.Multer.File = files[2];
    const videoBackgroundFile: Express.Multer.File = files[3];
    const videoBackgroundFileCompressed: Express.Multer.File = files[4];

    if (musicFile?.size) { // if musicFile exists
      data.musicFile = await this.uploadService.uploadFileToBucket(musicFile, ASSET_TYPE.MUSIC, false, this.bucketOption);
    }

    if (musicCompressedFile?.size) { // if musicFile exists
      data.musicFileCompressed = await this.uploadService.uploadFileToBucket(musicCompressedFile, ASSET_TYPE.MUSIC, false, this.bucketOption);
    }

    if (coverImageFile?.size) { // if imageFile exists
      data.coverImage = await this.uploadService.uploadFileToBucket(coverImageFile, ASSET_TYPE.IMAGE, false, this.bucketPublicOption);
    }

    if (videoBackgroundFile?.size) { // if videoBackgroundFile exists
      data.videoBackground = await this.uploadService.uploadFileToBucket(videoBackgroundFile, ASSET_TYPE.VIDEO, false, this.bucketPublicOption);
    }

    if (videoBackgroundFileCompressed?.size) { // if videoBackgroundFileCompressed exists
      data.videoBackgroundCompressed = await this.uploadService.uploadFileToBucket(videoBackgroundFileCompressed, ASSET_TYPE.VIDEO, false, this.bucketPublicOption);
    }

    await item.update(data);

    const albumIds = data.albumIds.split(",");

    const promises2 = albumIds.map(async albumId => {
      await this.albumMusicModel.create({
        musicId: item.id,
        albumId: Number(albumId),
      });
    });

    await Promise.all(promises2);

    const updatedItem = await this.musicModel.findByPk(data.id, {
      include: [
        { model: Album, as: 'albums' },
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

    let options: any = {};
    if (op.searchKey) {
      options = {
        order: orders,
        where: {
          title: {
            [Op.like]: `%${op.searchKey}%`
          }
        }
      };
    } else {
      options = {
        order: orders,
      };
    }

    const filteredMusics: Music[] = await this.musicModel.findAll({
      offset: (page - 1) * limit,
      limit: limit,
      ...options,
      include: [
        { model: Album, as: 'albums' },
        { model: MusicGenre, as: 'musicGenre' },
        { model: User, as: 'singer' },
        { model: Language, as: 'language' },
      ]
    });

    const promises = filteredMusics.map(async filteredMusic => {
      const music: MusicWithAlbumIds = {
        id: filteredMusic.id,
        singer: filteredMusic.singer,
        coverImage: filteredMusic.coverImage,
        musicFile: filteredMusic.musicFile,
        musicFileCompressed: filteredMusic.musicFileCompressed,
        videoBackground: filteredMusic.videoBackground,
        videoBackgroundCompressed: filteredMusic.videoBackgroundCompressed,
        isExclusive: filteredMusic.isExclusive,
        albums: filteredMusic.albums,
        albumIds: filteredMusic.albumIds,
        duration: filteredMusic.duration,
        title: filteredMusic.title,
        musicGenre: filteredMusic.musicGenre,
        language: filteredMusic.language,
        languageId: filteredMusic.languageId,
        copyright: filteredMusic.copyright,
        lyrics: filteredMusic.lyrics,
        description: filteredMusic.description,
        releaseDate: filteredMusic.releaseDate,
        createdAt: filteredMusic.createdAt,
      }
      return music;
    });

    const musics = await Promise.all(promises);

    const totalItems = await this.musicModel.count();
    const pages: number = Math.ceil(totalItems / limit);

    const data: AdminMusicDto = {
      pages,
      musics: musics,
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
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    const albumMusics = await this.albumMusicModel.findAll({
      where: {
        musicId: id,
      }
    });

    const promises = albumMusics.map(async albumMusic => {
      await albumMusic.destroy();
    });

    await Promise.all(promises);

    await item.destroy();
  }
}
