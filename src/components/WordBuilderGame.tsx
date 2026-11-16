import React, { useEffect, useMemo, useState } from 'react';
import { Volume2, Lightbulb, RotateCcw, ArrowRight, CheckCircle2, Trophy, Delete } from 'lucide-react';
import { RUSSIAN_WORDS } from '../data/russianWords';
import { VocabWord, WordDifficulty } from '../types/learning';
import { RealisticIllustration } from './RealisticIllustration';
import { playError, playFanfare, playPop, playSuccess, speakRussian } from '../utils/sound';

interface Tile {
  uid: string;
  char: string;
  used: boolean;
}

interface WordBuilderGameProps {
  soundEnabled: boolean;
  onReward: (stars: number, learnedWordId?: string) => void;
  onResetStreak: () => void;
}

const DECOY_POOL = ['А', 'О', 'Е', 'К', 'М', 'Т', 'Р', 'С', 'Н', 'Л', 'П', 'Д'];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createTilesForWord(word: VocabWord): Tile[] {
  const chars = word.ru.split('');
  const decoyCount = word.difficulty === 1 ? 2 : 3;
  const decoys = shuffle(DECOY_POOL.filter((c) => !chars.includes(c))).slice(0, decoyCount);
  const all = shuffle([...chars, ...decoys]);
  return all.map((char, idx) => ({
    uid: `${word.id}-${idx}-${char}`,
    char,
    used: false,
  }));
}

