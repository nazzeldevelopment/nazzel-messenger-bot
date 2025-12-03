import type { Config } from 'drizzle-kit';

let databaseUrl = process.env.DATABASE_URL!;

if (databaseUrl && databaseUrl.includes('/nazzelmessengerbot')) {
  databaseUrl = databaseUrl.replace('/nazzelmessengerbot', '/neondb');
}

export default {
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
} satisfies Config;
