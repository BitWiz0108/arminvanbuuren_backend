import { LiveStream } from "@models/live-stream.entity";

export class AdminLiveStreamDto {
  pages: number;
  livestreams: LiveStream[];
}