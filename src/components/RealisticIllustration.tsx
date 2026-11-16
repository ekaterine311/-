import React, { useState } from 'react';

export const HERO_DESK_IMAGE = '/src/assets/images/hero_desk_adventure_1794861478557.jpg';

const GENERATED_IMAGES: Record<string, { src: string; imgClassName?: string }> = {
  watermelon: { src: '/src/assets/images/pic_watermelon_1794861478900.jpg' },
  bear: { src: '/src/assets/images/pic_bear_1794861479108.jpg' },
  cat: { src: '/src/assets/images/pic_cat_1794861479392.jpg' },
  apple: { src: '/src/assets/images/pic_apple_1794861480280.jpg' },
  fox: { src: '/src/assets/images/pic_fox_1794861480462.jpg' },
  train: { src: '/src/assets/images/pic_train_1794861480486.jpg' },
  owl: {
    src: '/src/assets/images/pic_owl_1794861480366.jpg',
    imgClassName: 'object-cover object-[50%_26%] scale-[1.15]',
  },
  rocket: { src: '/src/assets/images/pic_rocket_1794861481021.jpg' },
  house: { src: '/src/assets/images/pic_house_1794861481519.jpg' },
};

interface RealisticIllustrationProps {
  imageKey: string;
  alt: string;
  className?: string;
}

export const RealisticIllustration: React.FC<RealisticIllustrationProps> = ({
  imageKey,
  alt,
  className = '',
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const generated = GENERATED_IMAGES[imageKey];

  if (generated && !imgFailed) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
        <img
          src={generated.src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgFailed(true)}
          className={`w-full h-full object-cover ${generated.imgClassName ?? ''}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/60 ${className}`}
      role="img"
      aria-label={alt}
    >
      <PainterlyVectorArt imageKey={imageKey} />
    </div>
  );
};

