import type { ModeId } from '../data/types'

export interface ModeStats {
  answered: number
  correct: number
  sessions: number
  best: number // best score (correct answers) in a 10-question session
}

export interface Stats {
  answered: number
  correct: number
  bestStreak: number
  perMode: Partial<Record<ModeId, ModeStats>>
}

const KEY = 'b2wordlab.stats.v1'

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Stats
      return {
        answered: parsed.answered ?? 0,
        correct: parsed.correct ?? 0,
        bestStreak: parsed.bestStreak ?? 0,
        perMode: parsed.perMode ?? {},
      }
    }
  } catch {
    // corrupted storage — start fresh
  }
  return { answered: 0, correct: 0, bestStreak: 0, perMode: {} }
}

export function recordSession(
  mode: ModeId,
  correctCount: number,
  total: number,
  bestStreakInSession: number,
): Stats {
  const s = loadStats()
  s.answered += total
  s.correct += correctCount
  s.bestStreak = Math.max(s.bestStreak, bestStreakInSession)
  const m = s.perMode[mode] ?? { answered: 0, correct: 0, sessions: 0, best: 0 }
  m.answered += total
  m.correct += correctCount
  m.sessions += 1
  m.best = Math.max(m.best, correctCount)
  s.perMode[mode] = m
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    // storage unavailable (private mode) — stats just won't persist
  }
  return s
}

export function accuracy(s: Stats): number {
  return s.answered === 0 ? 0 : Math.round((s.correct / s.answered) * 100)
}
