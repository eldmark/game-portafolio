import type { Goal as GoalRecord, Trophy as TrophyRecord } from '@prisma/client';
import type { Goal, Trophy } from '@portfolio/shared';
import { prisma } from '../lib/prisma.js';

function asGoalStatus(status: string): Goal['status'] {
  return status === 'in_progress' || status === 'done' ? status : 'planned';
}

export function mapGoal(goal: GoalRecord): Goal {
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description,
    category: goal.category,
    status: asGoalStatus(goal.status),
    targetDate: goal.targetDate ? goal.targetDate.toISOString() : null,
    orderIndex: goal.orderIndex,
    trophyId: goal.trophyId,
  };
}

export function mapTrophy(trophy: TrophyRecord): Trophy {
  return {
    id: trophy.id,
    title: trophy.title,
    description: trophy.description,
    icon: trophy.icon,
    category: trophy.category,
    dateEarned: trophy.dateEarned.toISOString(),
    proofUrl: trophy.proofUrl,
  };
}

export async function getGoals() {
  const goals = await prisma.goal.findMany({
    orderBy: [{ status: 'asc' }, { orderIndex: 'asc' }],
  });
  return goals.map(mapGoal);
}

export async function getTrophies() {
  const trophies = await prisma.trophy.findMany({
    orderBy: { dateEarned: 'desc' },
  });
  return trophies.map(mapTrophy);
}
