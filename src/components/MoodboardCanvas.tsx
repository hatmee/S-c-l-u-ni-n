import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MoodboardCanvasItem, GarmentSilhouette } from '../types';
import { 
  MOODBOARD_PRESET_ASSETS, 
  TRADITIONAL_COLORS, 
  BACKGROUND_SCENES, 
  MoodboardPresetAsset,
  GARMENTS_DATA,
  HAIRSTYLE_OPTIONS,
  HAIR_COLORS
} from '../data/garments';
import { MoodboardAssetRenderer } from './MoodboardAssetRenderer';
import { evaluateOutfitWithAI } from '../services/geminiService';
import { OutfitCardExporter } from './OutfitCardExporter';
import {
  Sparkles,
  Move,
  RotateCw,
  Maximize2,
  Trash2,
  Copy,
  Layers,
  Palette,
  MapPin,
  Share2,
  Bookmark,
  Check,
  Plus,
  RotateCcw,
  Sliders,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  User,
  Scissors,
  Undo2,
  AlertTriangle,
  X,
  Eye,
  ListFilter
} from 'lucide-react';

export const MoodboardCanvas: React.FC = () => {
  const {
    currentOutfit,
    isEvaluating,
    setAiEvaluation,
    setIsEvaluating,
    saveCurrentOutfit,
    setScene,
    setGarment,
    setGender,
    setHairstyle,
    setHairColor,
  } = useAppStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Trang phục');
  const [leftTab, setLeftTab] = useState<'library' | 'manage'>('library');
  const [lastDeletedItem, setLastDeletedItem] = useState<{ item: MoodboardCanvasItem; index: number } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Default Canvas Items (initialized with authentic image_a3daa7 reference layout)
  const [items, setItems] = useState<MoodboardCanvasItem[]>([
    {
      id: 'mb-garment-main',
      itemType: 'garment',
      name: 'Áo Ngũ Thân Lập Lĩnh (Bản Gốc)',
      assetId: 'asset-ngu-than-nam',
      x: 180,
      y: 70,
      width: 250,
      height: 440,
      rotation: 0,
      zIndex: 2,
      silhouette: 'ao-ngu-than-tay-chen',
      gender: currentOutfit.gender || 'nam',
      hairstyle: currentOutfit.hairstyle || 'khan-dong-nam',
      hairColor: currentOutfit.hairColor || '#212025',
      colors: {
        mainBody: '#1D3557', // Áo dài tối màu chuẩn image_a3daa7
        collarAndButtons: '#D5B477', // Nẹp cổ đứng sáng màu & 5 khuy vàng kim
        sleeves: '#1D3557',
        innerLining: '#F7F1E7',
        trousers: '#F7F1E7',
        headwear: '#212025',
      },
      pattern: 'plain',
    },
    {
      id: 'mb-quat-tram',
      itemType: 'handheld',
      name: 'Quạt Xếp Trầm Hương',
      assetId: 'asset-quat-tram',
      x: 350,
      y: 260,
      width: 100,
      height: 90,
      rotation: -18,
      zIndex: 4,
    },
    {
      id: 'mb-sneaker',
      itemType: 'footwear',
      name: 'Sneaker Trắng Gen Z',
      assetId: 'asset-sneaker-chunky',
      x: 120,
      y: 430,
      width: 120,
      height: 70,
      rotation: 8,
      zIndex: 3,
    },
    {
      id: 'mb-kinh-ram',
      itemType: 'eyewear',
      name: 'Kính Râm Retro',
      assetId: 'asset-kinh-ram-oval',
      x: 80,
      y: 120,
      width: 90,
      height: 45,
      rotation: -12,
      zIndex: 5,
    },
    {
      id: 'mb-seal',
      itemType: 'badge',
      name: 'Triện Son Sắc Lưu Niên',
      assetId: 'asset-badge-seal',
      x: 440,
      y: 40,
      width: 80,
      height: 80,
      rotation: 5,
      zIndex: 1,
    },
  ]);

  const [selectedItemId, setSelectedItemId] = useState<string | null>('mb-garment-main');
  const [activeGarmentLayer, setActiveGarmentLayer] = useState<'mainBody' | 'collarAndButtons' | 'sleeves' | 'trousers' | 'headwear'>('mainBody');

  const selectedItem = items.find((i) => i.id === selectedItemId);
  const selectedScene = BACKGROUND_SCENES.find((s) => s.id === currentOutfit.sceneId) || BACKGROUND_SCENES[0];

  // Dragging, Resizing & Rotating State Tracking
  const interactionRef = useRef<{
    mode: 'none' | 'drag' | 'resize' | 'rotate';
    startX: number;
    startY: number;
    itemStartX: number;
    itemStartY: number;
    itemStartW: number;
    itemStartH: number;
    itemStartRot: number;
    handleCorner?: string;
  }>({
    mode: 'none',
    startX: 0,
    startY: 0,
    itemStartX: 0,
    itemStartY: 0,
    itemStartW: 0,
    itemStartH: 0,
    itemStartRot: 0,
  });

  // Handle Drag Move on Canvas
  const handlePointerDownItem = (e: React.PointerEvent, item: MoodboardCanvasItem) => {
    e.stopPropagation();
    setSelectedItemId(item.id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    interactionRef.current = {
      mode: 'drag',
      startX: e.clientX,
      startY: e.clientY,
      itemStartX: item.x,
      itemStartY: item.y,
      itemStartW: item.width,
      itemStartH: item.height,
      itemStartRot: item.rotation,
    };
  };

  // Handle Resize Corner Down
  const handlePointerDownResize = (e: React.PointerEvent, corner: string) => {
    e.stopPropagation();
    if (!selectedItem) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    interactionRef.current = {
      mode: 'resize',
      startX: e.clientX,
      startY: e.clientY,
      itemStartX: selectedItem.x,
      itemStartY: selectedItem.y,
      itemStartW: selectedItem.width,
      itemStartH: selectedItem.height,
      itemStartRot: selectedItem.rotation,
      handleCorner: corner,
    };
  };

  // Handle Rotation Down
  const handlePointerDownRotate = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!selectedItem) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    interactionRef.current = {
      mode: 'rotate',
      startX: e.clientX,
      startY: e.clientY,
      itemStartX: selectedItem.x,
      itemStartY: selectedItem.y,
      itemStartW: selectedItem.width,
      itemStartH: selectedItem.height,
      itemStartRot: selectedItem.rotation,
    };
  };

  // Global Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    const inter = interactionRef.current;
    if (inter.mode === 'none' || !selectedItemId) return;

    const dx = e.clientX - inter.startX;
    const dy = e.clientY - inter.startY;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== selectedItemId) return item;

        if (inter.mode === 'drag') {
          return {
            ...item,
            x: Math.round(inter.itemStartX + dx),
            y: Math.round(inter.itemStartY + dy),
          };
        }

        if (inter.mode === 'resize') {
          // Proportionate or direct scaling
          const ratio = inter.itemStartW / inter.itemStartH;
          let newW = inter.itemStartW;
          let newH = inter.itemStartH;

          if (inter.handleCorner === 'se') {
            newW = Math.max(40, inter.itemStartW + dx);
            newH = Math.max(40, inter.itemStartH + dy);
          } else if (inter.handleCorner === 'sw') {
            newW = Math.max(40, inter.itemStartW - dx);
            newH = Math.max(40, inter.itemStartH + dy);
          } else if (inter.handleCorner === 'ne') {
            newW = Math.max(40, inter.itemStartW + dx);
            newH = Math.max(40, inter.itemStartH - dy);
          } else {
            newW = Math.max(40, inter.itemStartW - dx);
            newH = Math.max(40, inter.itemStartH - dy);
          }

          return {
            ...item,
            width: Math.round(newW),
            height: Math.round(newH),
          };
        }

        if (inter.mode === 'rotate') {
          if (!canvasRef.current) return item;
          const rect = canvasRef.current.getBoundingClientRect();
          const itemCenterX = rect.left + item.x + item.width / 2;
          const itemCenterY = rect.top + item.y + item.height / 2;
          const rad = Math.atan2(e.clientY - itemCenterY, e.clientX - itemCenterX);
          let deg = Math.round((rad * 180) / Math.PI) - 90;
          return {
            ...item,
            rotation: deg,
          };
        }

        return item;
      })
    );
  };

  const handlePointerUp = () => {
    interactionRef.current.mode = 'none';
  };

  // Add Item From Preset Assets
  const handleAddItem = (asset: MoodboardPresetAsset) => {
    const newItem: MoodboardCanvasItem = {
      id: `mb-item-${Date.now()}`,
      itemType: asset.itemType,
      name: asset.name,
      assetId: asset.id,
      x: 100 + Math.floor(Math.random() * 80),
      y: 100 + Math.floor(Math.random() * 80),
      width: asset.defaultWidth,
      height: asset.defaultHeight,
      rotation: 0,
      zIndex: items.length + 1,
      silhouette: asset.silhouette,
      colors: asset.colors ? { ...asset.colors } : undefined,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.id);
  };

  // Z-Index Controls
  const handleZIndexChange = (delta: number) => {
    if (!selectedItemId) return;
    setItems((prev) =>
      prev.map((item) => (item.id === selectedItemId ? { ...item, zIndex: Math.max(1, item.zIndex + delta) } : item))
    );
  };

  const handleDeleteItemById = (id: string) => {
    const targetIdx = items.findIndex((i) => i.id === id);
    if (targetIdx === -1) return;
    const targetItem = items[targetIdx];
    setLastDeletedItem({ item: targetItem, index: targetIdx });
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  };

  const handleDeleteSelectedItem = () => {
    if (!selectedItemId) return;
    handleDeleteItemById(selectedItemId);
  };

  const handleRestoreDeletedItem = () => {
    if (!lastDeletedItem) return;
    setItems((prev) => {
      const copy = [...prev];
      copy.splice(Math.min(lastDeletedItem.index, copy.length), 0, lastDeletedItem.item);
      return copy;
    });
    setSelectedItemId(lastDeletedItem.item.id);
    setLastDeletedItem(null);
  };

  const handleClearAllItems = () => {
    if (items.length === 0) return;
    setItems([]);
    setSelectedItemId(null);
    setShowClearConfirm(false);
  };

  // Keyboard shortcut: Delete or Backspace to delete selected item
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItemId) {
        e.preventDefault();
        handleDeleteItemById(selectedItemId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, items]);

  // Auto-dismiss undo notification after 6 seconds
  useEffect(() => {
    if (!lastDeletedItem) return;
    const timer = setTimeout(() => {
      setLastDeletedItem(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [lastDeletedItem]);

  const handleDuplicateSelectedItem = () => {
    if (!selectedItem) return;
    const duplicated: MoodboardCanvasItem = {
      ...selectedItem,
      id: `mb-item-${Date.now()}`,
      x: selectedItem.x + 25,
      y: selectedItem.y + 25,
      zIndex: items.length + 1,
    };
    setItems((prev) => [...prev, duplicated]);
    setSelectedItemId(duplicated.id);
  };

  // Dynamic SVG Color Changer for garment items
  const handleColorChange = (hex: string) => {
    if (!selectedItemId) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== selectedItemId) return item;
        const nextColors = { ...(item.colors || {}) };
        nextColors[activeGarmentLayer] = hex;
        return {
          ...item,
          colors: nextColors,
        };
      })
    );
  };

  const handleItemGenderChange = (newGender: 'nam' | 'nu') => {
    if (!selectedItemId) return;
    const nextStyle = newGender === 'nu' ? 'buong-xoa-nu' : 'khan-dong-nam';
    setItems((prev) =>
      prev.map((it) =>
        it.id === selectedItemId
          ? { ...it, gender: newGender, hairstyle: nextStyle }
          : it
      )
    );
    setGender(newGender);
  };

  const handleItemHairstyleChange = (styleId: any) => {
    if (!selectedItemId) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === selectedItemId
          ? { ...it, hairstyle: styleId }
          : it
      )
    );
    setHairstyle(styleId);
  };

  const handleItemHairColorChange = (hex: string) => {
    if (!selectedItemId) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === selectedItemId
          ? { ...it, hairColor: hex }
          : it
      )
    );
    setHairColor(hex);
  };

  // Preset Layout Switcher
  const applyPresetLayout = (preset: 'original' | 'streetwear' | 'ceremony') => {
    if (preset === 'original') {
      // image_a3daa7 standard
      setItems([
        {
          id: 'mb-garment-main',
          itemType: 'garment',
          name: 'Áo Ngũ Thân Nam Lập Lĩnh',
          assetId: 'asset-ngu-than-nam',
          x: 180,
          y: 70,
          width: 250,
          height: 440,
          rotation: 0,
          zIndex: 2,
          silhouette: 'ao-ngu-than-tay-chen',
          colors: {
            mainBody: '#1D3557', // Áo dài tối màu
            collarAndButtons: '#D5B477', // Nẹp cổ & 5 khuy sáng màu
            sleeves: '#1D3557',
            innerLining: '#F7F1E7',
            trousers: '#F7F1E7',
            headwear: '#212025',
          },
        },
        {
          id: 'mb-quat-tram',
          itemType: 'handheld',
          name: 'Quạt Xếp Trầm Hương',
          assetId: 'asset-quat-tram',
          x: 350,
          y: 260,
          width: 100,
          height: 90,
          rotation: -18,
          zIndex: 4,
        },
        {
          id: 'mb-guoc-moc',
          itemType: 'footwear',
          name: 'Guốc Mộc Quai Nhung',
          assetId: 'asset-guoc-moc',
          x: 130,
          y: 440,
          width: 110,
          height: 60,
          rotation: 0,
          zIndex: 3,
        },
        {
          id: 'mb-seal',
          itemType: 'badge',
          name: 'Triện Son Sắc Lưu Niên',
          assetId: 'asset-badge-seal',
          x: 440,
          y: 40,
          width: 80,
          height: 80,
          rotation: 5,
          zIndex: 1,
        },
      ]);
      setScene('hoang-thanh-thang-long');
    } else if (preset === 'streetwear') {
      setItems([
        {
          id: 'mb-garment-main',
          itemType: 'garment',
          name: 'Áo Ngũ Thân Phối Streetwear',
          assetId: 'asset-ngu-than-nam',
          x: 180,
          y: 70,
          width: 250,
          height: 440,
          rotation: 0,
          zIndex: 2,
          silhouette: 'ao-ngu-than-tay-chen',
          colors: {
            mainBody: '#212025',
            collarAndButtons: '#D5B477',
            sleeves: '#212025',
            innerLining: '#F7F1E7',
            trousers: '#FFFFFF',
            headwear: '#212025',
          },
        },
        {
          id: 'mb-sneaker',
          itemType: 'footwear',
          name: 'Sneaker Trắng Gen Z',
          assetId: 'asset-sneaker-chunky',
          x: 130,
          y: 430,
          width: 120,
          height: 70,
          rotation: 8,
          zIndex: 3,
        },
        {
          id: 'mb-kinh-ram',
          itemType: 'eyewear',
          name: 'Kính Râm Retro',
          assetId: 'asset-kinh-ram-oval',
          x: 90,
          y: 120,
          width: 90,
          height: 45,
          rotation: -12,
          zIndex: 5,
        },
        {
          id: 'mb-quat-tram',
          itemType: 'handheld',
          name: 'Quạt Xếp Trầm Hương',
          assetId: 'asset-quat-tram',
          x: 350,
          y: 260,
          width: 100,
          height: 90,
          rotation: -18,
          zIndex: 4,
        },
      ]);
      setScene('cafe-indochine');
    }
  };

  // Run AI Stylist on current Moodboard items
  const handleTriggerAI = async () => {
    setIsEvaluating(true);
    try {
      const mainGarment = items.find((i) => i.itemType === 'garment');
      const accessoriesInBoard = items.filter((i) => i.itemType !== 'garment').map((i) => i.assetId);

      const outfitPayload = {
        ...currentOutfit,
        garmentId: mainGarment?.silhouette || currentOutfit.garmentId,
        silhouette: mainGarment?.silhouette || currentOutfit.silhouette,
        colors: {
          mainBody: mainGarment?.colors?.mainBody || currentOutfit.colors.mainBody,
          collarAndButtons: mainGarment?.colors?.collarAndButtons || currentOutfit.colors.collarAndButtons,
          sleeves: mainGarment?.colors?.sleeves || currentOutfit.colors.sleeves,
          innerLining: mainGarment?.colors?.innerLining || currentOutfit.colors.innerLining,
          trousers: mainGarment?.colors?.trousers || currentOutfit.colors.trousers,
          headwear: mainGarment?.colors?.headwear || currentOutfit.colors.headwear,
        },
        accessories: accessoriesInBoard,
        moodboardItems: items,
      };

      const result = await evaluateOutfitWithAI(outfitPayload);
      setAiEvaluation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSaveLook = () => {
    saveCurrentOutfit();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Editorial Header */}
      <div className="mb-8 border-b border-[#E5DCCE] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8F2635] font-semibold">
            Bảng Phối Đồ 2D · Interactive Digital Moodboard
          </span>
          <h1 className="text-2xl md:text-4xl font-serif text-[#2C241E] mt-1 tracking-tight">
            Phòng Thử Đồ & Moodboard Tạp Chí
          </h1>
          <p className="text-xs md:text-sm text-[#6C6258] mt-1 max-w-2xl font-light">
            Tự do kéo thả, xoay, thay đổi kích thước và phối màu trực tiếp các món y phục cổ truyền theo tỷ lệ nghiên cứu <em>"Trang Phục Việt Nam"</em> và <em>"Ngàn Năm Áo Mũ"</em>.
          </p>
        </div>

        {/* Preset Layout Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => applyPresetLayout('original')}
            className="px-3 py-1.5 rounded-lg border border-[#D5B477] bg-white text-xs font-serif font-medium text-[#2C241E] hover:bg-[#F7F1E7] transition-colors shadow-2xs"
          >
            Bản Gốc Chuẩn Mực
          </button>
          <button
            onClick={() => applyPresetLayout('streetwear')}
            className="px-3 py-1.5 rounded-lg border border-[#8F2635] bg-[#8F2635]/10 text-xs font-serif font-medium text-[#8F2635] hover:bg-[#8F2635]/15 transition-colors shadow-2xs"
          >
            Streetwear Gen Z
          </button>
        </div>
      </div>

      {/* Main Grid: Left Drawer (Assets), Center (2D Canvas Board), Right (Inspector & Color) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Asset Library & Item Deletion Manager (Col 3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E5DCCE] p-4 shadow-editorial space-y-4 max-h-[720px] flex flex-col">
          {/* Main Tab Toggle: Thêm Món Đồ vs Quản Lý & Xóa Item */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F7F1E7] rounded-xl border border-[#E5DCCE]">
            <button
              type="button"
              onClick={() => setLeftTab('library')}
              className={`py-1.5 px-2 rounded-lg text-xs font-serif font-medium transition-all flex items-center justify-center gap-1.5 ${
                leftTab === 'library'
                  ? 'bg-white text-[#8F2635] shadow-xs font-semibold'
                  : 'text-[#6C6258] hover:text-[#2C241E]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Item</span>
            </button>
            <button
              type="button"
              onClick={() => setLeftTab('manage')}
              className={`py-1.5 px-2 rounded-lg text-xs font-serif font-medium transition-all flex items-center justify-center gap-1.5 ${
                leftTab === 'manage'
                  ? 'bg-[#8F2635] text-white shadow-xs font-semibold'
                  : 'text-[#6C6258] hover:text-[#2C241E]'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa Item ({items.length})</span>
            </button>
          </div>

          {leftTab === 'library' ? (
            <>
              <div>
                <h3 className="text-sm font-serif font-bold text-[#2C241E] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#8F2635]" />
                  Thư Viện Món Đồ (Assets)
                </h3>
                <p className="text-[11px] text-[#6C6258] mt-0.5">
                  Nhấp để thêm trang phục hoặc phụ kiện vào Moodboard
                </p>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1 border-b border-[#E5DCCE] pb-2 text-[11px]">
                {['Trang phục', 'Quần & Váy', 'Phụ kiện đầu', 'Cầm tay', 'Giày dép', 'Họa tiết & Tem'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-1 rounded transition-colors ${
                      activeCategory === cat ? 'bg-[#8F2635] text-white font-medium' : 'text-[#6C6258] hover:bg-[#F7F1E7]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Asset List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {MOODBOARD_PRESET_ASSETS.filter((a) => a.category === activeCategory).map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => handleAddItem(asset)}
                    className="w-full p-2.5 rounded-xl border border-[#E5DCCE] hover:border-[#8F2635] hover:bg-[#F7F1E7]/60 text-left transition-all flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#F7F1E7] flex items-center justify-center p-1 border border-[#E5DCCE] flex-shrink-0">
                      <MoodboardAssetRenderer
                        item={{
                          id: 'thumb',
                          itemType: asset.itemType,
                          name: asset.name,
                          assetId: asset.id,
                          x: 0,
                          y: 0,
                          width: 40,
                          height: 40,
                          rotation: 0,
                          zIndex: 1,
                          silhouette: asset.silhouette,
                          colors: asset.colors,
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-serif font-semibold text-[#2C241E] group-hover:text-[#8F2635] truncate">
                        {asset.name}
                      </div>
                      <div className="text-[10px] text-[#6C6258] truncate">{asset.description}</div>
                    </div>
                    <Plus className="w-4 h-4 text-[#8F2635] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>

              {/* Quick switch to Manage */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#6C6258]">
                <span>Đang có {items.length} món trên bảng vẽ</span>
                <button
                  type="button"
                  onClick={() => setLeftTab('manage')}
                  className="text-[#8F2635] hover:underline font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Quản lý & xóa ➜</span>
                </button>
              </div>
            </>
          ) : (
            /* TAB: QUẢN LÝ & XÓA ITEM */
            <div className="flex-1 flex flex-col space-y-3 min-h-0">
              <div className="flex items-center justify-between border-b border-[#E5DCCE] pb-2">
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#2C241E] flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    Quản Lý & Xóa Item
                  </h3>
                  <p className="text-[10px] text-[#6C6258]">
                    {items.length > 0 ? `Đang có ${items.length} món đồ trên bảng vẽ` : 'Moodboard đang trống'}
                  </p>
                </div>
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="px-2.5 py-1 text-[11px] font-medium text-red-600 hover:text-white hover:bg-red-600 rounded-lg border border-red-200 transition-all flex items-center gap-1 shadow-2xs"
                    title="Xóa tất cả các item trên Moodboard"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa tất cả</span>
                  </button>
                )}
              </div>

              {/* Clear All Confirmation Alert */}
              {showClearConfirm && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                  <div className="flex items-start gap-2 text-xs text-red-800 font-medium">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Xóa toàn bộ {items.length} món đồ trên moodboard?</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2.5 py-1 text-[11px] rounded bg-white border border-stone-300 text-stone-700"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllItems}
                      className="px-2.5 py-1 text-[11px] rounded bg-red-600 text-white font-medium hover:bg-red-700"
                    >
                      Xác nhận xóa hết
                    </button>
                  </div>
                </div>
              )}

              {/* Items List with Direct Delete Buttons */}
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#6C6258] space-y-2">
                  <Sliders className="w-8 h-8 text-[#8F2635]/30 mx-auto" />
                  <p className="text-xs font-serif font-semibold text-[#2C241E]">Moodboard Chưa Có Món Đồ Nào</p>
                  <p className="text-[11px]">Chuyển sang tab "Thêm Item" để chọn các phục trang & phụ kiện truyền thống.</p>
                  <button
                    type="button"
                    onClick={() => setLeftTab('library')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-[#8F2635] text-white text-xs font-medium"
                  >
                    + Thêm món đồ mới
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {items.map((item) => {
                    const isSelected = item.id === selectedItemId;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItemId(item.id)}
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer group ${
                          isSelected
                            ? 'border-[#8F2635] bg-[#8F2635]/5 ring-1 ring-[#8F2635]'
                            : 'border-[#E5DCCE] hover:bg-[#F7F1E7]/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-[#F7F1E7] border border-[#E5DCCE] flex items-center justify-center p-1 flex-shrink-0">
                            <MoodboardAssetRenderer
                              item={{
                                ...item,
                                x: 0,
                                y: 0,
                                width: 32,
                                height: 32,
                                rotation: 0,
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-serif font-bold text-[#2C241E] truncate group-hover:text-[#8F2635]">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-[#6C6258] flex items-center gap-1.5 mt-0.5">
                              <span className="capitalize">{item.itemType}</span>
                              <span>· Lớp {item.zIndex}</span>
                              {isSelected && <span className="text-[#8F2635] font-semibold">✓ Đang chọn</span>}
                            </div>
                          </div>
                        </div>

                        {/* Direct Delete Button */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItemById(item.id);
                            }}
                            className="px-2 py-1 rounded-lg text-xs font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 transition-colors flex items-center gap-1"
                            title={`Xóa ${item.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Xóa</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Scene Backdrop Selector */}
          <div className="pt-3 border-t border-[#E5DCCE]">
            <label className="text-[11px] font-semibold text-[#2C241E] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#8F2635]" />
              Bối Cảnh Trình Diễn
            </label>
            <select
              value={currentOutfit.sceneId}
              onChange={(e) => setScene(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-[#E5DCCE] bg-[#F7F1E7] text-[#2C241E] focus:outline-none focus:ring-1 focus:ring-[#8F2635]"
            >
              {BACKGROUND_SCENES.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.emoji ? `${sc.emoji} ` : ''}{sc.name}
                </option>
              ))}
            </select>
            {selectedScene && (
              <div className="mt-1.5 text-[10px] text-[#6C6258] bg-[#F7F1E7]/70 p-2 rounded-lg border border-[#E5DCCE]/60">
                <span className="font-semibold text-[#8F2635]">{selectedScene.tagline}</span>
                {selectedScene.suggestedMix && (
                  <p className="mt-0.5 text-[#286B61] leading-tight line-clamp-2">
                    💡 {selectedScene.suggestedMix}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: 2D Moodboard Canvas Board (Col 6) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div
            id="moodboard-capture-node"
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={() => setSelectedItemId(null)}
            className="w-full aspect-[9/14] sm:h-[640px] max-h-[660px] bg-[#F7F1E7] rounded-2xl border-2 border-[#D5B477]/40 shadow-editorial relative overflow-hidden select-none cursor-default"
            style={{
              backgroundImage: 'radial-gradient(#E5DCCE 1.2px, transparent 1.2px)',
              backgroundSize: '18px 18px',
            }}
          >
            {/* Background Gradient Ambiance */}
            <div className={`absolute inset-0 bg-gradient-to-b ${selectedScene.gradient} opacity-40 pointer-events-none`} />

            {/* Editorial Top Border Tag */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md border border-[#E5DCCE] text-[11px] shadow-2xs pointer-events-none">
              <span className="font-serif font-bold text-[#8F2635]">SẮC LƯU NIÊN</span>
              <span className="text-[#6C6258]">·</span>
              <span className="font-serif italic text-[#2C241E]">{selectedScene.name}</span>
            </div>

            {/* Render Moodboard Items */}
            {items.map((item) => {
              const isSelected = item.id === selectedItemId;

              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItemId(item.id);
                  }}
                  onPointerDown={(e) => handlePointerDownItem(e, item)}
                  style={{
                    position: 'absolute',
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    width: `${item.width}px`,
                    height: `${item.height}px`,
                    transform: `rotate(${item.rotation}deg)`,
                    transformOrigin: 'center center',
                    zIndex: item.zIndex,
                    cursor: interactionRef.current.mode === 'drag' ? 'grabbing' : 'grab',
                  }}
                  className={`group transition-shadow ${
                    isSelected ? 'ring-2 ring-[#8F2635] ring-offset-2 ring-offset-transparent' : 'hover:ring-1 hover:ring-[#8F2635]/40'
                  }`}
                >
                  {/* Asset Graphic */}
                  <MoodboardAssetRenderer item={item} isSelected={isSelected} />

                  {/* Bounding Box Handles when Selected */}
                  {isSelected && (
                    <>
                      {/* Top Rotation Anchor Handle */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                        <div
                          onPointerDown={handlePointerDownRotate}
                          className="w-5 h-5 rounded-full bg-[#8F2635] border-2 border-white shadow-md flex items-center justify-center cursor-crosshair hover:scale-125 transition-transform"
                          title="Kéo để xoay góc"
                        >
                          <RotateCw className="w-2.5 h-2.5 text-white" />
                        </div>
                        <div className="w-0.5 h-2 bg-[#8F2635]" />
                      </div>

                      {/* Top-Right Direct Delete Badge Button on Canvas */}
                      <div className="absolute -top-3.5 -right-3.5 pointer-events-auto z-30">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItemById(item.id);
                          }}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white border-2 border-white shadow-md flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all"
                          title="Xóa món đồ này khỏi moodboard (Phím Delete)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* 4 Corner Resize Handles */}
                      <div
                        onPointerDown={(e) => handlePointerDownResize(e, 'nw')}
                        className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-[#8F2635] rounded-xs cursor-nwse-resize shadow-xs"
                      />
                      <div
                        onPointerDown={(e) => handlePointerDownResize(e, 'ne')}
                        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-[#8F2635] rounded-xs cursor-nesw-resize shadow-xs"
                      />
                      <div
                        onPointerDown={(e) => handlePointerDownResize(e, 'sw')}
                        className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-[#8F2635] rounded-xs cursor-nesw-resize shadow-xs"
                      />
                      <div
                        onPointerDown={(e) => handlePointerDownResize(e, 'se')}
                        className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-[#8F2635] rounded-xs cursor-nwse-resize shadow-xs"
                      />

                      {/* Angle Display tooltip */}
                      {item.rotation !== 0 && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded font-mono pointer-events-none">
                          {item.rotation}°
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}

            {/* Empty Canvas Indicator */}
            {items.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#6C6258] p-6 text-center pointer-events-none">
                <Sliders className="w-8 h-8 text-[#8F2635]/40 mb-2" />
                <p className="text-xs font-serif font-semibold text-[#2C241E]">Moodboard Hiện Chưa Có Món Đồ Nào</p>
                <p className="text-[11px] mt-1">Chọn trang phục hoặc phụ kiện từ thư viện bên trái để bắt đầu sắp đặt.</p>
              </div>
            )}

            {/* Undo Toast Notification when an item is deleted */}
            {lastDeletedItem && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#2C241E] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#E5DCCE]/30 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-2">
                <span className="flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  Đã xóa món đồ <strong>"{lastDeletedItem.item.name}"</strong>
                </span>
                <button
                  type="button"
                  onClick={handleRestoreDeletedItem}
                  className="bg-[#8F2635] hover:bg-[#A32D3F] text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors shadow-2xs"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>Hoàn tác</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLastDeletedItem(null)}
                  className="text-stone-400 hover:text-white p-0.5"
                  title="Đóng thông báo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Toolbar Under Canvas */}
          <div className="w-full mt-3 flex items-center justify-between gap-2">
            <button
              onClick={handleSaveLook}
              className="py-2 px-3 rounded-lg border border-[#8F2635] text-[#8F2635] hover:bg-[#8F2635]/5 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{saveToast ? 'Đã lưu!' : 'Lưu Lookbook'}</span>
            </button>

            <button
              onClick={handleTriggerAI}
              disabled={isEvaluating}
              className="py-2 px-4 rounded-lg bg-[#286B61] text-white hover:bg-[#1E524A] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
              <span>Thẩm Định AI</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="py-2 px-4 rounded-lg bg-[#8F2635] text-white hover:bg-[#701D29] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Xuất Thẻ Tạp Chí</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Inspector & Heritage Color Customizer (Col 3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E5DCCE] p-4 shadow-editorial space-y-5">
          {/* Selected Item Controls */}
          {selectedItem ? (
            <div className="space-y-4">
              <div className="border-b border-[#E5DCCE] pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8F2635] font-semibold">Đang Tinh Chỉnh</span>
                  <h4 className="text-xs font-serif font-bold text-[#2C241E] truncate max-w-[150px]">
                    {selectedItem.name}
                  </h4>
                </div>
                <button
                  onClick={handleDeleteSelectedItem}
                  className="p-1.5 text-stone-400 hover:text-[#8F2635] rounded-md hover:bg-black/5"
                  title="Xóa món đồ này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons: Z-index & Duplicate */}
              <div>
                <label className="text-[11px] font-semibold text-[#2C241E] uppercase tracking-wider block mb-1.5">
                  Lớp Thứ Tự (Z-Index)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleZIndexChange(1)}
                    className="p-1.5 rounded-lg border border-[#E5DCCE] hover:bg-[#F7F1E7] text-xs flex items-center justify-center gap-1"
                  >
                    <ChevronUp className="w-3.5 h-3.5 text-[#286B61]" />
                    <span>Lên trên</span>
                  </button>
                  <button
                    onClick={() => handleZIndexChange(-1)}
                    className="p-1.5 rounded-lg border border-[#E5DCCE] hover:bg-[#F7F1E7] text-xs flex items-center justify-center gap-1"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-[#8F2635]" />
                    <span>Xuống dưới</span>
                  </button>
                  <button
                    onClick={handleDuplicateSelectedItem}
                    className="col-span-2 p-1.5 rounded-lg border border-[#E5DCCE] hover:bg-[#F7F1E7] text-xs flex items-center justify-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#6C6258]" />
                    <span>Nhân bản món đồ</span>
                  </button>
                </div>
              </div>

              {/* Character Gender & Hairstyle Controls (If garment item) */}
              {selectedItem.itemType === 'garment' && (
                <div className="pt-2 border-t border-[#E5DCCE] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-[#2C241E] uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#8F2635]" />
                      Nhân Vật & Kiểu Tóc
                    </label>
                    <span className="text-[10px] text-[#8F2635] font-serif font-medium bg-[#8F2635]/10 px-2 py-0.5 rounded-full">
                      {(selectedItem.gender || currentOutfit.gender) === 'nu' ? 'Phái Nữ' : 'Phái Nam'}
                    </span>
                  </div>

                  {/* Gender Selector */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleItemGenderChange('nam')}
                      className={`p-1.5 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        (selectedItem.gender || currentOutfit.gender || 'nam') === 'nam'
                          ? 'border-[#8F2635] bg-[#8F2635] text-white font-semibold shadow-2xs'
                          : 'border-[#E5DCCE] bg-white text-[#2C241E] hover:bg-[#F7F1E7]'
                      }`}
                    >
                      <span>👨</span>
                      <span>Nam</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemGenderChange('nu')}
                      className={`p-1.5 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        (selectedItem.gender || currentOutfit.gender) === 'nu'
                          ? 'border-[#8F2635] bg-[#8F2635] text-white font-semibold shadow-2xs'
                          : 'border-[#E5DCCE] bg-white text-[#2C241E] hover:bg-[#F7F1E7]'
                      }`}
                    >
                      <span>👩</span>
                      <span>Nữ</span>
                    </button>
                  </div>

                  {/* Hairstyle Selector */}
                  <div>
                    <label className="text-[10px] text-[#6C6258] block mb-1">Kiểu tóc:</label>
                    <select
                      value={selectedItem.hairstyle || (selectedItem.gender === 'nu' ? 'buong-xoa-nu' : 'khan-dong-nam')}
                      onChange={(e) => handleItemHairstyleChange(e.target.value as any)}
                      className="w-full text-xs p-1.5 rounded-lg border border-[#E5DCCE] bg-[#F7F1E7] text-[#2C241E] focus:outline-none focus:ring-1 focus:ring-[#8F2635]"
                    >
                      {HAIRSTYLE_OPTIONS.filter((h) => h.gender === (selectedItem.gender || currentOutfit.gender || 'nam') || h.gender === 'all').map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.era})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hair Color Palette */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    <span className="text-[10px] text-[#6C6258]">Màu tóc:</span>
                    <div className="flex items-center gap-1.5">
                      {HAIR_COLORS.map((hc) => {
                        const isColActive = (selectedItem.hairColor || currentOutfit.hairColor || '#212025').toLowerCase() === hc.hex.toLowerCase();
                        return (
                          <button
                            key={hc.id}
                            type="button"
                            onClick={() => handleItemHairColorChange(hc.hex)}
                            className={`w-5 h-5 rounded-full border border-black/20 shadow-2xs relative flex items-center justify-center transition-transform hover:scale-110 ${
                              isColActive ? 'ring-2 ring-[#8F2635]' : ''
                            }`}
                            style={{ backgroundColor: hc.hex }}
                            title={hc.name}
                          >
                            {isColActive && <Check className="w-2.5 h-2.5 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SVG Layer Color Changer (If garment item) */}
              {selectedItem.itemType === 'garment' && (
                <div className="pt-2 border-t border-[#E5DCCE] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-[#2C241E] uppercase tracking-wider flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5 text-[#8F2635]" />
                      Đổi Màu Lớp SVG (Fill)
                    </label>
                  </div>

                  {/* Sub-layer selection tabs */}
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    {[
                      { key: 'mainBody', label: 'Thân áo' },
                      { key: 'collarAndButtons', label: 'Nẹp cổ & 5 khuy' },
                      { key: 'sleeves', label: 'Tay áo' },
                      { key: 'trousers', label: 'Quần lụa' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveGarmentLayer(tab.key as any)}
                        className={`p-1.5 rounded-md border text-center transition-all ${
                          activeGarmentLayer === tab.key
                            ? 'border-[#8F2635] bg-[#8F2635]/10 font-semibold text-[#8F2635]'
                            : 'border-[#E5DCCE] text-[#6C6258] hover:bg-[#F7F1E7]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Palette Grid */}
                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {TRADITIONAL_COLORS.map((col) => {
                      const currentColor = selectedItem.colors?.[activeGarmentLayer];
                      const isColActive = currentColor?.toLowerCase() === col.hex.toLowerCase();
                      return (
                        <button
                          key={col.id}
                          onClick={() => handleColorChange(col.hex)}
                          className={`w-7 h-7 rounded-full border border-black/15 shadow-2xs relative flex items-center justify-center transition-transform hover:scale-110 ${
                            isColActive ? 'ring-2 ring-[#8F2635]' : ''
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        >
                          {isColActive && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Prominent Delete Action Button in Inspector */}
              <div className="pt-3 border-t border-[#E5DCCE]">
                <button
                  type="button"
                  onClick={handleDeleteSelectedItem}
                  className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-center gap-2 transition-colors group shadow-2xs"
                  title="Xóa món đồ này khỏi moodboard"
                >
                  <Trash2 className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                  <span>Xóa Món Đồ Này (Phím Delete)</span>
                </button>
              </div>
            </div>
          ) : (
            /* No Item Selected state -> Quick Items Deletion & Selection list */
            <div className="space-y-4">
              <div className="text-center py-2 text-[#6C6258] space-y-1">
                <Move className="w-7 h-7 mx-auto text-[#8F2635]/40" />
                <div className="text-xs font-serif font-semibold text-[#2C241E]">Chưa Chọn Món Đồ Nào</div>
                <p className="text-[11px] leading-relaxed">
                  Nhấp chọn item trên bảng vẽ hoặc quản lý & xóa nhanh trong danh sách dưới đây:
                </p>
              </div>

              {/* Quick Item List with Delete Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#E5DCCE]">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#2C241E] uppercase tracking-wider">
                  <span>Món Đồ Trên Bảng ({items.length})</span>
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(true)}
                      className="text-red-600 hover:text-red-700 font-normal lowercase"
                    >
                      xóa hết
                    </button>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className="p-3 bg-[#F7F1E7]/50 rounded-xl border border-[#E5DCCE] text-center text-[11px] text-[#6C6258]">
                    Bảng vẽ đang trống.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                    {items.map((it) => (
                      <div
                        key={it.id}
                        onClick={() => setSelectedItemId(it.id)}
                        className="p-2 rounded-lg border border-[#E5DCCE] hover:bg-[#F7F1E7] flex items-center justify-between gap-2 cursor-pointer transition-colors text-xs group"
                      >
                        <span className="truncate text-[#2C241E] font-medium group-hover:text-[#8F2635]">
                          {it.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItemById(it.id);
                          }}
                          className="p-1 text-stone-400 hover:text-white hover:bg-red-600 rounded transition-colors"
                          title={`Xóa ${it.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Score Status Summary */}
          {currentOutfit.aiEvaluation && (
            <div className="p-3.5 rounded-xl border border-[#E5DCCE] bg-[#F7F1E7]/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#6C6258]">Điểm An Toàn Văn Hóa</span>
                <span className="text-xs font-serif font-bold text-[#8F2635]">
                  {currentOutfit.aiEvaluation.culturalSafetyScore} / 100
                </span>
              </div>
              <p className="text-[11px] text-[#2C241E] italic leading-tight line-clamp-3">
                "{currentOutfit.aiEvaluation.evaluation}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <OutfitCardExporter
          outfit={currentOutfit}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
