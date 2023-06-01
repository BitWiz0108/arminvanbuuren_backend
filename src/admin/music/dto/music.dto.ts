import { Album } from "@common/database/models/album.entity";
import { Language } from "@common/database/models/language.entity";
import { MusicGenre } from "@common/database/models/music-genre.entity";
import { User } from "@common/database/models/user.entity";
import { Music } from "@models/music.entity";

export class AdminMusicDto {
  musics: MusicWithAlbumIds[];
  pages: number;
}

export class MusicWithAlbumIds {
  id: number;
  singer: User;
  coverImage: string;
  musicFile: string;
  musicFileCompressed: string;
  isExclusive: boolean;
  albums: Album[];
  albumIds: number[];
  duration: number;
  title: string;
  musicGenre: MusicGenre;
  language: Language;
  languageId: number;
  copyright: string;
  lyrics: string;
  description: string;
  releaseDate: string;
  createdAt: Date;
}