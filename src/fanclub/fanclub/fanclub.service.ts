import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FanclubArtistInfoDto, FanclubHighlightsDto, FavoritePostDoneDto, FavoritePostDto, PostAllDto, PostAllDtoWithReplies, PostAllPaginatedDto, PostByTitle, PostOptionDto, ReplyOptionDto, ReplyPaginatedDto } from './dto/fanclub.dto';
import { User } from '@models/user.entity';
import { Album } from '@models/album.entity';
import { ROLES } from '@common-modules/auth/role.enum';
import { Music } from '@models/music.entity';
import { LiveStream } from '@models/live-stream.entity';
import { Post } from '@models/post.entity';
import { Reply } from '@models/reply.entity';
import { PostLike } from '@models/post-like.entity';
import { PostFile } from '@common/database/models/post-files.entity';
import { Op } from 'sequelize';
import { MESSAGE } from '@common/constants';

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
    const numberOfFans = await this.userModel.count({
      where: {
        role_id: ROLES.FAN
      }
    });

    const artist = await this.userModel.findOne({
      where: {
        roleId: ROLES.ADMIN,
      },
      include: [
        { model: Album, as: 'albums' },
      ]
    });

    const numberOfPosts = await this.postModel.count({
      where: {
        authorId: artist.id
      }
    });

    const numberOfMusics = await this.musicModel.count({
      where: {
        userId: artist.id,
      }
    });

    const numberOfLivestreams = await this.livestreamModel.count({
      where: {
        singerId: artist.id,
      }
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
      numberOfPosts: numberOfPosts,
      numberOfMusics: numberOfMusics,
      numberOfLivestreams: numberOfLivestreams,
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
      subscriptionDescription: artist.subscriptionDescription,
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
        { model: PostFile, as: 'files' },
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
        files: item.files,
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
          { model: PostFile, as: 'files' },
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
        files: post.files,
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

  async getPostByTitle(data: PostByTitle): Promise<PostAllDtoWithReplies[]> {
    let posts: PostAllDtoWithReplies[] = [];

    try {
      const post = await this.postModel.findOne({
        where: {
          title: {
            [Op.like]: `%${data.title}%`
          },
        },
        include: [
          { model: Reply, as: 'replies', include: [{ model: User, as: 'replier' }] },
          { model: User, as: 'author' },
          { model: PostLike, as: 'likes' },
          { model: PostFile, as: 'files' },
        ]
      });
  
      const someoneLikeIt = await this.favoritePostModel.count({
        where: {
          postId: post.id,
          userId: data.userId
        }
      });

      const currentPost : PostAllDtoWithReplies = {
        id: post.id,
        title: post.title,
        files: post.files,
        content: post.content,
        createdAt: post.createdAt,
        author: post.author,
        isFavorite: someoneLikeIt > 0,
        numberOfFavorites: post.likedBy,
        replies: post.replies
      };
  
      const allPosts = await this.postModel.findAll({
        include: [
          { model: Reply, as: 'replies', include: [{ model: User, as: 'replier' }] },
          { model: User, as: 'author' },
          { model: PostLike, as: 'likes' },
          { model: PostFile, as: 'files' },
        ],
        order: [['createdAt', 'DESC']],
      });

      const promises = allPosts.map(async item => {
        const someoneLikeIt = await this.favoritePostModel.count({
          where: {
            postId: item.id,
            userId: data.userId
          }
        });
  
        const postWithReply : PostAllDtoWithReplies = {
          id: item.id,
          title: item.title,
          files: item.files,
          content: item.content,
          createdAt: item.createdAt,
          author: item.author,
          isFavorite: someoneLikeIt > 0,
          numberOfFavorites: item.likedBy,
          replies: item.replies
        };

        return postWithReply;
      });
  
      const allPostsWithReplies = await Promise.all(promises);

      const totalListSize = await this.postModel.count();

      const currentIndex = allPostsWithReplies.findIndex(post => post.id === currentPost.id);

      let prevPost: any = null;
      let nextPost: any = null;

      if (totalListSize >= 3) {
        nextPost = allPostsWithReplies[(currentIndex + 1) % totalListSize];
        prevPost = allPostsWithReplies[(currentIndex - 1 + totalListSize) % totalListSize];
      } else {
        if (currentIndex > 0) prevPost = allPostsWithReplies[currentIndex - 1];
        if (currentIndex < totalListSize - 1) nextPost = allPostsWithReplies[currentIndex + 1];
      }

      posts.push(prevPost);
      posts.push(currentPost);
      posts.push(nextPost);

      return posts;
    } catch (error) {
      throw new HttpException(MESSAGE.FAILED_LOAD_ITEM, HttpStatus.BAD_REQUEST);
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
