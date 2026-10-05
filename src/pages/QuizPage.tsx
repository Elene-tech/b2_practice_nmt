import { useMemo, useRef, useState } from 'react'
import { buildSession, type SessionQuestion } from '../data'
import { MODES } from '../data/types'
import type { ModeId } from '../data/types'
import { recordSession } from '../lib/stats'

const LETTERS = ['A', 'B', 'C', 'D']

function Sentence({ text, big }: { text: string; big?: boolean }) {
  if (!text.includes('**') && !text.includes('___')) {
    return (
      <span className={big ? 'font-display text-[clamp(1.6rem,5vw,2.6rem)] tracking-tight' : ''}>{text}</span>
    )
  }
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**')) {
          return <mark key={i} className="font-bold">{part.slice(2, -2)}</mark>
        }
        const segs = part.split('___')
        return (
          <span key={i}>
            {segs.map((s, j) => (
              <span key={j}>
                {s}
                {j < segs.length - 1 && (
                  <span className="inline-block min-w-[3.2em] border-b-[3px] border-ink align-baseline" aria-label="пропуск" />
                )}
              </span>
            ))}
          </span>
        )
      })}
    </>
  )
}

interface Answer {
  qid: string
  correct: boolean
  picked: string
  right: string
}

interface Props {
  mode: ModeId
  onExit: () => void
}

