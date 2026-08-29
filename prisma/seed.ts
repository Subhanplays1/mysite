import { PrismaClient } from '@prisma/client';
import { hashKey, generateAdminKey, storeAdminKey } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'owner@subhanplays.qzz.io' },
    update: {},
    create: {
      email: 'owner@subhanplays.qzz.io',
      name: 'Subhan',
      role: 'OWNER',
      permissions: [
        'manage_videos',
        'manage_projects',
        'manage_tasks',
        'manage_files',
        'manage_flowcharts',
        'manage_website',
        'manage_media',
        'view_analytics',
        'view_security',
        'manage_admins',
      ],
    },
  });
  console.log('Created admin user:', adminUser.email);

  const adminKey = await generateAdminKey();
  await storeAdminKey(adminKey, adminUser.id);
  console.log('Generated initial admin key:', adminKey);

  const settings = [
    { key: 'hero_title', value: 'SUBHANPLAYS', type: 'STRING' as const },
    { key: 'hero_subtitle', value: 'Gaming. Coding. Creating.', type: 'STRING' as const },
    { key: 'hero_description', value: 'Minecraft creator, developer, and technology enthusiast building servers, software, and digital experiences.', type: 'STRING' as const },
    { key: 'about_title', value: 'About SubhanPlays', type: 'STRING' as const },
    { key: 'about_text', value: 'I create content around Minecraft, coding, and technology. My journey started with playing Minecraft, which led me to server administration, plugin development, and eventually full-stack software development.', type: 'STRING' as const },
    { key: 'stats', value: [{ label: 'Videos', value: '100+' }, { label: 'Projects', value: '20+' }, { label: 'Subscribers', value: '10K+' }, { label: 'Years Active', value: '5+' }], type: 'ARRAY' as const },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type },
      create: setting,
    });
  }
  console.log('Created site settings');

  const announcement = await prisma.announcement.create({
    data: {
      title: 'Welcome to SubhanPlays!',
      message: 'This is the new SubhanPlays website. Explore my projects, videos, and roadmap.',
      style: 'INFO',
      enabled: true,
      public: true,
      startDate: new Date(),
    },
  });
  console.log('Created welcome announcement');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });