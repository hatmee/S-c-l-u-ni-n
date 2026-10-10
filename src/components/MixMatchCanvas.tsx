import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  GARMENTS_DATA, 
  TRADITIONAL_COLORS, 
  BACKGROUND_SCENES, 
  ACCESSORIES_DATA,
  HAIRSTYLE_OPTIONS,
  HAIR_COLORS
} from '../data/garments';
import { GarmentSvgSilhouette } from './GarmentSvgSilhouette';
import { evaluateOutfitWithAI } from '../services/geminiService';
import { OutfitCardExporter } from './OutfitCardExporter';
import { 
  Sparkles, 
  Layers, 
  Palette, 
  MapPin, 
  ShoppingBag, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Share2,
  Bookmark,
  ShieldCheck,
  Info,
  Sliders,
  Camera,
  User,
  Scissors,
  Trash2,
  X
} from 'lucide-react';

export const MixMatchCanvas: React.FC = () => {
  const {
    currentOutfit,
    currentStep,
    activeLayer,
    isEvaluating,
    savedOutfits,
    setStep,
    setActiveLayer,
    setGarment,
    setGender,
    setHairstyle,
    setHairColor,
    setLayerColor,
    setPattern,
    setScene,
    toggleAccessory,
    removeAccessory,
    clearAllAccessories,
    setAiEvaluation,
    setIsEvaluating,
    saveCurrentOutfit,
    setView,
  } = useAppStore();

  const [showExportModal, setShowExportModal] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  const selectedGarment = GARMENTS_DATA.find((g) => g.id === currentOutfit.garmentId) || GARMENTS_DATA[0];
  const selectedScene = BACKGROUND_SCENES.find((s) => s.id === currentOutfit.sceneId) || BACKGROUND_SCENES[0];

  const layerLabels: Record<typeof activeLayer, { name: string; desc: string }> = {
    mainBody: { name: 'Thân Áo', desc: 'Lớp vải chính, dáng dài phủ quá gối' },
    collarAndButtons: { name: 'Nẹp Cổ & 5 Khuy', desc: 'Cổ đứng lập lĩnh & hàng khuy Ngũ Thường' },
    sleeves: { name: 'Tay Áo', desc: 'Tay chẽn gọn gàng hoặc tay thụng nghi lễ' },
    innerLining: { name: 'Cổ & Tà Lót Trong', desc: 'Lớp lót trắng ngà hoặc tương phản bên trong' },
    trousers: { name: 'Quần Hạ Y', desc: 'Quần lụa ống rộng dài chấm mu bàn chân' },
    headwear: { name: 'Khăn Vấn', desc: 'Khăn xếp nhiều nếp ôm đầu chỉn chu' },
  };

  const handleRunAiEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const result = await evaluateOutfitWithAI(currentOutfit);
      setAiEvaluation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSaveToLookbook = () => {
    saveCurrentOutfit();
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10">
      {/* Editorial Header */}
      <div className="mb-8 border-b border-[#E5DCCE] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8F2635] font-semibold">
            Bản Thiết Kế Độc Bản · Atelier Sắc Lưu Niên
          </span>
          <h1 className="text-2xl md:text-4xl font-serif text-[#2C241E] mt-1 tracking-tight">
            Phòng Phối Trang Phục Di Sản
          </h1>
          <p className="text-sm text-[#6C6258] mt-1 max-w-2xl font-light">
            Tự do biến tấu các lớp vải vector Áo Ngũ Thân, khám phá thẩm mỹ cổ truyền kết hợp phong cách đương đại cùng trợ lý AI.
          </p>
        </div>

        {/* 4-Step Progress Tracker */}
        <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur p-1.5 rounded-lg border border-[#E5DCCE] shadow-sm">
          {[
            { step: 1, label: 'Trang phục' },
            { step: 2, label: 'Bối cảnh' },
            { step: 3, label: 'Phụ kiện' },
            { step: 4, label: 'Thẩm định' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setStep(item.step as 1 | 2 | 3 | 4)}
              className={`px-3 py-1.5 rounded text-xs transition-all font-medium flex items-center gap-1.5 ${
                currentStep === item.step
                  ? 'bg-[#8F2635] text-white shadow-sm'
                  : currentStep > item.step
                  ? 'text-[#286B61] hover:bg-[#F7F1E7]'
                  : 'text-[#6C6258] hover:bg-[#F7F1E7]'
              }`}
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
                {currentStep > item.step ? '✓' : item.step}
              </span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: 2 Columns (Left Canvas, Right Studio Controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SVG Dynamic Canvas Display (Col 5) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full relative rounded-2xl overflow-hidden border border-[#E5DCCE] bg-white shadow-editorial">
            
            {/* Background Texture Indicator */}
            <div className={`absolute inset-0 bg-gradient-to-b ${selectedScene.gradient} opacity-40 pointer-events-none transition-all duration-700`} />

            {/* Scene Watermark Tag */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md border border-[#E5DCCE] text-xs shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#8F2635]" />
              <span className="font-serif font-medium text-[#2C241E]">{selectedScene.name}</span>
            </div>

            {/* Garment Silhouette Tag */}
            <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md border border-[#E5DCCE] text-xs shadow-sm text-right">
              <span className="font-serif text-[#286B61] font-medium">{selectedGarment.name}</span>
            </div>

            {/* Wind Motion Tag for buong-xoa-nu */}
            {currentOutfit.hairstyle === 'buong-xoa-nu' && (
              <div className="absolute top-12 left-4 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[#286B61]/30 text-[11px] shadow-xs text-[#286B61]">
                <span className="text-xs">🍃</span>
                <span className="font-serif italic font-medium">Hoạt họa: Suối tóc thướt tha đung đưa theo gió</span>
              </div>
            )}

            {/* Interactive SVG Layer Canvas */}
            <div className="relative pt-12 pb-6 px-4 flex items-center justify-center min-h-[520px]">
              <GarmentSvgSilhouette
                silhouette={currentOutfit.silhouette}
                gender={currentOutfit.gender}
                hairstyle={currentOutfit.hairstyle}
                hairColor={currentOutfit.hairColor}
                colors={currentOutfit.colors}
                pattern={currentOutfit.pattern}
                activeLayer={activeLayer}
                onLayerClick={(layer) => setActiveLayer(layer as any)}
                accessories={currentOutfit.accessories}
                className="w-full max-h-[540px] drop-shadow-md select-none"
              />
            </div>

            {/* Bottom Bar inside Canvas: Active Layer Indicator */}
            <div className="border-t border-[#E5DCCE] bg-white/95 px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentOutfit.colors[activeLayer] }} />
                <span className="text-[#6C6258]">Đang chọn:</span>
                <span className="font-medium text-[#2C241E] font-serif">{layerLabels[activeLayer].name}</span>
              </div>
              <span className="text-[11px] text-[#6C6258] italic hidden sm:inline">
                Nhấp trực tiếp lên áo để đổi lớp
              </span>
            </div>

            {/* Active Accessories Deletion Tray */}
            <div className="border-t border-[#E5DCCE] bg-[#F7F1E7]/70 px-4 py-2.5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-serif font-semibold text-[#2C241E] flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#8F2635]" />
                  <span>Item Phụ Kiện Đang Mặc ({currentOutfit.accessories.length})</span>
                </span>
                {currentOutfit.accessories.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllAccessories}
                    className="text-[11px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1 hover:underline"
                    title="Gỡ toàn bộ phụ kiện"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa hết item</span>
                  </button>
                )}
              </div>

              {currentOutfit.accessories.length === 0 ? (
                <div className="text-[11px] text-[#6C6258] italic py-0.5">
                  Chưa trang bị phụ kiện. Chuyển sang Bước 3 để thêm phụ kiện hoặc trang sức.
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {currentOutfit.accessories.map((accId) => {
                    const acc = ACCESSORIES_DATA.find((a) => a.id === accId);
                    if (!acc) return null;
                    return (
                      <span
                        key={accId}
                        className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-0.5 rounded-md bg-white border border-[#E5DCCE] text-[11px] text-[#2C241E] shadow-2xs group"
                      >
                        <span className="truncate max-w-[120px] font-medium">{acc.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAccessory(accId)}
                          className="w-4 h-4 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-red-600 transition-colors"
                          title={`Xóa ${acc.name}`}
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Buttons Under Canvas */}
          <div className="w-full mt-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setView('moodboard')}
              className="flex-1 py-2.5 px-3 rounded-lg border border-[#286B61] text-[#286B61] hover:bg-[#286B61]/5 transition-colors text-xs font-medium flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Phòng thử đồ 2D</span>
            </button>

            <button
              onClick={handleSaveToLookbook}
              className="flex-1 py-2.5 px-3 rounded-lg border border-[#8F2635] text-[#8F2635] hover:bg-[#8F2635]/5 transition-colors text-xs font-medium flex items-center justify-center gap-2"
            >
              <Bookmark className="w-4 h-4" />
              <span>{saveSuccessMessage ? 'Đã lưu lookbook!' : 'Lưu bản phối'}</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="py-2.5 px-4 rounded-lg bg-[#8F2635] text-white hover:bg-[#701D29] transition-colors text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm"
              title="Xuất thẻ tạp chí Instagram Story"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Xuất Tạp Chí</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: 4-Step Styling Controls (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5DCCE] p-6 shadow-editorial">
          
          {/* STEP 1: CHỌN TRANG PHỤC & PHỐI MÀU SVG LAYERING */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif text-[#2C241E] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#8F2635] text-white text-xs flex items-center justify-center font-sans font-bold">1</span>
                    Chọn Kiểu Áo & Phối Màu Từng Lớp
                  </h2>
                  <span className="text-xs text-[#286B61] font-medium bg-[#286B61]/10 px-2.5 py-1 rounded">
                    {selectedGarment.tag}
                  </span>
                </div>
                <p className="text-xs text-[#6C6258] mt-1">
                  Chọn phom dáng trang phục truyền thống và bấm vào từng phân đoạn để thử sắc màu di sản.
                </p>
              </div>

              {/* Garment Selector Tabs */}
              <div>
                <label className="text-xs font-medium text-[#2C241E] uppercase tracking-wider block mb-2">
                  Dáng Cổ Phục Chuẩn Mực
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {GARMENTS_DATA.map((garment) => {
                    const isCurrent = garment.id === currentOutfit.garmentId;
                    return (
                      <button
                        key={garment.id}
                        onClick={() => setGarment(garment.id)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          isCurrent
                            ? 'border-[#8F2635] bg-[#8F2635]/5 shadow-sm ring-1 ring-[#8F2635]'
                            : 'border-[#E5DCCE] hover:border-[#8F2635]/40 hover:bg-[#F7F1E7]/50'
                        }`}
                      >
                        <div className="text-xs font-serif font-semibold text-[#2C241E]">{garment.name}</div>
                        <div className="text-[11px] text-[#6C6258] mt-0.5 line-clamp-1">{garment.era}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Character Gender & Hairstyle Customization */}
              <div className="p-4 rounded-xl border border-[#D5B477]/60 bg-gradient-to-br from-white via-[#F7F1E7]/40 to-white space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#2C241E] uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8F2635]" />
                    Nhân Vật & Kiểu Tóc
                  </label>
                  <span className="text-[11px] text-[#8F2635] font-serif font-medium bg-[#8F2635]/10 px-2 py-0.5 rounded-full">
                    {currentOutfit.gender === 'nu' ? 'Phái Nữ · Thanh tú' : 'Phái Nam · Đĩnh đạc'}
                  </span>
                </div>

                {/* Gender Toggle Buttons */}
                <div>
                  <span className="text-[11px] font-medium text-[#6C6258] block mb-1.5">Giới tính nhân vật:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('nam')}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        (currentOutfit.gender || 'nam') === 'nam'
                          ? 'border-[#8F2635] bg-[#8F2635] text-white shadow-xs font-semibold'
                          : 'border-[#E5DCCE] bg-white text-[#2C241E] hover:bg-[#F7F1E7]'
                      }`}
                    >
                      <span className="text-base">👨</span>
                      <span>Nhân Vật Nam</span>
                      {(currentOutfit.gender || 'nam') === 'nam' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender('nu')}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        currentOutfit.gender === 'nu'
                          ? 'border-[#8F2635] bg-[#8F2635] text-white shadow-xs font-semibold'
                          : 'border-[#E5DCCE] bg-white text-[#2C241E] hover:bg-[#F7F1E7]'
                      }`}
                    >
                      <span className="text-base">👩</span>
                      <span>Nhân Vật Nữ</span>
                      {currentOutfit.gender === 'nu' && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Hairstyle Selection Grid */}
                <div>
                  <div className="text-[11px] font-medium text-[#6C6258] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Scissors className="w-3 h-3 text-[#286B61]" />
                      Chọn Kiểu Tóc ({currentOutfit.gender === 'nu' ? 'Phái Nữ' : 'Phái Nam'}):
                    </span>
                    <span className="text-[10.5px] text-[#286B61] italic font-serif font-medium">
                      {HAIRSTYLE_OPTIONS.find((h) => h.id === currentOutfit.hairstyle)?.name || 'Chuẩn di sản'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {HAIRSTYLE_OPTIONS.filter((h) => h.gender === (currentOutfit.gender || 'nam') || h.gender === 'all').map((style) => {
                      const isActive = (currentOutfit.hairstyle || (currentOutfit.gender === 'nu' ? 'buong-xoa-nu' : 'khan-dong-nam')) === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setHairstyle(style.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isActive
                              ? 'border-[#8F2635] bg-[#8F2635]/10 ring-1 ring-[#8F2635] font-semibold text-[#8F2635] shadow-2xs'
                              : 'border-[#E5DCCE] bg-white hover:bg-[#F7F1E7] text-[#2C241E]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[11px] font-serif leading-tight font-bold truncate">{style.name}</span>
                              {isActive && <Check className="w-3 h-3 text-[#8F2635] flex-shrink-0" />}
                            </div>
                            <span className="inline-block mt-0.5 text-[9px] uppercase px-1.5 py-0.2 rounded font-mono bg-black/5 text-[#6C6258]">
                              {style.era}
                            </span>
                            {style.id === 'buong-xoa-nu' && (
                              <span className="inline-block mt-0.5 ml-1 text-[9px] px-1.5 py-0.2 rounded font-sans font-medium bg-[#286B61]/10 text-[#286B61]">
                                🍃 Hoạt họa gió bay
                              </span>
                            )}
                          </div>
                          <div className="text-[9.5px] text-[#6C6258] mt-1 line-clamp-2 leading-snug">{style.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hair Color Palette */}
                <div className="pt-2.5 border-t border-[#E5DCCE]/70 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#6C6258] font-medium">Sắc màu tóc:</span>
                  <div className="flex items-center gap-2">
                    {HAIR_COLORS.map((hc) => {
                      const isColorActive = (currentOutfit.hairColor || '#212025').toLowerCase() === hc.hex.toLowerCase();
                      return (
                        <button
                          key={hc.id}
                          type="button"
                          onClick={() => setHairColor(hc.hex)}
                          className={`w-6 h-6 rounded-full border border-black/20 shadow-2xs relative flex items-center justify-center transition-transform hover:scale-110 ${
                            isColorActive ? 'ring-2 ring-[#8F2635] ring-offset-1' : ''
                          }`}
                          style={{ backgroundColor: hc.hex }}
                          title={hc.name}
                        >
                          {isColorActive && <Check className="w-3 h-3 text-white drop-shadow" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Layer Selection Tabs (Bóc tách SVG) */}
              <div className="pt-2 border-t border-[#E5DCCE]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-[#2C241E] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#8F2635]" />
                    Lớp Cắt Trang Phục (SVG Layer)
                  </label>
                  <span className="text-xs text-[#8F2635] font-medium font-serif">
                    {layerLabels[activeLayer].name}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(Object.keys(layerLabels) as Array<typeof activeLayer>).map((layerKey) => {
                    const isActive = activeLayer === layerKey;
                    const currentColor = currentOutfit.colors[layerKey];
                    return (
                      <button
                        key={layerKey}
                        onClick={() => setActiveLayer(layerKey)}
                        className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1.5 ${
                          isActive
                            ? 'border-[#8F2635] bg-[#8F2635]/10 font-semibold'
                            : 'border-[#E5DCCE] hover:bg-[#F7F1E7]'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                          style={{ backgroundColor: currentColor }}
                        />
                        <span className="text-[11px] text-[#2C241E] leading-tight">
                          {layerLabels[layerKey].name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Heritage Color Palette Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-[#2C241E] uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#286B61]" />
                    Bảng Màu Di Sản (Vietnamese Heritage Palette)
                  </label>
                  <span className="text-[11px] text-[#6C6258]">
                    Đang chọn: {currentOutfit.colors[activeLayer]}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {TRADITIONAL_COLORS.map((col) => {
                    const isColorActive = currentOutfit.colors[activeLayer].toLowerCase() === col.hex.toLowerCase();
                    return (
                      <button
                        key={col.id}
                        onClick={() => setLayerColor(activeLayer, col.hex)}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                          isColorActive
                            ? 'border-[#8F2635] ring-2 ring-[#8F2635] bg-[#8F2635]/5'
                            : 'border-[#E5DCCE] hover:bg-[#F7F1E7]'
                        }`}
                      >
                        <span
                          className="w-6 h-6 rounded-full flex-shrink-0 border border-black/10 shadow-sm"
                          style={{ backgroundColor: col.hex }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-[#2C241E] truncate">{col.name}</div>
                          <div className="text-[10px] text-[#6C6258] truncate">{col.vietnameseName.split(' ')[0]}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fabric Pattern Texture */}
              <div className="pt-2 border-t border-[#E5DCCE]">
                <label className="text-xs font-medium text-[#2C241E] uppercase tracking-wider block mb-2">
                  Hoa Văn Dệt Lụa Truyền Thống
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'plain', name: 'Lụa Tơ Tằm Trơn', desc: 'Mượt mà thuần khiết' },
                    { id: 'damask', name: 'Gấm Hoa Cúc', desc: 'Họa tiết vương giả' },
                    { id: 'cloud', name: 'Vân Mây Cung Đình', desc: 'Cát tường như ý' },
                    { id: 'lotus', name: 'Liên Hoa (Sen)', desc: 'Thanh tao thoát tục' },
                  ].map((pat) => (
                    <button
                      key={pat.id}
                      onClick={() => setPattern(pat.id as any)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        currentOutfit.pattern === pat.id
                          ? 'border-[#286B61] bg-[#286B61]/10 font-semibold'
                          : 'border-[#E5DCCE] hover:bg-[#F7F1E7]'
                      }`}
                    >
                      <div className="text-xs text-[#2C241E]">{pat.name}</div>
                      <div className="text-[10px] text-[#6C6258]">{pat.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Step CTA */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] transition-all text-xs font-medium flex items-center gap-2 shadow-sm"
                >
                  <span>Bước 2: Chọn bối cảnh</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CHỌN BỐI CẢNH (SCENE) */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-serif text-[#2C241E] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8F2635] text-white text-xs flex items-center justify-center font-sans font-bold">2</span>
                  Chọn Không Gian Trình Diễn
                </h2>
                <p className="text-xs text-[#6C6258] mt-1">
                  Bối cảnh sẽ quyết định tương quan màu sắc và tiêu chí thẩm định an toàn văn hóa của AI Stylist.
                </p>
              </div>

              <div className="space-y-3">
                {BACKGROUND_SCENES.map((scene) => {
                  const isSelected = scene.id === currentOutfit.sceneId;
                  return (
                    <button
                      key={scene.id}
                      onClick={() => setScene(scene.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-4 ${
                        isSelected
                          ? 'border-[#8F2635] bg-[#8F2635]/5 shadow-sm ring-1 ring-[#8F2635]'
                          : 'border-[#E5DCCE] hover:bg-[#F7F1E7]/50'
                      }`}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl shadow-xs border border-white/20"
                        style={{ backgroundColor: `${scene.backdropColor}25` }}
                      >
                        {scene.emoji || '🏛️'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-serif font-semibold text-[#2C241E] flex items-center gap-1.5">
                            <span>{scene.name}</span>
                          </h3>
                          {isSelected && <span className="text-xs text-[#8F2635] font-semibold bg-[#8F2635]/10 px-2 py-0.5 rounded-full">Đang chọn ✓</span>}
                        </div>
                        <p className="text-xs text-[#8F2635] font-medium mt-0.5">{scene.tagline}</p>
                        <p className="text-xs text-[#6C6258] mt-1 font-light">{scene.description}</p>
                        {scene.suggestedMix && (
                          <div className="mt-2 text-[11px] bg-white/80 p-2 rounded-lg border border-[#E5DCCE] text-[#286B61]">
                            <span className="font-semibold text-[#2C241E]">Gợi ý phối: </span>
                            {scene.suggestedMix}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-[#E5DCCE] text-[#2C241E] hover:bg-[#F7F1E7] transition-all text-xs font-medium flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] transition-all text-xs font-medium flex items-center gap-2 shadow-sm"
                >
                  <span>Bước 3: Chọn phụ kiện</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PHONG CÁCH & PHỤ KIỆN (ACCESSORIES) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-serif text-[#2C241E] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8F2635] text-white text-xs flex items-center justify-center font-sans font-bold">3</span>
                  Phụ Kiện & Điểm Nhấn Cá Tính
                </h2>
                <p className="text-xs text-[#6C6258] mt-1">
                  Kết hợp giữa chuẩn mực cổ truyền và phụ kiện street-style hiện đại để định hình phong cách độc bản.
                </p>
              </div>

              {/* PHẦN QUẢN LÝ & XÓA ITEM PHỤ KIỆN */}
              <div className="p-4 rounded-2xl bg-[#F7F1E7]/70 border border-[#E5DCCE] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-serif font-bold text-[#2C241E] flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-[#8F2635]" />
                      Item Phụ Kiện Đang Phối ({currentOutfit.accessories.length})
                    </span>
                    {currentOutfit.accessories.length > 0 && (
                      <span className="text-[10px] bg-[#8F2635]/10 text-[#8F2635] px-2 py-0.5 rounded-full font-medium">
                        {currentOutfit.accessories.length} món
                      </span>
                    )}
                  </div>

                  {currentOutfit.accessories.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllAccessories}
                      className="text-xs text-red-600 hover:text-white hover:bg-red-600 font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-200 transition-colors shadow-2xs"
                      title="Gỡ toàn bộ phụ kiện đang mặc"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa tất cả item</span>
                    </button>
                  )}
                </div>

                {currentOutfit.accessories.length === 0 ? (
                  <p className="text-xs text-[#6C6258] italic">
                    Chưa có phụ kiện nào được thêm vào trang phục. Nhấp chọn các món đồ bên dưới để phối thêm.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {currentOutfit.accessories.map((accId) => {
                      const itemObj = ACCESSORIES_DATA.find((a) => a.id === accId);
                      if (!itemObj) return null;
                      return (
                        <div
                          key={accId}
                          className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-xl bg-white border border-[#E5DCCE] shadow-2xs group hover:border-[#8F2635] transition-colors"
                        >
                          <span className="text-xs font-medium text-[#2C241E]">
                            {itemObj.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAccessory(accId)}
                            className="p-1 text-stone-400 hover:text-white hover:bg-red-600 rounded-md transition-colors"
                            title={`Xóa ${itemObj.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Traditional Accessories */}
              <div>
                <span className="text-xs font-medium text-[#286B61] uppercase tracking-wider block mb-2.5">
                  Phụ Kiện Cổ Truyền Chuẩn Mực
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ACCESSORIES_DATA.filter((a) => a.eraCategory === 'traditional').map((item) => {
                    const isChecked = currentOutfit.accessories.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleAccessory(item.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'border-[#286B61] bg-[#286B61]/5 ring-1 ring-[#286B61]'
                            : 'border-[#E5DCCE] hover:bg-[#F7F1E7]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                          isChecked ? 'bg-[#286B61] border-[#286B61] text-white' : 'border-[#E5DCCE]'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-[#2C241E]">{item.name}</div>
                          <div className="text-[11px] text-[#6C6258] mt-0.5">{item.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contemporary Gen Z Accessories */}
              <div>
                <span className="text-xs font-medium text-[#8F2635] uppercase tracking-wider block mb-2.5">
                  Điểm Phá Cách Đương Đại (Gen Z Street-Style)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ACCESSORIES_DATA.filter((a) => a.eraCategory === 'contemporary').map((item) => {
                    const isChecked = currentOutfit.accessories.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleAccessory(item.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'border-[#8F2635] bg-[#8F2635]/5 ring-1 ring-[#8F2635]'
                            : 'border-[#E5DCCE] hover:bg-[#F7F1E7]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                          isChecked ? 'bg-[#8F2635] border-[#8F2635] text-white' : 'border-[#E5DCCE]'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-[#2C241E]">{item.name}</div>
                          <div className="text-[11px] text-[#6C6258] mt-0.5">{item.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-[#E5DCCE] text-[#2C241E] hover:bg-[#F7F1E7] transition-all text-xs font-medium flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
                <button
                  onClick={() => {
                    setStep(4);
                    if (!currentOutfit.aiEvaluation) {
                      handleRunAiEvaluation();
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] transition-all text-xs font-medium flex items-center gap-2 shadow-sm"
                >
                  <span>Bước 4: Thẩm định AI</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: THẨM ĐỊNH AI VĂN HÓA & XUẤT MOCKUP */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif text-[#2C241E] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#8F2635] text-white text-xs flex items-center justify-center font-sans font-bold">4</span>
                    Thẩm Định Văn Hóa & Xuất Bản
                  </h2>
                  <p className="text-xs text-[#6C6258] mt-1">
                    Trợ lý AI Cultural Stylist đánh giá mức độ tương thích di sản và tạo caption chia sẻ.
                  </p>
                </div>

                <button
                  onClick={handleRunAiEvaluation}
                  disabled={isEvaluating}
                  className="px-3.5 py-1.5 rounded-lg border border-[#8F2635] text-[#8F2635] hover:bg-[#8F2635]/5 transition-colors text-xs font-medium flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                  <span>Chấm điểm lại</span>
                </button>
              </div>

              {/* Evaluation Card */}
              {isEvaluating ? (
                <div className="p-8 rounded-2xl border border-[#E5DCCE] bg-[#F7F1E7]/40 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-[#8F2635] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-serif text-[#2C241E]">
                    Chuyên gia AI đang phân tích kết cấu nẹp cổ, 5 khuy và bối cảnh...
                  </p>
                  <p className="text-xs text-[#6C6258]">
                    Đang đối chiếu quy chuẩn Đại Nam Thực Lục & Thẩm mỹ Đương đại
                  </p>
                </div>
              ) : currentOutfit.aiEvaluation ? (
                <div className="space-y-4">
                  
                  {/* Score & Badge Hero */}
                  <div className="p-5 rounded-2xl border border-[#E5DCCE] bg-gradient-to-br from-white to-[#F7F1E7] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-[#6C6258] font-medium">Điểm An Toàn Văn Hóa</span>
                        <span className="text-[10px] text-[#286B61] bg-[#286B61]/10 px-2 py-0.5 rounded font-mono">
                          {currentOutfit.aiEvaluation.engineUsed === 'gemini' ? 'Gemini 2.5 Flash' : 'Hệ Thống Quy Chuẩn Chuẩn Mực'}
                        </span>
                      </div>
                      <div className="text-3xl font-serif font-bold text-[#8F2635] mt-1 flex items-baseline gap-1">
                        {currentOutfit.aiEvaluation.culturalSafetyScore}
                        <span className="text-sm text-[#6C6258] font-normal">/ 100</span>
                      </div>
                      <p className="text-xs text-[#286B61] mt-1 font-medium">
                        {currentOutfit.aiEvaluation.culturalSafetyScore >= 90
                          ? 'Đạt chuẩn mực di sản xuất sắc, hài hòa đương đại'
                          : 'Sự sáng tạo phá cách thú vị, vẫn bảo toàn linh hồn cổ y'}
                      </p>
                    </div>

                    <div className="sm:border-l sm:border-[#E5DCCE] sm:pl-6 text-left sm:max-w-xs">
                      <div className="text-xs font-semibold text-[#2C241E] uppercase tracking-wide">Cấu Trúc Cốt Lõi</div>
                      <div className="text-xs text-[#6C6258] mt-1 space-y-0.5">
                        <div>✓ Lập lĩnh (Cổ đứng 5 khuy cài kín đáo)</div>
                        <div>✓ Thân áo xẻ tà sườn phải chuẩn mực</div>
                        <div>✓ Bối cảnh: {selectedScene.name}</div>
                      </div>
                    </div>
                  </div>

                  {/* Evaluation Remarks */}
                  <div className="p-4 rounded-xl border border-[#E5DCCE] bg-white">
                    <div className="text-xs font-semibold text-[#8F2635] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#8F2635]" />
                      Nhận Xét Chuyên Môn
                    </div>
                    <p className="text-xs text-[#2C241E] leading-relaxed">
                      {currentOutfit.aiEvaluation.evaluation}
                    </p>
                  </div>

                  {/* Social Caption Suggestion */}
                  <div className="p-4 rounded-xl border border-[#D5B477]/40 bg-[#D5B477]/10">
                    <div className="text-xs font-semibold text-[#684A17] uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Caption Gợi Ý Cho Mạng Xã Hội (Instagram / TikTok)</span>
                      <button
                        onClick={() => {
                          if (currentOutfit.aiEvaluation?.socialCaption) {
                            navigator.clipboard.writeText(currentOutfit.aiEvaluation.socialCaption);
                            alert('Đã sao chép caption vào clipboard!');
                          }
                        }}
                        className="text-[11px] underline hover:text-[#8F2635]"
                      >
                        Sao chép
                      </button>
                    </div>
                    <p className="text-xs text-[#2C241E] italic leading-relaxed">
                      "{currentOutfit.aiEvaluation.socialCaption}"
                    </p>
                  </div>

                  {/* Historical Insight & Tips */}
                  <div className="p-4 rounded-xl border border-[#E5DCCE] bg-white">
                    <div className="text-xs font-semibold text-[#286B61] uppercase tracking-wider mb-1">
                      Ý Nghĩa Di Sản & Lời Khuyên Tạo Dáng
                    </div>
                    <p className="text-xs text-[#6C6258] leading-relaxed mb-2">
                      {currentOutfit.aiEvaluation.historicalInsight}
                    </p>
                    <ul className="text-xs text-[#2C241E] space-y-1 list-disc list-inside">
                      {currentOutfit.aiEvaluation.styleTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="text-center py-8">
                  <button
                    onClick={handleRunAiEvaluation}
                    className="px-6 py-2.5 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] transition-all text-xs font-medium inline-flex items-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Bắt đầu thẩm định văn hóa</span>
                  </button>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#E5DCCE] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-[#E5DCCE] text-[#2C241E] hover:bg-[#F7F1E7] transition-all text-xs font-medium flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Chỉnh sửa phụ kiện</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleSaveToLookbook}
                    className="px-4 py-2.5 rounded-xl border border-[#8F2635] text-[#8F2635] hover:bg-[#8F2635]/5 transition-all text-xs font-medium flex items-center gap-2"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>{saveSuccessMessage ? 'Đã lưu!' : 'Lưu Lookbook'}</span>
                  </button>

                  <button
                    onClick={() => setShowExportModal(true)}
                    className="px-6 py-2.5 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] transition-all text-xs font-medium flex items-center gap-2 shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Xuất Thẻ Tạp Chí 9:16</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Export Modal Container */}
      {showExportModal && (
        <OutfitCardExporter
          outfit={currentOutfit}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
