import { DASHBOARD_DATE_RANGE } from "@common/constants";

export class BestSellingInputDto {
  type: DASHBOARD_DATE_RANGE;
  from: string;
  to: string;
}