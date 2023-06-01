import { PostFile } from "@common/database/models/post-files.entity";
import { LiveStream } from "@models/live-stream.entity";
import { Music } from "@models/music.entity";
import { Reply } from "@models/reply.entity";
import { User } from "@models/user.entity";

export class FanclubArtistInfoDto {
    username: string;
    firstName: string;
    lastName: string;
    artistName: string;
    dob: string;
    email: string;
    website: string;
    numberOfFans: number;
    numberOfPosts: number;
    numberOfMusics: number;
    numberOfLivestreams: number;
    description: string;
    albumNames: string[];
    mobile: string;
    address: string;
    bannerType: string;
    avatarImage: string;
    bannerImage: string;
    bannerImageCompressed: string;
    logoImage: string;
    bannerVideo: string;
    bannerVideoCompressed: string;
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
    soundcloud: string;
    siteName: string;
    siteUrl: string;
    siteTitle: string;
    siteDescription: string;
    siteSocialPreviewImage: string;
}

export class FanclubHighlightsDto {
    livestreams: LiveStream[];
    musics: Music[];
}

export class PostOptionDto {
    userId: number;
    page: number;
    limit: number;
}

export class PostAllPaginatedDto {
    pages: number;
    posts: PostAllDto[];
}

export class PostAllDto {
    id: number;
    author: User;
    title: string;
    files: PostFile[];
    content: string;
    isFavorite: boolean;
    numberOfFavorites: number;
    createdAt: Date;
}

export class PostAllDtoWithReplies {
    id: number;
    author: User;
    title: string;
    files: PostFile[];
    content: string;
    isFavorite: boolean;
    numberOfFavorites: number;
    createdAt: Date;
    replies: ReplyDto[];
}

export class ReplyDto {
    id: number;
    replier: User;
    content: string;
    createdAt: Date;
}

export class ReplyPaginatedDto {
    pages: number;
    replies: Reply[];
}

export class ReplyOptionDto {
    postId: number;
    page: number;
    limit: number;
}

export class FavoritePostDto {
    userId: number;
    postId: number;
    isFavorite: boolean
}

export class FavoritePostDoneDto {
    readonly msg: string;
    constructor(msg: string) {
        this.msg = msg;
    }
}