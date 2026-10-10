import { create } from 'zustand';
import { OutfitConfig, CulturalEvaluationResult, GarmentSilhouette, CharacterGender, CharacterHairstyle } from '../types';
import { GARMENTS_DATA, BACKGROUND_SCENES } from '../data/garments';

export type AppView = 'home' | 'moodboard' | 'canvas' | 'explore' | 'culture' | 'knowledge' | 'dashboard';

interface AppState {
  currentView: AppView;
  currentStep: 1 | 2 | 3 | 4; // 1: Trang phục, 2: Bối cảnh, 3: Phụ kiện, 4: Thẩm định & Xuất
  activeLayer: 'mainBody' | 'collarAndButtons' | 'sleeves' | 'innerLining' | 'trousers' | 'headwear';
  
  // Current working outfit
  currentOutfit: OutfitConfig;
  isEvaluating: boolean;

  // Persisted Lookbook History
  savedOutfits: OutfitConfig[];

  // Notification State
  notificationPermission: NotificationPermission | 'default';
  showWeeklyNotificationModal: boolean;

  // Dark Mode & Traditional Background Pattern
  darkMode: boolean;
  backgroundPattern: 'dong-son' | 'van-thuy' | 'hoa-sen' | 'gam-cung-dinh' | 'all';

  // Actions
  setView: (view: AppView) => void;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  setActiveLayer: (layer: AppState['activeLayer']) => void;
  setGarment: (garmentId: string) => void;
  setGender: (gender: CharacterGender) => void;
  setHairstyle: (hairstyle: CharacterHairstyle) => void;
  setHairColor: (hairColor: string) => void;
  setLayerColor: (layer: AppState['activeLayer'], colorHex: string) => void;
  setPattern: (pattern: OutfitConfig['pattern']) => void;
  setScene: (sceneId: string) => void;
  toggleAccessory: (accessoryId: string) => void;
  removeAccessory: (accessoryId: string) => void;
  clearAllAccessories: () => void;
  setAiEvaluation: (evalResult: CulturalEvaluationResult) => void;
  setIsEvaluating: (loading: boolean) => void;
  saveCurrentOutfit: () => void;
  deleteSavedOutfit: (id: string) => void;
  clearAllSavedOutfits: () => void;
  loadSavedOutfit: (outfit: OutfitConfig) => void;
  setNotificationPermission: (perm: NotificationPermission) => void;
  setShowWeeklyNotificationModal: (show: boolean) => void;
  resetCurrentOutfit: () => void;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
  setBackgroundPattern: (pattern: 'dong-son' | 'van-thuy' | 'hoa-sen' | 'gam-cung-dinh' | 'all') => void;
}

const STORAGE_KEY = 'sac_luu_nien_lookbook_v1';
const THEME_STORAGE_KEY = 'sac_luu_nien_theme';
const PATTERN_STORAGE_KEY = 'sac_luu_nien_bg_pattern';

const getInitialDarkMode = (): boolean => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) return saved === 'dark';
    return false;
  } catch (e) {
    return false;
  }
};

const getInitialPattern = (): 'dong-son' | 'van-thuy' | 'hoa-sen' | 'gam-cung-dinh' | 'all' => {
  try {
    const saved = localStorage.getItem(PATTERN_STORAGE_KEY);
    if (saved) return saved as any;
  } catch (e) {}
  return 'all';
};

const defaultGarment = GARMENTS_DATA[0]; // Áo Ngũ Thân Tay Chẽn

const initialOutfit: OutfitConfig = {
  id: 'outfit-default',
  title: 'Bản Phối Khởi Nguyên',
  createdAt: Date.now(),
  garmentId: defaultGarment.id,
  silhouette: defaultGarment.silhouette,
  gender: 'nam',
  hairstyle: 'khan-dong-nam',
  hairColor: '#212025',
  colors: { ...defaultGarment.defaultColors },
  pattern: 'plain',
  sceneId: BACKGROUND_SCENES[0].id, // Phố cổ Hội An
  accessories: ['khan-van', 'quat-tram-huong'],
};

