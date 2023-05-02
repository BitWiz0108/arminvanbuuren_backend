import { Transaction } from '@common/database/models/transaction.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Stripe from 'stripe';
import * as paypal from "@paypal/checkout-server-sdk";
import { PAYMENT_METHODS, PAYMENT_STATUS, TRANSACTION_TYPES } from '@common/constants';
import { Plan } from '@common/database/models/plan.entity';
import { Currency } from '@common/database/models/currency.entity';
import { User } from '@common/database/models/user.entity';
import * as moment from 'moment';

@Injectable()
export class FinanceService {
  private readonly stripe: Stripe;
  private readonly paypal: any;
  
  constructor(
    @InjectModel(Transaction)
    private readonly transModel: typeof Transaction,

    @InjectModel(Plan)
    private readonly planModel: typeof Plan,

    @InjectModel(Currency)
    private readonly currencyModel: typeof Currency,

    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15', // set your desired API version here
      appInfo: {
        name: 'YourAppName',
        version: '1.0.0',
      },
    });
    const paypalClient = new paypal.core.PayPalHttpClient(
      process.env.IS_PRODUCTION == '1' ? 
      new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
      :
      new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    );
    
    this.paypal = paypalClient;
  }

  async handleStripePayment(orderId: string): Promise<string> {
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
}
