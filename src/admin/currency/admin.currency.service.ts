import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Currency } from '@common/database/models/currency.entity';
import { MESSAGE } from '@common/constants';

@Injectable()
export class AdminCurrencyService {
  constructor(
    @InjectModel(Currency)
    private readonly currencyModel: typeof Currency,
  ) {}

  async findAll(): Promise<Currency[]> {
    const currencies: Currency[] = await this.currencyModel.findAll();
    return currencies;
  }

  async add(data: Partial<Currency>): Promise<Currency> {
    try {
      return await this.currencyModel.create({
        name: data.name,
        code: data.code,
        symbol: data.symbol,
      });
    } catch (error) {
      throw new HttpException(MESSAGE.FAILED_CREATE_ITEM, HttpStatus.BAD_REQUEST);
    }
  }

  async update(data: Partial<Currency>): Promise<Currency> {
    const item = await this.currencyModel.findByPk(data.id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }
    const updatedItem = await item.update(data);
    return updatedItem;
  }

  async remove(id: number): Promise<void> {
    const item = await this.currencyModel.findByPk(id);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }
    await item.destroy();
  }
}
