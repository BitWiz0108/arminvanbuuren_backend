export const MESSAGE = {
  USER_NOT_FOUND: "User Not Found",
  PASSWORD_RESET_LINK_SENT : "Password reset link sent to email",
  INVALID_TOKEN: "Invalid token",
  PASSWORD_RESET_SUCCEEDED: "Password reset successfully",
  PASSWORD_RESET_ERROR: "Password Reset Failed",
  VERIFY_EMAIL_SUCCEEDED: "Email Verified Successfully",
  VERIFY_EMAIL_FAILED: "Email verification failed",
  USER_ALREADY_EXISTS: "User Already Exists",
  EMAIL_VERIFICATION_LINK_SENT: "Email verification link sent",
  EMAIL_VERIFICATION_LINK_RESENT: "Email verification link resent",
  EMAIL_VERIFICATION_ERROR: "Email verifiation failed",
  SEND_THANK_EMAIL_ERROR: "Failed while sending thanks email for subscription",
  NO_SUCH_DASHBOARD_DATE_RANGE: "No such date range type in dashboard statistics",
  DASHBOARD_DATE_RANGE_FORMAT_ERROR: "Date range format invalid",
  FAILED_TO_COMPRESS_MUSIC: "Failed to compress music file",
  FAILED_TO_COMPRESS_VIDEO: "Failed to compress video file",
  FAILED_TO_FETCH_TOS_DATA: "No TOS data",
  FAILED_UPLOAD_GALLERY: "Failed to Create an Gallery Image",
  FAILED_FETCH_GALLERY: "No such gallery image",
  FAILED_FETCH_HOME_DATA: "Home Data not found.",
  FAILED_FETCH_LOGIN_BACKGROUND_DATA: "Login background data not found.",
  RECEIVED_MESSAGE: "Successfully received your message",
  SEND_EMAIL_ERROR: "Failed to send connection request",
  FAILED_REMOVE_ITEM: "Failed to remove an item",
  FAILED_CREATE_ITEM: "Failed to create an item",
  FAILED_UPDATE_ITEM: "Failed to update an item",
  FAILED_LOAD_ITEM: "Failed to load an item",
  FAILED_ACCESS_ITEM: "You don't have permission to access",
  FAILED_LOAD_ARTIST_INFO: "Failed to load artist information",
  NOT_ALLOWED_MULTIPLE_DEFAULT_LANGUAGE: "There can't be 2+ default languages",
  NEED_PAYMENT_GATEWAY_INITIALIZE: "Need to initialize payment gateway",
  NEED_OAUTH_INITIALIZE: "Need to initialize oauth configuration",
}

export const PASSWORD_RESET_FORM = {
  SUBJECT: "Password Reset",
  FROM_NAME: "Lions & Legacy Support Team",
  FROM_EMAIL: "xian@lionsandlegacy.com",
}

export const EMAIL_VERIFY_FORM = {
  SUBJECT: "Email Verification",
  FROM_NAME: "Lions & Legacy Support Team",
  FROM_EMAIL: "xian@lionsandlegacy.com",
}

export const ASSET_STORAGE = {
  PUBLIC_DIR: "public",
  TEMP_DIR: "public/temp",
}

export const BUCKET_NAME = {
  MUSIC: "music",
  LIVESTREAM: "video",
  ALBUM: "album",
  AVATAR: "avatar",
  BANNER: "banner",
  POST: "poster",
  PLAN: "plan",
  LOGO: "logo",
  GALLERY: "gallery",
  HOME: "home",
  ABOUT: "about",
  LB: "loginbackground",
  CATEGORY: "category",
}

export enum PAYMENT_METHODS {
  PAYPAL = "PAYPAL",
  STRIPE = "STRIPE",
}

export enum PAYMENT_STATUS {
  SUCCEEDED = "SUCCEEDED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export enum TRANSACTION_TYPES {
  SUBSCRIPTION = "SUBSCRIPTION",
  DONATION = "DONATION",
}

export enum EMAIL_TEMPLATE_TYPE {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  THANK = "THANK",
  PASSWORD_RESET = "PASSWORD_RESET",
}

export enum DASHBOARD_DATE_RANGE {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export enum ASSET_TYPE {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  MUSIC = "MUSIC",
}

export enum BUCKET_ACL_TYPE {
  PRIVATE = "private",
  PUBLIC_READ = 'public-read',
}

export enum POST_FILE_TYPE {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

export enum BANNER_TYPE {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

export enum HOME_DATA_TYPE {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}