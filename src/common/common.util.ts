import { BUCKET_NAME } from "./constants";

export class AWSBucketNameOptimizer {
  private awsOptimizedBucketPath: string;

  constructor (
    private readonly bucketType: string,
  ) {
    const currentDate = new Date(); // current date and time

    const month = currentDate.getMonth() + 1; // add 1 since getMonth() returns a zero-based index
    const year = currentDate.getFullYear();

    const monthStr = month.toString().padStart(2, '0'); // ensure two-digit format, e.g. "01" for January
    const yearStr = year.toString();

    if (bucketType == BUCKET_NAME.MUSIC) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_MUSIC_PATH;
    } else if (bucketType == BUCKET_NAME.LIVESTREAM) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_LIVE_STREAM_PATH;
    } else if (bucketType == BUCKET_NAME.ALBUM) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_ALBUM_PATH;
    } else if (bucketType == BUCKET_NAME.AVATAR) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_AVATAR_PATH;
    } else if (bucketType == BUCKET_NAME.BANNER) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_BANNER_PATH;
    } else if (bucketType == BUCKET_NAME.POST) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_POST_PATH;
    } else if (bucketType == BUCKET_NAME.PLAN) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_PLAN_PATH;
    } else if (bucketType == BUCKET_NAME.LOGO) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_LOGO_PATH;
    } else if (bucketType == BUCKET_NAME.GALLERY) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_GALLERY_PATH;
    } else if (bucketType == BUCKET_NAME.HOME) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_HOME_PATH;
    } else if (bucketType == BUCKET_NAME.ABOUT) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_ABOUT_PATH;
    } else if (bucketType == BUCKET_NAME.LB) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_LB_PATH;
    } else if (bucketType == BUCKET_NAME.CATEGORY) {
      this.awsOptimizedBucketPath = process.env.AWS_S3_CATEGORY_PATH;
    }
    this.awsOptimizedBucketPath += `${yearStr}/${monthStr}`;
  }

  getAwsOptimizedBucketPath() {
    return this.awsOptimizedBucketPath;
  }
}