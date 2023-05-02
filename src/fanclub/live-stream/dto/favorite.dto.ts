export class FavoriteLiveStreamDto {
  readonly userId: number;
  readonly livestreamId: number;
  readonly isFavorite: boolean;
}

export class FavoriteLiveStreamDoneDto {
  readonly msg: string;
  constructor(msg: string) {
    this.msg = msg;
  }
}