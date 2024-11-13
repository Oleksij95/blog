import type { Schema, Struct } from '@strapi/strapi';

export interface OtherOther extends Struct.ComponentSchema {
  collectionName: 'components_other_others';
  info: {
    displayName: 'other';
    icon: 'apps';
  };
  attributes: {};
}

export interface SeoSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_seos';
  info: {
    displayName: 'seo';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'other.other': OtherOther;
      'seo.seo': SeoSeo;
    }
  }
}
