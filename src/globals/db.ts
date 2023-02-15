import { PrismaClient } from '@prisma/client';
import { GlobalRef } from './GlobalRef';

const dbRef = new GlobalRef<PrismaClient>('myapp.prisma');
if (!dbRef.value) {
  dbRef.value = new PrismaClient();
}

export const db = dbRef.value;
