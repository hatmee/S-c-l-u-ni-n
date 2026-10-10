import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Sparkles, X, Info } from 'lucide-react';

export const TraditionalBackground: React.FC = () => {
  const { darkMode, backgroundPattern, setBackgroundPattern } = useAppStore();
  const [showPatternSelector, setShowPatternSelector] = useState(false);
  const [patternIntensity, setPatternIntensity] = useState<'soft' | 'rich'>('soft');

  const strokeColor = darkMode ? '#D5B477' : '#9C7730';
  const fillColor = darkMode ? '#D5B477' : '#8F2635';
  const opacityMultiplier = patternIntensity === 'rich' ? (darkMode ? 0.22 : 0.16) : (darkMode ? 0.12 : 0.07);

  const patternInfo = {
    'dong-son': {
      name: 'Trống Đồng Đông Sơn',
      desc: 'Mặt trời 14 tia sáng cùng bầy chim Lạc bay ngược chiều kim đồng hồ, biểu tượng văn minh cội nguồn dân tộc.',
      icon: '🥁',
    },
    'van-thuy': {
      name: 'Mây Nước Thủy Ba',
      desc: 'Họa tiết sóng nước dâng cuộn (thủy ba) và cụm vân mây mềm mại chạm khắc thời Lý - Trần - Nguyễn.',
      icon: '🌊',
    },
    'hoa-sen': {
      name: 'Hoa Sen Đại Việt',
      desc: 'Đóa sen chạm khắc tinh xảo tại Hoàng thành Thăng Long và chùa Phật Tích, tôn vinh vẻ đẹp thanh tịnh tao nhã.',
      icon: '🪷',
    },
    'gam-cung-dinh': {
      name: 'Gấm Vóc Cung Đình',
      desc: 'Văn chữ Vạn - chữ Thọ liên hoàn dệt trên sa đoạn lụa gấm cung đình Huế, tượng trưng cho phúc lộc vẹn toàn.',
      icon: '📜',
    },
    'all': {
      name: 'Hòa Quyện Di Sản (Tất Cả)',
      desc: 'Phối hợp hài hòa giữa Trống Đồng, Mây Nước, Hoa Sen và Gấm Vóc tạo nên tổng thể trang nhã cung đình.',
      icon: '✨',
    },
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* SVG Canvas for seamless vector patterns and ambient cultural art */}
      <svg
        className="w-full h-full absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* 1. GẤM VÓC CHỮ VẠN / CHỮ THỌ (Continuous Imperial Damask) */}
          <pattern
            id="pattern-gam-cung-dinh"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M15 0 H45 V15 H30 V30 H60 V45 H45 V60 H15 V45 H30 V30 H0 V15 H15 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.8"
              strokeOpacity={opacityMultiplier * 0.9}
            />
            <path
              d="M30 15 L45 30 L30 45 L15 30 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.6"
              strokeDasharray="2 2"
              strokeOpacity={opacityMultiplier * 0.7}
            />
            <circle cx="30" cy="30" r="2.5" fill={strokeColor} fillOpacity={opacityMultiplier} />
          </pattern>

          {/* 2. MÂY NƯỚC THỦY BA LÃNG ĐÀO (Swirling Cloud & Wave Pattern) */}
          <pattern
            id="pattern-van-thuy"
            width="120"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* Cụm sóng nước Thủy Ba nhấp nhô */}
            <path
              d="M0 60 C20 45, 40 45, 60 60 C80 45, 100 45, 120 60 L120 80 L0 80 Z"
              fill={fillColor}
              fillOpacity={opacityMultiplier * 0.45}
            />
            <path
              d="M0 70 C20 55, 40 55, 60 70 C80 55, 100 55, 120 70"
              stroke={strokeColor}
              strokeWidth="1"
              fill="none"
              strokeOpacity={opacityMultiplier * 0.9}
            />
            {/* Cụm mây thời Lý cuộn xoắn */}
            <path
              d="M30 30 C30 18, 45 15, 52 22 C60 12, 80 16, 78 28 C85 28, 92 34, 88 42 C82 50, 68 48, 62 42 C56 48, 38 46, 34 38 C30 36, 30 32, 30 30 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.9"
              strokeOpacity={opacityMultiplier * 0.85}
            />
            <path
              d="M48 30 C54 26, 62 26, 66 32 C60 38, 52 36, 48 30"
              stroke={strokeColor}
              strokeWidth="0.7"
              fill="none"
              strokeOpacity={opacityMultiplier * 0.7}
            />
          </pattern>

          {/* 3. HOA SEN ĐẠI VIỆT HOÀNG THÀNH (Royal Lotus Medallion) */}
          <pattern
            id="pattern-hoa-sen"
            width="140"
            height="140"
            patternUnits="userSpaceOnUse"
          >
            <g transform="translate(70, 70)">
              {/* Tâm sen nhị vàng */}
              <circle cx="0" cy="0" r="10" fill="none" stroke={strokeColor} strokeWidth="0.8" strokeOpacity={opacityMultiplier} />
              <circle cx="0" cy="0" r="4" fill={strokeColor} fillOpacity={opacityMultiplier * 0.8} />
              {/* 8 cánh sen lớn */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <path
                  key={i}
                  d="M0 -10 C-8 -22, -6 -36, 0 -44 C6 -36, 8 -22, 0 -10 Z"
                  transform={`rotate(${angle})`}
                  fill={fillColor}
                  fillOpacity={opacityMultiplier * 0.35}
                  stroke={strokeColor}
                  strokeWidth="0.8"
                  strokeOpacity={opacityMultiplier * 0.9}
                />
              ))}
              {/* 8 cánh sen phụ viền ngoài */}
              {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
                <path
                  key={`sub-${i}`}
                  d="M0 -14 C-5 -26, -3 -36, 0 -40 C3 -36, 5 -26, 0 -14 Z"
                  transform={`rotate(${angle})`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="0.6"
                  strokeDasharray="2 1"
                  strokeOpacity={opacityMultiplier * 0.65}
                />
              ))}
              <circle cx="0" cy="0" r="54" fill="none" stroke={strokeColor} strokeWidth="0.7" strokeDasharray="3 3" strokeOpacity={opacityMultiplier * 0.6} />
            </g>
          </pattern>

          {/* 4. TRỐNG ĐỒNG ĐÔNG SƠN MỜ ẢO (Dong Son Bronze Drum Center) */}
          <g id="dong-son-drum-large">
            {/* Tâm mặt trời 14 tia sáng */}
            <circle cx="0" cy="0" r="22" fill={strokeColor} fillOpacity={opacityMultiplier * 0.6} />
            {Array.from({ length: 14 }).map((_, i) => {
              const angle = (i * 360) / 14;
              return (
                <polygon
                  key={i}
                  points="0,-22 -7,-55 7,-55"
                  transform={`rotate(${angle})`}
                  fill={strokeColor}
                  fillOpacity={opacityMultiplier * 0.85}
                />
              );
            })}
            {/* Các vành đồng tâm */}
            <circle cx="0" cy="0" r="62" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={opacityMultiplier} />
            <circle cx="0" cy="0" r="72" fill="none" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity={opacityMultiplier * 0.7} />
            <circle cx="0" cy="0" r="95" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={opacityMultiplier} />
            
            {/* Vành chim Lạc bay ngược chiều kim đồng hồ (10 cánh chim Lạc) */}
            {Array.from({ length: 10 }).map((_, i) => {
              const angle = (i * 360) / 10;
              return (
                <g key={`lac-${i}`} transform={`rotate(${angle}) translate(0, -125)`}>
                  {/* Dáng chim Lạc cổ mỏ dài cánh xòe */}
                  <path
                    d="M-15 0 C-8 -8, 12 -12, 28 -6 C15 -4, 5 -1, -5 4 C-8 8, -18 8, -25 3 Z"
                    fill={strokeColor}
                    fillOpacity={opacityMultiplier * 0.9}
                  />
                  <path d="M-5 -2 L-10 -15 L-2 -8" stroke={strokeColor} strokeWidth="1" fill="none" strokeOpacity={opacityMultiplier} />
                </g>
              );
            })}

            <circle cx="0" cy="0" r="148" fill="none" stroke={strokeColor} strokeWidth="1.4" strokeOpacity={opacityMultiplier} />
            <circle cx="0" cy="0" r="162" fill="none" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="4 2" strokeOpacity={opacityMultiplier * 0.7} />
            <circle cx="0" cy="0" r="195" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={opacityMultiplier} />

            {/* Vành hươu / hoa văn vòng ngoài */}
            {Array.from({ length: 18 }).map((_, i) => {
              const angle = (i * 360) / 18;
              return (
                <circle
                  key={`dot-${i}`}
                  cx="0"
                  cy="-178"
                  r="3.5"
                  transform={`rotate(${angle})`}
                  fill={strokeColor}
                  fillOpacity={opacityMultiplier * 0.75}
                />
              );
            })}
            <circle cx="0" cy="0" r="230" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeOpacity={opacityMultiplier} />
            <circle cx="0" cy="0" r="255" fill="none" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity={opacityMultiplier * 0.6} />
            <circle cx="0" cy="0" r="290" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeOpacity={opacityMultiplier} />
          </g>

          {/* 5. GÓC HOA VĂN TỨ PHƯƠNG CUNG ĐÌNH (Imperial Corner Bracket) */}
          <g id="imperial-corner">
            <path
              d="M0 0 L110 0 C100 12, 85 16, 75 16 L25 16 C20 16, 16 20, 16 25 L16 75 C16 85, 12 100, 0 110 Z"
              fill={fillColor}
              fillOpacity={opacityMultiplier * 0.4}
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeOpacity={opacityMultiplier}
            />
            <path
              d="M8 8 L80 8 C72 14, 65 14, 55 14 L20 14 C14 14, 14 14, 14 20 L14 55 C14 65, 14 72, 8 80 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.8"
              strokeDasharray="2 2"
              strokeOpacity={opacityMultiplier * 0.8}
            />
            <circle cx="28" cy="28" r="4" fill={strokeColor} fillOpacity={opacityMultiplier * 0.8} />
          </g>
        </defs>

        {/* REPEATING BACKGROUND FILLS BASED ON ACTIVE PATTERN */}
        {(backgroundPattern === 'gam-cung-dinh' || backgroundPattern === 'all') && (
          <rect width="100%" height="100%" fill="url(#pattern-gam-cung-dinh)" />
        )}

        {backgroundPattern === 'van-thuy' && (
          <rect width="100%" height="100%" fill="url(#pattern-van-thuy)" />
        )}

        {backgroundPattern === 'hoa-sen' && (
          <rect width="100%" height="100%" fill="url(#pattern-hoa-sen)" />
        )}

        {/* WATERMARK DRUMS & AMBIENT MEDALLIONS (Fixed aesthetic positions) */}
        {(backgroundPattern === 'dong-son' || backgroundPattern === 'all') && (
          <>
            {/* Large Dong Son Drum watermark in upper right */}
            <g transform="translate(90%, 15%) scale(0.95)" className="transition-transform duration-1000">
              <use href="#dong-son-drum-large" />
            </g>

            {/* Medium Dong Son Drum watermark in bottom left */}
            <g transform="translate(10%, 85%) scale(0.75)" className="transition-transform duration-1000">
              <use href="#dong-son-drum-large" />
            </g>

            {/* Subtle central watermark for depth */}
            <g transform="translate(50%, 52%) scale(1.1)" opacity="0.6">
              <use href="#dong-son-drum-large" />
            </g>
          </>
        )}

        {(backgroundPattern === 'hoa-sen' || backgroundPattern === 'all') && (
          <>
            {/* Large Floating Lotus Medallions */}
            <g transform="translate(15%, 28%) scale(1.4)">
              <rect width="140" height="140" x="-70" y="-70" fill="url(#pattern-hoa-sen)" />
            </g>
            <g transform="translate(82%, 70%) scale(1.3)">
              <rect width="140" height="140" x="-70" y="-70" fill="url(#pattern-hoa-sen)" />
            </g>
          </>
        )}

        {(backgroundPattern === 'van-thuy' || backgroundPattern === 'all') && (
          <>
            {/* Wave crest bands on top and bottom borders */}
            <g transform="translate(0, 0)">
              <rect width="100%" height="80" fill="url(#pattern-van-thuy)" opacity="0.8" />
            </g>
          </>
        )}

        {/* 4 IMPERIAL CORNER BRACKETS */}
        <g transform="translate(0, 0)">
          <use href="#imperial-corner" />
        </g>
        <g transform="translate(100%, 0) scale(-1, 1)">
          <use href="#imperial-corner" />
        </g>
        <g transform="translate(0, 100%) scale(1, -1)">
          <use href="#imperial-corner" />
        </g>
        <g transform="translate(100%, 100%) scale(-1, -1)">
          <use href="#imperial-corner" />
        </g>
      </svg>

      {/* FLOATING CULTURAL PATTERN SELECTOR TOOLBAR (Bottom-Right, Pointer-events auto) */}
      <div className="fixed bottom-5 right-5 pointer-events-auto z-30 flex flex-col items-end gap-2">
        {showPatternSelector && (
          <div
            className={`p-4 rounded-2xl border shadow-xl backdrop-blur-md max-w-xs sm:w-80 transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              darkMode
                ? 'bg-[#1D191D]/95 border-[#D5B477]/40 text-[#F7F1E7]'
                : 'bg-white/95 border-[#E5DCCE] text-[#2C241E]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-current/10">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏮</span>
                <div>
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider">
                    Hoa Văn Nền Truyền Thống
                  </h4>
                  <p className="text-[10px] text-[#6C6258] dark:text-[#BDB2A7]">
                    Chạm khắc & dệt gấm cung đình Việt
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPatternSelector(false)}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pattern Selection Grid */}
            <div className="mt-3 space-y-1.5">
              {(['all', 'dong-son', 'van-thuy', 'hoa-sen', 'gam-cung-dinh'] as const).map((key) => {
                const isCur = backgroundPattern === key;
                const info = patternInfo[key];
                return (
                  <button
                    key={key}
                    onClick={() => setBackgroundPattern(key)}
                    className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-start gap-2.5 border ${
                      isCur
                        ? 'border-[#8F2635] bg-[#8F2635]/10 dark:border-[#D5B477] dark:bg-[#D5B477]/15 font-semibold text-[#8F2635] dark:text-[#D5B477]'
                        : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-current'
                    }`}
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">{info.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-medium truncate">{info.name}</span>
                        {isCur && <span className="text-[10px] uppercase font-bold">✓ Đang dùng</span>}
                      </div>
                      <p className="text-[10px] text-[#6C6258] dark:text-[#BDB2A7] line-clamp-1 font-light mt-0.5">
                        {info.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Intensity Level Control */}
            <div className="mt-3 pt-2.5 border-t border-current/10 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#6C6258] dark:text-[#BDB2A7] flex items-center gap-1">
                <Info className="w-3 h-3 text-[#286B61]" />
                Độ đậm hoa văn:
              </span>
              <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg">
                <button
                  onClick={() => setPatternIntensity('soft')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    patternIntensity === 'soft'
                      ? 'bg-[#8F2635] text-white dark:bg-[#D5B477] dark:text-[#141214]'
                      : 'text-[#6C6258] dark:text-[#BDB2A7]'
                  }`}
                >
                  Thanh nhã
                </button>
                <button
                  onClick={() => setPatternIntensity('rich')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    patternIntensity === 'rich'
                      ? 'bg-[#8F2635] text-white dark:bg-[#D5B477] dark:text-[#141214]'
                      : 'text-[#6C6258] dark:text-[#BDB2A7]'
                  }`}
                >
                  Rõ nét
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Floating Badge Button */}
        <button
          onClick={() => setShowPatternSelector(!showPatternSelector)}
          className={`flex items-center gap-2 px-3 py-2 rounded-full border shadow-md backdrop-blur-md text-xs font-serif transition-all hover:scale-105 ${
            darkMode
              ? 'bg-[#1F1B1E]/90 border-[#D5B477]/50 text-[#D5B477] hover:border-[#D5B477]'
              : 'bg-white/95 border-[#E5DCCE] text-[#8F2635] hover:border-[#8F2635]'
          }`}
          title="Tùy chọn hoa văn nền truyền thống Việt Nam"
        >
          <span className="text-sm">🏮</span>
          <span className="font-semibold hidden sm:inline">
            Hoa Văn Nền: {patternInfo[backgroundPattern].name}
          </span>
          <span className="sm:hidden font-semibold">Hoa Văn</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D5B477] animate-pulse" />
        </button>
      </div>

    </div>
  );
};
