import { Transaction } from "@common/database/models/transaction.entity";

export class AdminTransactionPaginatedDto {
  pages: number;
  transactions: Transaction[];
}