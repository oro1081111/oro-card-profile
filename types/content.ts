export type SiteContent = {
  profile: Profile;
  theme: Theme;
  cards: ProfileCard[];
};

export type Profile = {
  displayNameZh: string;
  displayNameEn: string;
  headline: string;
  subheadline: string;
  shortBio: string;
  avatarUrl?: string;
  links: ProfileLink[];
};

export type ProfileLink = {
  label: string;
  type: "email" | "link" | "social";
  url: string;
};

export type Theme = {
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  accentColor: string;
  cardRadius: string;
  cardShadow: boolean;
  fontStyle: "modern" | "classic" | "playful";
};

export type ProfileCard = {
  id: string;
  order: number;
  visible: boolean;
  title: string;
  subtitle: string;
  imageUrl?: string;
  tags: string[];
  frontColor: string;
  backColor: string;
  accentColor: string;
  textColor: string;
  shortDescription: string;
  detail: string;
  buttons: CardButton[];
};

export type CardButton = {
  label: string;
  type: "modal" | "link";
  target: string;
};
