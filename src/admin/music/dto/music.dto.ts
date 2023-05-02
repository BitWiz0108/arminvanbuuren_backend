import { Music } from "@models/music.entity";

export class AdminMusicDto {
  musics: Music[];
  pages: number;
}