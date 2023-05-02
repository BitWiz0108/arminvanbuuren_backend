import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ArtistGenre } from '@common/database/models/artist-genre.entity';
import { MESSAGE } from '@common/constants';

@Injectable()
export class AdminArtistGenreService {
  constructor(
    @InjectModel(ArtistGenre)
    private readonly artistGenreModel: typeof ArtistGenre,
  ) {}

  async add(data: ArtistGenre): Promise<ArtistGenre>{
    try {
      return await this.artistGenreModel.create({
        name: data.name,
      });
    } catch (error) {
      throw new HttpException(MESSAGE.FAILED_CREATE_ITEM, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: number,
    data: Partial<ArtistGenre>,
  ): Promise<ArtistGenre> {
    const item = await this.artistGenreModel.findByPk(id);
    if (!item) {
      throw new Error(`Music with id ${id} not found.`);
    }
    const updatedItem = await item.update(data);
    return updatedItem;
  }

  async findAll(): Promise<ArtistGenre[]> {
    return this.artistGenreModel.findAll();
  }

  findOne(id: number): Promise<ArtistGenre> {
    return this.artistGenreModel.findByPk(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.artistGenreModel.findByPk(id);
    if (!item) {
      throw new Error(`Artist Genre with id ${id} not found.`);
    }
    await item.destroy();
  }
}