export default function QuizPage({ mode, onExit }: Props) {
  const meta = MODES.find((m) => m.id === mode)!
  const [session, setSession] = useState<SessionQuestion[]>(() => buildSession(mode, 10))
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [done, setDone] = useState(false)
  const recorded = useRef(false)

  const q = session[idx]
  const total = session.length
  const correctCount = useMemo(() => answers.filter((a) => a.correct).length, [answers])
  const wrongAnswers = useMemo(() => {
    return answers
      .map((a, i) => ({ ...a, q: session[i] }))
      .filter((a) => !a.correct)
  }, [answers, session])

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    const isRight = q.shuffledOptions[i].ok
    const right = q.shuffledOptions.find((o) => o.ok)!.t
    setAnswers((prev) => [...prev, { qid: q.id, correct: isRight, picked: q.shuffledOptions[i].t, right }])
    const newStreak = isRight ? streak + 1 : 0
    setStreak(newStreak)
    setBestStreak((b) => Math.max(b, newStreak))
  }

  const next = () => {
    if (idx + 1 >= total) {
      setDone(true)
      if (!recorded.current) {
        recorded.current = true
        recordSession(mode, correctCount, total, bestStreak)
      }
      window.scrollTo({ top: 0 })
    } else {
      setIdx(idx + 1)
      setPicked(null)
    }
  }

  const restart = () => {
    setSession(buildSession(mode, 10))
    setIdx(0)
    setPicked(null)
    setAnswers([])
    setStreak(0)
    setBestStreak(0)
    setDone(false)
    recorded.current = false
    window.scrollTo({ top: 0 })
  }

  if (done) {
    const pct = Math.round((correctCount / total) * 100)
    const verdict =
      pct >= 90
        ? 'Відмінно! Рівень впевненого B2 — так тримати.'
        : pct >= 70
          ? 'Дуже добре! Ще трохи практики з дистракторами.'
          : pct >= 50
            ? 'Непогано, але дистрактори тебе ловлять. Перечитай пояснення нижче.'
            : 'Поки складно — і це нормально. Розбери помилки й спробуй ще раз.'
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 anim-fade-up">
        <p className="label-caps text-ink/50">{meta.tag} · результат</p>
        <h1 className="font-display mt-2 text-[clamp(2.4rem,8vw,4rem)] leading-none">
          {correctCount}
          <span className="text-ink/30">/{total}</span>
        </h1>
        <div className="mt-4 h-3 border-2 border-ink bg-paper">
          <div className="h-full bg-hl transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-4 text-lg font-semibold">{verdict}</p>
        <p className="mt-1 text-sm text-ink/60">
          Найкраща серія за сесію: <span className="font-bold text-ink">{bestStreak}</span> правильних поспіль.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={restart}
            className="border-ink-2 bg-hl px-6 min-h-[48px] font-bold text-sm uppercase tracking-wider transition-colors duration-200 hover:bg-ink hover:text-hl"
          >
            Ще раз ↻
          </button>
          <button
            onClick={onExit}
            className="border-ink-2 bg-paper px-6 min-h-[48px] font-bold text-sm uppercase tracking-wider transition-colors duration-200 hover:bg-hl"
          >
            Усі режими
          </button>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl sm:text-2xl">Розбір помилок ({wrongAnswers.length})</h2>
            <div className="mt-4 space-y-4">
              {wrongAnswers.map((a) => (
                <div key={a.qid} className="border-ink-2 bg-cream p-4 sm:p-5">
                  {a.q.sentence && (
                    <p className="text-base sm:text-lg leading-relaxed">
                      <Sentence text={a.q.sentence} />
                    </p>
                  )}
                  <p className="mt-2 text-sm">
                    <span className="font-bold text-bad">Твоя відповідь: {a.picked}</span>
                    <span className="mx-2 text-ink/40">·</span>
                    <span className="font-bold text-good">Правильно: {a.right}</span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">{a.q.explain}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const answered = picked !== null
  const isRight = answered && q.shuffledOptions[picked].ok

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10" key={q.id}>
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onExit}
          className="label-caps min-h-[44px] px-2 transition-colors duration-200 hover:bg-hl"
        >
          ← Вихід
        </button>
        <span className="label-caps text-ink/50 hidden sm:inline">{meta.tag}</span>
        <span className="label-caps">
          {idx + 1} / {total}
        </span>
      </div>
      <div className="mt-2 h-2 border-2 border-ink bg-paper">
        <div
          className="h-full bg-hl transition-all duration-300"
          style={{ width: `${((idx + (answered ? 1 : 0)) / total) * 100}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-sm font-bold">
        <span>
          Бал: <span className="text-good">{correctCount}</span>
        </span>
        <span className={streak >= 2 ? 'bg-hl px-2 py-0.5 border-2 border-ink' : 'text-ink/40'}>
          Серія: {streak}
        </span>
      </div>

      {/* Question */}
      <div className="mt-6 anim-fade-up" key={`q-${q.id}`}>
        <p className="label-caps text-ink/60">{q.prompt}</p>
        {q.sentence && (
          <div className={`mt-4 border-ink-2 bg-cream p-5 sm:p-7 ${q.mode === 'oddone' ? 'text-center' : ''}`}>
            <p className={`leading-relaxed ${q.mode === 'oddone' ? '' : 'text-lg sm:text-2xl font-semibold'}`}>
              <Sentence text={q.sentence} big={q.mode === 'oddone'} />
            </p>
            {q.ua && <p className="mt-3 text-sm text-ink/55 italic-none">{q.ua}</p>}
          </div>
        )}

        {/* Options */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {q.shuffledOptions.map((opt, i) => {
            let cls = 'border-ink bg-paper hover:bg-hl'
            if (answered) {
              if (opt.ok) cls = 'border-good bg-goodbg'
              else if (i === picked) cls = 'border-bad bg-badbg anim-shake'
              else cls = 'border-ink/20 bg-paper opacity-60'
            }
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={answered}
                className={`flex items-center gap-3 border-2 p-4 min-h-[56px] text-left font-semibold text-base sm:text-lg transition-colors duration-200 ${cls}`}
              >
                <span
                  className={`label-caps shrink-0 w-8 h-8 flex items-center justify-center border-2 ${
                    answered && opt.ok
                      ? 'border-good bg-good text-paper'
                      : answered && i === picked
                        ? 'border-bad bg-bad text-paper'
                        : 'border-ink'
                  }`}
                >
                  {answered ? (opt.ok ? '✓' : i === picked ? '✗' : LETTERS[i]) : LETTERS[i]}
                </span>
                <span>{opt.t}</span>
              </button>
            )
          })}
        </div>

        {/* Feedback + explanation */}
        {answered && (
          <div className="mt-5 anim-fade-up">
            <div
              className={`border-2 p-4 sm:p-5 ${isRight ? 'border-good bg-goodbg' : 'border-bad bg-badbg'}`}
            >
              <p className="font-display text-lg">
                {isRight ? 'Правильно!' : 'Не зовсім.'}{' '}
                {!isRight && (
                  <span className="font-semibold">
                    Правильна відповідь: <mark>{q.shuffledOptions.find((o) => o.ok)!.t}</mark>
                  </span>
                )}
              </p>
            </div>

            <div className="mt-3 border-ink-2 bg-paper">
              <div className="bg-hl border-b-2 border-ink px-4 py-2 label-caps">Пояснення</div>
              <div className="p-4 sm:p-5">
                <p className="text-sm sm:text-base leading-relaxed">{q.explain}</p>
                <ul className="mt-4 space-y-2">
                  {q.shuffledOptions.map((opt, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed">
                      <span className={`font-bold shrink-0 ${opt.ok ? 'text-good' : 'text-bad'}`}>
                        {opt.ok ? '✓' : '✗'}
                      </span>
                      <span>
                        <span className="font-bold">{opt.t}</span> — {opt.note.replace(/^[✓✗]\s*/, '')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={next}
              className="mt-5 w-full sm:w-auto border-ink-2 bg-ink text-hl px-8 min-h-[52px] font-bold text-sm uppercase tracking-wider transition-colors duration-200 hover:bg-hl hover:text-ink"
            >
              {idx + 1 >= total ? 'Показати результат →' : 'Далі →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
