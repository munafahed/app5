'use server';

import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';

let firestoreInstance: ReturnType<typeof getFirestore> | null = null;

function getFirestoreInstance() {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(app);
  }
  return firestoreInstance;
}

export interface UserProgress {
  uid: string;
  xp: number;
  hearts: number;
  streak: number;
  currentLevel: number;
  lastVisit: Date;
  answeredQuestions: string[];
  wrongQuestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  title: string;
  term: string;
  definition: string;
  example: string;
  why: string;
  level: number;
  track: string;
  quiz: {
    type: 'mcq' | 'tf';
    question: string;
    options: string[];
    answerIndex: number;
  };
  tags: string[];
  createdAt: Date;
}

import { MAX_HEARTS, XP_REWARD, XP_PER_LEVEL } from './game-utils';

export async function getUserProgress(uid: string): Promise<UserProgress | null> {
  try {
    const db = getFirestoreInstance();
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        uid,
        xp: data.xp || 0,
        hearts: data.hearts !== undefined ? data.hearts : MAX_HEARTS,
        streak: data.streak || 0,
        currentLevel: data.currentLevel || 1,
        lastVisit: data.lastVisit?.toDate() || new Date(),
        answeredQuestions: data.answeredQuestions || [],
        wrongQuestions: data.wrongQuestions || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return null;
  }
}

export async function initializeUserProgress(uid: string): Promise<UserProgress> {
  try {
    const db = getFirestoreInstance();
    const userRef = doc(db, 'users', uid);
    
    const now = Timestamp.now();
    const initialData = {
      xp: 0,
      hearts: MAX_HEARTS,
      streak: 1,
      currentLevel: 1,
      lastVisit: now,
      answeredQuestions: [],
      wrongQuestions: [],
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(userRef, initialData, { merge: true });

    return {
      uid,
      ...initialData,
      lastVisit: now.toDate(),
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  } catch (error) {
    console.error('Error initializing user progress:', error);
    throw error;
  }
}

export async function updateStreak(uid: string): Promise<UserProgress | null> {
  try {
    const db = getFirestoreInstance();
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return await initializeUserProgress(uid);
    }

    const data = userSnap.data();
    const lastVisit = data.lastVisit?.toDate() || new Date(0);
    const now = new Date();
    
    const daysSinceLastVisit = Math.floor(
      (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = data.streak || 0;

    if (daysSinceLastVisit === 0) {
      return await getUserProgress(uid);
    } else if (daysSinceLastVisit === 1) {
      newStreak += 1;
    } else if (daysSinceLastVisit > 1) {
      newStreak = 1;
    }

    await updateDoc(userRef, {
      streak: newStreak,
      lastVisit: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return await getUserProgress(uid);
  } catch (error) {
    console.error('Error updating streak:', error);
    return null;
  }
}

export async function addCorrectAnswer(uid: string, questionId: string): Promise<UserProgress | null> {
  try {
    const db = getFirestoreInstance();
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await initializeUserProgress(uid);
    }

    const data = userSnap.exists() ? userSnap.data() : {};
    const currentXP = data.xp || 0;
    const currentLevel = data.currentLevel || 1;
    const answeredQuestions = data.answeredQuestions || [];
    const wrongQuestions = data.wrongQuestions || [];

    const newXP = currentXP + XP_REWARD;
    const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;

    const updatedAnswered = answeredQuestions.includes(questionId) 
      ? answeredQuestions 
      : [...answeredQuestions, questionId];
    
    const updatedWrong = wrongQuestions.filter((id: string) => id !== questionId);

    await updateDoc(userRef, {
      xp: newXP,
      currentLevel: Math.max(currentLevel, newLevel),
      answeredQuestions: updatedAnswered,
      wrongQuestions: updatedWrong,
      updatedAt: Timestamp.now(),
    });

    return await getUserProgress(uid);
  } catch (error) {
    console.error('Error adding correct answer:', error);
    return null;
  }
}

export async function addWrongAnswer(uid: string, questionId: string): Promise<UserProgress | null> {
  try {
    const db = getFirestoreInstance();
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await initializeUserProgress(uid);
    }

    const data = userSnap.exists() ? userSnap.data() : {};
    const currentHearts = data.hearts !== undefined ? data.hearts : MAX_HEARTS;
    const wrongQuestions = data.wrongQuestions || [];

    const newHearts = Math.max(0, currentHearts - 1);
    
    const updatedWrong = wrongQuestions.includes(questionId)
      ? wrongQuestions
      : [...wrongQuestions, questionId];

    await updateDoc(userRef, {
      hearts: newHearts,
      wrongQuestions: updatedWrong,
      updatedAt: Timestamp.now(),
    });

    return await getUserProgress(uid);
  } catch (error) {
    console.error('Error adding wrong answer:', error);
    return null;
  }
}

export async function restoreHearts(uid: string): Promise<UserProgress | null> {
  try {
    const db = getFirestoreInstance();
    const userRef = doc(db, 'users', uid);

    await updateDoc(userRef, {
      hearts: MAX_HEARTS,
      updatedAt: Timestamp.now(),
    });

    return await getUserProgress(uid);
  } catch (error) {
    console.error('Error restoring hearts:', error);
    return null;
  }
}

export async function getNextQuestion(
  uid: string,
  track: string
): Promise<Question | null> {
  try {
    const db = getFirestoreInstance();
    const userProgress = await getUserProgress(uid);
    
    if (!userProgress) {
      return null;
    }

    const { currentLevel, answeredQuestions, wrongQuestions } = userProgress;

    if (wrongQuestions.length > 0) {
      const wrongQuestionRef = doc(db, 'questions', wrongQuestions[0]);
      const wrongQuestionSnap = await getDoc(wrongQuestionRef);
      
      if (wrongQuestionSnap.exists()) {
        const data = wrongQuestionSnap.data();
        return {
          id: wrongQuestionSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Question;
      }
    }

    for (let level = 1; level <= currentLevel; level++) {
      const questionsRef = collection(db, 'questions');
      const q = query(
        questionsRef,
        where('level', '==', level),
        where('track', '==', track),
        orderBy('createdAt'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      
      for (const docSnap of querySnapshot.docs) {
        const questionId = docSnap.id;
        if (!answeredQuestions.includes(questionId)) {
          const data = docSnap.data();
          return {
            id: questionId,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as Question;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting next question:', error);
    return null;
  }
}

export async function saveQuestion(question: Omit<Question, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    const db = getFirestoreInstance();
    const questionsRef = collection(db, 'questions');
    const docRef = doc(questionsRef);
    
    await setDoc(docRef, {
      ...question,
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving question:', error);
    return null;
  }
}

