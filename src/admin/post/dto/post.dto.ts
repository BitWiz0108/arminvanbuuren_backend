import { Post } from "@models/post.entity";

export class AdminPostPaginatedDto {
  pages: number;
  posts: Post[];
}