const getStoredOutfits = (): OutfitConfig[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const useAppStore = create<AppState>((set, get) => ({
  currentView: 'home',
  currentStep: 1,
  activeLayer: 'mainBody',
  currentOutfit: initialOutfit,
  isEvaluating: false,
  savedOutfits: typeof window !== 'undefined' ? getStoredOutfits() : [],
  notificationPermission: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default',
  showWeeklyNotificationModal: false,
  darkMode: typeof window !== 'undefined' ? getInitialDarkMode() : false,
  backgroundPattern: typeof window !== 'undefined' ? getInitialPattern() : 'all',

  setView: (view) => set({ currentView: view }),
  setStep: (step) => set({ currentStep: step }),
  setActiveLayer: (layer) => set({ activeLayer: layer }),

  setGarment: (garmentId) => {
    const garment = GARMENTS_DATA.find((g) => g.id === garmentId);
    if (!garment) return;
    set((state) => ({
      currentOutfit: {
        ...state.currentOutfit,
        garmentId: garment.id,
        silhouette: garment.silhouette,
        colors: { ...garment.defaultColors },
        aiEvaluation: undefined, // reset evaluation when garment changes
      },
    }));
  },

  setGender: (gender) => {
    set((state) => {
      // Pick a smart default hairstyle matching the gender
      const currentStyle = state.currentOutfit.hairstyle;
      let nextStyle: CharacterHairstyle = currentStyle || (gender === 'nu' ? 'buong-xoa-nu' : 'khan-dong-nam');
      if (gender === 'nam' && (!currentStyle || currentStyle.endsWith('-nu'))) {
        nextStyle = 'khan-dong-nam';
      } else if (gender === 'nu' && (!currentStyle || currentStyle.endsWith('-nam'))) {
        nextStyle = 'buong-xoa-nu';
      }
      return {
        currentOutfit: {
          ...state.currentOutfit,
          gender,
          hairstyle: nextStyle,
          aiEvaluation: undefined,
        },
      };
    });
  },

  setHairstyle: (hairstyle) => {
    set((state) => ({
      currentOutfit: {
        ...state.currentOutfit,
        hairstyle,
        aiEvaluation: undefined,
      },
    }));
  },

  setHairColor: (hairColor) => {
    set((state) => ({
      currentOutfit: {
        ...state.currentOutfit,
        hairColor,
        aiEvaluation: undefined,
      },
    }));
  },

  setLayerColor: (layer, colorHex) => {
    set((state) => ({
      currentOutfit: {
        ...state.currentOutfit,
        colors: {
          ...state.currentOutfit.colors,
          [layer]: colorHex,
        },
        aiEvaluation: undefined,
      },
    }));
  },

  setPattern: (pattern) => {
    set((state) => ({
      currentOutfit: {
        ...state.currentOutfit,
        pattern,
      },
    }));
  },

  setScene: (sceneId) => {
    set((state) => ({
      currentOutfit: {
        ...state.currentOutfit,
        sceneId,
        aiEvaluation: undefined,
      },
    }));
  },

  toggleAccessory: (accessoryId) => {
    set((state) => {
      const current = state.currentOutfit.accessories;
      const next = current.includes(accessoryId)
        ? current.filter((id) => id !== accessoryId)
        : [...current, accessoryId];
      return {
        currentOutfit: {
          ...state.currentOutfit,
          accessories: next,
          aiEvaluation: undefined,
        },
      };
    });
  },

  removeAccessory: (accessoryId) => {
    set((state) => ({
      currentOutfit: {
        ...state.currentOutfit,
        accessories: state.currentOutfit.accessories.filter((id) => id !== accessoryId),
        aiEvaluation: undefined,
      },
    }));
  },

  clearAllAccessories: () => {
    set((state) => ({
      currentOutfit: {
        ...state.currentOutfit,
        accessories: [],
        aiEvaluation: undefined,
      },
    }));
  },

  setAiEvaluation: (evalResult) => {
    set((state) => ({
      currentOutfit: {
        ...state.currentOutfit,
        aiEvaluation: evalResult,
      },
      isEvaluating: false,
    }));
  },

  setIsEvaluating: (loading) => set({ isEvaluating: loading }),

  saveCurrentOutfit: () => {
    const state = get();
    const newOutfit: OutfitConfig = {
      ...state.currentOutfit,
      id: `outfit-${Date.now()}`,
      createdAt: Date.now(),
      title: state.currentOutfit.title || `Bản phối ${new Date().toLocaleDateString('vi-VN')}`,
    };
    const updated = [newOutfit, ...state.savedOutfits];
    set({ savedOutfits: updated });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  },

  deleteSavedOutfit: (id) => {
    set((state) => {
      const updated = state.savedOutfits.filter((o) => o.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return { savedOutfits: updated };
    });
  },

  clearAllSavedOutfits: () => {
    set(() => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      return { savedOutfits: [] };
    });
  },

  loadSavedOutfit: (outfit) => {
    set({
      currentOutfit: { ...outfit },
      currentView: 'canvas',
      currentStep: 4,
    });
  },

  setNotificationPermission: (perm) => set({ notificationPermission: perm }),
  setShowWeeklyNotificationModal: (show) => set({ showWeeklyNotificationModal: show }),

  resetCurrentOutfit: () => {
    set({
      currentOutfit: { ...initialOutfit, createdAt: Date.now() },
      currentStep: 1,
    });
  },

  toggleDarkMode: () => {
    set((state) => {
      const next = !state.darkMode;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
        if (typeof document !== 'undefined') {
          if (next) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch (e) {}
      return { darkMode: next };
    });
  },

  setDarkMode: (enabled) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, enabled ? 'dark' : 'light');
      if (typeof document !== 'undefined') {
        if (enabled) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (e) {}
    set({ darkMode: enabled });
  },

  setBackgroundPattern: (pattern) => {
    try {
      localStorage.setItem(PATTERN_STORAGE_KEY, pattern);
    } catch (e) {}
    set({ backgroundPattern: pattern });
  },
}));
