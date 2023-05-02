import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Language } from '@models/language.entity';
import { MESSAGE } from '@common/constants';

@Injectable()
export class AdminLanguageService {
  constructor(
    @InjectModel(Language)
    private readonly languageModel: typeof Language,
  ) {}

  async add(data: Language): Promise<Language>{
    if (data.isDefault == true) {
      const default_language = this.languageModel.findOne({
        where: {
          isDefault: true
        }
      });
      if (default_language) {
        throw new HttpException(MESSAGE.FAILED_CREATE_ITEM, HttpStatus.BAD_REQUEST);
      }
    }

    try {
      return await this.languageModel.create({
        name: data.name,
        code: data.code,
        isDefault: data.isDefault,
        status: true,
      });
    } catch (error) {
      throw new HttpException(MESSAGE.FAILED_CREATE_ITEM, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: number,
    data: Partial<Language>,
  ): Promise<Language> {
    const item = await this.languageModel.findByPk(id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_UPDATE_ITEM, HttpStatus.BAD_REQUEST);
    }
    if (data.isDefault == true) {
      const default_language = this.languageModel.findOne({
        where: {
          isDefault: true
        }
      });
      if (default_language && (await default_language).id == id) {
        throw new HttpException(MESSAGE.NOT_ALLOWED_MULTIPLE_DEFAULT_LANGUAGE, HttpStatus.BAD_REQUEST);
      }
    }
    const updatedItem = await item.update(data);
    return updatedItem;
  }

  async findAll(): Promise<Language[]> {
    return this.languageModel.findAll();
  }

  findOne(id: number): Promise<Language> {
    return this.languageModel.findByPk(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.languageModel.findByPk(id);
    if (!item) {
      throw new Error(`Language with id ${id} not found.`);
    }
    await item.destroy();
  }
}
