import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { GARMENTS_DATA, BACKGROUND_SCENES } from '../data/garments';
import { GarmentSvgSilhouette } from './GarmentSvgSilhouette';
import { OutfitCardExporter } from './OutfitCardExporter';
import { OutfitConfig } from '../types';
import { 
  Bookmark, 
  Trash2, 
  Edit3, 
  Share2, 
  Sparkles, 
  Award, 
  Clock, 
  Layers, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { savedOutfits, deleteSavedOutfit, loadSavedOutfit, setView, setStep } = useAppStore();
  const [selectedOutfitToExport, setSelectedOutfitToExport] = useState<OutfitConfig | null>(null);

  // Calculate statistics
  const totalLooks = savedOutfits.length;
  const avgScore = totalLooks > 0
    ? Math.round(
        savedOutfits.reduce((acc, curr) => acc + (curr.aiEvaluation?.culturalSafetyScore ?? 90), 0) / totalLooks
      )
    : 0;

  // Garment distribution
  const garmentCounts: Record<string, number> = {};
  savedOutfits.forEach((o) => {
    garmentCounts[o.garmentId] = (garmentCounts[o.garmentId] || 0) + 1;
  });

  const topGarmentId = Object.entries(garmentCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topGarment = GARMENTS_DATA.find((g) => g.id === topGarmentId);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="border-b border-[#E5DCCE] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8F2635] font-semibold">
            Bảo Tàng Ký Ức Cá Nhân · My Atelier
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#2C241E] mt-1 tracking-tight">
            Lookbook Của Bạn
          </h1>
          <p className="text-sm text-[#6C6258] mt-2 max-w-2xl font-light">
            Nơi lưu giữ các bản phối di sản độc bản của bạn, theo dõi mức độ am tường văn hóa và quản lý các tác phẩm đã xuất bản.
          </p>
        </div>

        <button
          onClick={() => {
            setStep(1);
            setView('canvas');
          }}
          className="px-5 py-2.5 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] transition-all text-xs font-medium flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tạo bản phối mới</span>
        </button>
      </div>

      {/* Metrics & Analytics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-white border border-[#E5DCCE] shadow-editorial flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#8F2635]/10 text-[#8F2635] flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#2C241E]">{totalLooks}</div>
            <div className="text-xs text-[#6C6258] mt-0.5">Bản phối trong Lookbook</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5DCCE] shadow-editorial flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#286B61]/10 text-[#286B61] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#286B61]">
              {totalLooks > 0 ? `${avgScore} / 100` : '--'}
            </div>
            <div className="text-xs text-[#6C6258] mt-0.5">Điểm An Toàn Văn Hóa TB</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5DCCE] shadow-editorial flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#D5B477]/20 text-[#684A17] flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-base font-serif font-bold text-[#2C241E] truncate max-w-[180px]">
              {topGarment?.name || 'Chưa định hình'}
            </div>
            <div className="text-xs text-[#6C6258] mt-0.5">Phom áo ưa thích nhất</div>
          </div>
        </div>
      </div>

      {/* Looks Grid / Empty State */}
      {savedOutfits.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E5DCCE] p-12 text-center max-w-xl mx-auto shadow-editorial space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F7F1E7] text-[#8F2635] flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#2C241E]">Chưa Có Bản Phối Nào Được Lưu</h3>
          <p className="text-xs text-[#6C6258] max-w-md mx-auto leading-relaxed">
            Hãy bắt đầu hành trình sáng tạo của bạn tại Phòng Phối Trang Phục. Tự do thay đổi sắc áo ngũ thân, thẩm định cùng trợ lý AI và lưu lại dấu ấn riêng!
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setStep(1);
                setView('canvas');
              }}
              className="px-6 py-3 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] text-xs font-medium inline-flex items-center gap-2 shadow-sm"
            >
              <span>Vào phòng phối đồ ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedOutfits.map((outfit) => {
            const g = GARMENTS_DATA.find((item) => item.id === outfit.garmentId) || GARMENTS_DATA[0];
            const sc = BACKGROUND_SCENES.find((item) => item.id === outfit.sceneId) || BACKGROUND_SCENES[0];
            const score = outfit.aiEvaluation?.culturalSafetyScore ?? 90;

            return (
              <div
                key={outfit.id}
                className="bg-white rounded-2xl border border-[#E5DCCE] overflow-hidden shadow-editorial hover:shadow-elevated transition-all flex flex-col justify-between"
              >
                {/* SVG Visual Header */}
                <div className="relative h-64 bg-gradient-to-b from-[#F7F1E7] to-white p-4 flex items-center justify-center border-b border-[#E5DCCE]">
                  {/* Score Tag */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md border border-[#E5DCCE] text-xs shadow-2xs">
                    <span className="font-serif font-bold text-[#8F2635]">{score}</span>
                    <span className="text-[10px] text-[#6C6258]">điểm</span>
                  </div>

                  <div className="absolute top-3 right-3 text-[11px] text-[#6C6258] font-serif">
                    {sc.name}
                  </div>

                  <GarmentSvgSilhouette
                    silhouette={outfit.silhouette}
                    colors={outfit.colors}
                    pattern={outfit.pattern}
                    accessories={outfit.accessories}
                    className="w-full h-full max-h-[220px] drop-shadow-md"
                  />
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-[#2C241E]">{outfit.title}</h4>
                    <div className="text-xs text-[#8F2635] font-serif italic mt-0.5">{g.name}</div>
                    <div className="flex items-center gap-1 text-[11px] text-[#6C6258] mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(outfit.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  {/* Palette Swatches */}
                  <div className="flex items-center gap-2 pt-1">
                    {Object.values(outfit.colors).slice(0, 5).map((hex, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#E5DCCE] flex items-center justify-between">
                    <button
                      onClick={() => deleteSavedOutfit(outfit.id)}
                      className="p-2 text-[#6C6258] hover:text-[#8F2635] hover:bg-[#8F2635]/5 rounded-lg transition-colors"
                      title="Xóa khỏi bộ sưu tập"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOutfitToExport(outfit)}
                        className="px-3 py-1.5 rounded-lg border border-[#E5DCCE] hover:bg-[#F7F1E7] text-xs font-medium text-[#2C241E] flex items-center gap-1"
                        title="Xuất thẻ Instagram Story"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Xuất thẻ</span>
                      </button>

                      <button
                        onClick={() => loadSavedOutfit(outfit)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#8F2635] text-white hover:bg-[#701D29] text-xs font-medium flex items-center gap-1 shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Export Modal */}
      {selectedOutfitToExport && (
        <OutfitCardExporter
          outfit={selectedOutfitToExport}
          onClose={() => setSelectedOutfitToExport(null)}
        />
      )}
    </div>
  );
};
