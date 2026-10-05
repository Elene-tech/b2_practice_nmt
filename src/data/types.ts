export type ModeId = 'synonyms' | 'oddone' | 'gapfill' | 'prepositions' | 'sprint'

export interface QOption {
  t: string // option text (English)
  ok: boolean // the target answer
  note: string // Ukrainian note about this option
}

export interface Question {
  id: string
  mode: Exclude<ModeId, 'sprint'>
  prompt: string // Ukrainian instruction shown above the sentence
  sentence?: string // context; **word** = highlighted target, ___ = gap
  options: QOption[] // exactly 4, exactly one ok
  explain: string // general Ukrainian explanation
  ua?: string // Ukrainian translation of the sentence
}

export interface ModeMeta {
  id: ModeId
  tag: string // English label
  title: string // Ukrainian title
  desc: string // Ukrainian description
  accentNote: string
}

export const MODES: ModeMeta[] = [
  {
    id: 'synonyms',
    tag: 'Synonyms in context',
    title: 'Синоніми в контексті',
    desc: 'Обери слово або фразу, що найкраще замінює виділене слово саме в цьому реченні. Дистрактори — «друзі перекладача» та слова іншого значення.',
    accentNote: 'meaning in context',
  },
  {
    id: 'oddone',
    tag: 'Distractor hunt',
    title: 'Зайве слово',
    desc: 'Три слова поєднуються з опорним словом, а одне — ні. Знайди дистрактора. Усі пари взяті з твоєї бази словосполучень.',
    accentNote: 'collocation intruder',
  },
  {
    id: 'gapfill',
    tag: 'Gap fill',
    title: 'Заповни пропуск',
    desc: 'Класичний формат іспиту B2: речення з пропуском і чотири варіанти. Пастки: make/do, say/tell, borrow/lend, «false friends».',
    accentNote: 'exam-style MCQ',
  },
  {
    id: 'prepositions',
    tag: 'Preposition trap',
    title: 'Прийменник-пастка',
    desc: 'In, on, at, by... Один маленький прийменник вирішує все. Фіксовані фрази з бази: on purpose, by mistake, in my opinion.',
    accentNote: 'fixed phrases',
  },
  {
    id: 'sprint',
    tag: 'Exam sprint',
    title: 'Спринт',
    desc: 'Десять випадкових питань з усіх режимів підряд. Рахуй серію правильних відповідей і бий власний рекорд.',
    accentNote: '10 mixed questions',
  },
]
