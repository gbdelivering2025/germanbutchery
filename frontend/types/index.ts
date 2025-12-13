// Types for Strapi API responses

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width: number;
  height: number;
}

export interface UnitPrice {
  id: number;
  unitType: 'grams' | 'kilograms' | 'pieces' | 'packets';
  unitValue: number;
  price: number;
  currency: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  images?: StrapiImage[];
  category?: Category;
  isAvailable: boolean;
  pricing?: UnitPrice[];
  featured: boolean;
  sku?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  displayOrder: number;
  icon?: StrapiImage;
  image?: StrapiImage;
  description?: string;
  featured: boolean;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  id: number;
  documentId: string;
  name: string;
  isActive: boolean;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: 'Inter' | 'Roboto' | 'Open Sans' | 'Montserrat' | 'Poppins' | 'Lato';
  buttonStyle: 'rounded' | 'square' | 'pill';
  borderRadius: number;
  mode: 'light' | 'dark';
  logo?: StrapiImage;
  favicon?: StrapiImage;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppNumber {
  id: number;
  label: string;
  number: string;
  isPrimary: boolean;
}

export interface SocialLink {
  id: number;
  platform: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn' | 'YouTube';
  url: string;
}

export interface HomepageSection {
  id: number;
  sectionType: 'hero' | 'featuredProducts' | 'featuredCategories' | 'announcement' | 'aboutUs' | 'testimonials';
  title?: string;
  isEnabled: boolean;
  displayOrder: number;
}

export interface SiteSettings {
  id: number;
  documentId: string;
  businessName: string;
  businessDescription?: string;
  whatsappNumbers?: WhatsAppNumber[];
  email?: string;
  address?: string;
  announcement?: string;
  showAnnouncement: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  socialMediaLinks?: SocialLink[];
  currency: string;
  homepageSections?: HomepageSection[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  unitPrice: UnitPrice;
  quantity: number;
}
