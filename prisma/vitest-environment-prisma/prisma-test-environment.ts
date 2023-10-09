import { randomUUID } from 'crypto';
import { Environment } from 'vitest';
import { execSync } from 'node:child_process';
import 'dotenv/config';
import { prisma } from '@/lib/prisma';

function generateDatabseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schema);

  return url.toString();
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    const schema = `test-${randomUUID()}`;
    const testDatabaseURL = generateDatabseURL(schema);

    process.env.DATABASE_URL = testDatabaseURL;

    // executing migrations
    // we are using 'npx prisma migrate deploy' instead of 'npx prisma migrate dev' 
    // because we don't want to check for any changes in our schema.prisma file
    execSync('npx prisma migrate deploy');
    
    return {
      async teardown() { 
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );
        await prisma.$disconnect();
      },
    };
  },
};