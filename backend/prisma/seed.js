const { PrismaClient, ContributionType, Status } = require('@prisma/client');
const ShortUniqueId = require('short-unique-id');

const prisma = new PrismaClient();
const uid = new ShortUniqueId({ length: 6, dictionary: 'alphanum_upper' });

async function main() {
  console.log('🌱 Seeding database...');

  // Create some sample contributions
  const sampleContributions = [
    {
      shortId: `HM-${uid.rnd()}`,
      x: 0,
      y: 0,
      type: ContributionType.TEXT,
      content: 'Welcome to The Human Monument! This is the first tile.',
      status: Status.APPROVED,
    },
    {
      shortId: `HM-${uid.rnd()}`,
      x: 150,
      y: 0,
      type: ContributionType.TEXT,
      content: 'Every tile tells a story. What\'s yours?',
      status: Status.APPROVED,
    },
    {
      shortId: `HM-${uid.rnd()}`,
      x: -150,
      y: 0,
      type: ContributionType.TEXT,
      content: '🌍 From every corner of the world, we build together.',
      status: Status.APPROVED,
    },
    {
      shortId: `HM-${uid.rnd()}`,
      x: 0,
      y: 150,
      type: ContributionType.TEXT,
      content: 'Art, memories, dreams — all immortalized here.',
      status: Status.APPROVED,
    },
    {
      shortId: `HM-${uid.rnd()}`,
      x: 0,
      y: -150,
      type: ContributionType.TEXT,
      content: '✨ Your contribution matters. Leave your mark!',
      status: Status.APPROVED,
    },
  ];

  for (const contribution of sampleContributions) {
    await prisma.contribution.create({
      data: contribution,
    });
  }

  console.log('✅ Seeding completed!');
  console.log(`📊 Created ${sampleContributions.length} sample contributions`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });