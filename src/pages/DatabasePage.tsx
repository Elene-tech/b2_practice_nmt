import { useMemo, useState } from 'react'
import { DATABASE, TOTAL_DB_ENTRIES } from '../data/database'

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  const parts: React.ReactNode[] = []
  let i = 0
  let k = 0
  while (i < text.length) {
    const hit = lower.indexOf(q, i)
    if (hit === -1) {
      parts.push(text.slice(i))
      break
    }
    if (hit > i) parts.push(text.slice(i, hit))
    parts.push(<mark key={k++}>{text.slice(hit, hit + q.length)}</mark>)
    i = hit + q.length
  }
  return <>{parts}</>
}

export default function DatabasePage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return DATABASE
    return DATABASE.filter((e) => e.w.toLowerCase().includes(q) || e.p.toLowerCase().includes(q))
  }, [query])

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const e of filtered) {
      const letter = e.w[0].toUpperCase()
      if (!map.has(letter)) map.set(letter, [])
      map.get(letter)!.push(e)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <div className="anim-fade-up">
      <section className="border-b-2 border-ink bg-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          <p className="label-caps text-ink/60">Phrases and collocations database · с. 203–207</p>
          <h1 className="font-display mt-2 text-[clamp(1.8rem,5vw,3rem)] leading-tight">
            База <span className="highlight-ink">словосполучень</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-ink/75">
            Повна база з твоїх сторінок: {TOTAL_DB_ENTRIES} опорних слів від accident до wrong. У режимі
            «Зайве слово» дистрактори побудовані саме на цих фразах — перечитуй базу, а потім перевіряй себе.
          </p>
          <div className="mt-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Пошук: слово або фраза… (наприклад, attention або make a)"
              className="w-full border-ink-2 bg-paper px-4 min-h-[52px] text-base placeholder:text-ink/40 focus:outline-none focus:bg-hl/30"
              aria-label="Пошук у базі"
            />
            <p className="mt-2 label-caps text-ink/50">
              {query ? `Знайдено: ${filtered.length}` : `Усього записів: ${TOTAL_DB_ENTRIES}`}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
        {groups.length === 0 && (
          <p className="border-ink-2 bg-cream p-6 text-center font-semibold">
            Нічого не знайдено за запитом «{query}». Спробуй коротший фрагмент.
          </p>
        )}
        <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {groups.map(([letter, entries]) => (
            <div key={letter} className="break-inside-avoid">
              <div className="sticky top-14 sm:top-16 bg-paper py-2 border-b-2 border-ink font-display text-xl">
                <span className="bg-hl border-2 border-ink px-1.5">{letter}</span>
              </div>
              <dl>
                {entries.map((e) => (
                  <div key={e.w} className="py-3 border-b border-ink/15">
                    <dt className="font-bold text-base sm:text-lg">
                      <Highlight text={e.w} query={query.trim()} />
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink/75">
                      <Highlight text={e.p} query={query.trim()} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
