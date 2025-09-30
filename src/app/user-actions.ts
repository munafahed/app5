'use server';

import { db } from '@/lib/db';
import { users, type User, type InsertUser } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserData(uid: string): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, uid));
    return user || null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function createOrUpdateUser(data: InsertUser): Promise<User | null> {
  try {
    const [user] = await db
      .insert(users)
      .values(data)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return null;
  }
}

export async function updateUserPreferences(
  uid: string,
  track: string,
  level: string
): Promise<User | null> {
  try {
    const [user] = await db
      .update(users)
      .set({
        track,
        level,
        updatedAt: new Date(),
      })
      .where(eq(users.id, uid))
      .returning();
    return user;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return null;
  }
}

export async function updateUserStreak(uid: string): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, uid));
    
    if (!user) return null;

    const now = new Date();
    const lastVisit = user.lastVisit ? new Date(user.lastVisit) : null;
    
    let newStreak = user.streak || 0;
    let newPoints = user.points || 0;

    if (lastVisit) {
      const daysSinceLastVisit = Math.floor(
        (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastVisit === 0) {
        return user;
      } else if (daysSinceLastVisit === 1) {
        newStreak += 1;
        newPoints += 10;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
      newPoints = 10;
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        streak: newStreak,
        points: newPoints,
        lastVisit: now,
        updatedAt: now,
      })
      .where(eq(users.id, uid))
      .returning();

    return updatedUser;
  } catch (error) {
    console.error('Error updating user streak:', error);
    return null;
  }
}
