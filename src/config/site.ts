export const site = {
  name: 'Mario Colli',
  descriptor: 'Ideas, tecnología y vida',
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL ?? '',
  socials: [
    { name: 'Instagram', handle: '@studiomcolli', url: 'https://www.instagram.com/studiomcolli/' },
    { name: 'TikTok', handle: '@alberto_colli9', url: 'https://www.tiktok.com/@alberto_colli9' },
    { name: 'YouTube', handle: '@marioalbertocolliek1448', url: 'https://www.youtube.com/@marioalbertocolliek1448/videos' },
    { name: 'Facebook', handle: 'Alberto Colli', url: 'https://www.facebook.com/alberto.colli.540663' },
  ],
};

export const configuredSocials = site.socials.filter((social) => social.url);
