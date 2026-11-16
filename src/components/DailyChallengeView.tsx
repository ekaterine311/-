import React, { useState } from 'react';
import { Volume2, CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { RUSSIAN_ALPHABET } from '../data/russianAlphabet';
import { RUSSIAN_WORDS } from '../data/russianWords';
import { RussianLetter, VocabWord } from '../types/learning';
import { RealisticIllustration } from './RealisticIllustration';
import { playError, playFanfare, playPop, playSuccess, speakRussian } from '../utils/sound';

type ChallengeItem =
  | {
      kind: 'letter-audio';
      target: RussianLetter;
      options: RussianLetter[];
    }
  | {
      kind: 'word-picture';
      target: VocabWord;
      options: VocabWord[];
    };

interface DailyChallengeViewProps {
  soundEnabled: boolean;
  onReward: (stars: number, learnedLetterId?: string, learnedWordId?: string) => void;
  onResetStreak: () => void;
  onBackToAlphabet: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateChallenge(): ChallengeItem[] {
  const letters = shuffle(RUSSIAN_ALPHABET).slice(0, 4);
  const words = shuffle(RUSSIAN_WORDS).slice(0, 4);

  const items: ChallengeItem[] = [];

  for (let i = 0; i < 4; i++) {
    const l = letters[i];
    const lDistractors = shuffle(RUSSIAN_ALPHABET.filter((x) => x.id !== l.id)).slice(0, 3);
    items.push({
      kind: 'letter-audio',
      target: l,
      options: shuffle([l, ...lDistractors]),
    });

    const w = words[i];
    const wDistractors = shuffle(RUSSIAN_WORDS.filter((x) => x.id !== w.id)).slice(0, 3);
    items.push({
      kind: 'word-picture',
      target: w,
      options: shuffle([w, ...wDistractors]),
    });
  }

  return items;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({
  soundEnabled,
  onReward,
  onResetStreak,
  onBackToAlphabet,
}) => {
  const [items, setItems] = useState<ChallengeItem[]>(() => generateChallenge());
  const [idx, setIdx] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = items[idx];

  const handleRestart = () => {
    playPop(soundEnabled);
    setItems(generateChallenge());
    setIdx(0);
    setPickedId(null);
    setCorrectCount(0);
    setFinished(false);
  };

  const handleAnswer = (id: string) => {
    if (pickedId !== null) return;
    setPickedId(id);

    const isRight =
      current.kind === 'letter-audio'
        ? id === current.target.id
        : id === current.target.id;

    if (isRight) {
      playSuccess(soundEnabled);
      setCorrectCount((c) => c + 1);
      if (current.kind === 'letter-audio') {
        onReward(3, current.target.id);
      } else {
        onReward(3, undefined, current.target.id);
      }
    } else {
      playError(soundEnabled);
      onResetStreak();
    }
  };

  const handleNext = () => {
    playPop(soundEnabled);
    if (idx + 1 >= items.length) {
      playFanfare(soundEnabled);
      setFinished(true);
    } else {
      const nextIdx = idx + 1;
      setIdx(nextIdx);
      setPickedId(null);
      const nextItem = items[nextIdx];
      if (nextItem.kind === 'letter-audio') {
        speakRussian(nextItem.target.spokenHint, soundEnabled, 0.8);
      } else {
        speakRussian(nextItem.target.ru, soundEnabled, 0.85);
      }
    }
  };

  if (finished) {
    return (
      <section className="bg-white border border-slate-200 rounded-2xl p-8 max-w-xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">დღის გამოწვევა დასრულდა!</h2>
          <p className="text-sm text-slate-600 mt-1.5">
            შენ შეაგროვე{' '}
            <span className="font-mono-num font-bold text-slate-900">
              {correctCount} / {items.length}
            </span>{' '}
            სწორი პასუხი და{' '}
            <span className="font-mono-num font-bold text-amber-600">
              +{correctCount * 3} ★
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            ახალი გამოწვევა
          </button>
          <button
            type="button"
            onClick={onBackToAlphabet}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
          >
            ანბანზე დაბრუნება
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">დღის შერეული გამოწვევა</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ასოები და სიტყვები ერთად · თითო სწორი პასუხი = +3 ★
          </p>
        </div>
        <div className="font-mono-num text-sm font-bold text-slate-700">
          {idx + 1} / {items.length}
        </div>
      </div>

      {current.kind === 'letter-audio' ? (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-slate-500">დავალება: ასოს გამოცნობა</div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                რომელი რუსული ასო ისმის? ჟღერადობა: <span className="text-blue-700">{current.target.phoneticKa}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => speakRussian(current.target.spokenHint, soundEnabled, 0.8)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              მოუსმინე ასოს
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {current.options.map((opt) => {
              const answered = pickedId !== null;
              const isRight = opt.id === current.target.id;
              const isPicked = opt.id === pickedId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={answered}
                  onClick={() => handleAnswer(opt.id)}
                  className={`relative rounded-2xl border-2 p-6 flex flex-col items-center justify-center transition-all cursor-pointer disabled:cursor-default ${
                    answered
                      ? isRight
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                        : isPicked
                        ? 'bg-rose-50 border-rose-300 text-rose-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                      : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-slate-900'
                  }`}
                >
                  <span className="font-display text-4xl font-extrabold">
                    {opt.upper} {opt.lower}
                  </span>
                  {answered && isRight && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute top-2.5 right-2.5" />
                  )}
                  {answered && isPicked && !isRight && (
                    <XCircle className="w-5 h-5 text-rose-600 absolute top-2.5 right-2.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-slate-500">დავალება: სიტყვის პოვნა</div>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-display text-3xl font-extrabold text-slate-900">
                  {current.target.ru}
                </span>
                <span className="text-sm text-slate-500">[{current.target.transcriptionKa}]</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => speakRussian(current.target.ru, soundEnabled, 0.82)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              მოუსმინე სიტყვას
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {current.options.map((opt) => {
              const answered = pickedId !== null;
              const isRight = opt.id === current.target.id;
              const isPicked = opt.id === pickedId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={answered}
                  onClick={() => handleAnswer(opt.id)}
                  className={`rounded-2xl border-2 overflow-hidden bg-white text-left transition-all cursor-pointer disabled:cursor-default ${
                    answered
                      ? isRight
                        ? 'border-emerald-500 ring-2 ring-emerald-200'
                        : isPicked
                        ? 'border-rose-400 ring-2 ring-rose-200'
                        : 'border-slate-200 opacity-55'
                      : 'border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div className="aspect-square w-full overflow-hidden bg-slate-100">
                    <RealisticIllustration
                      imageKey={opt.imageKey}
                      alt={opt.ka}
                      className="w-full h-full"
                    />
                  </div>
                  {answered && (
                    <div className="p-2.5 bg-white border-t border-slate-100 text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>{opt.ka}</span>
                      {isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {isPicked && !isRight && <XCircle className="w-4 h-4 text-rose-600" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {pickedId !== null && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {idx + 1 >= items.length ? 'შედეგის ნახვა' : 'შემდეგი დავალება'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
