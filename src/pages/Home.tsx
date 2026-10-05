import { useMemo, useState } from 'react'
import { MODES } from '../data/types'
import type { ModeId } from '../data/types'
import { ALL_QUESTIONS, BANKS } from '../data'
import { TOTAL_DB_ENTRIES } from '../data/database'
import { loadStats, accuracy } from '../lib/stats'

interface Props {
  onStart: (mode: ModeId) => void
  onOpenDb: () => void
}

export default function Home({ onStart, onOpenDb }: Props) {
  const [stats] = useState(loadStats)
  const acc = accuracy(stats)

  const counts = useMemo<Record<ModeId, number>>(() => {
    return {
      synonyms: BANKS.synonyms.length,
      oddone: BANKS.oddone.length,
      gapfill: BANKS.gapfill.length,
      prepositions: BANKS.prepositions.length,
      sprint: ALL_QUESTIONS.length,
    }
  }, [])

  return (
    <div className="anim-fade-up">
      {/* Hero */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16">
          <p className="label-caps text-ink/60">B2 English exam prep · British English</p>
          <h1 className="font-display mt-3 text-[clamp(2rem,6vw,3.6rem)] leading-[1.05]">
            Синоніми. <span className="highlight-ink">Дистрактори.</span>
            <br />
            Контекст.
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-ink/80">
            Тренажер для тих, хто готується до іспиту рівня B2. Учишся впізнавати правильне слово серед
            схожих дистракторів, розбираєш кожну помилку з поясненням українською — і закріплюєш
            словосполучення з власного посібника.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => onStart('sprint')}
              className="border-ink-2 bg-hl px-6 min-h-[48px] font-bold text-sm uppercase tracking-wider transition-colors duration-200 hover:bg-ink hover:text-hl"
            >
              Почати спринт →
            </button>
            <button
              onClick={onOpenDb}
              className="border-ink-2 bg-paper px-6 min-h-[48px] font-bold text-sm uppercase tracking-wider transition-colors duration-200 hover:bg-hl"
            >
              База фраз ({TOTAL_DB_ENTRIES})
            </button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b-2 border-ink bg-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-px bg-ink/10">
          {[
            { n: String(stats.answered), l: 'питань розв’язано' },
            { n: `${acc}%`, l: 'точність' },
            { n: String(stats.bestStreak), l: 'найкраща серія' },
            { n: String(ALL_QUESTIONS.length), l: 'питань у банку' },
          ].map((s) => (
            <div key={s.l} className="bg-cream px-3 py-4">
              <div className="font-display text-3xl">{s.n}</div>
              <div className="label-caps mt-1 text-ink/50">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modes */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        <p className="label-caps text-ink/60">Режими тренування</p>
        <h2 className="font-display mt-2 text-2xl sm:text-3xl">Обери, що тренуємо сьогодні</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {MODES.map((m) => {
            const ms = stats.perMode[m.id]
            const best = ms && ms.sessions > 0 ? ms.best : null
            return (
              <button
                key={m.id}
                onClick={() => onStart(m.id)}
                className="text-left border-ink-2 bg-paper p-5 sm:p-6 min-h-[44px] transition-colors duration-200 hover:bg-hl group"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="label-caps text-ink/50 group-hover:text-ink/70">{m.tag}</span>
                  <span className="label-caps border-2 border-ink px-1.5 py-0.5 shrink-0">
                    {counts[m.id]} пит.
                  </span>
                </div>
                <h3 className="font-display mt-2 text-xl sm:text-2xl">{m.title}</h3>
                <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-ink/70 group-hover:text-ink/85">
                  {m.desc}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm font-bold">
                  <span className="uppercase tracking-wider">
                    {best !== null ? `Рекорд: ${best}/10` : 'Ще не грав(ла)'}
                  </span>
                  <span aria-hidden className="text-xl transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t-2 border-ink bg-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
          <p className="label-caps text-ink/60">Як це працює</p>
          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            {[
              {
                n: '01',
                t: '10 питань за сесію',
                d: 'Кожна сесія — це десять випадкових питань обраного режиму. Коротко, як справжній exam drill.',
              },
              {
                n: '02',
                t: 'Миттєва перевірка',
                d: 'Одразу після відповіді бачиш, чи влучив(ла), і читаєш пояснення українською — чому правильний варіант правильний, а кожен дистрактор — ні.',
              },
              {
                n: '03',
                t: 'Повторення слабких місць',
                d: 'Наприкінці — розбір помилок. Перечитай пояснення й прожени режим ще раз: питання перемішуються щоразу.',
              },
            ].map((s) => (
              <div key={s.n} className="border-l-2 border-ink pl-4">
                <div className="font-display text-hl text-2xl [-webkit-text-stroke:1.5px_#141412]">{s.n}</div>
                <h3 className="font-bold mt-2">{s.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
