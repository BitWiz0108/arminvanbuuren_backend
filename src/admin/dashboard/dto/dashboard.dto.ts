import { DASHBOARD_DATE_RANGE } from "@common/constants";
import { LiveStream } from "@common/database/models/live-stream.entity";
import { Music } from "@common/database/models/music.entity";

export class DashboardDto {
  numberOfUsers: number;
  numberOfSubscribedUsers: number;
  numberOfSongs: number;
  numberOfLivestreams: number;
  numberOfAlbums: number;
  numberOfPlans: number;
  totalIncome: number;
  totalDonation: number;
  totalSubscription: number;
  mostFavoriteMusic: Music;
  mostFavoriteLivestream: LiveStream;
}

export class BestSellingDto {
  type: DASHBOARD_DATE_RANGE;
  sellingsPerDay: DailySubscriptionDto[];
  sellingsPerWeek: WeeklySubscriptionDto[];
  sellingsPerMonth: MonthlySubscriptionDto[];
}

export class DailySubscriptionDto {
  date: string;
  subscriptionCount: number;
}

export class WeeklySubscriptionDto {
  week: number;
  subscriptionCount: number;
}

export class MonthlySubscriptionDto {
  month: number;
  subscriptionCount: number;
}