import React, { useMemo, useState } from 'react';
import { Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Trophy, Search, X } from 'lucide-react';
import { RUSSIAN_WORDS, WORD_CATEGORIES } from '../data/russianWords';
import { VocabWord } from '../types/learning';
import { RealisticIllustration } from './RealisticIllustration';
import { playError, playFanfare, playFlip, playPop, playSuccess, speakRussian } from '../utils/sound';

type WordGameMode = 'dictionary' | 'picture-quiz' | 'memory';

interface WordQuestion {
  target: VocabWord;
  options: VocabWord[];
}

interface MemoryCard {
  uid: string;
  wordId: string;
  type: 'image' | 'word';
  word: VocabWord;
  flipped: boolean;
  matched: boolean;
}

interface WordMatchGameProps {
  soundEnabled: boolean;
  onReward: (stars: number, learnedWordId?: string) => void;
  onResetStreak: () => void;
}

const QUIZ_LENGTH = 10;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildPictureQuiz(): WordQuestion[] {
  const targets = shuffle(RUSSIAN_WORDS).slice(0, QUIZ_LENGTH);
  return targets.map((target) => {
    const distractors = shuffle(
      RUSSIAN_WORDS.filter((w) => w.id !== target.id && w.imageKey !== target.imageKey)
    ).slice(0, 3);
    return {
      target,
      options: shuffle([target, ...distractors]),
    };
  });
}

function buildMemoryDeck(): MemoryCard[] {
  const picked = shuffle(RUSSIAN_WORDS).slice(0, 6);
  const cards: MemoryCard[] = [];
  picked.forEach((word) => {
    cards.push({
      uid: `img-${word.id}`,
      wordId: word.id,
      type: 'image',
      word,
      flipped: false,
      matched: false,
    });
    cards.push({
      uid: `txt-${word.id}`,
      wordId: word.id,
      type: 'word',
      word,
      flipped: false,
      matched: false,
    });
  });
  return shuffle(cards);
}

