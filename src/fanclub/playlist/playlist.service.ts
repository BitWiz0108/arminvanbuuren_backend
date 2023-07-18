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
export class PlaylistService {
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
        const playlist = await this.playlistModel.findByPk(playlistIds[i]);
        if (playlist.userId != data.userId) {
          throw new HttpException(MESSAGE.FAILED_CREATE_ITEM, HttpStatus.BAD_REQUEST);
        }

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
    options = {
      where: {
        userId: {
          [Op.or]: [1, op.userId]
        }
      }
    };
    return this.playlistModel.findAll({
      order: [['created_at', 'DESC']],
      ...options,
      include: [
        { model: User, as: 'creator' },
        { model: Music, as: 'musics' },
      ],
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    const item = await this.playlistModel.findByPk(id);
    if (!item || item.userId != userId) {
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

  async removeMusic(op: any): Promise<Playlist[]> {
    const item = await this.playlistModel.findByPk(op.id);
    if (!item || item.userId != op.userId) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    const playlistMusic = await this.playlistMusicModel.findOne({
      where: {
        playlistId: op.id,
        musicId: op.musicId,
      }
    });

    await playlistMusic.destroy();

    return this.playlistModel.findAll({
      order: [['created_at', 'DESC']],
      where: {
        id: op.id,
      },
      include: [
        { model: User, as: 'creator' },
        { model: Music, as: 'musics' },
      ],
    });
  }
}
