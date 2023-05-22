import { LiveStreamComment } from "@common/database/models/live-stream-comment.entity";
import { User } from "@models/user.entity";

export class LiveStreamAllDto {
  livestreams: LiveStreamWithFavorite[];
  pages: number;
  size: number;
  hours: number;
}

export class LiveStreamWithFavorite {
  id: number;
  coverImage: string;
  previewVideo: string;
  previewVideoCompressed: string;
  fullVideo: string;
  fullVideoCompressed: string;
  title: string;
  lyrics: string;
  singer: User;
  creator: User;
  duration: number;
  shortDescription: string;
  description: string;
  releaseDate: Date;
  isExclusive: boolean;
  isFavorite: boolean;
}

export class LiveStreamCommentsPaginatedDto {
  pages: number;
  comments: LiveStreamComment[];
}