export const WordBuilderGame: React.FC<WordBuilderGameProps> = ({
  soundEnabled,
  onReward,
  onResetStreak,
}) => {
  const [difficulty, setDifficulty] = useState<WordDifficulty>(1);
  const [wordIndex, setWordIndex] = useState(0);
  const [slots, setSlots] = useState<(Tile | null)[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  const levelWords = useMemo(
    () => RUSSIAN_WORDS.filter((w) => w.difficulty === difficulty),
    [difficulty]
  );

  const currentWord = levelWords[wordIndex] || levelWords[0];

  const initWord = (word: VocabWord) => {
    setSlots(Array(word.ru.length).fill(null));
    setTiles(createTilesForWord(word));
    setShowHint(false);
    setStatus('IDLE');
  };

  useEffect(() => {
    if (currentWord) {
      initWord(currentWord);
    }
  }, [currentWord]);

  const handleDifficultyChange = (level: WordDifficulty) => {
    playPop(soundEnabled);
    setDifficulty(level);
    setWordIndex(0);
    setSolvedCount(0);
    setRoundCompleted(false);
  };

  const evaluateCompletion = (nextSlots: (Tile | null)[]) => {
    if (nextSlots.some((s) => s === null)) return;
    const built = nextSlots.map((s) => s?.char || '').join('');
    if (built === currentWord.ru) {
      setStatus('CORRECT');
      playSuccess(soundEnabled);
      speakRussian(currentWord.ru, soundEnabled, 0.85);
      setSolvedCount((c) => c + 1);
      onReward(3, currentWord.id);
    } else {
      setStatus('WRONG');
      playError(soundEnabled);
      onResetStreak();
    }
  };

  const handlePickTile = (tile: Tile) => {
    if (tile.used || status === 'CORRECT') return;
    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx === -1) return;

    playPop(soundEnabled);
    const nextSlots = [...slots];
    nextSlots[emptyIdx] = tile;
    setSlots(nextSlots);
    setTiles((prev) => prev.map((t) => (t.uid === tile.uid ? { ...t, used: true } : t)));
    setStatus('IDLE');
    evaluateCompletion(nextSlots);
  };

  const handleRemoveSlot = (slotIndex: number) => {
    if (status === 'CORRECT') return;
    const tile = slots[slotIndex];
    if (!tile) return;

    playPop(soundEnabled);
    const nextSlots = [...slots];
    nextSlots[slotIndex] = null;
    setSlots(nextSlots);
    setTiles((prev) => prev.map((t) => (t.uid === tile.uid ? { ...t, used: false } : t)));
    setStatus('IDLE');
  };

  const handleClearSlots = () => {
    if (status === 'CORRECT') return;
    playPop(soundEnabled);
    setSlots(Array(currentWord.ru.length).fill(null));
    setTiles((prev) => prev.map((t) => ({ ...t, used: false })));
    setStatus('IDLE');
  };

  const handleHint = () => {
    if (status === 'CORRECT') return;
    setShowHint(true);
    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx === -1) return;
    const neededChar = currentWord.ru[emptyIdx];
    const matchingTile = tiles.find((t) => !t.used && t.char === neededChar);
    if (matchingTile) {
      handlePickTile(matchingTile);
    }
  };

  const handleNextWord = () => {
    playPop(soundEnabled);
    if (wordIndex + 1 >= levelWords.length) {
      playFanfare(soundEnabled);
      setRoundCompleted(true);
    } else {
      setWordIndex((i) => i + 1);
    }
  };

  const handleRestartLevel = () => {
    playPop(soundEnabled);
    setWordIndex(0);
    setSolvedCount(0);
    setRoundCompleted(false);
    initWord(levelWords[0]);
  };

  return (
    <section className="space-y-6">
      {/* Difficulty Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">სიტყვების აწყობა ასოებით</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            შეხედე სურათს, მოუსმინე და ააწყვე რუსული სიტყვა ასოებისგან
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
          {([1, 2, 3] as WordDifficulty[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => handleDifficultyChange(lvl)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                difficulty === lvl
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lvl === 1 ? 'დონე 1 · მარტივი' : lvl === 2 ? 'დონე 2 · საშუალო' : 'დონე 3 · რთული'}
            </button>
          ))}
        </div>
      </div>

      {roundCompleted ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-xl mx-auto text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              დონე {difficulty} წარმატებით დასრულდა!
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              შენ ააწყვე ყველა სიტყვა ({solvedCount} / {levelWords.length})!
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRestartLevel}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              თავიდან
            </button>
            {difficulty < 3 && (
              <button
                type="button"
                onClick={() => handleDifficultyChange((difficulty + 1) as WordDifficulty)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                შემდეგი დონე
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-5">
            <span className="font-mono-num">
              სიტყვა {wordIndex + 1} / {levelWords.length}
            </span>
            <span>
              {currentWord.categoryKa} · {currentWord.ru.length} ასო
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-center">
            {/* Realistic Picture Card */}
            <div className="md:col-span-5 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
              <div className="aspect-square w-full overflow-hidden">
                <RealisticIllustration
                  imageKey={currentWord.imageKey}
                  alt={currentWord.ka}
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xl font-bold text-slate-900">{currentWord.ka}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    მარცვლები: {currentWord.syllables.map(() => '●').join(' - ')} ({currentWord.syllables.length} მარცვალი)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => speakRussian(currentWord.ru, soundEnabled, 0.8)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  მოსმენა
                </button>
              </div>
            </div>

            {/* Slots & Letter Tiles */}
            <div className="md:col-span-7 space-y-6">
              {/* Target Letter Slots */}
              <div>
                <div className="text-xs font-medium text-slate-500 mb-2.5">
                  დააწკაპე ასოებს ქვემოდან სიტყვის ასაწყობად:
                </div>
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleRemoveSlot(idx)}
                      disabled={!slot || status === 'CORRECT'}
                      className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 font-display text-2xl sm:text-3xl font-bold flex items-center justify-center transition-all ${
                        status === 'CORRECT'
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                          : status === 'WRONG'
                          ? 'bg-rose-50 border-rose-300 text-rose-800 cursor-pointer'
                          : slot
                          ? 'bg-white border-blue-500 text-slate-900 shadow-sm cursor-pointer hover:bg-slate-50'
                          : 'bg-slate-50 border-dashed border-slate-300 text-slate-300'
                      }`}
                    >
                      {slot ? slot.char : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrambled Tiles */}
              <div>
                <div className="flex flex-wrap gap-2.5">
                  {tiles.map((tile) => (
                    <button
                      key={tile.uid}
                      type="button"
                      disabled={tile.used || status === 'CORRECT'}
                      onClick={() => handlePickTile(tile)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border font-display text-2xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                        tile.used
                          ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-default'
                          : 'bg-white border-slate-300 text-slate-900 shadow-sm hover:border-blue-500 hover:bg-blue-50 active:scale-95'
                      }`}
                    >
                      {tile.char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleHint}
                  disabled={status === 'CORRECT'}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  მინიშნება (+1 ასო)
                </button>
                <button
                  type="button"
                  onClick={handleClearSlots}
                  disabled={status === 'CORRECT'}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Delete className="w-4 h-4 text-slate-500" />
                  გასუფთავება
                </button>
              </div>

              {showHint && status !== 'CORRECT' && (
                <div className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  მინიშნება: {currentWord.hintKa}
                </div>
              )}

              {status === 'WRONG' && (
                <div className="text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-xl p-3.5">
                  თითქმის სწორია! შეეცადე შეცვალო ასოების ადგილი — დააწკაპე შეცდომით ჩასმულ ასოს მოსაშორებლად.
                </div>
              )}

              {status === 'CORRECT' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-emerald-950">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="text-sm">
                      <span className="font-bold">შესანიშნავია! </span>
                      <span className="font-display font-bold">{currentWord.ru}</span> [
                      {currentWord.transcriptionKa}] — {currentWord.ka}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextWord}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {wordIndex + 1 >= levelWords.length ? 'დასრულება' : 'შემდეგი სიტყვა'}
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
