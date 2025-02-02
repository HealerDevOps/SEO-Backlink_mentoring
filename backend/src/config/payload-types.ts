/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  collections: {
    users: User;
    media: Media;
    CredentialsForMarketplaces: CredentialsForMarketplace;
    backlinks: Backlink;
    domainsForBackgroundProcess: DomainsForBackgroundProcess;
    'paypal-plans': PaypalPlan;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    CredentialsForMarketplaces: CredentialsForMarketplacesSelect<false> | CredentialsForMarketplacesSelect<true>;
    backlinks: BacklinksSelect<false> | BacklinksSelect<true>;
    domainsForBackgroundProcess: DomainsForBackgroundProcessSelect<false> | DomainsForBackgroundProcessSelect<true>;
    'paypal-plans': PaypalPlansSelect<false> | PaypalPlansSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {
    'site-settings': SiteSetting;
  };
  globalsSelect: {
    'site-settings': SiteSettingsSelect<false> | SiteSettingsSelect<true>;
  };
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  role: 'admin' | 'user';
  username?: string | null;
  profilePicture?: (string | null) | Media;
  authProvider?: string | null;
  planId?: string | null;
  subscriptionId?: string | null;
  planName?: string | null;
  features?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  projects?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  altText?: string | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "CredentialsForMarketplaces".
 */
export interface CredentialsForMarketplace {
  id: string;
  email: string;
  password: string;
  secretKey?: string | null;
  websiteTarget: {
    value?:
      | (
          | 'DataForSeo'
          | 'PaperClub'
          | 'Ereferer'
          | 'Link.Builders'
          | 'Prensalink'
          | 'Seojungle'
          | 'Mistergoodlink'
          | 'Boosterlink'
          | 'Linkavista'
          | 'Getalink'
          | 'Develink'
          | 'Linkatomic'
          | 'Unancor'
          | 'Publisuites'
          | 'Backlinked'
          | 'Motherlink'
          | 'Presswhizz'
          | 'Whitepress'
          | 'Conexoo'
          | 'Linkbroker'
          | 'Prnews'
          | '123mdia'
        )
      | null;
    id?: string | null;
  }[];
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "backlinks".
 */
export interface Backlink {
  id: string;
  domain: string;
  marketplaces: {
    marketplace_source: string;
    price: number;
    id?: string | null;
  }[];
  rd?: number | null;
  tf?: number | null;
  cf?: number | null;
  ttf?: string | null;
  title?: string | null;
  backlinks?: number | null;
  ref_ips?: number | null;
  ref_subnets?: number | null;
  ref_edu?: number | null;
  ref_gov?: number | null;
  language?: string | null;
  ref_lang?: string | null;
  expiry_date?: string | null;
  date_fetched: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "domainsForBackgroundProcess".
 */
export interface DomainsForBackgroundProcess {
  id: string;
  domain: string;
  rd?: number | null;
  tf?: number | null;
  cf?: number | null;
  ttf?: string | null;
  title?: string | null;
  backlinks?: string | null;
  ref_ips?: string | null;
  ref_edu?: string | null;
  ref_gov?: string | null;
  language?: string | null;
  ref_lang?: string | null;
  expiry_date?: string | null;
  status: 'pending' | 'processing' | 'processed';
  created_at: string;
  updated_at?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "paypal-plans".
 */
export interface PaypalPlan {
  id: string;
  product_id: string;
  plans?:
    | {
        plan_name?: string | null;
        plan_id?: string | null;
        description?: string | null;
        price?: number | null;
        currency?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'CredentialsForMarketplaces';
        value: string | CredentialsForMarketplace;
      } | null)
    | ({
        relationTo: 'backlinks';
        value: string | Backlink;
      } | null)
    | ({
        relationTo: 'domainsForBackgroundProcess';
        value: string | DomainsForBackgroundProcess;
      } | null)
    | ({
        relationTo: 'paypal-plans';
        value: string | PaypalPlan;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  role?: T;
  username?: T;
  profilePicture?: T;
  authProvider?: T;
  planId?: T;
  subscriptionId?: T;
  planName?: T;
  features?: T;
  projects?: T;
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  altText?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "CredentialsForMarketplaces_select".
 */
export interface CredentialsForMarketplacesSelect<T extends boolean = true> {
  email?: T;
  password?: T;
  secretKey?: T;
  websiteTarget?:
    | T
    | {
        value?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "backlinks_select".
 */
export interface BacklinksSelect<T extends boolean = true> {
  domain?: T;
  marketplaces?:
    | T
    | {
        marketplace_source?: T;
        price?: T;
        id?: T;
      };
  rd?: T;
  tf?: T;
  cf?: T;
  ttf?: T;
  title?: T;
  backlinks?: T;
  ref_ips?: T;
  ref_subnets?: T;
  ref_edu?: T;
  ref_gov?: T;
  language?: T;
  ref_lang?: T;
  expiry_date?: T;
  date_fetched?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "domainsForBackgroundProcess_select".
 */
export interface DomainsForBackgroundProcessSelect<T extends boolean = true> {
  domain?: T;
  rd?: T;
  tf?: T;
  cf?: T;
  ttf?: T;
  title?: T;
  backlinks?: T;
  ref_ips?: T;
  ref_edu?: T;
  ref_gov?: T;
  language?: T;
  ref_lang?: T;
  expiry_date?: T;
  status?: T;
  created_at?: T;
  updated_at?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "paypal-plans_select".
 */
export interface PaypalPlansSelect<T extends boolean = true> {
  product_id?: T;
  plans?:
    | T
    | {
        plan_name?: T;
        plan_id?: T;
        description?: T;
        price?: T;
        currency?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "site-settings".
 */
export interface SiteSetting {
  id: string;
  siteTitle: string;
  description: string;
  socialLinks?:
    | {
        platform: string;
        url: string;
        id?: string | null;
      }[]
    | null;
  logo?: (string | null) | Media;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "site-settings_select".
 */
export interface SiteSettingsSelect<T extends boolean = true> {
  siteTitle?: T;
  description?: T;
  socialLinks?:
    | T
    | {
        platform?: T;
        url?: T;
        id?: T;
      };
  logo?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}