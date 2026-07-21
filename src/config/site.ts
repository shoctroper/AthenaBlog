export const site = {
  name: 'Mario Colli',
  descriptor: 'Ideas, tecnología y vida',
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL ?? '',
  socials: [
    { name: 'Instagram', handle: import.meta.env.PUBLIC_INSTAGRAM_HANDLE ?? '', url: import.meta.env.PUBLIC_INSTAGRAM_URL ?? '' },
    { name: 'TikTok', handle: import.meta.env.PUBLIC_TIKTOK_HANDLE ?? '', url: import.meta.env.PUBLIC_TIKTOK_URL ?? '' },
    { name: 'YouTube', handle: import.meta.env.PUBLIC_YOUTUBE_HANDLE ?? '', url: import.meta.env.PUBLIC_YOUTUBE_URL ?? '' },
    { name: 'Facebook', handle: import.meta.env.PUBLIC_FACEBOOK_HANDLE ?? '', url: import.meta.env.PUBLIC_FACEBOOK_URL ?? '' },
  ],
};

export const configuredSocials = site.socials.filter((social) => social.url);
