import { Category } from "@common/database/models/category.entity";
import { User } from "@common/database/models/user.entity";
import { LiveStream } from "@models/live-stream.entity";

export class AdminLiveStreamDto {
  pages: number;
  livestreams: LiveStreamWithCategoryIds[];
}

export class LiveStreamWithCategoryIds {
  id: number;
  coverImage: string;
  title: string;
  singer: User;
  creator: User;
  releaseDate: string;
  previewVideo: string;
  previewVideoCompressed: string;
  fullVideo: string;
  fullVideoCompressed: string;
  lyrics: string;
  description: string;
  duration: number;
  shortDescription: string;
  isExclusive: boolean;
  categoryIds: number[];
  categories: Category[];
}
