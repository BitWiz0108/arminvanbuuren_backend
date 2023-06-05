import { LiveStream } from "@common/database/models/live-stream.entity";
import { User } from "@common/database/models/user.entity";

export class LiveStreamOption {
  readonly userId: number;
  readonly page: number;
  readonly limit: number;
  readonly isExclusive: boolean;
}

export class LiveStreamOptionForCategory {
  categoryId: number;
  userId: number;
  page: number;
  limit: number;
  isExclusive: boolean;
}

export class LiveStreamCommentOption {
  readonly id: number;
  readonly page: number;
  readonly limit: number;
}

export class CategoriesWithLiveStreams {
  id: number;
  name: string;
  creator: User;
  description: string;
  size: number;
  hours: number; // in seconds
  livestreams: LiveStream[]
}

export class LivestreamByTitle {
  userId: number;
  title: string;
  hasMemebership: boolean;
}