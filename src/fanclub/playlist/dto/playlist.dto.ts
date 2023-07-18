import { Music } from "@common/database/models/music.entity";
import { User } from "@common/database/models/user.entity";

export class AddMusicToPlaylistInputArg {
  playlistIds: string;
  musicId: number;
  userId: number;
}

export class PlaylistDto {
	id: number;
	name: string;
	musicIds: number[];
	musics: Music[];
	creator: User;
}