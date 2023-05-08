import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminPaymentGatewayService } from './admin.payment-gateway.service';
import { AdminPaymentGatewayController } from './admin.payment-gateway.controller';
import { PaymentGateway } from '@common/database/models/payment-gateway.entity';

@Module({
  imports: [SequelizeModule.forFeature([ PaymentGateway ])],
  providers: [ AdminPaymentGatewayService ],
  controllers: [ AdminPaymentGatewayController ],
})
export class AdminPaymentGatewayModule {}
