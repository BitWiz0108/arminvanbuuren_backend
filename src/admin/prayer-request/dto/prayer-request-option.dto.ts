export class PrayerRequestListOption {
  readonly page: number;
  readonly limit: number;
}

export class PrayerRequestPayloadDto {
  authorId: number;
  title: string;
  content: string;
  isAnonymous: boolean;
}

export class PrayerRequestApprovePayloadDto {
  id: number;
  isApproved: boolean;
}