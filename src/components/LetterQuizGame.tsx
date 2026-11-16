import React, { useMemo, useState } from 'react';
import { Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Trophy } from 'lucide-react';
import { RUSSIAN_ALPHABET } from '../data/russianAlphabet';
import { RussianLetter } from '../types/learning';
import { RealisticIllustration } from './RealisticIllustration';
import { playError, playFanfare, playPop, playSuccess, speakRussian } from '../utils/sound';

type QuizMode = 'audio' | 'picture';
type GameState = 'PLAYING' | 'ROUND_SUMMARY';

interface Question {
  target: RussianLetter;
  options: RussianLetter[];
}

interface LetterQuizGameProps {
  soundEnabled: boolean;
  onReward: (stars: number, learnedLetterId?: string) => void;
  onResetStreak: () => void;
}

const ROUND_LENGTH = 8;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildRound(mode: QuizMode): Question[] {
  const pool =
    mode === 'picture'
      ? RUSSIAN_ALPHABET.filter(
          (l) => l.exampleWord.highlightIndex === 0 && l.category !== 'sign'
        )
      : RUSSIAN_ALPHABET;

  const pickedTargets = shuffle(pool).slice(0, ROUND_LENGTH);
  return pickedTargets.map((target) => {
    const distractors = shuffle(
      RUSSIAN_ALPHABET.filter((l) => l.id !== target.id)
    ).slice(0, 3);
    return {
      target,
      options: shuffle([target, ...distractors]),
    };
  });
}

