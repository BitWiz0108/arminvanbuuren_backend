export class AdminLiveStreamOption {
  readonly page: number;
  readonly limit: number;
  readonly title: string;
  readonly releaseDate: string;
  readonly artistName: string;
  readonly searchKey: string;
}

export class LiveStreamInputArg {
  id: number;
  coverImage: string;
  fullVideo: string;
  fullVideoCompressed: string;
  previewVideo: string;
  previewVideoCompressed: string;
  title: string;
  singerId: string;
  creatorId: number;
  categoryIds: string;
  releaseDate: string;
  lyrics: string;
  description: string;
  duration: number;
  shortDescription: string;
  isExclusive: boolean;
}