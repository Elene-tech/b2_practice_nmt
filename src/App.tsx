import { useState } from 'react'
import type { ModeId } from './data/types'
import Home from './pages/Home'
import QuizPage from './pages/QuizPage'
import DatabasePage from './pages/DatabasePage'

type View = { t: 'home' } | { t: 'quiz'; mode: ModeId } | { t: 'db' }

export default function App() {
  const [view, setView] = useState<View>({ t: 'home' })

  const goHome = () => setView({ t: 'home' })
  const goDb = () => setView({ t: 'db' })
  const startQuiz = (mode: ModeId) => {
    setView({ t: 'quiz', mode })
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <header className="sticky top-0 z-40 bg-paper border-b-2 border-ink">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <button
            onClick={goHome}
            className="flex items-center gap-2 min-h-[44px] group"
            aria-label="На головну"
          >
            <span className="bg-hl border-2 border-ink px-1.5 py-0.5 font-display text-lg leading-none transition-colors duration-200 group-hover:bg-ink group-hover:text-hl">
              B2
            </span>
            <span className="font-display text-lg tracking-tight">WORDLAB</span>
          </button>
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={goHome}
              className={`label-caps whitespace-nowrap px-2 sm:px-3 min-h-[44px] transition-colors duration-200 hover:bg-hl ${
                view.t !== 'db' ? 'underline underline-offset-4 decoration-2' : ''
              }`}
            >
              Тренування
            </button>
            <button
              onClick={goDb}
              className={`label-caps whitespace-nowrap px-2 sm:px-3 min-h-[44px] transition-colors duration-200 hover:bg-hl ${
                view.t === 'db' ? 'bg-hl' : ''
              }`}
            >
              База фраз
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {view.t === 'home' && <Home onStart={startQuiz} onOpenDb={goDb} />}
        {view.t === 'quiz' && <QuizPage key={view.mode} mode={view.mode} onExit={goHome} />}
        {view.t === 'db' && <DatabasePage />}
      </main>

      <footer className="border-t-2 border-ink bg-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 text-sm leading-relaxed text-ink/70 safe-bottom">
          <p>
            B2 WordLab — тренажер синонімів і словосполучень у контексті. Британська англійська, пояснення українською.
            Матеріали адаптовано з «Phrases and collocations database» (с. 203–207).
          </p>
          <p className="mt-2">
            Твій прогрес зберігається лише в цьому браузері — на іншому пристрої він не синхронізується, а очищення даних браузера його видалить.
          </p>
        </div>
      </footer>
    </div>
  )
}
