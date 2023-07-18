import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Playlist } from '@models/playlist.entity';
import { User } from '@models/user.entity';
import { UploadToS3Service } from '@common/services/upload-s3.service';
import { ASSET_TYPE, BUCKET_ACL_TYPE, BUCKET_NAME, MESSAGE } from '@common/constants';
import { PlaylistMusic } from '@common/database/models/playlist-music.entity';
import { Op } from 'sequelize';
import { AddMusicToPlaylistInputArg, PlaylistDto } from './dto/playlist.dto';
import { Music } from '@common/database/models/music.entity';

@Injectable()
export class AdminPlaylistService {
  constructor(
    @InjectModel(Playlist)
    private readonly playlistModel: typeof Playlist,

    @InjectModel(PlaylistMusic)
    private readonly playlistMusicModel: typeof PlaylistMusic,

    private uploadService: UploadToS3Service,
  ) {}

  async add(data: Partial<Playlist>): Promise<Playlist> {
    try {
      const newPlaylist: Playlist = await this.playlistModel.create({
        name: data.name,
        userId: data.userId,
      });

      const newItem = await this.playlistModel.findByPk(newPlaylist.id, {
        include: [
          { model: User, as: 'creator' }
        ]
      });

      return newItem;
    } catch (error) {
      throw new HttpException(MESSAGE.FAILED_CREATE_ITEM, HttpStatus.BAD_REQUEST);
    }
  }

  async addMusicsToPlaylist(data: AddMusicToPlaylistInputArg): Promise<Playlist[]> {
    try {
      const playlistIds = data.playlistIds.split(",");

      for (let i = 0; i < playlistIds.length; i ++) {
        await this.playlistMusicModel.create({
          playlistId: playlistIds[i],
          musicId: data.musicId,
        });
      }

      let updatedPlaylists = [];
      const promises = playlistIds.map(async playlistId => {
        const playlist = await this.playlistModel.findByPk(playlistId, {
          include: [
            { model: User, as: 'creator' },
            { model: Music, as: 'musics' },
          ],
        });
        const updatedPlaylist: PlaylistDto = {
          id: playlist.id,
          name: playlist.name,
          musicIds: playlist.musicIds,
          musics: playlist.musics,
          creator: playlist.creator,
        }
        updatedPlaylists.push(updatedPlaylist);
      });

      await Promise.all(promises);

      return updatedPlaylists;
    } catch (error) {
      throw new HttpException(MESSAGE.FAILED_CREATE_ITEM, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(op: any): Promise<Playlist[]> {
    let options: any = {};
    if (op.searchKey) {
      options = {
        where: {
          name: {
            [Op.like]: `%${op.searchKey}%`
          }
        }
      };
    }
    return this.playlistModel.findAll({
      order: [['created_at', 'DESC']],
      ...options,
      include: [
        { model: User, as: 'creator' },
        { model: Music, as: 'musics' },
      ],
    });
  }

  async remove(id: number): Promise<void> {
    const item = await this.playlistModel.findByPk(id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    const playlistMusics = await this.playlistMusicModel.findAll({
      where: {
        playlistId: id,
      }
    });

    const promises = playlistMusics.map(async playlistMusic => {
      await playlistMusic.destroy();
    });

    await Promise.all(promises);
    await item.destroy();
  }

  async removeMusic(id: number, musicId: number): Promise<Playlist[]> {
    const item = await this.playlistModel.findByPk(id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    const playlistMusic = await this.playlistMusicModel.findOne({
      where: {
        playlistId: id,
        musicId: musicId,
      }
    });

    await playlistMusic.destroy();

    return this.playlistModel.findAll({
      order: [['created_at', 'DESC']],
      where: {
        id: id,
      },
      include: [
        { model: User, as: 'creator' },
        { model: Music, as: 'musics' },
      ],
    });
  }
}
