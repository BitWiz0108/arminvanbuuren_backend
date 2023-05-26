import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BestSellingDto, DailySubscriptionDto, DashboardDto, MonthlySubscriptionDto, WeeklySubscriptionDto } from './dto/dashboard.dto';
import { User } from '@common/database/models/user.entity';
import { Music } from '@common/database/models/music.entity';
import { LiveStream } from '@common/database/models/live-stream.entity';
import { Album } from '@common/database/models/album.entity';
import { Plan } from '@common/database/models/plan.entity';
import { Transaction } from '@common/database/models/transaction.entity';
import { DASHBOARD_DATE_RANGE, PAYMENT_STATUS, TRANSACTION_TYPES } from '@common/constants';
import { MusicGenre } from '@common/database/models/music-genre.entity';
import { Language } from '@common/database/models/language.entity';
import { Op, Sequelize } from 'sequelize';
import { Favorite } from '@common/database/models/favorite.entity';
import { BestSellingInputDto } from './dto/dashboard-input.dto';
import { MESSAGE } from '@common/constants';
import * as moment from 'moment';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Music)
    private readonly musicModel: typeof Music,
    @InjectModel(LiveStream)
    private readonly livestreamModel: typeof LiveStream,
    @InjectModel(Album)
    private readonly albumModel: typeof Album,
    @InjectModel(Plan)
    private readonly planModel: typeof Plan,
    @InjectModel(Transaction)
    private readonly transactionModel: typeof Transaction,
  ) {}

  async getStatistics(): Promise<DashboardDto> {
    const numberOfUsers = await this.userModel.count({
      where: {
        status: true,
      }
    });

    // const subscribedUsers = await this.userModel.findAll({
    //   where: {
    //     status: true,
    //     planId: {
    //       [Op.not]: null,
    //     },
    //     planEndDate: {
    //       [Op.gt]: new Date(),
    //     },
    //   }
    // });

    const numberOfSubscribedUsers = await this.userModel.count({
      where: {
        status: true,
        planId: {
          [Op.not]: null,
        },
        planEndDate: {
          [Op.gt]: new Date(),
        },
      }
    });

    const numberOfSongs = await this.musicModel.count();

    const numberOfLivestreams = await this.livestreamModel.count();

    const numberOfAlbums = await this.albumModel.count();

    const numberOfPlans = await this.planModel.count();

    const totalTransactions = await this.transactionModel.findAll({
      where: {
        status: PAYMENT_STATUS.SUCCEEDED
      }
    });
    let totalIncome: number = 0;
    totalTransactions.map(transaction => {
      totalIncome += Number(transaction.amount);
    });

    const totalSubscriptionTransactions = await this.transactionModel.findAll({
      where: {
        type: TRANSACTION_TYPES.SUBSCRIPTION,
        status: PAYMENT_STATUS.SUCCEEDED
      }
    });
    let totalSubscription: number = 0;
    totalSubscriptionTransactions.map(transaction => {
      totalSubscription += Number(transaction.amount);
    });

    const totalDonationTransactions = await this.transactionModel.findAll({
      where: {
        status: PAYMENT_STATUS.SUCCEEDED,
        type: TRANSACTION_TYPES.DONATION
      }
    });
    let totalDonation: number = 0;
    totalDonationTransactions.map(transaction => {
      totalDonation += Number(transaction.amount);
    });

    /// get most favorite music ///
    const allMusics = await this.musicModel.findAll({
      include: [
        { model: Album, as: 'album' },
        { model: MusicGenre, as: 'musicGenre' },
        { model: User, as: 'singer' },
        { model: Language, as: 'language' },
        { model: Favorite, as: 'favorites' },
      ]
    });

    const sortedMusics = allMusics.sort((a: Music, b: Music) => {
      if (a.likedBy <= b.likedBy) {
        return b.likedBy - a.likedBy;
      } else {
        const aDate = new Date(a.releaseDate);
        const bDate = new Date(b.releaseDate);
        return bDate.getTime() - aDate.getTime();
      }
    });

    /// End - get most favorite music ///

    /// get most favorite livestreams ///
    const allLivestreams = await this.livestreamModel.findAll({
      include: [
        { model: User, as: 'singer' },
        { model: User, as: 'creator' },
        { model: Favorite, as: 'favorites' },
      ]
    });

    const sortedLivestreams = allLivestreams.sort((a: LiveStream, b: LiveStream) => {
      if (a.likedBy <= b.likedBy) {
        return b.likedBy - a.likedBy;
      } else {
        const aDate = new Date(a.releaseDate);
        const bDate = new Date(b.releaseDate);
        return bDate.getTime() - aDate.getTime();
      }
    });

    /// End - get most favorite livestreams ///
    
    const data: DashboardDto = {
      numberOfUsers,
      numberOfSubscribedUsers,
      numberOfSongs,
      numberOfLivestreams,
      numberOfAlbums,
      numberOfPlans,
      totalIncome,
      totalDonation,
      totalSubscription,
      mostFavoriteMusic: sortedMusics ? sortedMusics[0] : null,
      mostFavoriteLivestream: sortedLivestreams ? sortedLivestreams[0] : null,
    };

    return data;
  }

  async getBestSelling(payload: BestSellingInputDto): Promise<BestSellingDto> {
    let data: BestSellingDto = {
      type: payload.type,
      sellingsPerDay: [],
      sellingsPerWeek: [],
      sellingsPerMonth: [],
    };
    let whereClause = {
      createdAt: {
        [Op.gte]: payload.from ? payload.from : moment().format('YYYY-MM-DD'),
        [Op.lt]: payload.to ? moment(payload.to).add(1, 'days').format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD'),
      },
      type: TRANSACTION_TYPES.SUBSCRIPTION,
      status: PAYMENT_STATUS.SUCCEEDED,
    };
  
    try {
      if (payload.type === DASHBOARD_DATE_RANGE.DAILY) {
        const startDate = moment(payload.from);
        const endDate = moment(payload.to);
        const dates = [];
        while (startDate <= endDate) {
          dates.push(startDate.format('YYYY-MM-DD'));
          startDate.add(1, 'days');
        }
        const transactions = await this.transactionModel.findAll({
          where: whereClause,
          attributes: [
            'createdAt',
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'subscriptionCount'],
          ],
          group: ['createdAt'],
        });
        data.sellingsPerDay = dates.map((date) => {
          
          const transaction = transactions.find(
            (transaction) => moment(transaction.getDataValue('createdAt')).format('YYYY-MM-DD') === date
          );
          return {
            date,
            subscriptionCount: transaction ? transaction.getDataValue('subscriptionCount') : 0,
          };
        });
      } else if (payload.type === DASHBOARD_DATE_RANGE.WEEKLY) {
        const startDate = moment(payload.from);
        const endDate = moment();
        const weeks = [];
        while (true) {
          const weekOfYearForEndDate = endDate.format("w");
          const weekOfYear = startDate.format("w");
          if (parseInt(weekOfYear) > parseInt(weekOfYearForEndDate)) break;
          weeks.push(`${weekOfYear}`);
          startDate.add(1, "weeks");
        }
        const transactions = await this.transactionModel.findAll({
          where: whereClause,
          attributes: [
            [
              Sequelize.fn(
                "LPAD",
                Sequelize.fn("WEEK", Sequelize.col("created_at")),
                2,
                "0"
              ),
              "week",
            ],
            [Sequelize.fn("COUNT", Sequelize.col("id")), "subscriptionCount"],
          ],
          group: ["week"],
        });
        let weekNumber: number = 1;
        data.sellingsPerWeek = weeks.map((week) => {
          const transaction = transactions.find(
            (transaction) => transaction.getDataValue("week") === week
          );
          return {
            // week: parseInt(week),
            week: weekNumber ++,
            subscriptionCount: transaction ? transaction.getDataValue("subscriptionCount") : 0,
          };
        });
      } else if (payload.type === DASHBOARD_DATE_RANGE.MONTHLY) {
        const startDate = moment(payload.from);
        const endDate = moment();
        const months = [];
        while (true) {
          const monthOfYearForEndDate = endDate.format("MM");
          const monthOfYear = startDate.format("MM");
          if (parseInt(monthOfYear) > parseInt(monthOfYearForEndDate)) break;
          months.push(`${monthOfYear}`);
          startDate.add(1, "months");
        }
        const transactions = await this.transactionModel.findAll({
          where: whereClause,
          attributes: [
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%m'), 'month'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'subscriptionCount'],
          ],
          group: ['month'],
        });
        let monthNumber: number = 1;
        data.sellingsPerMonth = months.map((month) => {
          const transaction = transactions.find(
            (transaction) => transaction.getDataValue("month") === month
          );
          return {
            month: monthNumber ++,
            subscriptionCount: transaction ? transaction.getDataValue("subscriptionCount") : 0,
          };
        });
      } else {
        throw new HttpException(
          MESSAGE.NO_SUCH_DASHBOARD_DATE_RANGE,
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (e) {
      throw new HttpException(
        MESSAGE.DASHBOARD_DATE_RANGE_FORMAT_ERROR,
        HttpStatus.BAD_REQUEST
      );
    }
    return data;
  }

}
