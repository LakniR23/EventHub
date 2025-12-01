import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const values = [
  'CONCERTS',
  'MUSICAL',
  'THEATRE_DRAMA',
  'DANCE_PERFORMANCES',
  'ART_EXHIBITIONS',
  'FILM_SCREENINGS',
  'COMEDY_SHOWS',
  'FESTIVALS',
  'CHARITY_DEDICATION',
  'DONATION_DRIVES',
  'COMMUNITY_GATHERINGS',
  'CULTURAL_FAIRS',
  'OPEN_MIC_NIGHTS',
  'TALENT_SHOWS',
  'BOOK_READINGS',
  'FOOD_FESTIVALS',
  'FASHION_SHOWS',
  'FUNDRAISING_EVENTS',
  'WORKSHOPS_CREATIVE',
  'SPORTS_EVENTS'
];

async function addEnumValues() {
  console.log('Connecting to database...');
  try {
    for (const v of values) {
      try {
        console.log(`Ensuring enum value exists: ${v}`);
        const sql = `DO $$\nBEGIN\n  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'Category' AND e.enumlabel = '${v}') THEN\n    EXECUTE 'ALTER TYPE "Category" ADD VALUE ''${v}''';\n  END IF;\nEND$$;`;
        await prisma.$executeRawUnsafe(sql);
        console.log(`Checked/added: ${v}`);
      } catch (err) {
        console.error(`Failed to add/check ${v}:`, err.message || err);
      }
    }
  } finally {
    await prisma.$disconnect();
    console.log('Done. Disconnected.');
  }
}

addEnumValues().catch(err => {
  console.error('Migration script error:', err);
  prisma.$disconnect();
  process.exit(1);
});
