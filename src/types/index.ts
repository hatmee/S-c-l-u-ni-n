export type GarmentTag = 'Nguyên bản' | 'Phục dựng' | 'Cách tân';

export type GarmentSilhouette = 
  | 'ao-ngu-than-tay-chen'
  | 'ao-tac-tay-thung'
  | 'ao-nhat-binh'
  | 'ao-dai-tan-thoi'
  | 'ao-giao-linh'
  | 'ao-con-mien'
  | 'ao-dich-y'
  | 'ao-vien-linh'
  | 'ao-doi-kham'
  | 'ao-tu-than'
  | 'ao-mang-lan';

export type AppView = 
  | 'home'
  | 'moodboard' 
  | 'canvas' 
  | 'explore'
  | 'culture'
  | 'knowledge' 
  | 'dashboard';

export interface TraditionalColor {
  id: string;
  name: string;
  vietnameseName: string;
  hex: string;
  category: string;
  culturalMeaning: string;
}

export interface GarmentDefinition {
  id: string;
  name: string;
  vietnameseTitle: string;
  silhouette: GarmentSilhouette;
  tag: GarmentTag;
  era: string;
  brief: string;
  dynastyGroup: 'ly-tran' | 'le' | 'nguyen' | 'contemporary';
  gender: 'nam' | 'nu' | 'unisex';
  occasions: string[];
  anatomy: {
    flaps: string;         // e.g. "5 thân (4 thân ngoài tượng trưng phụ mẫu bên nội và ngoại + 1 thân con bên trong)"
    collar: string;        // e.g. "Lập lĩnh (cổ đứng tròn ôm khít cao 3-4cm)"
    buttons: string;       // e.g. "5 khuy cài tượng trưng cho Ngũ Thường (Nhân - Lễ - Nghĩa - Trí - Tín)"
    sleeves: string;       // e.g. "Tay chẽn (bó sát cổ tay) hoặc Tay thụng (rộng thùng thình)"
  };
  historicalContext: string;
  academicCitation: {
    author: string;
    bookTitle: string;
    publisherAndYear: string;
    keyQuote: string;
  };
  referenceSource: string;
  referenceUrl?: string;
  defaultColors: {
    mainBody: string;
    collarAndButtons: string;
    sleeves: string;
    innerLining: string;
    trousers: string;
    headwear: string;
  };
}

export interface BackgroundScene {
  id: string;
  name: string;
  description: string;
  tagline: string;
  backdropColor: string;
  gradient: string;
  iconName: string;
  emoji?: string;
  targetVibe?: string;
  suggestedMix?: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  type: 'headwear' | 'handheld' | 'jewelry' | 'footwear' | 'eyewear' | 'bag';
  eraCategory: 'traditional' | 'contemporary';
  description: string;
  historicalNote?: string;
  svgIcon?: string;
}

// 2D Moodboard Item on Canvas
export interface MoodboardCanvasItem {
  id: string;
  itemType: 'garment' | 'trousers' | 'headwear' | 'handheld' | 'footwear' | 'eyewear' | 'jewelry' | 'decor' | 'badge';
  name: string;
  assetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees
  zIndex: number;
  colors?: {
    mainBody?: string;
    collarAndButtons?: string;
    sleeves?: string;
    innerLining?: string;
    trousers?: string;
    headwear?: string;
  };
  pattern?: 'plain' | 'damask' | 'cloud' | 'lotus';
  silhouette?: GarmentSilhouette;
  gender?: CharacterGender;
  hairstyle?: CharacterHairstyle;
  hairColor?: string;
}

export type CharacterGender = 'nam' | 'nu';

export type CharacterHairstyle = 
  | 'bui-to-nam'       // Búi tó củ hành nam truyền thống
  | 'side-part-nam'    // Side-part 7/3 nam hiện đại
  | 'undercut-nam'     // Tóc ngắn layer nam
  | 'toc-dai-cot-nam'  // Tóc dài cột cao kiếm hiệp
  | 'khan-dong-nam'    // Khăn đóng chữ nhân nam
  | 'buong-xoa-nu'     // Tóc dài buông xõa nữ
  | 'bui-tre-cai-tram' // Búi trễ cài trâm ngọc nữ
  | 'van-tran-duoi-ga' // Vấn trần đuôi gà Kinh Bắc
  | 'tet-bim-nu'       // Tóc tết bím nữ
  | 'ngan-bob-nu'      // Tóc ngắn bob cá tính
  | 'khan-van-nu';     // Khăn vấn vành rộng nữ

export interface HairStyleOption {
  id: CharacterHairstyle;
  name: string;
  gender: 'nam' | 'nu' | 'all';
  description: string;
  era: 'Cổ truyền' | 'Hiện đại';
  previewIcon?: string;
}

export interface OutfitConfig {
  id: string;
  title: string;
  createdAt: number;
  garmentId: string;
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
  pattern: 'plain' | 'damask' | 'cloud' | 'lotus';
  sceneId: string;
  accessories: string[]; // list of accessory IDs
  moodboardItems?: MoodboardCanvasItem[];
  aiEvaluation?: CulturalEvaluationResult;
}

export interface CulturalEvaluationResult {
  culturalSafetyScore: number; // 0 - 100
  evaluation: string;
  socialCaption: string;
  historicalInsight: string;
  academicNotes: string; // Citation from "Trang Phục Việt Nam" or "Ngàn Năm Áo Mũ"
  styleTips: string[];
  evaluatedAt: string;
  engineUsed: 'gemini' | 'rules-fallback';
}

export interface WeeklyStylingTip {
  id: string;
  weekTitle: string;
  garmentRecommendation: string;
  paletteTheme: string[];
  stylingNote: string;
  context: string;
  publishedDate: string;
}

// Cultural Article for "Góc Văn Hóa"
export interface CulturalArticle {
  id: string;
  title: string;
  subtitle: string;
  category: 'Triết lý Y phục' | 'Điển chế Cung đình' | 'Đời sống Dân gian' | 'Phụ kiện & Nón mũ';
  authorOrSource: string;
  summary: string;
  readingMinutes: number;
  publishYear: string;
  content: {
    heading: string;
    paragraphs: string[];
    quote?: string;
  }[];
  relatedGarmentIds: string[];
}

// Historical Timeline Period for "Khám Phá"
export interface HistoricalTimelineEra {
  id: string;
  name: string;
  period: string;
  overview: string;
  inflectionPoint: string;
  keyFeatures: {
    male: string;
    female: string;
    hairAndHats: string;
    court: string;
  };
  representativeGarments: string[];
}
