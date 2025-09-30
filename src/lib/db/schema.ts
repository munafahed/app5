import { pgTable, text, integer, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  photoURL: text('photo_url'),
  track: varchar('track', { length: 50 }),
  level: varchar('level', { length: 20 }),
  streak: integer('streak').default(0).notNull(),
  points: integer('points').default(0).notNull(),
  lastVisit: timestamp('last_visit'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
