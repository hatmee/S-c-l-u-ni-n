import React from 'react';
import { GarmentSilhouette, CharacterGender, CharacterHairstyle } from '../types';

interface GarmentSvgProps {
  silhouette: GarmentSilhouette;
  gender?: CharacterGender;
  hairstyle?: CharacterHairstyle;
  hairColor?: string;
  colors: {
    mainBody: string;
    collarAndButtons: string;
    sleeves: string;
    innerLining: string;
    trousers: string;
    headwear: string;
  };
  pattern?: 'plain' | 'damask' | 'cloud' | 'lotus';
  activeLayer?: string;
  onLayerClick?: (layerKey: string) => void;
  accessories?: string[];
  className?: string;
}

export const GarmentSvgSilhouette: React.FC<GarmentSvgProps> = ({
  silhouette,
  gender = 'nam',
  hairstyle,
  hairColor = '#212025',
  colors,
  pattern = 'plain',
  activeLayer,
  onLayerClick,
  accessories = [],
  className = 'w-full h-full max-h-[560px] mx-auto',
}) => {
  const isSelected = (layer: string) => activeLayer === layer;

  // Resolve active hairstyle matching gender
  const resolvedHairstyle: CharacterHairstyle = 
    hairstyle || (gender === 'nu' ? 'buong-xoa-nu' : 'khan-dong-nam');

  const isFemale = gender === 'nu';

  // Check accessory flags
  const hasMuMien = accessories.includes('mu-mien-12-luu') || accessories.includes('asset-mu-mien') || silhouette === 'ao-con-mien';
  const hasQuatTram = accessories.includes('quat-tram-huong') || accessories.includes('asset-quat-tram');
  const hasChuoiNgoc = accessories.includes('chuoi-ngoc-bich');
  const hasSneaker = accessories.includes('sneaker-chunky') || accessories.includes('asset-sneaker-chunky');
  const hasGuocMoc = accessories.includes('guoc-moc-quai-nhung') || accessories.includes('asset-guoc-moc');
  const hasBotDa = accessories.includes('giay-bot-da');
  const hasKinhRam = accessories.includes('kinh-ram-oval') || accessories.includes('asset-kinh-ram-oval');
  const hasTuiCoi = accessories.includes('tui-coi-dan');
  const hasBoXaTich = accessories.includes('bo-xa-tich');

  const cursorClass = onLayerClick ? 'cursor-pointer transition-all duration-200 hover:opacity-90' : '';

  return (
    <svg
      viewBox="0 0 400 680"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Minh họa trang phục ${silhouette}`}
    >
      <defs>
        {/* Subtle drop shadows and fabric highlights */}
        <filter id="garmentShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#2C241E" floodOpacity="0.12" />
        </filter>
        <filter id="layerGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#D5B477" floodOpacity="0.8" />
        </filter>

        {/* Traditional Cloud / Damask / Dragon Patterns */}
        <pattern id="cloudPattern" width="40" height="40" patternUnits="userSpaceOnUse" opacity="0.16">
          <path d="M10 20 C10 14, 20 12, 22 16 C25 14, 32 16, 30 22 C32 26, 26 30, 20 30 C12 30, 10 24, 10 20 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" />
        </pattern>
        <pattern id="lotusPattern" width="36" height="36" patternUnits="userSpaceOnUse" opacity="0.15">
          <path d="M18 6 C12 14, 12 24, 18 30 C24 24, 24 14, 18 6 Z M18 16 C14 20, 10 22, 10 26 C14 26, 16 22, 18 16 Z M18 16 C22 20, 26 22, 26 26 C22 26, 20 22, 18 16 Z" fill="#FFFFFF" />
        </pattern>
        <pattern id="damaskPattern" width="30" height="30" patternUnits="userSpaceOnUse" opacity="0.14">
          <path d="M15 0 L30 15 L15 30 L0 15 Z M15 5 L25 15 L15 25 L5 15 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
        </pattern>
        <pattern id="pheasantPattern" width="32" height="32" patternUnits="userSpaceOnUse" opacity="0.18">
          <path d="M8 16 C12 10, 20 12, 24 8 C22 14, 16 18, 12 22 Z" fill="#D5B477" />
          <circle cx="24" cy="8" r="1.5" fill="#8F2635" />
        </pattern>

        {/* Shading Gradients */}
        <linearGradient id="bodyShade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.15" />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </linearGradient>

        <linearGradient id="goldButtonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="50%" stopColor="#D5B477" />
          <stop offset="100%" stopColor="#8C6826" />
        </linearGradient>

        <linearGradient id="dragonRoundel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E6CA" />
          <stop offset="50%" stopColor="#D5B477" />
          <stop offset="100%" stopColor="#9C7730" />
        </linearGradient>

        {/* Gradients cho suối tóc óng ả thướt tha */}
        <linearGradient id="hairBackSilkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={hairColor} />
          <stop offset="45%" stopColor="#221D20" />
          <stop offset="75%" stopColor={hairColor} />
          <stop offset="100%" stopColor="#181517" />
        </linearGradient>

        <linearGradient id="hairFrontTressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={hairColor} />
          <stop offset="35%" stopColor="#2A2325" />
          <stop offset="70%" stopColor={hairColor} />
          <stop offset="100%" stopColor="#1C181A" />
        </linearGradient>

        <linearGradient id="hairSilkSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* CSS Keyframes Hoạt họa: Gió xuân lay động suối tóc thướt tha */}
        <style>{`
          @keyframes hairWindBackL {
            0%, 100% {
              transform: rotate(0deg) skewX(0deg);
            }
            50% {
              transform: rotate(-1.8deg) skewX(-2deg) translate(-2.5px, 0.5px);
            }
          }
          @keyframes hairWindBackR {
            0%, 100% {
              transform: rotate(0deg) skewX(0deg);
            }
            50% {
              transform: rotate(2deg) skewX(2.2deg) translate(3px, 0.5px);
            }
          }
          @keyframes hairWindFrontL {
            0%, 100% {
              transform: rotate(0deg) translate(0, 0);
            }
            50% {
              transform: rotate(-2.2deg) translate(-2.8px, 1px);
            }
          }
          @keyframes hairWindFrontR {
            0%, 100% {
              transform: rotate(0deg) translate(0, 0);
            }
            50% {
              transform: rotate(2.4deg) translate(2.8px, 0.8px);
            }
          }
          @keyframes hairWindFlyaway {
            0%, 100% {
              opacity: 0.65;
              transform: rotate(0deg) translate(0, 0);
            }
            50% {
              opacity: 1;
              transform: rotate(-3.5deg) translate(-3.2px, -1.5px);
            }
          }
          .anim-hair-back-l {
            transform-origin: 165px 100px;
            animation: hairWindBackL 4.8s ease-in-out infinite;
          }
          .anim-hair-back-r {
            transform-origin: 235px 100px;
            animation: hairWindBackR 5.4s ease-in-out infinite;
          }
          .anim-hair-front-l {
            transform-origin: 166px 115px;
            animation: hairWindFrontL 4.2s ease-in-out infinite;
          }
          .anim-hair-front-r {
            transform-origin: 234px 115px;
            animation: hairWindFrontR 4.9s ease-in-out infinite;
          }
          .anim-hair-flyaway {
            transform-origin: 170px 75px;
            animation: hairWindFlyaway 3.4s ease-in-out infinite;
          }
        `}</style>
      </defs>

      {/* Ground subtle shadow */}
      <ellipse cx="200" cy="650" rx="90" ry="12" fill="#2C241E" opacity="0.12" />

      {/* 0. BACK HAIR LAYER (Behind neck/shoulders) */}
      <g id="backHairLayer">
        {resolvedHairstyle === 'buong-xoa-nu' && (
          <g id="hair-buong-xoa-back">
            {/* Suối tóc lớn phủ sau lưng mềm mại, dài ngang eo */}
            <path
              d="M165 58 C148 85, 134 140, 132 210 C130 280, 140 335, 154 372 C162 388, 175 392, 185 388 C195 384, 205 384, 215 388 C225 392, 238 388, 246 372 C260 335, 270 280, 268 210 C266 140, 252 85, 235 58 Z"
              fill="url(#hairBackSilkGrad)"
            />

            {/* Cánh tóc sau vai trái với hoạt họa đung đưa theo gió */}
            <g className="anim-hair-back-l">
              <path
                d="M160 68 C140 100, 126 160, 124 225 C122 290, 132 345, 148 376 C152 382, 158 378, 156 370 C144 338, 138 285, 140 225 C142 165, 154 112, 168 74 Z"
                fill={hairColor}
              />
              {/* Lọn tóc tơ uốn lượn thướt tha */}
              <path
                d="M134 205 C128 255, 132 310, 144 350 C146 357, 142 360, 139 355 C130 315, 126 265, 131 215 Z"
                fill={hairColor}
                opacity="0.9"
              />
              {/* Ánh sáng lụa trên tóc */}
              <path
                d="M148 140 C140 200, 138 260, 146 320"
                stroke="url(#hairSilkSheen)"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Cánh tóc sau vai phải với hoạt họa đung đưa theo gió */}
            <g className="anim-hair-back-r">
              <path
                d="M240 68 C260 100, 274 160, 276 225 C278 290, 268 345, 252 376 C248 382, 242 378, 244 370 C256 338, 262 285, 260 225 C258 165, 246 112, 232 74 Z"
                fill={hairColor}
              />
              {/* Lọn tóc tơ uốn lượn thướt tha */}
              <path
                d="M266 205 C272 255, 268 310, 256 350 C254 357, 258 360, 261 355 C270 315, 274 265, 269 215 Z"
                fill={hairColor}
                opacity="0.9"
              />
              {/* Ánh sáng lụa trên tóc */}
              <path
                d="M252 140 C260 200, 262 260, 254 320"
                stroke="url(#hairSilkSheen)"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>
        )}

        {resolvedHairstyle === 'tet-bim-nu' && (
          <g id="hair-tet-bim-back">
            {/* Bím tết trái */}
            <path d="M166 70 C154 100, 152 140, 158 180 C162 205, 168 220, 172 220 C174 220, 168 195, 166 170 C162 140, 164 100, 172 75 Z" fill={hairColor} />
            <circle cx="166" cy="180" r="3.5" fill="#8F2635" />
            <circle cx="166" cy="218" r="3" fill="#D5B477" />
            {/* Bím tết phải */}
            <path d="M234 70 C246 100, 248 140, 242 180 C238 205, 232 220, 228 220 C226 220, 232 195, 234 170 C238 140, 236 100, 228 75 Z" fill={hairColor} />
            <circle cx="234" cy="180" r="3.5" fill="#8F2635" />
            <circle cx="234" cy="218" r="3" fill="#D5B477" />
          </g>
        )}

        {resolvedHairstyle === 'toc-dai-cot-nam' && (
          <g id="hair-cot-nam-back">
            <path d="M192 36 C188 65, 185 130, 192 205 C196 220, 204 220, 208 205 C215 130, 212 65, 208 36 Z" fill={hairColor} />
            <circle cx="200" cy="38" r="5" fill="#8F2635" />
          </g>
        )}

        {resolvedHairstyle === 'bui-tre-cai-tram' && (
          <g id="hair-bui-tre-back">
            <ellipse cx="200" cy="98" rx="24" ry="15" fill={hairColor} />
            <line x1="170" y1="94" x2="230" y2="94" stroke="#D5B477" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="170" cy="94" r="3.5" fill="#8F2635" />
            <circle cx="230" cy="94" r="3.5" fill="#286B61" />
          </g>
        )}

        {resolvedHairstyle === 'van-tran-duoi-ga' && (
          <g id="hair-duoi-ga-back">
            <path d="M225 65 C238 75, 252 95, 248 130 C245 145, 238 150, 234 148 C238 135, 240 115, 234 95 C230 85, 226 75, 222 68 Z" fill={hairColor} />
          </g>
        )}
      </g>

      {/* 1. CHARACTER BODY & HEAD BASE */}
      <g id="characterBase">
        {/* Neck */}
        <path d="M185 105 L185 145 L215 145 L215 105 Z" fill={isFemale ? "#FCE4D6" : "#F3D2BA"} />
        
        {/* Head / Face Silhouette */}
        {isFemale ? (
          <path
            d="M175 73 C175 46, 185 34, 200 34 C215 34, 225 46, 225 73 C225 96, 212 112, 200 112 C188 112, 175 96, 175 73 Z"
            fill="#FDF0E5"
            stroke="#E8C7B0"
            strokeWidth="1"
          />
        ) : (
          <path
            d="M174 72 C174 44, 184 32, 200 32 C216 32, 226 44, 226 72 C226 95, 214 113, 200 113 C186 113, 174 95, 174 72 Z"
            fill="#F7DEC8"
            stroke="#E5BA9D"
            strokeWidth="1"
          />
        )}

        {/* Ears */}
        <ellipse cx="173" cy="74" rx="4" ry="7" fill={isFemale ? "#FCE4D6" : "#F3D2BA"} />
        <ellipse cx="227" cy="74" rx="4" ry="7" fill={isFemale ? "#FCE4D6" : "#F3D2BA"} />

        {/* Khuyên tai nụ ngọc bích / vàng kim cho phái nữ */}
        {isFemale && (
          <g id="femaleEarrings">
            <circle cx="173" cy="81" r="2.2" fill="#D5B477" />
            <circle cx="173" cy="86" r="1.6" fill="#286B61" />
            <circle cx="227" cy="81" r="2.2" fill="#D5B477" />
            <circle cx="227" cy="86" r="1.6" fill="#286B61" />
          </g>
        )}

        {/* Hair line */}
        <path d="M176 60 C182 40, 218 40, 224 60 C218 48, 182 48, 176 60 Z" fill={hairColor} />

        {/* Minimalist graceful facial features */}
        {isFemale ? (
          <g id="femaleFeatures">
            <path d="M184 63 Q189 60 194 63" stroke="#4A3427" strokeWidth="1.1" strokeLinecap="round" fill="none" />
            <path d="M206 63 Q211 60 216 63" stroke="#4A3427" strokeWidth="1.1" strokeLinecap="round" fill="none" />
            <ellipse cx="188" cy="68" rx="3.5" ry="2" fill="#212025" />
            <ellipse cx="212" cy="68" rx="3.5" ry="2" fill="#212025" />
            <circle cx="189" cy="67.5" r="1" fill="#FFFFFF" />
            <circle cx="213" cy="67.5" r="1" fill="#FFFFFF" />
            <path d="M191 66 L193 64.5" stroke="#212025" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M209 64.5 L211 66" stroke="#212025" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M200 68 L199 77 L202 78" stroke="#E2AE93" strokeWidth="1" strokeLinecap="round" fill="none" />
            <ellipse cx="182" cy="77" rx="5" ry="3" fill="#E8929A" opacity="0.4" />
            <ellipse cx="218" cy="77" rx="5" ry="3" fill="#E8929A" opacity="0.4" />
            <path d="M194 88 Q200 90.5 206 88 Q200 93 194 88 Z" fill="#C53D4E" />
          </g>
        ) : (
          <g id="maleFeatures">
            <path d="M182 61 Q188 59 194 62" stroke="#3A2A20" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <path d="M206 62 Q212 59 218 61" stroke="#3A2A20" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <ellipse cx="188" cy="68" rx="3.5" ry="1.8" fill="#2C241E" />
            <ellipse cx="212" cy="68" rx="3.5" ry="1.8" fill="#2C241E" />
            <circle cx="189" cy="67.5" r="0.8" fill="#FFFFFF" />
            <circle cx="213" cy="67.5" r="0.8" fill="#FFFFFF" />
            <path d="M200 67 L199 78 L203 79" stroke="#DBAA8C" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M194 88 Q200 91 206 88 Q200 92.5 194 88 Z" fill="#B36058" />
          </g>
        )}
      </g>

      {/* 2. LAYER: KHĂN VẤN / KIỂU TÓC / MŨ MIỆN (Headwear & Hairstyle) */}
      <g
        id="layer-headwear"
        className={cursorClass}
        onClick={() => onLayerClick?.('headwear')}
        filter={isSelected('headwear') ? 'url(#layerGlow)' : undefined}
      >
        {hasMuMien ? (
          /* Mũ Miện 12 Lưu Hoàng Đế Chu Lễ (Hoàng đế Lý, Trần, Nguyễn) */
          <g>
            <rect x="178" y="28" width="44" height="28" rx="3" fill="#141316" stroke="#D5B477" strokeWidth="1" />
            <rect x="145" y="20" width="110" height="10" rx="2" fill="#141316" stroke="#D5B477" strokeWidth="1.5" />
            <g stroke="#D5B477" strokeWidth="1" strokeDasharray="2,3">
              <line x1="155" y1="30" x2="155" y2="70" />
              <line x1="163" y1="30" x2="163" y2="72" />
              <line x1="171" y1="30" x2="171" y2="74" />
              <line x1="179" y1="30" x2="179" y2="76" />
              <line x1="187" y1="30" x2="187" y2="78" />
              <line x1="195" y1="30" x2="195" y2="80" />
              <line x1="205" y1="30" x2="205" y2="80" />
              <line x1="213" y1="30" x2="213" y2="78" />
              <line x1="221" y1="30" x2="221" y2="76" />
              <line x1="229" y1="30" x2="229" y2="74" />
              <line x1="237" y1="30" x2="237" y2="72" />
              <line x1="245" y1="30" x2="245" y2="70" />
            </g>
            <circle cx="179" cy="76" r="2.5" fill="#8F2635" />
            <circle cx="187" cy="78" r="2.5" fill="#286B61" />
            <circle cx="195" cy="80" r="2.5" fill="#D5B477" />
            <circle cx="205" cy="80" r="2.5" fill="#D5B477" />
            <circle cx="213" cy="78" r="2.5" fill="#286B61" />
            <circle cx="221" cy="76" r="2.5" fill="#8F2635" />
          </g>
        ) : resolvedHairstyle === 'khan-dong-nam' ? (
          /* Khăn vấn xếp nếp chuẩn mực chữ nhân (image_a3daa7 chuẩn) */
          <g>
            <path
              d="M170 46 C170 20, 230 20, 230 46 C235 48, 236 56, 230 58 C222 42, 178 42, 170 58 C164 56, 165 48, 170 46 Z"
              fill={colors.headwear}
              stroke="#000000"
              strokeWidth="0.8"
              strokeOpacity="0.2"
            />
            <path d="M172 40 C182 28, 218 28, 228 40 C220 32, 180 32, 172 40 Z" fill="#FFFFFF" fillOpacity="0.15" />
            <path d="M192 48 L200 42 L208 48" stroke="#D5B477" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </g>
        ) : resolvedHairstyle === 'khan-van-nu' ? (
          /* Khăn vấn vành rộng lụa gấm quý tộc nữ */
          <g>
            <path
              d="M166 48 C166 18, 234 18, 234 48 C242 50, 242 62, 234 64 C224 44, 176 44, 166 64 C158 62, 158 50, 166 48 Z"
              fill={colors.headwear}
              stroke="#D5B477"
              strokeWidth="1"
            />
            <path d="M168 38 C180 24, 220 24, 232 38" stroke="#D5B477" strokeWidth="1.2" fill="none" opacity="0.6" />
            <path d="M172 46 C182 32, 218 32, 228 46" stroke="#D5B477" strokeWidth="1.2" fill="none" opacity="0.6" />
          </g>
        ) : resolvedHairstyle === 'bui-to-nam' ? (
          /* Búi tó củ hành nam với trâm cài */
          <g>
            <path d="M172 62 C172 32, 228 32, 228 62 C220 45, 180 45, 172 62 Z" fill={hairColor} />
            <ellipse cx="200" cy="24" rx="14" ry="11" fill={hairColor} />
            <path d="M192 22 Q200 16 208 22" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.25" fill="none" />
            <line x1="178" y1="24" x2="222" y2="24" stroke="#D5B477" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="178" cy="24" r="3" fill="#8F2635" />
            <circle cx="222" cy="24" r="2" fill="#D5B477" />
          </g>
        ) : resolvedHairstyle === 'side-part-nam' ? (
          /* Tóc Side-Part 7/3 thời thượng */
          <g>
            <path
              d="M171 64 C170 36, 192 28, 204 30 C222 30, 230 40, 229 64 C225 50, 206 46, 192 48 C184 46, 174 52, 171 64 Z"
              fill={hairColor}
            />
            <path d="M192 34 L193 48" stroke="#1A181C" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M193 36 C206 33, 222 42, 226 56" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.2" fill="none" />
            <path d="M172 58 C176 46, 188 44, 192 46" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.2" fill="none" />
          </g>
        ) : resolvedHairstyle === 'undercut-nam' ? (
          /* Tóc ngắn layer Gen Z */
          <g>
            <path
              d="M172 65 C170 40, 182 30, 200 30 C218 30, 230 40, 228 65 C222 52, 218 46, 200 46 C182 46, 178 52, 172 65 Z"
              fill={hairColor}
            />
            <path d="M185 30 L188 24 L194 30 M196 28 L200 22 L204 28 M206 30 L210 25 L214 31" stroke={hairColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M180 40 Q200 34 220 40" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.25" fill="none" />
          </g>
        ) : resolvedHairstyle === 'toc-dai-cot-nam' ? (
          /* Tóc dài cột cao nửa đầu */
          <g>
            <path d="M172 64 C172 35, 228 35, 228 64 C220 48, 180 48, 172 64 Z" fill={hairColor} />
            <circle cx="200" cy="32" r="8" fill={hairColor} />
            <circle cx="200" cy="32" r="5" fill="#8F2635" />
          </g>
        ) : resolvedHairstyle === 'buong-xoa-nu' ? (
          /* Tóc dài buông xõa rẽ ngôi giữa - Phần đỉnh đầu, trán, highlight óng mượt & cài hoa ngọc */
          <g>
            {/* Vòm tóc đỉnh đầu ôm tròn bồng bềnh */}
            <path
              d="M170 70 C167 40, 182 30, 200 30 C218 30, 233 40, 230 70 C224 52, 214 46, 200 46 C186 46, 176 52, 170 70 Z"
              fill={hairColor}
            />
            {/* Đường rẽ ngôi giữa mềm mại */}
            <line x1="200" y1="31" x2="200" y2="47" stroke="#171518" strokeWidth="1.2" strokeLinecap="round" />
            
            {/* Tóc mai hai bên ôm nhẹ viền mặt */}
            <path d="M170 65 C172 82, 176 96, 178 104 C176 96, 174 82, 171 66 Z" fill={hairColor} />
            <path d="M230 65 C228 82, 224 96, 222 104 C224 96, 226 82, 229 66 Z" fill={hairColor} />
            
            {/* Ánh bóng mượt mà của tóc */}
            <path d="M180 40 Q190 35 197 39" stroke="url(#hairSilkSheen)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M203 39 Q210 35 220 40" stroke="url(#hairSilkSheen)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            
            {/* Lọn tóc tơ bay bổng bên má trái (Wispy flyaway flutter) */}
            <path
              className="anim-hair-flyaway"
              d="M168 76 C163 88, 160 102, 164 115 C164.5 117, 163.5 118, 162.8 116 C158.5 102, 161.5 87, 167 75 Z"
              fill={hairColor}
            />

            {/* Điểm xuyết hoa mai ngọc bích cài tóc thanh nhã */}
            <g id="hairPinFlower" transform="translate(172, 53)">
              <circle cx="0" cy="0" r="3.2" fill="#286B61" />
              <circle cx="-2.5" cy="-2" r="1.8" fill="#3D8E82" />
              <circle cx="2.5" cy="-2" r="1.8" fill="#3D8E82" />
              <circle cx="-2" cy="2.5" r="1.8" fill="#3D8E82" />
              <circle cx="2" cy="2.5" r="1.8" fill="#3D8E82" />
              <circle cx="0" cy="-3" r="1.8" fill="#3D8E82" />
              <circle cx="0" cy="0" r="1.2" fill="#D5B477" />
              <path d="M-1 3.5 L-2.5 10" stroke="#D5B477" strokeWidth="0.8" strokeLinecap="round" />
              <circle cx="-2.5" cy="11" r="1" fill="#8F2635" />
            </g>
          </g>
        ) : resolvedHairstyle === 'bui-tre-cai-tram' ? (
          /* Tóc rẽ ngôi búi trễ */
          <g>
            <path
              d="M172 68 C170 40, 185 32, 200 32 C215 32, 230 40, 228 68 C224 50, 212 46, 200 46 C188 46, 176 50, 172 68 Z"
              fill={hairColor}
            />
            <line x1="200" y1="34" x2="200" y2="46" stroke="#1A181C" strokeWidth="1" />
            <circle cx="200" cy="46" r="3" fill="#D5B477" />
            <circle cx="200" cy="46" r="1.5" fill="#8F2635" />
          </g>
        ) : resolvedHairstyle === 'van-tran-duoi-ga' ? (
          /* Vấn trần Kinh Bắc */
          <g>
            <path
              d="M168 50 C168 22, 232 22, 232 50 C236 56, 232 64, 228 64 C222 46, 178 46, 172 64 C168 64, 164 56, 168 50 Z"
              fill={hairColor}
              stroke="#000000"
              strokeWidth="0.6"
            />
            <path d="M174 42 C184 30, 216 30, 226 42" stroke="#FFFFFF" strokeWidth="1" opacity="0.25" fill="none" />
          </g>
        ) : resolvedHairstyle === 'tet-bim-nu' ? (
          /* Tóc tết bím */
          <g>
            <path
              d="M172 66 C170 40, 185 32, 200 32 C215 32, 230 40, 228 66 C222 52, 212 48, 200 48 C188 48, 178 52, 172 66 Z"
              fill={hairColor}
            />
            <line x1="200" y1="34" x2="200" y2="48" stroke="#1A181C" strokeWidth="1" />
          </g>
        ) : resolvedHairstyle === 'ngan-bob-nu' ? (
          /* Tóc ngắn bob */
          <g>
            <path
              d="M167 78 C164 42, 180 30, 200 30 C220 30, 236 42, 233 78 C228 88, 222 92, 218 84 C222 66, 214 50, 200 50 C186 50, 178 66, 182 84 C178 92, 172 88, 167 78 Z"
              fill={hairColor}
            />
            <path d="M174 60 C182 45, 194 44, 200 48" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.25" fill="none" />
            <path d="M226 60 C218 45, 206 44, 200 48" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.25" fill="none" />
          </g>
        ) : null}
      </g>

      {/* 3. LAYER: QUẦN HẠ Y HOẶC VÁY THƯỜNG (Trousers / Thường) */}
      <g
        id="layer-trousers"
        className={cursorClass}
        onClick={() => onLayerClick?.('trousers')}
        filter={isSelected('trousers') ? 'url(#layerGlow)' : undefined}
      >
        {silhouette === 'ao-giao-linh' || silhouette === 'ao-dich-y' || silhouette === 'ao-doi-kham' ? (
          /* Váy Thường quấn 2 lớp xếp nếp thời Lý - Trần - Lê */
          <g>
            {/* Thường bên trong (dài hơn) */}
            <path d="M160 380 L140 600 C155 605, 245 605, 260 600 L240 380 Z" fill={colors.trousers} />
            {/* Thường bên ngoài ngắn hơn (đặc trưng Việt Nam để lộ 2 lớp váy) */}
            <path d="M162 380 L146 540 C160 545, 240 545, 254 540 L238 380 Z" fill="#FFFFFF" fillOpacity="0.3" stroke="#D5B477" strokeWidth="1" />
            {/* Nếp gấp thường thẳng */}
            <path d="M175 400 L170 595 M200 400 L200 598 M225 400 L230 595" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.15" />
          </g>
        ) : silhouette === 'ao-tu-than' ? (
          /* Váy lưỡi trai đen 7 bức của phụ nữ Bắc Bộ */
          <g>
            <path d="M164 380 L142 595 C160 602, 240 602, 258 595 L236 380 Z" fill={colors.trousers} />
            {/* Cạp váy rộng bản màu sáng */}
            <rect x="165" y="375" width="70" height="12" fill="#E5DCCE" />
          </g>
        ) : (
          /* Quần lụa hai ống (Hạ y thời Nguyễn) */
          <g>
            <path
              d="M165 410 L145 595 C145 600, 185 602, 192 595 L196 440 L204 440 L208 595 C215 602, 255 600, 255 595 L235 410 Z"
              fill={colors.trousers}
            />
            <path d="M198 440 L195 592" stroke="#000000" strokeWidth="1" strokeOpacity="0.15" />
            <path d="M170 430 L162 588" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.1" />
            <path d="M230 430 L238 588" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.1" />
          </g>
        )}
      </g>

      {/* FOOTWEAR ACCESSORIES */}
      <g id="layer-footwear">
        {hasSneaker ? (
          <g>
            <path d="M148 595 C140 595, 134 606, 134 615 C134 624, 182 626, 188 616 C188 605, 175 595, 168 595 Z" fill="#FFFFFF" stroke="#D5D5D5" strokeWidth="1.5" />
            <path d="M136 618 L186 618" stroke="#8F2635" strokeWidth="3" />
            <path d="M212 595 C225 595, 232 605, 232 616 C238 626, 266 624, 266 615 C266 606, 260 595, 252 595 Z" fill="#FFFFFF" stroke="#D5D5D5" strokeWidth="1.5" />
            <path d="M214 618 L264 618" stroke="#8F2635" strokeWidth="3" />
          </g>
        ) : hasBotDa ? (
          <g>
            <path d="M150 575 L144 618 C144 625, 185 625, 186 618 L180 575 Z" fill="#212025" stroke="#3A3836" strokeWidth="1" />
            <path d="M220 575 L214 618 C214 625, 255 625, 256 618 L250 575 Z" fill="#212025" stroke="#3A3836" strokeWidth="1" />
          </g>
        ) : (
          <g>
            <path d="M152 600 C146 600, 142 608, 142 616 L182 616 C182 608, 176 600, 170 600 Z" fill="#B38656" />
            <path d="M152 606 C158 601, 168 601, 172 606" stroke={hasGuocMoc ? '#8F2635' : '#286B61'} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M228 600 C222 600, 218 608, 218 616 L258 616 C258 608, 254 600, 248 600 Z" fill="#B38656" />
            <path d="M228 606 C234 601, 244 601, 248 606" stroke={hasGuocMoc ? '#8F2635' : '#286B61'} strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        )}
      </g>

      {/* 4. LAYER: CỔ TRONG & TÀ LÓT (Inner Lining) */}
      <g
        id="layer-innerLining"
        className={cursorClass}
        onClick={() => onLayerClick?.('innerLining')}
        filter={isSelected('innerLining') ? 'url(#layerGlow)' : undefined}
      >
        <path d="M186 112 L200 120 L214 112 L214 122 L200 130 L186 122 Z" fill={colors.innerLining} />
      </g>

      {/* 5. LAYER: TAY ÁO (Sleeves) */}
      <g
        id="layer-sleeves"
        className={cursorClass}
        onClick={() => onLayerClick?.('sleeves')}
        filter={isSelected('sleeves') ? 'url(#layerGlow)' : undefined}
      >
        {silhouette === 'ao-tac-tay-thung' || silhouette === 'ao-con-mien' || silhouette === 'ao-dich-y' || silhouette === 'ao-vien-linh' ? (
          /* Tay thụng rộng thùng thình (Áo Tấc, Cổn Miện, Địch Y, Viên Lĩnh) */
          <g>
            <path
              d="M155 145 C120 180, 75 230, 65 340 C85 365, 125 375, 142 340 L160 250 Z"
              fill={colors.sleeves}
            />
            <path
              d="M245 145 C280 180, 325 230, 335 340 C315 365, 275 375, 258 340 L240 250 Z"
              fill={colors.sleeves}
            />
            <path d="M65 340 C85 365, 125 375, 142 340" stroke="#000000" strokeWidth="1" strokeOpacity="0.2" fill="none" />
            <path d="M335 340 C315 365, 275 375, 258 340" stroke="#000000" strokeWidth="1" strokeOpacity="0.2" fill="none" />
          </g>
        ) : silhouette === 'ao-nhat-binh' ? (
          /* Áo Nhật Bình: Tay áo ngũ sắc (5 màu Ngũ Hành) */
          <g>
            <path d="M155 145 C135 180, 115 220, 105 290 L135 295 C145 235, 160 190, 168 160 Z" fill={colors.sleeves} />
            <path d="M245 145 C265 180, 285 220, 295 290 L265 295 C255 235, 240 190, 232 160 Z" fill={colors.sleeves} />
            <rect x="104" y="270" width="32" height="4" fill="#D5B477" transform="rotate(8 104 270)" />
            <rect x="104" y="274" width="32" height="4" fill="#286B61" transform="rotate(8 104 274)" />
            <rect x="104" y="278" width="32" height="4" fill="#F7F1E7" transform="rotate(8 104 278)" />
            <rect x="104" y="282" width="32" height="4" fill="#8F2635" transform="rotate(8 104 282)" />
            <rect x="104" y="286" width="32" height="4" fill="#212025" transform="rotate(8 104 286)" />

            <rect x="264" y="270" width="32" height="4" fill="#D5B477" transform="rotate(-8 264 270)" />
            <rect x="264" y="274" width="32" height="4" fill="#286B61" transform="rotate(-8 264 274)" />
            <rect x="264" y="278" width="32" height="4" fill="#F7F1E7" transform="rotate(-8 264 278)" />
            <rect x="264" y="282" width="32" height="4" fill="#8F2635" transform="rotate(-8 264 282)" />
            <rect x="264" y="286" width="32" height="4" fill="#212025" transform="rotate(-8 264 286)" />
          </g>
        ) : (
          /* Áo Ngũ Thân Tay Chẽn, Tứ Thân, Mãng Lan: Tay bó sát cổ tay */
          <g>
            <path
              d="M158 145 C142 175, 125 210, 118 290 L138 294 C146 230, 158 190, 168 165 Z"
              fill={colors.sleeves}
            />
            <path
              d="M242 145 C258 175, 275 210, 282 290 L262 294 C254 230, 242 190, 232 165 Z"
              fill={colors.sleeves}
            />
            <path d="M120 286 C126 284, 134 286, 138 290" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />
            <path d="M280 286 C274 284, 266 286, 262 290" stroke="#000000" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />
          </g>
        )}
      </g>

      {/* Hands */}
      <ellipse cx="128" cy="298" rx="8" ry="12" fill="#F3D2BA" />
      <ellipse cx="272" cy="298" rx="8" ry="12" fill="#F3D2BA" />

      {/* 6. LAYER: THÂN ÁO (Main Robe Body) */}
      <g
        id="layer-mainBody"
        className={cursorClass}
        onClick={() => onLayerClick?.('mainBody')}
        filter={isSelected('mainBody') ? 'url(#layerGlow)' : 'url(#garmentShadow)'}
      >
        {silhouette === 'ao-doi-kham' ? (
          /* Áo Đối Khâm: 2 vạt trước song song buông thõng */
          <g>
            <path
              d="M152 145 C152 145, 175 148, 185 148 L185 490 L136 480 C140 320, 146 220, 152 145 Z"
              fill={colors.mainBody}
            />
            <path
              d="M248 145 C248 145, 225 148, 215 148 L215 490 L264 480 C260 320, 254 220, 248 145 Z"
              fill={colors.mainBody}
            />
            {/* Lớp áo trong lộ ra ở giữa */}
            <path d="M185 148 L215 148 L215 490 L185 490 Z" fill={colors.innerLining} opacity="0.4" />
          </g>
        ) : silhouette === 'ao-tu-than' ? (
          /* Áo Tứ Thân: 2 vạt trước buộc múi trước bụng */
          <g>
            <path
              d="M154 145 C168 148, 190 148, 196 148 L185 360 L140 380 C142 280, 148 200, 154 145 Z"
              fill={colors.mainBody}
            />
            <path
              d="M246 145 C232 148, 210 148, 204 148 L215 360 L260 380 C258 280, 252 200, 246 145 Z"
              fill={colors.mainBody}
            />
            {/* Tấm yếm cổ xây đỏ hoa hiên lộ ra giữa ngực */}
            <path d="M190 135 L210 135 L206 240 L194 240 Z" fill="#C05C7E" />
            {/* Nút buộc múi hai vạt trước bụng */}
            <circle cx="200" cy="365" r="7" fill={colors.mainBody} />
            <path d="M195 368 L182 450 L192 450 L200 375 L208 450 L218 450 L205 368 Z" fill={colors.mainBody} />
          </g>
        ) : silhouette === 'ao-vien-linh' ? (
          /* Áo Viên Lĩnh Bào Phục: Cổ tròn, vạt dài, thêu rồng ổ */
          <g>
            <path
              d="M154 145 C170 148, 200 148, 246 145 C254 220, 262 320, 265 495 C238 505, 162 505, 135 495 C138 320, 146 220, 154 145 Z"
              fill={colors.mainBody}
            />
            {/* Bổ tử hoặc hoa văn Long Ổ tròn giữa ngực */}
            <circle cx="200" cy="220" r="28" fill="url(#dragonRoundel)" opacity="0.85" />
            <circle cx="200" cy="220" r="24" fill="none" stroke="#8F2635" strokeWidth="1.5" strokeDasharray="4,2" />
          </g>
        ) : silhouette === 'ao-con-mien' ? (
          /* Áo Cổn Miện: Huyền sắc (đen), thêu 12 chương */
          <g>
            <path
              d="M154 145 C170 148, 200 148, 246 145 C256 220, 265 330, 268 510 C238 520, 162 520, 132 510 C135 330, 144 220, 154 145 Z"
              fill={colors.mainBody}
            />
            {/* 12 Chương (Nhật, Nguyệt, Tinh Thìn, Sơn, Long...) */}
            <circle cx="178" cy="190" r="7" fill="#8F2635" stroke="#D5B477" strokeWidth="1" /> {/* Nhật */}
            <circle cx="222" cy="190" r="7" fill="#F7F1E7" stroke="#D5B477" strokeWidth="1" /> {/* Nguyệt */}
            <polygon points="200,165 204,175 196,175" fill="#D5B477" /> {/* Sơn */}
            {/* Hàng họa tiết rồng giáng */}
            <path d="M165 230 C175 240, 175 270, 165 280" stroke="#D5B477" strokeWidth="2.5" fill="none" />
            <path d="M235 230 C225 240, 225 270, 235 280" stroke="#D5B477" strokeWidth="2.5" fill="none" />
          </g>
        ) : silhouette === 'ao-dich-y' ? (
          /* Áo Địch Y: Lam sẫm thêu chim trĩ 12 hàng */
          <g>
            <path
              d="M154 145 C170 148, 200 148, 246 145 C256 220, 265 330, 268 510 C238 520, 162 520, 132 510 C135 330, 144 220, 154 145 Z"
              fill={colors.mainBody}
            />
            <rect x="140" y="160" width="120" height="340" fill="url(#pheasantPattern)" />
          </g>
        ) : (
          /* Áo Ngũ Thân & Áo Tấc chuẩn image_a3daa7: 5 thân, tà xẻ sườn phải */
          <g>
            <path
              d="M154 145 C170 148, 200 148, 246 145 C254 220, 262 320, 265 490 C238 500, 162 500, 135 490 C138 320, 146 220, 154 145 Z"
              fill={colors.mainBody}
            />
            {/* Asymmetric right flap curve */}
            <path
              d="M200 148 C215 158, 228 178, 230 205 C232 235, 222 280, 220 340 L220 495"
              stroke="#000000"
              strokeWidth="1.2"
              strokeOpacity="0.25"
              fill="none"
            />
          </g>
        )}

        {/* Pattern Overlays */}
        {pattern === 'cloud' && (
          <rect x="130" y="145" width="140" height="355" fill="url(#cloudPattern)" />
        )}
        {pattern === 'lotus' && (
          <rect x="130" y="145" width="140" height="355" fill="url(#lotusPattern)" />
        )}
        {pattern === 'damask' && (
          <rect x="130" y="145" width="140" height="355" fill="url(#damaskPattern)" />
        )}

        {/* Shading overlay for silk drape realism */}
        <path
          d="M154 145 C170 148, 200 148, 246 145 C254 220, 262 320, 265 490 C238 500, 162 500, 135 490 C138 320, 146 220, 154 145 Z"
          fill="url(#bodyShade)"
        />
      </g>

      {/* 7. LAYER: NẸP CỔ VÀ KHUY CÀI (Collar & Buttons) */}
      <g
        id="layer-collarAndButtons"
        className={cursorClass}
        onClick={() => onLayerClick?.('collarAndButtons')}
        filter={isSelected('collarAndButtons') ? 'url(#layerGlow)' : undefined}
      >
        {silhouette === 'ao-nhat-binh' ? (
          /* Nhật Bình: Nẹp chữ nhật to bản trước ngực */
          <g>
            <path
              d="M174 125 L226 125 L236 240 L216 240 L212 155 L188 155 L184 240 L164 240 Z"
              fill={colors.collarAndButtons}
              stroke="#D5B477"
              strokeWidth="1.5"
            />
            <circle cx="200" cy="140" r="5" fill="#D5B477" />
            <circle cx="174" cy="180" r="3.5" fill="#8F2635" />
            <circle cx="226" cy="180" r="3.5" fill="#8F2635" />
          </g>
        ) : silhouette === 'ao-vien-linh' ? (
          /* Viên Lĩnh: Cổ tròn ôm sát chân cổ gài cúc bên vai phải */
          <g>
            <circle cx="200" cy="132" r="16" fill="none" stroke={colors.collarAndButtons} strokeWidth="5" />
            <circle cx="215" cy="132" r="4" fill="url(#goldButtonGrad)" stroke="#684A17" strokeWidth="0.8" />
          </g>
        ) : silhouette === 'ao-giao-linh' || silhouette === 'ao-con-mien' || silhouette === 'ao-dich-y' ? (
          /* Giao Lĩnh / Cổn Miện / Địch Y: Cổ vạt bắt chéo chữ Y */
          <g>
            <path d="M170 120 L200 160 L215 140" stroke={colors.collarAndButtons} strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M230 120 L195 168 L185 240" stroke={colors.collarAndButtons} strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Đai lưng ngọc thắt ngang eo */}
            <rect x="160" y="270" width="80" height="10" rx="2" fill="#D5B477" stroke="#684A17" strokeWidth="1" />
            <circle cx="200" cy="275" r="3.5" fill="#8F2635" />
          </g>
        ) : (
          /* Lập Lĩnh Chuẩn image_a3daa7: Cổ đứng cao 3-4cm sáng màu + 5 Khuy Ngũ Thường */
          <g>
            {/* Cổ đứng lập lĩnh cao ôm khít cổ */}
            <path
              d="M182 122 C184 116, 192 114, 200 114 C208 114, 216 116, 218 122 L216 146 C210 148, 190 148, 184 146 Z"
              fill={colors.collarAndButtons}
              stroke="#000000"
              strokeWidth="0.8"
              strokeOpacity="0.2"
            />
            {/* Nẹp cổ lượn chéo sang nách phải */}
            <path
              d="M200 146 C210 152, 224 165, 228 185 C232 210, 226 240, 224 280"
              stroke={colors.collarAndButtons}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* 5 KHUY NGŨ THƯỜNG (NHÂN - LỄ - NGHĨA - TRÍ - TÍN) */}
            <circle cx="200" cy="134" r="3.8" fill="url(#goldButtonGrad)" stroke="#684A17" strokeWidth="0.8" />
            <circle cx="199" cy="133" r="1.2" fill="#FFFFFF" opacity="0.8" />
            <circle cx="212" cy="156" r="3.8" fill="url(#goldButtonGrad)" stroke="#684A17" strokeWidth="0.8" />
            <circle cx="211" cy="155" r="1.2" fill="#FFFFFF" opacity="0.8" />
            <circle cx="225" cy="188" r="3.8" fill="url(#goldButtonGrad)" stroke="#684A17" strokeWidth="0.8" />
            <circle cx="224" cy="187" r="1.2" fill="#FFFFFF" opacity="0.8" />
            <circle cx="227" cy="225" r="3.8" fill="url(#goldButtonGrad)" stroke="#684A17" strokeWidth="0.8" />
            <circle cx="226" cy="224" r="1.2" fill="#FFFFFF" opacity="0.8" />
            <circle cx="224" cy="265" r="3.8" fill="url(#goldButtonGrad)" stroke="#684A17" strokeWidth="0.8" />
            <circle cx="223" cy="264" r="1.2" fill="#FFFFFF" opacity="0.8" />
          </g>
        )}
      </g>

      {/* 7b. FRONT DRAPE HAIR LAYER (Suối tóc trước ngực thướt tha buông qua vai) */}
      {resolvedHairstyle === 'buong-xoa-nu' && (
        <g id="hair-buong-xoa-front-drape" className="pointer-events-none select-none">
          {/* Dải tóc trước ngực bên trái buông qua vai */}
          <g className="anim-hair-front-l">
            {/* Thân dải tóc chính bên trái */}
            <path
              d="M168 108
                 C162 135, 156 175, 156 220
                 C156 260, 162 292, 166 312
                 C167 317, 170 315, 169 310
                 C165 290, 162 258, 163 218
                 C164 175, 170 135, 175 110 Z"
              fill="url(#hairFrontTressGrad)"
            />
            {/* Lọn tóc uốn lượn phụ mềm mại */}
            <path
              d="M160 180
                 C157 215, 160 255, 167 285
                 C168 290, 170 288, 169 284
                 C163 255, 161 218, 163 182 Z"
              fill={hairColor}
              opacity="0.85"
            />
            {/* Vệt sáng óng ả trên tóc trước ngực */}
            <path
              d="M166 145 C160 190, 160 240, 165 280"
              stroke="url(#hairSilkSheen)"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Dải tóc trước ngực bên phải buông qua vai */}
          <g className="anim-hair-front-r">
            {/* Thân dải tóc chính bên phải */}
            <path
              d="M232 108
                 C238 135, 244 175, 244 220
                 C244 260, 238 292, 234 312
                 C233 317, 230 315, 231 310
                 C235 290, 238 258, 237 218
                 C236 175, 230 135, 225 110 Z"
              fill="url(#hairFrontTressGrad)"
            />
            {/* Lọn tóc uốn lượn phụ mềm mại */}
            <path
              d="M240 180
                 C243 215, 240 255, 233 285
                 C232 290, 230 288, 231 284
                 C237 255, 239 218, 237 182 Z"
              fill={hairColor}
              opacity="0.85"
            />
            {/* Vệt sáng óng ả trên tóc trước ngực */}
            <path
              d="M234 145 C240 190, 240 240, 235 280"
              stroke="url(#hairSilkSheen)"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>
      )}

      {/* 8. ACCESSORIES OVERLAY */}
      {hasChuoiNgoc && (
        <g id="acc-jewelry">
          <path d="M184 140 C186 185, 214 185, 216 140" stroke="#286B61" strokeWidth="3" strokeDasharray="4,2" fill="none" />
          <circle cx="200" cy="170" r="5" fill="#D5B477" />
        </g>
      )}

      {hasBoXaTich && (
        <g id="acc-satich" transform="translate(225, 280)">
          <path d="M0 0 L-5 40 M2 0 L-2 42 M4 0 L2 40" stroke="#A8A29E" strokeWidth="1.2" />
          <circle cx="-5" cy="45" r="3.5" fill="#D1D5DB" stroke="#6B7280" strokeWidth="0.5" />
        </g>
      )}

      {hasKinhRam && (
        <g id="acc-eyewear">
          <ellipse cx="188" cy="68" rx="6" ry="4" fill="#1C1B1A" stroke="#D5B477" strokeWidth="1" />
          <ellipse cx="212" cy="68" rx="6" ry="4" fill="#1C1B1A" stroke="#D5B477" strokeWidth="1" />
          <line x1="194" y1="68" x2="206" y2="68" stroke="#D5B477" strokeWidth="1.2" />
        </g>
      )}

      {hasQuatTram && (
        <g id="acc-handheld" transform="translate(115, 280) rotate(-25)">
          <path d="M0 0 L-25 -45 C-10 -55, 10 -55, 25 -45 Z" fill="#D5B477" stroke="#684A17" strokeWidth="1" />
          <path d="M0 0 L-18 -48 M0 0 L-8 -52 M0 0 L8 -52 M0 0 L18 -48" stroke="#8F2635" strokeWidth="0.8" />
          <line x1="0" y1="0" x2="0" y2="20" stroke="#8F2635" strokeWidth="1.5" />
          <circle cx="0" cy="22" r="3" fill="#8F2635" />
        </g>
      )}

      {hasTuiCoi && (
        <g id="acc-bag" transform="translate(265, 305)">
          <path d="M-4 -20 C-4 -35, 16 -35, 16 -20" stroke="#A88B60" strokeWidth="2" fill="none" />
          <path d="M-10 -15 L22 -15 L18 20 L-6 20 Z" fill="#CBB188" stroke="#9C7F53" strokeWidth="1" />
          <line x1="-8" y1="-8" x2="20" y2="-8" stroke="#9C7F53" strokeWidth="0.8" />
          <line x1="-7" y1="0" x2="19" y2="0" stroke="#9C7F53" strokeWidth="0.8" />
        </g>
      )}
    </svg>
  );
};