export const WordMatchGame: React.FC<WordMatchGameProps> = ({
  soundEnabled,
  onReward,
  onResetStreak,
}) => {
  const [mode, setMode] = useState<WordGameMode>('dictionary');
  const [activeCategory, setActiveCategory] = useState<string>('ყველა');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Picture Quiz State
  const [questions, setQuestions] = useState<WordQuestion[]>(() => buildPictureQuiz());
  const [qIdx, setQIdx] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Memory Match State
  const [deck, setDeck] = useState<MemoryCard[]>(() => buildMemoryDeck());
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [lockBoard, setLockBoard] = useState(false);

  const filteredDictionary = useMemo(() => {
    const byCategory =
      activeCategory === 'ყველა'
        ? RUSSIAN_WORDS
        : RUSSIAN_WORDS.filter((w) => w.categoryKa === activeCategory);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter(
      (w) =>
        w.ru.toLowerCase().includes(q) ||
        w.ka.toLowerCase().includes(q) ||
        w.transcriptionKa.toLowerCase().includes(q)
    );
  }, [activeCategory, searchQuery]);

  const currentQ = questions[qIdx];
  const matchedPairs = deck.filter((c) => c.matched).length / 2;
  const memoryDone = matchedPairs === 6;

  const switchMode = (nextMode: WordGameMode) => {
    playPop(soundEnabled);
    setMode(nextMode);
    if (nextMode === 'picture-quiz') {
      restartQuiz();
    } else if (nextMode === 'memory') {
      restartMemory();
    }
  };

  const restartQuiz = () => {
    playPop(soundEnabled);
    setQuestions(buildPictureQuiz());
    setQIdx(0);
    setSelectedWordId(null);
    setScore(0);
    setQuizDone(false);
  };

  const restartMemory = () => {
    playPop(soundEnabled);
    setDeck(buildMemoryDeck());
    setFlippedUids([]);
    setMoves(0);
    setLockBoard(false);
  };

  const handleSelectPicture = (opt: VocabWord) => {
    if (selectedWordId !== null) return;
    setSelectedWordId(opt.id);
    if (opt.id === currentQ.target.id) {
      playSuccess(soundEnabled);
      setScore((s) => s + 1);
      onReward(2, currentQ.target.id);
    } else {
      playError(soundEnabled);
      onResetStreak();
    }
  };

  const handleNextQuestion = () => {
    playPop(soundEnabled);
    if (qIdx + 1 >= questions.length) {
      playFanfare(soundEnabled);
      setQuizDone(true);
    } else {
      const next = qIdx + 1;
      setQIdx(next);
      setSelectedWordId(null);
      speakRussian(questions[next].target.ru, soundEnabled, 0.85);
    }
  };

  const handleFlipCard = (card: MemoryCard) => {
    if (lockBoard || card.flipped || card.matched) return;

    playFlip(soundEnabled);
    if (card.type === 'word') {
      speakRussian(card.word.ru, soundEnabled, 0.85);
    }

    const updatedDeck = deck.map((c) =>
      c.uid === card.uid ? { ...c, flipped: true } : c
    );
    setDeck(updatedDeck);

    const nextFlipped = [...flippedUids, card.uid];
    setFlippedUids(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLockBoard(true);
      const [firstUid, secondUid] = nextFlipped;
      const firstCard = updatedDeck.find((c) => c.uid === firstUid);
      const secondCard = updatedDeck.find((c) => c.uid === secondUid);

      if (firstCard && secondCard && firstCard.wordId === secondCard.wordId) {
        setTimeout(() => {
          playSuccess(soundEnabled);
          setDeck((prev) =>
            prev.map((c) =>
              c.wordId === firstCard.wordId ? { ...c, matched: true } : c
            )
          );
          setFlippedUids([]);
          setLockBoard(false);
          onReward(2, firstCard.wordId);
        }, 350);
      } else {
        setTimeout(() => {
          setDeck((prev) =>
            prev.map((c) =>
              c.uid === firstUid || c.uid === secondUid
                ? { ...c, flipped: false }
                : c
            )
          );
          setFlippedUids([]);
          setLockBoard(false);
        }, 850);
      }
    }
  };

  return (
    <section className="space-y-6">
      {/* Mode Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            სიტყვების სამყარო ({RUSSIAN_WORDS.length} სიტყვა)
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            დაათვალიერე რეალისტური ბარათები, მოუსმინე გამოთქმას და ითამაშე
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => switchMode('dictionary')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'dictionary'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            სურათებიანი ლექსიკონი
          </button>
          <button
            type="button"
            onClick={() => switchMode('picture-quiz')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'picture-quiz'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            იპოვე სურათი
          </button>
          <button
            type="button"
            onClick={() => switchMode('memory')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'memory'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            მეხსიერების ბარათები
          </button>
        </div>
      </div>

      {mode === 'dictionary' && (
        <div className="space-y-5">
          {/* Category Filter & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {WORD_CATEGORIES.map((cat) => {
                const active = activeCategory === cat;
                const count =
                  cat === 'ყველა'
                    ? RUSSIAN_WORDS.length
                    : RUSSIAN_WORDS.filter((w) => w.categoryKa === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      playPop(soundEnabled);
                      setActiveCategory(cat);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-64 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="მოძებნე სიტყვა..."
                aria-label="სიტყვის ძებნა"
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="ძებნის გასუფთავება"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {filteredDictionary.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
              ასეთი სიტყვა ვერ მოიძებნა. სცადე სხვა საძიებო სიტყვა ან კატეგორია.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDictionary.map((word) => (
              <article
                key={word.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col hover:border-blue-300 transition-colors"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-100">
                  <RealisticIllustration
                    imageKey={word.imageKey}
                    alt={`${word.ru} — ${word.ka}`}
                    className="w-full h-full"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-display text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                        {word.ru}
                      </div>
                      <div className="text-sm font-semibold text-blue-700 mt-0.5">
                        {word.ka}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        [{word.transcriptionKa}] · {word.syllables.join('-')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        speakRussian(word.ru, soundEnabled, 0.82);
                        onReward(1, word.id);
                      }}
                      aria-label={`მოუსმინე სიტყვას ${word.ru}`}
                      className="w-11 h-11 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                    {word.categoryKa}
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </div>
      )}

      {mode === 'picture-quiz' && (
        quizDone ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-xl mx-auto text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">შესანიშნავი შედეგი!</h3>
              <p className="text-sm text-slate-600 mt-1">
                შენ გამოიცანი{' '}
                <span className="font-mono-num font-bold text-slate-900">
                  {score} / {questions.length}
                </span>{' '}
                სიტყვა
              </p>
            </div>
            <button
              type="button"
              onClick={restartQuiz}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              თავიდან თამაში
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="text-xs font-medium text-slate-500 font-mono-num mb-1">
                  შეკითხვა {qIdx + 1} / {questions.length} · სწორი: {score}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {currentQ.target.ru}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    [{currentQ.target.transcriptionKa}]
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => speakRussian(currentQ.target.ru, soundEnabled, 0.82)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                მოუსმინე სიტყვას
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentQ.options.map((opt) => {
                const isAnswered = selectedWordId !== null;
                const isCorrect = opt.id === currentQ.target.id;
                const isPicked = opt.id === selectedWordId;

                let borderStyle = 'border-slate-200 hover:border-blue-400';
                if (isAnswered) {
                  if (isCorrect) borderStyle = 'border-emerald-500 ring-2 ring-emerald-200';
                  else if (isPicked) borderStyle = 'border-rose-400 ring-2 ring-rose-200';
                  else borderStyle = 'border-slate-200 opacity-55';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectPicture(opt)}
                    className={`group relative rounded-2xl border-2 overflow-hidden bg-white text-left transition-all cursor-pointer disabled:cursor-default ${borderStyle}`}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-slate-100">
                      <RealisticIllustration
                        imageKey={opt.imageKey}
                        alt={opt.ka}
                        className="w-full h-full group-hover:scale-[1.03] transition-transform duration-200"
                      />
                    </div>
                    {isAnswered && (
                      <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {opt.ka}
                        </span>
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        {isPicked && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedWordId !== null && (
              <div
                className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  selectedWordId === currentQ.target.id
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="text-sm">
                  <span className="font-bold">
                    {selectedWordId === currentQ.target.id ? 'სწორია! ' : 'სწორი პასუხია: '}
                  </span>
                  <span className="font-display font-bold">{currentQ.target.ru}</span> ნიშნავს «
                  {currentQ.target.ka}»
                </div>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {qIdx + 1 >= questions.length ? 'შედეგის ნახვა' : 'შემდეგი'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )
      )}

      {mode === 'memory' && (
        /* Memory Match Game */
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 max-w-4xl mx-auto space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              ნაპოვნი წყვილი:{' '}
              <span className="font-mono-num font-bold text-slate-900">
                {matchedPairs} / 6
              </span>
              <span className="mx-2 text-slate-300">·</span>
              სვლები:{' '}
              <span className="font-mono-num font-bold text-slate-900">{moves}</span>
            </div>
            <button
              type="button"
              onClick={restartMemory}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              ახალი ბარათები
            </button>
          </div>

          {memoryDone && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-emerald-950 text-sm">
                <Trophy className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <span className="font-bold">ბრავო! </span>
                  ყველა 6 წყვილი იპოვე {moves} სვლაში!
                </span>
              </div>
              <button
                type="button"
                onClick={restartMemory}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                კიდევ თამაში
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
            {deck.map((card) => {
              const revealed = card.flipped || card.matched;
              return (
                <button
                  key={card.uid}
                  type="button"
                  onClick={() => handleFlipCard(card)}
                  className={`aspect-square rounded-2xl border-2 overflow-hidden transition-all duration-200 cursor-pointer ${
                    card.matched
                      ? 'border-emerald-400 bg-emerald-50'
                      : revealed
                      ? 'border-blue-500 bg-white shadow-sm'
                      : 'border-slate-200 bg-slate-100 hover:border-blue-300 hover:bg-blue-50/40'
                  }`}
                >
                  {!revealed ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2">
                      <span className="font-display text-2xl font-bold text-slate-400">
                        А—Я
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 mt-1">
                        გახსენი
                      </span>
                    </div>
                  ) : card.type === 'image' ? (
                    <div className="w-full h-full relative">
                      <RealisticIllustration
                        imageKey={card.word.imageKey}
                        alt={card.word.ka}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                      <span className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
                        {card.word.ru}
                      </span>
                      <span className="text-xs font-medium text-slate-500 mt-1">
                        {card.word.ka}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
