export class AdminArtistInfoDto {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  artistName: string;
  dob: string;
  email: string;
  website: string;
  description: string;
  address: string;
  bannerType: string;
  bannerImage: string;
  bannerImageCompressed: string;
  bannerVideo: string;
  bannerVideoCompressed: string;
  avatarImage: string;
  logoImage: string;
  mobile: string;
  country: string;
  state: string;
  city: string;
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  soundcloud: string;
  siteName: string;
  siteUrl: string;
  siteTitle: string;
  siteDescription: string;
  siteSocialPreviewImage: string;
  subscriptionDescription: string;
}

export class SubscriptionDto {
  artistId: number;
  content: string;
}