export class PostListOption {
  readonly page: number;
  readonly limit: number;
}

export class PostPayloadDto {
  authorId: number;
  title: string;
  types: string;
  content: string;
}

export class PostPartialDto {
  id: number;
  authorId: number;
  title: string;
  content: string;
  ids: string;
  types: string;
}