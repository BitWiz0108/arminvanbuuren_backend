import { User } from "@common/database/models/user.entity";

export class AdminUsersPaginatedDto {
  pages: number;
  users: User[];
}