export class MusicOption {
  readonly userId: number;
  readonly page: number;
  readonly limit: number;
  readonly isExclusive: boolean;
}

export class MusicOptionForAlbum {
  albumId: number;
  userId: number;
  page: number;
  limit: number;
  isExclusive: boolean;
}