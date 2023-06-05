import { Transaction } from '@common/database/models/transaction.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Stripe from 'stripe';
import * as paypal from "@paypal/checkout-server-sdk";
import { MESSAGE, PAYMENT_METHODS, PAYMENT_STATUS, PRODUCTION_MODE, TRANSACTION_TYPES } from '@common/constants';
import { Plan } from '@common/database/models/plan.entity';
import { Currency } from '@common/database/models/currency.entity';
import { User } from '@common/database/models/user.entity';
import * as moment from 'moment';
import { PaymentGateway } from '@common/database/models/payment-gateway.entity';
import { CreatePaymentDto, PaymentGatewayDto } from './dto/payment-gateway.dto';

@Injectable()
export class FinanceService {
  private stripe: Stripe;
  private paypal: any;
  
  constructor(
    @InjectModel(Transaction)
    private readonly transModel: typeof Transaction,

    @InjectModel(Plan)
    private readonly planModel: typeof Plan,

    @InjectModel(Currency)
    private readonly currencyModel: typeof Currency,

    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(PaymentGateway)
    private readonly pgModel: typeof PaymentGateway,
  ) {}

  async handleStripePayment(orderId: string): Promise<string> {
    const pg = await this.pgModel.findOne();

    this.stripe = new Stripe(pg.stripeSecretKey, {
      apiVersion: '2022-11-15', // set your desired API version here
      appInfo: {
        name: 'YourAppName',
        version: '1.0.0',
      },
    });

    const paymentIntent = await this.stripe.paymentIntents.retrieve(orderId);

    if (paymentIntent.status === 'succeeded') {
      return PAYMENT_STATUS.SUCCEEDED;
    } else if (paymentIntent.status === 'requires_payment_method') {
      return 'requires_payment_method';
    } else {
      return PAYMENT_STATUS.FAILED;
    }
  }

  async handlePayPalPayment(orderId: string): Promise<string> {
    const pg = await this.pgModel.findOne();

    const paypalClient = new paypal.core.PayPalHttpClient(
      new paypal.core.LiveEnvironment(pg.paypalClientId, pg.paypalClientSecret)
    );
    
    this.paypal = paypalClient;

    const request = new paypal.orders.OrdersGetRequest(orderId);
    try {
      const response = await this.paypal.execute(request);
      if (response.result.status === 'COMPLETED') {
        return PAYMENT_STATUS.SUCCEEDED;
      } else if (response.result.status === 'CREATED' || response.result.status === 'SAVED') {
        return PAYMENT_STATUS.PENDING;
      } else {
        return PAYMENT_STATUS.FAILED;
      }
    } catch (error) {
      throw new HttpException('Error getting PayPal payment status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllPlans(): Promise<Plan[]> {
    const plans = await this.planModel.findAll({
      include: [
        { model: Currency, as: 'currency'}
      ]
    });

    return plans;
  }

  async getAllCurrencies(): Promise<Currency[]> {
    const currencies = await this.currencyModel.findAll();
    return currencies;
  }

  async transact(data: Partial<Transaction>, req: any): Promise<Transaction> {
    let status: string;

    if (data.provider === PAYMENT_METHODS.STRIPE) {
      status = await this.handleStripePayment(data.orderId);
    } else if (data.provider === PAYMENT_METHODS.PAYPAL) {
      status = await this.handlePayPalPayment(data.orderId);
    } else {
      throw new HttpException('Invalid payment provider', HttpStatus.BAD_REQUEST);
    }

    const transaction = await this.transModel.create({
      userId: data.userId,
      amount: data.amount,
      orderId: data.orderId,
      provider: data.provider,
      type: data.type,
      livestreamId: data.livestreamId,
      musicId: data.musicId,
      currencyId: data.currencyId,
      planId: data.planId,
      status: status
    });

    /// update user info about subscribed plan ///
    if (data.type == TRANSACTION_TYPES.SUBSCRIPTION) {
      const user = await this.userModel.findByPk(req.user.id, {
        include: [
          { model: Plan, as: 'plan'}
        ]
      });

      const plan = await this.planModel.findByPk(data.planId);

      let updatedUserInfo: any = {};

      const today = moment();
      updatedUserInfo.planId = data.planId;
      updatedUserInfo.planStartDate = today.format("YYYY-MM-DD");
      updatedUserInfo.planEndDate =  today.add(plan.duration, "days").format("YYYY-MM-DD");
      await user.update(updatedUserInfo);
    }
    /// end - update user info about subscribed plan ///

    return transaction;
  }

  async getPaymentGateways(): Promise<PaymentGatewayDto> {
    const cnt = this.pgModel.count();
    if (!cnt) {
      throw new HttpException(MESSAGE.NEED_PAYMENT_GATEWAY_INITIALIZE, HttpStatus.BAD_REQUEST);
    }

    const pg: PaymentGateway = await this.pgModel.findByPk(1);

    const data: PaymentGatewayDto = {
      paypalClientId: pg.paypalClientId,
      stripePublicApiKey: pg.stripePublicApiKey,
    };

    return data;
  }

  async createPayment(data: CreatePaymentDto): Promise<any> {
    const cnt = this.pgModel.count();
    if (!cnt) {
      throw new HttpException(MESSAGE.NEED_PAYMENT_GATEWAY_INITIALIZE, HttpStatus.BAD_REQUEST);
    }

    const pg: PaymentGateway = await this.pgModel.findByPk(1);
    
    if (data.provider == PAYMENT_METHODS.PAYPAL) {
      try {
        // Create a PayPal client with your sandbox or live credentials
        const paypalClient = new paypal.core.PayPalHttpClient(
          PRODUCTION_MODE
            ? new paypal.core.LiveEnvironment(
                pg.paypalClientId,
                pg.paypalClientSecret
              )
            : new paypal.core.SandboxEnvironment(
                pg.paypalClientId,
                pg.paypalClientSecret
              )
        );

        // Create a new PayPal order with the given amount and currency
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: data.currency,
                value: data.amount,
              },
            },
          ],
        });
        const response = await paypalClient.execute(request);
        const orderID = response.result.id;

        return new Promise((resolve, reject) => {
          resolve({ sessionId: orderID });
        })
      } catch (error) {
        console.error(error);
        throw new HttpException(MESSAGE.FAILED_PROCEED_API, HttpStatus.BAD_REQUEST);
      }
    }
    if (data.provider == PAYMENT_METHODS.STRIPE) {
      const stripe = new Stripe(pg.stripeSecretKey, { apiVersion: "2022-11-15" });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(data.amount) * 100,
        currency: data.currency,
      });

      return new Promise((resolve, reject) => {
        resolve({ sessionId: paymentIntent.client_secret });
      });
    }
  }
}
