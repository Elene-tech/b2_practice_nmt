import type { ModeId, Question } from './types'
import { SYNONYMS } from './synonyms'
import { ODDONE } from './oddone'
import { GAPFILL } from './gapfill'
import { PREPOSITIONS } from './prepositions'

export const BANKS: Record<Exclude<ModeId, 'sprint'>, Question[]> = {
  synonyms: SYNONYMS,
  oddone: ODDONE,
  gapfill: GAPFILL,
  prepositions: PREPOSITIONS,
}

export const ALL_QUESTIONS: Question[] = [...SYNONYMS, ...ODDONE, ...GAPFILL, ...PREPOSITIONS]

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export interface SessionQuestion extends Question {
  shuffledOptions: Question['options']
}

export function buildSession(mode: ModeId, count = 10): SessionQuestion[] {
  const pool = mode === 'sprint' ? ALL_QUESTIONS : BANKS[mode]
  return shuffle(pool)
    .slice(0, Math.min(count, pool.length))
    .map((q) => ({ ...q, shuffledOptions: shuffle(q.options) }))
}