export const LetterQuizGame: React.FC<LetterQuizGameProps> = ({
  soundEnabled,
  onReward,
  onResetStreak,
}) => {
  const [mode, setMode] = useState<QuizMode>('picture');
  const [questions, setQuestions] = useState<Question[]>(() => buildRound('picture'));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>('PLAYING');

  const currentQ = questions[currentIdx];

  const startNewRound = (nextMode: QuizMode = mode) => {
    playPop(soundEnabled);
    setMode(nextMode);
    const nextQs = buildRound(nextMode);
    setQuestions(nextQs);
    setCurrentIdx(0);
    setSelectedId(null);
    setCorrectCount(0);
    setGameState('PLAYING');
  };

  const handleChooseOption = (opt: RussianLetter) => {
    if (selectedId !== null || !currentQ) return;
    setSelectedId(opt.id);

    if (opt.id === currentQ.target.id) {
      playSuccess(soundEnabled);
      setCorrectCount((c) => c + 1);
      onReward(2, currentQ.target.id);
    } else {
      playError(soundEnabled);
      onResetStreak();
    }
  };

  const handleNext = () => {
    playPop(soundEnabled);
    if (currentIdx + 1 >= questions.length) {
      playFanfare(soundEnabled);
      setGameState('ROUND_SUMMARY');
    } else {
      const nextIndex = currentIdx + 1;
      setCurrentIdx(nextIndex);
      setSelectedId(null);
      const nextTarget = questions[nextIndex].target;
      if (mode === 'audio') {
        speakRussian(nextTarget.spokenHint, soundEnabled, 0.8);
      } else {
        speakRussian(nextTarget.exampleWord.ru, soundEnabled, 0.85);
      }
    }
  };

  const progressPct = useMemo(
    () => Math.round(((currentIdx + (selectedId ? 1 : 0)) / questions.length) * 100),
    [currentIdx, selectedId, questions.length]
  );

  return (
    <section className="space-y-6">
      {/* Mode Switch Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">ასოების გამოცნობა</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            აირჩიე სავარჯიშო რეჟიმი და მოაგროვე ვარსკვლავები
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => startNewRound('picture')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'picture'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            სურათი და პირველი ასო
          </button>
          <button
            type="button"
            onClick={() => startNewRound('audio')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'audio'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ხმით გამოცნობა
          </button>
        </div>
      </div>

      {gameState === 'ROUND_SUMMARY' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-xl mx-auto text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">ტური დასრულდა!</h3>
            <p className="text-sm text-slate-600 mt-1">
              შენ სწორად უპასუხე{' '}
              <span className="font-mono-num font-bold text-slate-900">
                {correctCount} / {questions.length}
              </span>{' '}
              შეკითხვას
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 inline-flex items-center gap-6">
            <div>
              <div className="text-xs text-slate-500">სიზუსტე</div>
              <div className="font-mono-num text-xl font-bold text-emerald-700">
                {Math.round((correctCount / questions.length) * 100)}%
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-xs text-slate-500">მოპოვებული ვარსკვლავი</div>
              <div className="font-mono-num text-xl font-bold text-amber-600">
                +{correctCount * 2} ★
              </div>
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={() => startNewRound(mode)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              თავიდან თამაში
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 max-w-4xl mx-auto space-y-6">
          {/* Progress Row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="font-mono-num">
                კითხვა {currentIdx + 1} / {questions.length}
              </span>
              <span className="font-mono-num">სწორი პასუხი: {correctCount}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Prompt Stage */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5">
              {mode === 'picture' ? (
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                  <div className="aspect-square w-full overflow-hidden">
                    <RealisticIllustration
                      imageKey={currentQ.target.exampleWord.imageKey}
                      alt={currentQ.target.exampleWord.ka}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-base font-bold text-slate-900">
                        {currentQ.target.exampleWord.ka}
                      </div>
                      <div className="text-xs text-slate-500">
                        {selectedId
                          ? `${currentQ.target.exampleWord.ru} [${currentQ.target.exampleWord.transcriptionKa}]`
                          : 'რომელ ასოზე იწყება რუსულად?'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        speakRussian(currentQ.target.exampleWord.ru, soundEnabled, 0.85)
                      }
                      aria-label="მოუსმინე სიტყვას"
                      className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 text-center space-y-4">
                  <div className="text-xs font-medium text-slate-500">
                    მოუსმინე და აირჩიე შესაბამისი რუსული ასო
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      speakRussian(currentQ.target.spokenHint, soundEnabled, 0.8)
                    }
                    className="w-20 h-20 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center mx-auto shadow-sm transition-transform active:scale-95 cursor-pointer"
                    aria-label="მოუსმინე ასოს"
                  >
                    <Volume2 className="w-9 h-9" />
                  </button>
                  <div className="text-sm text-slate-700">
                    ქართული ჟღერადობა:{' '}
                    <span className="font-bold text-blue-700 text-base">
                      {currentQ.target.phoneticKa}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 4 Letter Options */}
            <div className="md:col-span-7 space-y-4">
              <div className="text-sm font-semibold text-slate-700">
                {mode === 'picture'
                  ? `აირჩიე ასო, რომელზეც იწყება «${currentQ.target.exampleWord.ka}»:`
                  : 'რომელი რუსული ასო ისმის?'}
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {currentQ.options.map((opt) => {
                  const isAnswered = selectedId !== null;
                  const isCorrect = opt.id === currentQ.target.id;
                  const isPicked = opt.id === selectedId;

                  let cardStyle =
                    'bg-white border-slate-200 text-slate-900 hover:border-blue-400 hover:bg-blue-50/40';
                  if (isAnswered) {
                    if (isCorrect) {
                      cardStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900';
                    } else if (isPicked) {
                      cardStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                    } else {
                      cardStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-65';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleChooseOption(opt)}
                      className={`relative rounded-2xl border-2 p-5 flex flex-col items-center justify-center min-h-[112px] transition-all cursor-pointer disabled:cursor-default ${cardStyle}`}
                    >
                      <span className="font-display text-4xl font-extrabold leading-none">
                        {opt.upper} {opt.lower}
                      </span>
                      {isAnswered && (
                        <span className="text-xs font-semibold mt-2">
                          {opt.phoneticKa}
                        </span>
                      )}
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute top-2.5 right-2.5" />
                      )}
                      {isAnswered && isPicked && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 absolute top-2.5 right-2.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Banner */}
              {selectedId !== null && (
                <div
                  className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    selectedId === currentQ.target.id
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="text-sm">
                    <span className="font-bold">
                      {selectedId === currentQ.target.id ? 'ყოჩაღ, სწორია! ' : 'სწორი პასუხია: '}
                    </span>
                    <span className="font-display font-bold">{currentQ.target.upper}</span>{' '}
                    {currentQ.target.phoneticKa} — {currentQ.target.exampleWord.ru} (
                    {currentQ.target.exampleWord.ka})
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {currentIdx + 1 >= questions.length ? 'შედეგის ნახვა' : 'შემდეგი'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
