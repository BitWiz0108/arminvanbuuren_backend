import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FanclubArtistInfoDto, FanclubHighlightsDto, FavoritePostDoneDto, FavoritePostDto, PostAllDto, PostAllDtoWithReplies, PostAllPaginatedDto, PostOptionDto, ReplyOptionDto, ReplyPaginatedDto } from './dto/fanclub.dto';
import { User } from '@models/user.entity';
import { ArtistGenre } from '@common/database/models/artist-genre.entity';
import { Album } from '@models/album.entity';
import { ROLES } from '@common-modules/auth/role.enum';
import { Music } from '@models/music.entity';
import { LiveStream } from '@models/live-stream.entity';
import { Post } from '@models/post.entity';
import { Reply } from '@models/reply.entity';
import { PostLike } from '@models/post-like.entity';

@Injectable()
export class FanclubService {
  
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    
    @InjectModel(LiveStream)
    private readonly livestreamModel: typeof LiveStream,
    
    @InjectModel(Music)
    private readonly musicModel: typeof Music,
    
    @InjectModel(Post)
    private readonly postModel: typeof Post,
    
    @InjectModel(Reply)
    private readonly replyModel: typeof Reply,

    @InjectModel(PostLike)
    private readonly favoritePostModel: typeof PostLike,
  ) {}

  async getArtistInfo(): Promise<FanclubArtistInfoDto> {
    const numberOfFans = (await this.userModel.findAll({
      where: {
        role_id: ROLES.FAN
      }
    })).length;

    const artist = await this.userModel.findByPk(1, {
      include: [
        { model: ArtistGenre, as: 'genre' },
        { model: Album, as: 'albums' },
        { model: Music, as: 'musics' },
        { model: Post, as: 'posts' },
        { model: LiveStream, as: 'livestreams' },
      ]
    });

    let albumNames : string[] = [];
    artist.albums.forEach(album => {
      albumNames.push(album.name);
    });

    const data: FanclubArtistInfoDto = {
      username: artist.username,
      firstName: artist.firstName,
      lastName: artist.lastName,
      artistName: artist.artistName,
      dob: artist.dob,
      email: artist.email,
      website: artist.website,
      numberOfFans: numberOfFans,
      numberOfPosts: artist.posts.length,
      numberOfMusics: artist.musics.length,
      numberOfLivestreams: artist.livestreams.length,
      description: artist.description,
      albumNames: albumNames,
      mobile: artist.mobile,
      address: artist.address,
      avatarImage: artist.avatarImage,
      logoImage: artist.logoImage,
      bannerType: artist.bannerType,
      bannerImage: artist.bannerImage,
      bannerImageCompressed: artist.bannerImageCompressed,
      bannerVideo: artist.bannerVideo,
      bannerVideoCompressed: artist.bannerVideoCompressed,
      facebook: artist.facebook,
      instagram: artist.instagram,
      youtube: artist.youtube,
      twitter: artist.twitter,
      soundcloud: artist.soundcloud,
      siteName: artist.siteName,
      siteUrl: artist.siteUrl,
      siteTitle: artist.siteTitle,
      siteDescription: artist.siteDescription,
      siteSocialPreviewImage: artist.siteSocialPreviewImage,
    }

    return data;
  }

  async findAllPosts(op: PostOptionDto) : Promise<PostAllPaginatedDto> {
    const items = await this.postModel.findAll({ 
      offset: (op.page - 1) * op.limit,
      limit: op.limit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Reply, as: 'replies', include: [{ model: User, as: 'replier' }] },
        { model: User, as: 'author' },
        { model: PostLike, as: 'likes' },
      ]
    });
    
    const promises = items.map(async item => {
      const someoneLikeIt = await this.favoritePostModel.findOne({
        where: {
          postId: item.id,
          userId: op.userId
        }
      });

      const post : PostAllDto = {
        id: item.id,
        title: item.title,
        type: item.type,
        image: item.image,
        imageCompressed: item.imageCompressed,
        video: item.video,
        videoCompressed: item.videoCompressed,
        content: item.content,
        createdAt: item.createdAt,
        isFavorite: someoneLikeIt ? true : false,
        author: item.author,
        numberOfFavorites: item.likedBy,
      };
      
      return post;
    });

    const totalPosts = await this.postModel.count();
    const pages = Math.ceil(totalPosts / op.limit);
    const posts = await Promise.all(promises);
    const data = {
      pages: pages,
      posts: posts,
    }
    return data;
  }

  async getPostDetailed(data) : Promise<PostAllDtoWithReplies> {
    try {
      const post = await this.postModel.findByPk(data.id, {
        include: [
          { model: Reply, as: 'replies', include: [{ model: User, as: 'replier' }] },
          { model: User, as: 'author' },
          { model: PostLike, as: 'likes' },
        ]
      });
  
      const someoneLikeIt = await this.favoritePostModel.findOne({
        where: {
          postId: data.id,
          userId: data.userId
        }
      });

      const postWithReplies : PostAllDtoWithReplies = {
        id: post.id,
        title: post.title,
        type: post.type,
        image: post.image,
        imageCompressed: post.imageCompressed,
        video: post.video,
        videoCompressed: post.videoCompressed,
        content: post.content,
        createdAt: post.createdAt,
        author: post.author,
        isFavorite: someoneLikeIt ? true : false,
        numberOfFavorites: post.likedBy,
        replies: post.replies
      };
  
      return postWithReplies;
    } catch (error) {
      throw new HttpException("Failed to get a post", HttpStatus.BAD_REQUEST);
    }
  }

  async addReply(data: Partial<Reply>) : Promise<Reply>{
    const newReply = await this.replyModel.create({
      replierId: data.replierId,
      postId: data.postId,
      content: data.content
    });

    const newItem = await this.replyModel.findByPk(newReply.id, {
      include: [
        { model: User, as: "replier"}
      ]
    })

    return newItem;
  }

  async findAllReplies(op: ReplyOptionDto) : Promise<ReplyPaginatedDto> {
    const replies = await this.replyModel.findAll({ 
      offset: (op.page - 1) * op.limit, 
      limit: op.limit,
      where: {
        postId: op.postId,
      },
      include: [
        { model: User, as: 'replier' },
      ],
      order: [['createdAt', 'DESC']]
    });

    const totalReplies = await this.replyModel.count({
      where: {
        postId: op.postId
      }
    });

    const data : ReplyPaginatedDto = {
      pages: Math.ceil(totalReplies / op.limit),
      replies: replies
    };

    return data;
  }

  async favorite(data: FavoritePostDto) : Promise<any> {
    if (data.isFavorite) {
      const item = await this.favoritePostModel.findOne({
        where: {
          userId: data.userId,
          postId: data.postId
        }
      });
      if (item) {
        throw new Error(`You already like this.`);
      } else {
        return await this.favoritePostModel.create({
          userId: data.userId,
          postId: data.postId
        });
      }
    } else {
      const item = await this.favoritePostModel.findOne({
        where: {
          userId: data.userId,
          postId: data.postId
        }
      });

      if (!item) {
        throw new Error(`Not found the Post you would dislike`);
      }

      await item.destroy();
      return new Promise((resolve, reject) => {
        resolve(new FavoritePostDoneDto("success"))
      });
    }
  }
}
