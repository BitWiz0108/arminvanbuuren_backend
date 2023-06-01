import { User } from "@common/database/models/user.entity";

export class AdminPrayerRequestsPaginatedDto {
  pages: number;
  prayerRequests: PrayerRequestDto[];
}

export class PrayerRequestDto {
  id: number;
  author: User;
  isAnonymous: boolean;
  isApproved: boolean;
  title: string;
  content: string;
  numberOfPrays: number;
  createdAt: Date;
}