import { User } from "@common/database/models/user.entity";
import { Post } from "@models/post.entity";

export class AdminPostPaginatedDto {
  pages: number;
  posts: Post[];
}

// export class PostWithTypes {
//   id: number;
//   author: User;
//   title: string;
//   types: string[];
//   files: [
//     file: string,
//     fileCompressed: string,
//   ];
//   content: string;
//   createdAt: string;
// }