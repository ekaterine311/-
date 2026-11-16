import React, { useMemo, useState } from 'react';
import { Volume2, CheckCircle2, ChevronLeft, ChevronRight, AlertTriangle, Sparkles } from 'lucide-react';
import { ALPHABET_GROUPS, RUSSIAN_ALPHABET } from '../data/russianAlphabet';
import { AlphabetGroupId, RussianLetter } from '../types/learning';
import { RealisticIllustration } from './RealisticIllustration';
import { LetterCanvas } from './LetterCanvas';
import { playPop, playSuccess, speakRussian } from '../utils/sound';

interface AlphabetExplorerProps {
  learnedLetters: string[];
  soundEnabled: boolean;
  onToggleLearned: (letterId: string) => void;
  onGoToLetterGame: () => void;
}

const CATEGORY_LABELS: Record<RussianLetter['category'], string> = {
  vowel: 'ხმოვანი',
  consonant: 'თანხმოვანი',
  sign: 'უხმო ნიშანი',
};

export const AlphabetExplorer: React.FC<AlphabetExplorerProps> = ({
  learnedLetters,
  soundEnabled,
  onToggleLearned,
  onGoToLetterGame,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<AlphabetGroupId>('familiar');
  const [activeLetterId, setActiveLetterId] = useState<string>('А');

  const filteredLetters = useMemo(() => {
    if (selectedGroup === 'all') return RUSSIAN_ALPHABET;
    return RUSSIAN_ALPHABET.filter((item) => item.group === selectedGroup);
  }, [selectedGroup]);

  const activeLetter = useMemo(() => {
    return (
      filteredLetters.find((l) => l.id === activeLetterId) ||
      filteredLetters[0] ||
      RUSSIAN_ALPHABET[0]
    );
  }, [filteredLetters, activeLetterId]);

  const activeIndex = filteredLetters.findIndex((l) => l.id === activeLetter.id);
  const isLearned = learnedLetters.includes(activeLetter.id);

  const handleGroupChange = (groupId: AlphabetGroupId) => {
    playPop(soundEnabled);
    setSelectedGroup(groupId);
    const nextList =
      groupId === 'all'
        ? RUSSIAN_ALPHABET
        : RUSSIAN_ALPHABET.filter((l) => l.group === groupId);
    if (nextList.length > 0 && !nextList.some((l) => l.id === activeLetterId)) {
      setActiveLetterId(nextList[0].id);
    }
  };

  const handleSelectLetter = (letter: RussianLetter) => {
    setActiveLetterId(letter.id);
    speakRussian(letter.spokenHint, soundEnabled, 0.85);
  };

  const handlePrevNext = (dir: -1 | 1) => {
    if (filteredLetters.length === 0) return;
    const nextIdx = (activeIndex + dir + filteredLetters.length) % filteredLetters.length;
    const next = filteredLetters[nextIdx];
    setActiveLetterId(next.id);
    speakRussian(next.spokenHint, soundEnabled, 0.85);
  };

  const handleToggleMastery = () => {
    if (!isLearned) {
      playSuccess(soundEnabled);
    } else {
      playPop(soundEnabled);
    }
    onToggleLearned(activeLetter.id);
  };

  const renderHighlightedWord = (word: string, index: number) => {
    return word.split('').map((char, idx) => (
      <span
        key={idx}
        className={
          idx === index
            ? 'text-blue-600 underline decoration-blue-300 decoration-2 underline-offset-4'
            : 'text-slate-900'
        }
      >
        {char}
      </span>
    ));
  };

  const activeGroupMeta = ALPHABET_GROUPS.find((g) => g.id === selectedGroup);

  return (
    <section className="space-y-6">
      {/* Group Filter Segmented Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              რუსული ანბანის გზამკვლევი
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {activeGroupMeta?.subtitleKa}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
            {ALPHABET_GROUPS.map((group) => {
              const active = selectedGroup === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => handleGroupChange(group.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {group.labelKa}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Two-Zone Learning Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Main Stage: Detailed Letter Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-6">
          {/* Top Metadata & Navigation */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-mono-num">ასო #{activeLetter.order} / 33</span>
              <span aria-hidden="true">·</span>
              <span>{CATEGORY_LABELS[activeLetter.category]}</span>
              {isLearned && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-semibold">ნასწავლია</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handlePrevNext(-1)}
                aria-label="წინა ასო"
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handlePrevNext(1)}
                aria-label="შემდეგი ასო"
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Primary Letter + Audio + Realistic Example Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
            {/* Letter Display & Sound */}
            <div className="flex flex-col justify-between bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div>
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-7xl sm:text-8xl font-extrabold tracking-tight text-slate-900 leading-none">
                    {activeLetter.upper}{' '}
                    <span className="text-slate-400 font-semibold">{activeLetter.lower}</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-600">
                  წარმოთქმა ქართულად:{' '}
                  <span className="font-bold text-lg text-blue-700">
                    {activeLetter.phoneticKa}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => speakRussian(activeLetter.spokenHint, soundEnabled, 0.8)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  მოუსმინე ასოს
                </button>
                <button
                  type="button"
                  onClick={handleToggleMastery}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isLearned
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isLearned ? 'ნასწავლია' : 'ვისწავლე!'}
                </button>
              </div>
            </div>

            {/* Realistic Example Word Card */}
            <div className="flex flex-col justify-between border border-slate-200 rounded-xl overflow-hidden bg-white">
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <RealisticIllustration
                  imageKey={activeLetter.exampleWord.imageKey}
                  alt={`${activeLetter.exampleWord.ru} — ${activeLetter.exampleWord.ka}`}
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3 border-t border-slate-100">
                <div className="min-w-0">
                  <div className="font-display text-2xl font-bold tracking-tight truncate">
                    {renderHighlightedWord(
                      activeLetter.exampleWord.ru,
                      activeLetter.exampleWord.highlightIndex
                    )}
                  </div>
                  <div className="text-sm text-slate-600 mt-0.5 truncate">
                    <span className="font-semibold text-slate-900">
                      {activeLetter.exampleWord.ka}
                    </span>
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span className="text-slate-500">
                      [{activeLetter.exampleWord.transcriptionKa}]
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => speakRussian(activeLetter.exampleWord.ru, soundEnabled, 0.85)}
                  aria-label="მოუსმინე სიტყვას"
                  className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* False Friend Warning or Georgian Memory Tip */}
          {activeLetter.isFalseFriend && activeLetter.falseFriendNote && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-950">
                <span className="font-bold">ფრთხილად, ცრუ მეგობარი! </span>
                {activeLetter.falseFriendNote}
              </div>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="text-xs font-semibold text-slate-500">
              როგორ დავიმახსოვროთ მარტივად
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {activeLetter.georgianTip}
            </p>
            {activeLetter.cursiveTipKa && (
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-200/70">
                წერის შენიშვნა: {activeLetter.cursiveTipKa}
              </p>
            )}
          </div>

          {/* Interactive Tracing Canvas */}
          <LetterCanvas upper={activeLetter.upper} lower={activeLetter.lower} />
        </div>

        {/* Right Panel: Interactive Letter Grid */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                აირჩიე ასო სასწავლად
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                დააჭირე ნებისმიერ ბარათს ხმის მოსასმენად
              </p>
            </div>
            <span className="font-mono-num text-xs font-semibold text-slate-500">
              {filteredLetters.length} ასო
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2.5">
            {filteredLetters.map((item) => {
              const isSelected = item.id === activeLetter.id;
              const mastered = learnedLetters.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectLetter(item)}
                  className={`relative rounded-xl border p-2.5 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[76px] ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : mastered
                      ? 'bg-emerald-50/70 border-emerald-200 text-slate-900 hover:border-emerald-300'
                      : 'bg-slate-50/60 border-slate-200 text-slate-900 hover:bg-white hover:border-blue-300'
                  }`}
                >
                  {mastered && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 absolute top-1.5 right-1.5 ${
                        isSelected ? 'text-white' : 'text-emerald-600'
                      }`}
                    />
                  )}
                  {item.isFalseFriend && !mastered && (
                    <span
                      className={`text-[10px] font-bold absolute top-1 right-1.5 ${
                        isSelected ? 'text-amber-200' : 'text-amber-600'
                      }`}
                      title="ცრუ მეგობარი"
                    >
                      !
                    </span>
                  )}
                  <span className="font-display text-2xl font-bold leading-none">
                    {item.upper}
                    <span
                      className={`text-lg font-medium ml-0.5 ${
                        isSelected ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.lower}
                    </span>
                  </span>
                  <span
                    className={`text-[11px] font-medium mt-1.5 ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {item.phoneticKa.split('/')[0].replace(']', '')}]
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              მზად ხარ ცოდნის შესამოწმებლად?
            </div>
            <button
              type="button"
              onClick={onGoToLetterGame}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ასოების თამაში
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
