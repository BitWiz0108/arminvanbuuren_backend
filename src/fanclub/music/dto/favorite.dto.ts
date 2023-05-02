export class FavoriteMusicDto {
  readonly userId: number;
  readonly musicId: number;
  readonly isFavorite: boolean;
}

export class FavoriteMusicDoneDto {
  readonly msg: string;
  constructor(msg: string) {
    this.msg = msg;
  }
}