import React from 'react';
import { MoodboardCanvasItem } from '../types';
import { GarmentSvgSilhouette } from './GarmentSvgSilhouette';

interface MoodboardAssetRendererProps {
  item: MoodboardCanvasItem;
  isSelected?: boolean;
}

export const MoodboardAssetRenderer: React.FC<MoodboardAssetRendererProps> = ({ item, isSelected }) => {
  const colors = item.colors || {};

  switch (item.itemType) {
    case 'garment':
      return (
        <div className="w-full h-full select-none pointer-events-none drop-shadow-md">
          <GarmentSvgSilhouette
            silhouette={item.silhouette || 'ao-ngu-than-tay-chen'}
            gender={item.gender}
            hairstyle={item.hairstyle}
            hairColor={item.hairColor}
            colors={{
              mainBody: colors.mainBody || '#1D3557',
              collarAndButtons: colors.collarAndButtons || '#D5B477',
              sleeves: colors.sleeves || colors.mainBody || '#1D3557',
              innerLining: colors.innerLining || '#F7F1E7',
              trousers: colors.trousers || '#F7F1E7',
              headwear: colors.headwear || '#212025',
            }}
            pattern={item.pattern || 'plain'}
            className="w-full h-full"
          />
        </div>
      );

    case 'trousers':
      return (
        <svg viewBox="0 0 160 240" className="w-full h-full select-none pointer-events-none drop-shadow-sm">
          <path
            d="M20 10 L140 10 L150 230 C130 235, 90 235, 84 215 L80 80 L76 215 C70 235, 30 235, 10 230 Z"
            fill={colors.trousers || '#F7F1E7'}
            stroke="#000000"
            strokeWidth="0.8"
            strokeOpacity="0.2"
          />
          <path d="M80 80 L80 215" stroke="#000000" strokeWidth="1" strokeOpacity="0.15" />
        </svg>
      );

    case 'headwear':
      return (
        <svg viewBox="0 0 140 100" className="w-full h-full select-none pointer-events-none drop-shadow-sm">
          <path
            d="M15 55 C15 20, 125 20, 125 55 C132 58, 132 70, 125 72 C115 50, 25 50, 15 72 C8 70, 8 58, 15 55 Z"
            fill={colors.headwear || '#212025'}
            stroke="#000000"
            strokeWidth="1"
            strokeOpacity="0.3"
          />
          {/* Folds */}
          <path d="M22 50 C40 30, 100 30, 118 50" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.25" fill="none" />
          <path d="M28 62 C45 42, 95 42, 112 62" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.2" fill="none" />
          {/* Nếp gấp chữ nhân */}
          <path d="M60 40 L70 30 L80 40" stroke="#D5B477" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'handheld':
      return (
        <svg viewBox="0 0 120 110" className="w-full h-full select-none pointer-events-none drop-shadow-md">
          {/* Quạt nan trầm hương dát vàng */}
          <path d="M60 90 L10 25 C30 5, 90 5, 110 25 Z" fill="#D5B477" stroke="#684A17" strokeWidth="1.2" />
          <path d="M60 90 L25 18 M60 90 L40 12 M60 90 L60 10 M60 90 L80 12 M60 90 L95 18" stroke="#8F2635" strokeWidth="1" />
          <circle cx="60" cy="90" r="4" fill="#684A17" />
          <path d="M60 90 L60 105" stroke="#8F2635" strokeWidth="2" />
          <circle cx="60" cy="107" r="3" fill="#8F2635" />
        </svg>
      );

    case 'footwear':
      if (item.assetId.includes('sneaker')) {
        return (
          <svg viewBox="0 0 140 80" className="w-full h-full select-none pointer-events-none drop-shadow-sm">
            <path
              d="M10 50 C8 35, 25 30, 45 32 C65 30, 95 20, 120 40 C132 50, 130 65, 115 65 L10 65 Z"
              fill="#FFFFFF"
              stroke="#D1D5DB"
              strokeWidth="2"
            />
            {/* Sole */}
            <path d="M5 65 L125 65 L125 74 L5 74 Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" />
            <path d="M25 65 L115 65" stroke="#8F2635" strokeWidth="3" />
            {/* Laces */}
            <path d="M60 38 L85 34 M65 44 L90 40" stroke="#8F2635" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      }
      return (
        /* Guốc mộc */
        <svg viewBox="0 0 120 70" className="w-full h-full select-none pointer-events-none drop-shadow-sm">
          <path d="M10 40 L110 40 L105 58 L85 58 L80 48 L40 48 L35 58 L15 58 Z" fill="#B38656" stroke="#684A17" strokeWidth="1" />
          {/* Quai nhung đỏ */}
          <path d="M25 40 C40 18, 70 18, 85 40" stroke="#8F2635" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M25 40 C40 18, 70 18, 85 40" stroke="#D5B477" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'eyewear':
      return (
        <svg viewBox="0 0 120 50" className="w-full h-full select-none pointer-events-none drop-shadow-sm">
          <ellipse cx="35" cy="25" rx="22" ry="14" fill="#1C1B1A" stroke="#D5B477" strokeWidth="2.5" />
          <ellipse cx="85" cy="25" rx="22" ry="14" fill="#1C1B1A" stroke="#D5B477" strokeWidth="2.5" />
          <line x1="57" y1="23" x2="63" y2="23" stroke="#D5B477" strokeWidth="3" />
          <line x1="13" y1="22" x2="0" y2="18" stroke="#D5B477" strokeWidth="2" />
          <line x1="107" y1="22" x2="120" y2="18" stroke="#D5B477" strokeWidth="2" />
        </svg>
      );

    case 'badge':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none drop-shadow-md">
          <rect x="5" y="5" width="90" height="90" rx="12" fill="#8F2635" stroke="#D5B477" strokeWidth="3" />
          <rect x="12" y="12" width="76" height="76" rx="8" fill="none" stroke="#D5B477" strokeWidth="1" strokeDasharray="3,2" />
          <text x="50" y="42" fill="#F7E7A9" fontFamily="Playfair Display, serif" fontSize="16" fontWeight="bold" textAnchor="middle">
            SẮC
          </text>
          <text x="50" y="65" fill="#F7E7A9" fontFamily="Playfair Display, serif" fontSize="16" fontWeight="bold" textAnchor="middle">
            LƯU NIÊN
          </text>
          <text x="50" y="80" fill="#F7E7A9" fontFamily="Inter, sans-serif" fontSize="7" letterSpacing="1" textAnchor="middle">
            DI SẢN VIỆT
          </text>
        </svg>
      );

    default:
      return (
        <div className="w-full h-full bg-[#E5DCCE] rounded-xl flex items-center justify-center text-xs font-serif text-[#2C241E] p-2 text-center border border-[#8F2635]/20">
          {item.name}
        </div>
      );
  }
};