const PainterlyVectorArt: React.FC<{ imageKey: string }> = ({ imageKey }) => {
  switch (imageKey) {
    case 'butterfly':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="skyBf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eff6ff" />
              <stop offset="100%" stopColor="#f0fdf4" />
            </linearGradient>
            <radialGradient id="wingTop" cx="40%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="65%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#7c2d12" />
            </radialGradient>
            <radialGradient id="wingBot" cx="45%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#fdba74" />
              <stop offset="70%" stopColor="#c2410c" />
              <stop offset="100%" stopColor="#431407" />
            </radialGradient>
          </defs>
          <rect width="200" height="200" fill="url(#skyBf)" />
          <ellipse cx="100" cy="162" rx="48" ry="8" fill="#cbd5e1" opacity="0.45" />
          {/* Left Wings */}
          <path d="M97 96 C62 42, 22 44, 30 88 C35 112, 68 115, 97 104 Z" fill="url(#wingTop)" stroke="#431407" strokeWidth="2.5" />
          <path d="M97 106 C65 114, 42 138, 56 154 C70 168, 90 144, 97 116 Z" fill="url(#wingBot)" stroke="#431407" strokeWidth="2.5" />
          {/* Right Wings */}
          <path d="M103 96 C138 42, 178 44, 170 88 C165 112, 132 115, 103 104 Z" fill="url(#wingTop)" stroke="#431407" strokeWidth="2.5" />
          <path d="M103 106 C135 114, 158 138, 144 154 C130 168, 110 144, 103 116 Z" fill="url(#wingBot)" stroke="#431407" strokeWidth="2.5" />
          {/* Wing Spots */}
          <circle cx="52" cy="76" r="7" fill="#fef3c7" opacity="0.9" />
          <circle cx="148" cy="76" r="7" fill="#fef3c7" opacity="0.9" />
          <circle cx="67" cy="136" r="5" fill="#fef3c7" opacity="0.85" />
          <circle cx="133" cy="136" r="5" fill="#fef3c7" opacity="0.85" />
          {/* Body */}
          <ellipse cx="100" cy="106" rx="5.5" ry="30" fill="#1e293b" />
          <circle cx="100" cy="74" r="6" fill="#0f172a" />
          <path d="M98 69 Q86 48 76 48" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <path d="M102 69 Q114 48 124 48" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'wolf':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="wolfSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>
            <linearGradient id="wolfFur" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="60%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#wolfSky)" />
          <path d="M0 155 Q60 140 120 152 T200 148 L200 200 L0 200 Z" fill="#cbd5e1" opacity="0.5" />
          {/* Neck & Shoulders */}
          <path d="M55 180 Q68 125 85 112 L115 112 Q132 125 145 180 Z" fill="url(#wolfFur)" />
          <path d="M78 130 Q100 165 122 130 L114 178 L86 178 Z" fill="#e2e8f0" />
          {/* Ears */}
          <polygon points="66,78 58,34 86,58" fill="#475569" />
          <polygon points="68,72 64,45 81,59" fill="#cbd5e1" />
          <polygon points="134,78 142,34 114,58" fill="#475569" />
          <polygon points="132,72 136,45 119,59" fill="#cbd5e1" />
          {/* Head */}
          <path d="M62 82 Q60 54 100 54 Q140 54 138 82 Q138 118 100 128 Q62 118 62 82 Z" fill="url(#wolfFur)" />
          {/* Cheeks & Snout */}
          <path d="M72 95 Q100 84 128 95 Q122 124 100 128 Q78 124 72 95 Z" fill="#f1f5f9" />
          <ellipse cx="100" cy="112" rx="9" ry="6" fill="#0f172a" />
          {/* Eyes */}
          <ellipse cx="83" cy="82" rx="6" ry="4.5" fill="#fbbf24" />
          <circle cx="83" cy="82" r="2.2" fill="#0f172a" />
          <ellipse cx="117" cy="82" rx="6" ry="4.5" fill="#fbbf24" />
          <circle cx="117" cy="82" r="2.2" fill="#0f172a" />
        </svg>
      );

    case 'mushroom':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="mushBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ecfdf5" />
              <stop offset="100%" stopColor="#fefce8" />
            </linearGradient>
            <radialGradient id="mushCap" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="65%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>
            <linearGradient id="mushStem" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#fffbeb" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#mushBg)" />
          <ellipse cx="100" cy="166" rx="56" ry="12" fill="#86efac" opacity="0.6" />
          <path d="M80 96 C78 125 70 156 76 164 C90 170 112 170 124 164 C130 156 122 125 120 96 Z" fill="url(#mushStem)" stroke="#d97706" strokeWidth="1.5" />
          <path d="M38 100 C38 52 162 52 162 100 C162 108 38 108 38 100 Z" fill="url(#mushCap)" />
          <ellipse cx="78" cy="68" rx="18" ry="6" fill="#fde68a" opacity="0.22" transform="rotate(-15 78 68)" />
          <path d="M52 166 Q60 144 68 166 M132 166 Q142 142 148 166" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'pine':
    case 'tree':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="treeBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#f0fdf4" />
            </linearGradient>
            <linearGradient id="pineGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#treeBg)" />
          <ellipse cx="100" cy="170" rx="64" ry="10" fill="#bbf7d0" />
          <rect x="90" y="128" width="20" height="42" rx="4" fill="#78350f" />
          {imageKey === 'pine' ? (
            <>
              <polygon points="100,28 56,82 144,82" fill="url(#pineGrad)" />
              <polygon points="100,56 46,114 154,114" fill="url(#pineGrad)" />
              <polygon points="100,84 36,144 164,144" fill="url(#pineGrad)" />
            </>
          ) : (
            <>
              <circle cx="100" cy="76" r="42" fill="#16a34a" />
              <circle cx="72" cy="94" r="30" fill="#15803d" />
              <circle cx="128" cy="94" r="30" fill="#22c55e" />
              <circle cx="94" cy="64" r="22" fill="#4ade80" opacity="0.45" />
            </>
          )}
        </svg>
      );

    case 'hedgehog':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#f0fdf4" />
          <ellipse cx="100" cy="158" rx="60" ry="10" fill="#bbf7d0" />
          {/* Spines */}
          <path d="M44 128 Q40 72 95 66 Q142 66 156 106 L142 138 L52 138 Z" fill="#451a03" />
          <path d="M54 125 Q54 78 96 74 Q134 74 146 108" fill="none" stroke="#92400e" strokeWidth="5" strokeDasharray="4 6" strokeLinecap="round" />
          {/* Face */}
          <path d="M98 102 Q135 92 162 122 Q142 146 102 142 Z" fill="#fed7aa" />
          <circle cx="160" cy="122" r="5" fill="#0f172a" />
          <circle cx="128" cy="112" r="4" fill="#0f172a" />
          <circle cx="129" cy="111" r="1.4" fill="#fff" />
          <ellipse cx="78" cy="146" rx="9" ry="5" fill="#9a3412" />
          <ellipse cx="122" cy="146" rx="9" ry="5" fill="#9a3412" />
        </svg>
      );

    case 'beetle':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#ecfeff" />
          <ellipse cx="100" cy="164" rx="45" ry="9" fill="#bae6fd" opacity="0.6" />
          <g stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M72 86 L46 70" /><path d="M128 86 L154 70" />
            <path d="M68 108 L42 108" /><path d="M132 108 L158 108" />
            <path d="M72 130 L48 148" /><path d="M128 130 L152 148" />
          </g>
          <ellipse cx="100" cy="110" rx="34" ry="44" fill="#0f766e" stroke="#134e4a" strokeWidth="3" />
          <line x1="100" y1="84" x2="100" y2="154" stroke="#042f2e" strokeWidth="2.5" />
          <path d="M72 84 Q100 62 128 84" fill="#115e59" />
          <circle cx="100" cy="64" r="14" fill="#0f172a" />
          <ellipse cx="86" cy="108" rx="7" ry="18" fill="#5eead4" opacity="0.28" transform="rotate(-12 86 108)" />
        </svg>
      );

    case 'star':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="nightStar" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="goldStar" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#nightStar)" />
          <circle cx="36" cy="40" r="2" fill="#fff" opacity="0.7" />
          <circle cx="164" cy="48" r="2.5" fill="#fff" opacity="0.8" />
          <circle cx="152" cy="158" r="2" fill="#fff" opacity="0.6" />
          <circle cx="44" cy="148" r="1.5" fill="#fff" opacity="0.7" />
          <polygon
            points="100,32 120,76 168,82 132,114 142,162 100,138 58,162 68,114 32,82 80,76"
            fill="url(#goldStar)"
            stroke="#fef9c3"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'sun':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="sunSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
            <radialGradient id="sunCore" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="65%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>
          </defs>
          <rect width="200" height="200" fill="url(#sunSky)" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="26"
              x2="100"
              y2="46"
              stroke="#f59e0b"
              strokeWidth="6"
              strokeLinecap="round"
              transform={`rotate(${i * 30} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="44" fill="url(#sunCore)" />
        </svg>
      );

    case 'cloud':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <linearGradient id="cloudSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>
          <rect width="200" height="200" fill="url(#cloudSky)" />
          <path
            d="M46 132 C30 132 22 118 26 105 C30 92 44 86 56 88 C62 66 86 56 108 64 C122 54 146 60 152 80 C168 82 178 96 174 112 C170 124 158 132 142 132 Z"
            fill="#ffffff"
          />
          <path d="M48 132 L144 132 C156 132 168 124 172 116 C158 122 142 124 100 124 C66 124 44 122 30 116 C34 126 42 132 48 132 Z" fill="#e2e8f0" />
        </svg>
      );

    case 'rainbow':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#e0f2fe" />
          <path d="M22 148 A78 78 0 0 1 178 148" fill="none" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
          <path d="M32 148 A68 68 0 0 1 168 148" fill="none" stroke="#f97316" strokeWidth="10" strokeLinecap="round" />
          <path d="M42 148 A58 58 0 0 1 158 148" fill="none" stroke="#eab308" strokeWidth="10" strokeLinecap="round" />
          <path d="M52 148 A48 48 0 0 1 148 148" fill="none" stroke="#22c55e" strokeWidth="10" strokeLinecap="round" />
          <path d="M62 148 A38 38 0 0 1 138 148" fill="none" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" />
          <path d="M72 148 A28 28 0 0 1 128 148" fill="none" stroke="#8b5cf6" strokeWidth="10" strokeLinecap="round" />
          <circle cx="36" cy="152" r="18" fill="#fff" />
          <circle cx="52" cy="148" r="15" fill="#fff" />
          <circle cx="164" cy="152" r="18" fill="#fff" />
          <circle cx="148" cy="148" r="15" fill="#fff" />
        </svg>
      );

    case 'elephant':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#fefce8" />
          <ellipse cx="100" cy="166" rx="56" ry="10" fill="#fde68a" opacity="0.6" />
          <ellipse cx="132" cy="112" rx="40" ry="34" fill="#64748b" />
          <rect x="104" y="132" width="16" height="32" rx="6" fill="#475569" />
          <rect x="144" y="132" width="16" height="32" rx="6" fill="#475569" />
          <circle cx="82" cy="94" r="30" fill="#94a3b8" />
          <ellipse cx="100" cy="96" rx="22" ry="28" fill="#64748b" />
          <path d="M56 102 Q42 134 58 148 Q66 154 70 144 Q62 132 68 108" fill="#94a3b8" />
          <path d="M64 114 Q52 124 44 116" fill="none" stroke="#fef9c3" strokeWidth="5" strokeLinecap="round" />
          <circle cx="72" cy="84" r="4" fill="#0f172a" />
        </svg>
      );

    case 'fish':
    case 'pike':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <linearGradient id="waterFish" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cffafe" />
            <stop offset="100%" stopColor="#a5f3fc" />
          </linearGradient>
          <rect width="200" height="200" fill="url(#waterFish)" />
          <polygon points="146,100 180,74 172,100 180,126" fill={imageKey === 'pike' ? '#15803d' : '#ea580c'} />
          <ellipse cx="100" cy="100" rx="54" ry="26" fill={imageKey === 'pike' ? '#16a34a' : '#f97316'} />
          <ellipse cx="100" cy="108" rx="44" ry="14" fill={imageKey === 'pike' ? '#bbf7d0' : '#fed7aa'} opacity="0.7" />
          <circle cx="64" cy="94" r="5.5" fill="#fff" />
          <circle cx="63" cy="94" r="2.8" fill="#0f172a" />
          <circle cx="38" cy="74" r="5" fill="#fff" opacity="0.7" />
          <circle cx="28" cy="56" r="3.5" fill="#fff" opacity="0.6" />
        </svg>
      );

    case 'tiger':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#fef3c7" />
          <circle cx="62" cy="64" r="14" fill="#ea580c" />
          <circle cx="138" cy="64" r="14" fill="#ea580c" />
          <circle cx="100" cy="106" r="48" fill="#f97316" />
          <ellipse cx="100" cy="124" rx="28" ry="20" fill="#fff7ed" />
          <path d="M72 74 L84 86 M128 74 L116 86 M100 62 L100 78 M56 104 L70 108 M144 104 L130 108" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
          <polygon points="92,114 108,114 100,124" fill="#ec4899" />
          <circle cx="82" cy="96" r="5" fill="#0f172a" />
          <circle cx="118" cy="96" r="5" fill="#0f172a" />
        </svg>
      );

    case 'dog':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#ecfdf5" />
          <ellipse cx="56" cy="92" rx="14" ry="30" fill="#78350f" transform="rotate(14 56 92)" />
          <ellipse cx="144" cy="92" rx="14" ry="30" fill="#78350f" transform="rotate(-14 144 92)" />
          <circle cx="100" cy="100" r="42" fill="#d97706" />
          <ellipse cx="100" cy="118" rx="22" ry="18" fill="#fef3c7" />
          <ellipse cx="100" cy="110" rx="8" ry="6" fill="#0f172a" />
          <circle cx="84" cy="90" r="4.5" fill="#0f172a" />
          <circle cx="116" cy="90" r="4.5" fill="#0f172a" />
          <path d="M94 128 Q100 136 106 128" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'duck':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#e0f2fe" />
          <path d="M0 144 Q50 134 100 144 T200 144 L200 200 L0 200 Z" fill="#38bdf8" />
          <ellipse cx="106" cy="126" rx="44" ry="28" fill="#facc15" />
          <circle cx="78" cy="84" r="24" fill="#fde047" />
          <path d="M56 86 L34 92 L56 98 Z" fill="#ea580c" />
          <circle cx="72" cy="78" r="4" fill="#0f172a" />
        </svg>
      );

    case 'rhino':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#f1f5f9" />
          <ellipse cx="114" cy="118" rx="48" ry="32" fill="#64748b" />
          <rect x="82" y="136" width="16" height="26" rx="4" fill="#475569" />
          <rect x="132" y="136" width="16" height="26" rx="4" fill="#475569" />
          <path d="M44 114 Q44 86 78 86 L92 126 Q54 134 44 114 Z" fill="#94a3b8" />
          <path d="M48 94 L32 68 L60 88 Z" fill="#e2e8f0" />
          <circle cx="68" cy="100" r="3.5" fill="#0f172a" />
        </svg>
      );

    case 'flower':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#fdf2f8" />
          <path d="M100 100 L100 174" stroke="#15803d" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="122" cy="144" rx="18" ry="8" fill="#22c55e" transform="rotate(-24 122 144)" />
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse
              key={i}
              cx="100"
              cy="56"
              rx="18"
              ry="28"
              fill="#ec4899"
              transform={`rotate(${i * 60} 100 92)`}
            />
          ))}
          <circle cx="100" cy="92" r="20" fill="#facc15" />
        </svg>
      );

    case 'bread':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#fffbeb" />
          <ellipse cx="100" cy="152" rx="64" ry="12" fill="#fde68a" />
          <path d="M36 122 C36 74 164 74 164 122 L156 144 L44 144 Z" fill="#d97706" />
          <path d="M42 122 C42 82 158 82 158 122 Z" fill="#f59e0b" />
          <path d="M68 92 L82 110 M96 88 L110 108 M124 92 L136 110" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'cheese':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#fefce8" />
          <polygon points="36,126 140,64 164,104 36,126" fill="#fde047" />
          <polygon points="36,126 164,104 164,148 36,148" fill="#facc15" />
          <circle cx="76" cy="130" r="9" fill="#ca8a04" />
          <circle cx="118" cy="122" r="11" fill="#ca8a04" />
          <circle cx="144" cy="134" r="6" fill="#ca8a04" />
        </svg>
      );

    case 'milk':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#eff6ff" />
          <rect x="64" y="64" width="72" height="104" rx="10" fill="#ffffff" stroke="#93c5fd" strokeWidth="3" />
          <rect x="64" y="96" width="72" height="44" fill="#3b82f6" opacity="0.16" />
          <path d="M74 64 L84 42 L116 42 L126 64 Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth="3" />
          <rect x="86" y="34" width="28" height="10" rx="3" fill="#2563eb" />
        </svg>
      );

    case 'yogurt':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#fdf2f8" />
          <polygon points="62,74 138,74 126,158 74,158" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
          <rect x="56" y="64" width="88" height="14" rx="6" fill="#ec4899" />
          <circle cx="100" cy="116" r="16" fill="#f43f5e" opacity="0.8" />
        </svg>
      );

    case 'clock':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#f8fafc" />
          <circle cx="100" cy="100" r="62" fill="#1e293b" />
          <circle cx="100" cy="100" r="52" fill="#ffffff" />
          <line x1="100" y1="100" x2="100" y2="62" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
          <line x1="100" y1="100" x2="130" y2="112" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="100" r="5" fill="#0f172a" />
        </svg>
      );

    case 'balloon':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#eff6ff" />
          <path d="M100 132 Q94 156 106 178" fill="none" stroke="#64748b" strokeWidth="2.5" />
          <ellipse cx="100" cy="82" rx="44" ry="52" fill="#ef4444" />
          <ellipse cx="82" cy="64" rx="10" ry="18" fill="#fca5a5" opacity="0.6" transform="rotate(-20 82 64)" />
          <polygon points="94,132 106,132 100,140" fill="#dc2626" />
        </svg>
      );

    case 'flag':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#f1f5f9" />
          <rect x="46" y="34" width="8" height="136" rx="4" fill="#475569" />
          <path d="M54 42 Q96 32 154 46 L154 106 Q96 92 54 104 Z" fill="#2563eb" />
          <path d="M54 42 Q96 32 154 46 L154 68 Q96 54 54 64 Z" fill="#ffffff" />
          <path d="M54 84 Q96 72 154 86 L154 106 Q96 92 54 104 Z" fill="#dc2626" />
        </svg>
      );

    case 'book':
    case 'notebook':
    case 'school':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#eff6ff" />
          {imageKey === 'school' ? (
            <>
              <rect x="34" y="84" width="132" height="84" rx="4" fill="#fca5a5" stroke="#b91c1c" strokeWidth="2" />
              <polygon points="26,84 100,42 174,84" fill="#991b1b" />
              <rect x="86" y="122" width="28" height="46" fill="#78350f" />
              <rect x="48" y="102" width="24" height="24" fill="#e0f2fe" />
              <rect x="128" y="102" width="24" height="24" fill="#e0f2fe" />
              <circle cx="100" cy="68" r="10" fill="#fff" />
            </>
          ) : (
            <>
              <rect x="48" y="42" width="104" height="122" rx="8" fill={imageKey === 'notebook' ? '#10b981' : '#2563eb'} />
              <rect x="58" y="42" width="10" height="122" fill={imageKey === 'notebook' ? '#047857' : '#1d4ed8'} />
              <rect x="78" y="64" width="58" height="26" rx="4" fill="#ffffff" opacity="0.9" />
              <line x1="78" y1="108" x2="134" y2="108" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            </>
          )}
        </svg>
      );

    case 'needle':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#f8fafc" />
          <path d="M52 148 Q128 134 156 68" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="48" y1="152" x2="152" y2="48" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="144" cy="56" rx="4" ry="8" fill="#f8fafc" transform="rotate(45 144 56)" />
        </svg>
      );

    case 'screen':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#f1f5f9" />
          <rect x="30" y="48" width="140" height="92" rx="10" fill="#0f172a" />
          <rect x="38" y="56" width="124" height="76" rx="4" fill="#38bdf8" />
          <rect x="88" y="140" width="24" height="18" fill="#475569" />
          <rect x="68" y="156" width="64" height="8" rx="4" fill="#334155" />
        </svg>
      );

    case 'spinningtop':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#fef3c7" />
          <rect x="94" y="44" width="12" height="24" rx="4" fill="#ef4444" />
          <ellipse cx="100" cy="98" rx="48" ry="26" fill="#2563eb" />
          <ellipse cx="100" cy="90" rx="34" ry="12" fill="#facc15" />
          <polygon points="74,116 126,116 100,162" fill="#dc2626" />
        </svg>
      );

    case 'entrance':
    default:
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect width="200" height="200" fill="#f1f5f9" />
          <rect x="52" y="46" width="96" height="122" rx="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="3" />
          <rect x="74" y="76" width="52" height="92" rx="4" fill="#475569" />
          <polygon points="62,76 100,52 138,76" fill="#334155" />
          <circle cx="116" cy="124" r="4" fill="#facc15" />
        </svg>
      );
  }
};
