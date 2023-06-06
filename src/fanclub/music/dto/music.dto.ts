import { User } from "@models/user.entity";

export class MusicAllDto {
  musics: MusicWithFavorite[];
  pages: number;
}

export class MusicWithFavorite {
  id: number;
  coverImage: string;
  musicFile: string;
  musicFileCompressed: string;
  title: string;
  duration: number;
  lyrics: string;
  description: string;
  isExclusive: boolean;
  isFavorite: boolean;
  singer: User;
  releaseDate: string;
}

export class AlbumsWithMusics {
  id: number;
  name: string;
  creator: User;
  description: string;
  copyright: string;
  size: number;
  hours: number; // in seconds
  musics: MusicWithFavorite[]
}