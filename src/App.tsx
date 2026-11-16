import { useEffect, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, ArrowRight } from 'lucide-react';
import { NavTab, PlayerProgress } from './types/learning';
import { RUSSIAN_ALPHABET } from './data/russianAlphabet';
import { RUSSIAN_WORDS } from './data/russianWords';
import { HERO_DESK_IMAGE } from './components/RealisticIllustration';
import { AlphabetExplorer } from './components/AlphabetExplorer';
import { LetterQuizGame } from './components/LetterQuizGame';
import { WordBuilderGame } from './components/WordBuilderGame';
import { WordMatchGame } from './components/WordMatchGame';
import { DailyChallengeView } from './components/DailyChallengeView';
import { PWAInstallButton, PWAUpdatePrompt, OfflineIndicator } from './components/PWAControls';
import { playPop } from './utils/sound';

const STORAGE_KEY = 'rusuli_anbani_progress_v1';

const DEFAULT_PROGRESS: PlayerProgress = {
  learnedLetters: [],
  learnedWords: [],
  stars: 0,
  streak: 0,
  bestStreak: 0,
  soundEnabled: true,
};

const NAV_ITEMS: { id: Exclude<NavTab, 'daily-challenge'>; label: string }[] = [
  { id: 'alphabet', label: 'ანბანი' },
  { id: 'letter-game', label: 'ასოები' },
  { id: 'word-builder', label: 'აწყობა' },
  { id: 'word-match', label: 'სიტყვები' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('alphabet');
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore storage errors
    }
  }, [progress]);

  const handleTabChange = (tab: NavTab) => {
    playPop(progress.soundEnabled);
    setActiveTab(tab);
  };

  const handleToggleLearnedLetter = (letterId: string) => {
    setProgress((prev) => {
      const exists = prev.learnedLetters.includes(letterId);
      const nextLetters = exists
        ? prev.learnedLetters.filter((id) => id !== letterId)
        : [...prev.learnedLetters, letterId];
      return {
        ...prev,
        learnedLetters: nextLetters,
        stars: exists ? prev.stars : prev.stars + 1,
      };
    });
  };

  const handleReward = (starsToAdd: number, learnedLetterId?: string, learnedWordId?: string) => {
    setProgress((prev) => {
      const nextStreak = prev.streak + 1;
      const nextLetters =
        learnedLetterId && !prev.learnedLetters.includes(learnedLetterId)
          ? [...prev.learnedLetters, learnedLetterId]
          : prev.learnedLetters;
      const nextWords =
        learnedWordId && !prev.learnedWords.includes(learnedWordId)
          ? [...prev.learnedWords, learnedWordId]
          : prev.learnedWords;
      return {
        ...prev,
        learnedLetters: nextLetters,
        learnedWords: nextWords,
        stars: prev.stars + starsToAdd,
        streak: nextStreak,
        bestStreak: Math.max(prev.bestStreak, nextStreak),
      };
    });
  };

  const handleResetStreak = () => {
    setProgress((prev) => ({ ...prev, streak: 0 }));
  };

  const handleToggleSound = () => {
    setProgress((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleResetProgress = () => {
    playPop(progress.soundEnabled);
    setProgress((prev) => ({
      ...DEFAULT_PROGRESS,
      soundEnabled: prev.soundEnabled,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar */}
      <header className="md:sticky md:top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleTabChange('alphabet')}
            className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            რუსული ანბანი
          </button>

          {/* Zone 2: Concise Single-line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    active
                      ? 'text-blue-700 border-blue-600'
                      : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary CTA Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => handleTabChange('daily-challenge')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'daily-challenge'
                  ? 'bg-slate-900 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              დღის გამოწვევა
            </button>
          </div>
        </div>

        {/* Mobile Nav Strip */}
        <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
                  active ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Progress & Audio HUD Strip (Clean unboxed metadata with typographic separators) */}
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-600">
            <span>
              ასოები:{' '}
              <strong className="font-mono-num text-slate-900">
                {progress.learnedLetters.length} / {RUSSIAN_ALPHABET.length}
              </strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              სიტყვები:{' '}
              <strong className="font-mono-num text-slate-900">
                {progress.learnedWords.length} / {RUSSIAN_WORDS.length}
              </strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              ვარსკვლავი:{' '}
              <strong className="font-mono-num text-amber-600">{progress.stars} ★</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              სერია:{' '}
              <strong className="font-mono-num text-emerald-700">{progress.streak}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <PWAInstallButton />
            <button
              type="button"
              onClick={handleToggleSound}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {progress.soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  ხმა ჩართულია
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  ხმა გამორთულია
                </>
              )}
            </button>
            {(progress.stars > 0 || progress.learnedLetters.length > 0) && (
              <button
                type="button"
                onClick={handleResetProgress}
                title="პროგრესის განულება"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                განულება
              </button>
            )}
          </div>
        </div>

        {/* Hero Overview Banner on Alphabet Home */}
        {activeTab === 'alphabet' && (
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-blue-700">
                  მე-5 კლასის თვალსაჩინო ენციკლოპედია · ასოებიდან სიტყვებამდე
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
                  ისწავლე რუსული ანბანი და სიტყვები მარტივად, რეალისტური ნახატებით
                </h1>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  ჯერ გაეცანი 33 ასოს ქართული მინიშნებებით, მოუსმინე სწორ გამოთქმას და შემოხაზე თითით, შემდეგ კი ითამაშე სიტყვების აწყობა და სურათების გამოცნობა.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleTabChange('word-builder')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  სიტყვების აწყობა
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('word-match')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  სურათების თამაში
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 min-h-[220px] bg-slate-100 overflow-hidden">
              <img
                src={HERO_DESK_IMAGE}
                alt="სასწავლო მაგიდა ილუსტრირებული წიგნით, ასოების კუბიკებითა და გლობუსით"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </section>
        )}

        {/* Active Learning / Game View */}
        {activeTab === 'alphabet' && (
          <AlphabetExplorer
            learnedLetters={progress.learnedLetters}
            soundEnabled={progress.soundEnabled}
            onToggleLearned={handleToggleLearnedLetter}
            onGoToLetterGame={() => handleTabChange('letter-game')}
          />
        )}

        {activeTab === 'letter-game' && (
          <LetterQuizGame
            soundEnabled={progress.soundEnabled}
            onReward={(stars, letterId) => handleReward(stars, letterId)}
            onResetStreak={handleResetStreak}
          />
        )}

        {activeTab === 'word-builder' && (
          <WordBuilderGame
            soundEnabled={progress.soundEnabled}
            onReward={(stars, wordId) => handleReward(stars, undefined, wordId)}
            onResetStreak={handleResetStreak}
          />
        )}

        {activeTab === 'word-match' && (
          <WordMatchGame
            soundEnabled={progress.soundEnabled}
            onReward={(stars, wordId) => handleReward(stars, undefined, wordId)}
            onResetStreak={handleResetStreak}
          />
        )}

        {activeTab === 'daily-challenge' && (
          <DailyChallengeView
            soundEnabled={progress.soundEnabled}
            onReward={handleReward}
            onResetStreak={handleResetStreak}
            onBackToAlphabet={() => handleTabChange('alphabet')}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>რუსული ანბანი · 5 კლასის თვალსაჩინო სავარჯიშო თამაში</span>
          <span>{RUSSIAN_ALPHABET.length} ასო · {RUSSIAN_WORDS.length} სიტყვა · რეალისტური ნახატები და ხმოვანი გახმოვანება</span>
        </div>
      </footer>

      <PWAUpdatePrompt />
      <OfflineIndicator />
    </div>
  );
}
