import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaymentGateway } from '@common/database/models/payment-gateway.entity';
import { MESSAGE } from '@common/constants';

@Injectable()
export class AdminPaymentGatewayService {
  constructor(
    @InjectModel(PaymentGateway)
    private readonly pgModel: typeof PaymentGateway,
    
  ) {}

  async update(
    data: Partial<PaymentGateway>,
  ): Promise<PaymentGateway> {
    const item = await this.pgModel.findByPk(1);
    if (!item) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
    }

    await item.update(data);
    const updatedItem = this.pgModel.findByPk(1);

    return updatedItem;
  }

  async getPaymentGateways(): Promise<PaymentGateway> {
    const cnt = this.pgModel.count();
    if (!cnt) {
      throw new HttpException(MESSAGE.NEED_PAYMENT_GATEWAY_INITIALIZE, HttpStatus.BAD_REQUEST);
    }

    const pg: PaymentGateway = await this.pgModel.findByPk(1);

    return pg;
  }
}
