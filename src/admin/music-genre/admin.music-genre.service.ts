import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MusicGenre } from '@common/database/models/music-genre.entity';

@Injectable()
export class AdminMusicGenreService {
  constructor(
    @InjectModel(MusicGenre)
    private readonly musicGenreModel: typeof MusicGenre,
  ) {}

  async add(data: MusicGenre): Promise<MusicGenre>{
    try {
      return await this.musicGenreModel.create({
        name: data.name,
        coverImage: data.coverImage,
        status: true,
      });
    } catch (error) {
      throw new HttpException("Failed to Create an Music Genre", HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: number,
    data: Partial<MusicGenre>,
  ): Promise<MusicGenre> {
    const item = await this.musicGenreModel.findByPk(id);
    if (!item) {
      throw new Error(`Music with id ${id} not found.`);
    }
    const updatedItem = await item.update(data);
    return updatedItem;
  }

  async findAll(): Promise<MusicGenre[]> {
    return this.musicGenreModel.findAll();
  }

  findOne(id: number): Promise<MusicGenre> {
    return this.musicGenreModel.findByPk(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.musicGenreModel.findByPk(id);
    if (!item) {
      throw new Error(`Music Genre with id ${id} not found.`);
    }
    await item.destroy();
  }
}
