export class MusicOption {
  readonly page: number;
  readonly limit: number;
  readonly title: string;
  readonly releaseDate: string;
  readonly artistName: string;
  readonly searchKey: string;
}

export class MusicInputArg {
  id: number;
  userId: number;
  musicFile: string;
  musicFileCompressed: string;
  videoBackground: string;
  videoBackgroundCompressed: string;
  coverImage: string;
  isExclusive: boolean;
  albumIds: string;
  duration: number;
  title: string;
  musicGenreId: number;
  languageId: number;
  copyright: string;
  lyrics: string;
  description: string;
  releaseDate: string;
}