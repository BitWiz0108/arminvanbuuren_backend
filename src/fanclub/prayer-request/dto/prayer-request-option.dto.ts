export class PrayerRequestListOption {
  readonly userId: number;
  readonly page: number;
  readonly limit: number;
}

export class PrayerRequestPayloadDto {
  authorId: number;
  title: string;
  content: string;
  isAnonymous: boolean;
}

export class PrayerReplyOptionDto {
  prayerRequestId: number;
  page: number;
  limit: number;
}

export class PrayerDto {
  userId: boolean;
  prayerRequestId: boolean;
  isPraying: boolean;
}