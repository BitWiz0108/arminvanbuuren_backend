import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Music } from '@models/music.entity';
import { MusicOption, MusicOptionForAlbum } from './dto/music-option';
import { Favorite } from '@models/favorite.entity';
import { FavoriteMusicDoneDto, FavoriteMusicDto } from './dto/favorite.dto';
import { AlbumsWithMusics, MusicAllDto, MusicWithFavorite } from './dto/music.dto';
import { User } from '@models/user.entity';
import { Album } from '@models/album.entity';

@Injectable()
export class MusicService {
  constructor(
    @InjectModel(Music)
    private readonly musicModel: typeof Music,
    @InjectModel(Favorite)
    private readonly favoriteMusicModel: typeof Favorite,
    @InjectModel(Album)
    private readonly albumModel: typeof Album,
  ) {}

  async findAllMusics(op: MusicOption): Promise<MusicAllDto> {
    let options: any = {
      order: [['releaseDate', 'DESC']],
    };

    if (op.isExclusive != null) {
      options.where = {
        isExclusive: op.isExclusive,
      };
    }

    let data: MusicAllDto;
    const items = await this.musicModel.findAll({ 
      offset: (op.page - 1) * op.limit, 
      limit: op.limit,
      ...options,
      include: [
        { model: User, as: 'singer' },
      ]
    });
    const promises = items.map(async item => {
      const someoneLikeIt = await this.favoriteMusicModel.findOne({
        where: {
          musicId: item.id,
          userId: op.userId
        }
      });

      const music: MusicWithFavorite = {
        id: item.id,
        coverImage: item.coverImage,
        musicFile: item.musicFile,
        musicFileCompressed: item.musicFileCompressed,
        title: item.title,
        duration: item.duration,
        lyrics: item.lyrics,
        description: item.description,
        isExclusive: item.isExclusive,
        isFavorite: someoneLikeIt ? true : false,
        singer: item.singer,
      };
      
      return music;
    });

    const musics = await Promise.all(promises);
    const totalMusicsCount = await this.musicModel.findAll(
      options
    );
    const pages = Math.ceil(totalMusicsCount.length / op.limit);
    data = { musics, pages };
    return data;
  }

  async findAllMusicsWithAlbums(op: MusicOption): Promise<AlbumsWithMusics[]> {
    const allAlbums = await this.albumModel.findAll({ 
      include: [
        { model: User, as: 'creator' },
        { model: Music, as: 'musics',
          include: [
            { model: User, as: 'singer' }
          ]
        }
      ]
    });

    const albumPromises = allAlbums.map(async (album) => {
      const musicsForEachAlbum = album.musics;

      const promises = musicsForEachAlbum.map(async (item) => {
        const someoneLikeIt = await this.favoriteMusicModel.findOne({
          where: {
            musicId: item.id,
            userId: op.userId
          }
        });
        const music: MusicWithFavorite = {
          id: item.id,
          coverImage: item.coverImage,
          musicFile: item.musicFile,
          musicFileCompressed: item.musicFileCompressed,
          title: item.title,
          duration: item.duration,
          lyrics: item.lyrics,
          description: item.description,
          isExclusive: item.isExclusive,
          isFavorite: someoneLikeIt ? true : false,
          singer: item.singer,
        };

        return music;
      });
      const musics = await Promise.all(promises);

      let totalDuration: number = 0;
      musics.map(music => {
        totalDuration += music.duration;
      })

      const alb = {
        id: album.id,
        name: album.name,
        creator: album.creator,
        description: album.description,
        copyright: album.copyright,
        size: musics.length,
        hours: totalDuration / 3600,
        musics
      }
      return alb;
    });

    const data = await Promise.all(albumPromises);

    return data;
  }

  async findAllMusicsForAlbum(op: MusicOptionForAlbum): Promise<MusicWithFavorite[]> {
    let data: MusicAllDto;
    const items = await this.musicModel.findAll({ 
      offset: (op.page - 1) * op.limit, 
      limit: op.limit,
      where: {
        isExclusive: op.isExclusive,
        albumId: op.albumId
      },
      include: [
        { model: User, as: 'singer' },
      ]
    });
    const promises = items.map(async item => {
      const someoneLikeIt = await this.favoriteMusicModel.findOne({
        where: {
          musicId: item.id,
          userId: op.userId
        }
      });

      const music: MusicWithFavorite = {
        id: item.id,
        coverImage: item.coverImage,
        musicFile: item.musicFile,
        musicFileCompressed: item.musicFileCompressed,
        title: item.title,
        duration: item.duration,
        lyrics: item.lyrics,
        description: item.description,
        isExclusive: item.isExclusive,
        isFavorite: someoneLikeIt ? true : false,
        singer: item.singer,
      };
      
      return music;
    });

    const musics = await Promise.all(promises);
    return musics;
  }

  findOne(id): Promise<Music> {
    return this.musicModel.findByPk(id);
  }

  async favorite(data: FavoriteMusicDto) : Promise<any> {
    if (data.isFavorite) {
      const item = await this.favoriteMusicModel.findOne({
        where: {
          userId: data.userId,
          musicId: data.musicId
        }
      });
      if (item) {
        throw new Error(`You already like this.`);
      } else {
        return await this.favoriteMusicModel.create({
          userId: data.userId,
          musicId: data.musicId
        });
      }
    } else {
      const item = await this.favoriteMusicModel.findOne({
        where: {
          userId: data.userId,
          musicId: data.musicId
        }
      });

      if (!item) {
        throw new Error(`Not found the item you would dislike`);
      }

      await item.destroy();
      return new Promise((resolve, reject) => {
        resolve(new FavoriteMusicDoneDto("success"))
      });
    }
  }
}
