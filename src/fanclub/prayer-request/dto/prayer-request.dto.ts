import { PrayerReply } from "@common/database/models/prayer-reply.entity";
import { User } from "@common/database/models/user.entity";

export class PrayerRequestsPaginatedDto {
  pages: number;
  prayerRequests: PrayerRequestDto[];
}

export class PrayerRequestDto {
  id: number;
  author: User;
  isAnonymous: boolean;
  title: string;
  content: string;
  numberOfPrays: number;
  isPraying: boolean;
  createdAt: Date;
}

export class PrayerRequestWithRepliesDto {
  id: number;
  author: User;
  isAnonymous: boolean;
  title: string;
  content: string;
  numberOfPrays: number;
  createdAt: Date;
  replies: PrayerReply[];
}

export class PrayerReplyPaginatedDto {
  pages: number;
  replies: PrayerReply[];
}

export class PrayDoneDto {
  readonly msg: string;
  constructor(msg: string) {
      this.msg = msg;
  }
}