import React, { useRef, useState } from 'react';
import { OutfitConfig } from '../types';
import { GARMENTS_DATA, BACKGROUND_SCENES, TRADITIONAL_COLORS } from '../data/garments';
import { GarmentSvgSilhouette } from './GarmentSvgSilhouette';
import { MoodboardAssetRenderer } from './MoodboardAssetRenderer';
import { toPng, toJpeg } from 'html-to-image';
import { Download, X, Copy, Check, Sparkles, Share2, BookOpen, ShieldCheck } from 'lucide-react';

interface OutfitCardExporterProps {
  outfit: OutfitConfig;
  onClose: () => void;
}

export const OutfitCardExporter: React.FC<OutfitCardExporterProps> = ({ outfit, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aspectMode, setAspectMode] = useState<'9-16' | '4-5'>('9-16');

  const garment = GARMENTS_DATA.find((g) => g.id === outfit.garmentId) || GARMENTS_DATA[0];
  const scene = BACKGROUND_SCENES.find((s) => s.id === outfit.sceneId) || BACKGROUND_SCENES[0];
  const evalScore = outfit.aiEvaluation?.culturalSafetyScore ?? 92;

  const handleDownload = async (format: 'png' | 'jpeg') => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      await new Promise((r) => setTimeout(r, 150));
      const exporter = format === 'png' ? toPng : toJpeg;
      const dataUrl = await exporter(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `Sac-Luu-Nien-Lookbook-${garment.id}-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Không thể tạo file ảnh tự động. Bạn hãy chụp ảnh màn hình thẻ Moodboard này nhé!');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color Swatches to display on card
  const usedColors = [
    { label: 'Thân áo', hex: outfit.colors.mainBody },
    { label: 'Nẹp cổ & 5 khuy', hex: outfit.colors.collarAndButtons },
    { label: 'Tay áo', hex: outfit.colors.sleeves },
    { label: 'Quần lụa', hex: outfit.colors.trousers },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E5DCCE] overflow-hidden my-6">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-[#E5DCCE] flex items-center justify-between bg-[#F7F1E7]">
          <div>
            <h2 className="text-base font-serif font-bold text-[#2C241E]">
              Xuất Thẻ Tạp Chí Lookbook (Editorial 9:16)
            </h2>
            <p className="text-xs text-[#6C6258]">
              Kết hợp bảng phối Moodboard 2D, Bảng màu Di sản và Điểm số AI Cultural Stylist
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6C6258] hover:bg-black/5 hover:text-[#2C241E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Card Preview Column (Col 7) */}
          <div className="md:col-span-7 flex justify-center bg-[#F7F1E7]/50 p-4 rounded-xl border border-[#E5DCCE]">
            <div
              ref={cardRef}
              className={`relative bg-[#F7F1E7] text-[#2C241E] overflow-hidden rounded-xl border-2 border-[#D5B477]/50 shadow-xl transition-all duration-300 flex flex-col justify-between ${
                aspectMode === '9-16' ? 'w-[360px] h-[640px]' : 'w-[380px] h-[480px]'
              }`}
              style={{
                backgroundImage: 'radial-gradient(#E5DCCE 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            >
              {/* Gold Filigree Corner Borders */}
              <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#D5B477]" />
              <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#D5B477]" />
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#D5B477]" />
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#D5B477]" />

              {/* Magazine Top Masthead */}
              <div className="px-6 pt-4 text-center">
                <div className="text-[9px] tracking-[0.3em] uppercase text-[#8F2635] font-semibold">
                  SẮC LƯU NIÊN · LOOKBOOK ISSUE N° 01
                </div>
                <h3 className="text-base font-serif font-bold text-[#2C241E] tracking-tight mt-0.5">
                  {garment.name}
                </h3>
                <div className="text-[10px] text-[#6C6258] italic font-serif">
                  {scene.name} · {scene.tagline}
                </div>
              </div>

              {/* Center Visual: Render Moodboard Composition or Silhouette */}
              <div className="relative flex-1 flex items-center justify-center px-4 my-1 overflow-hidden">
                <div className="absolute inset-0 bg-radial from-white/70 via-transparent to-transparent pointer-events-none" />
                
                {outfit.moodboardItems && outfit.moodboardItems.length > 0 ? (
                  /* Render Moodboard snapshot layout scaled to card */
                  <div className="relative w-full h-[280px] scale-[0.68] origin-center">
                    {outfit.moodboardItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          position: 'absolute',
                          left: `${item.x * 0.7}px`,
                          top: `${item.y * 0.7}px`,
                          width: `${item.width * 0.7}px`,
                          height: `${item.height * 0.7}px`,
                          transform: `rotate(${item.rotation}deg)`,
                          zIndex: item.zIndex,
                        }}
                      >
                        <MoodboardAssetRenderer item={item} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <GarmentSvgSilhouette
                    silhouette={outfit.silhouette}
                    gender={outfit.gender}
                    hairstyle={outfit.hairstyle}
                    hairColor={outfit.hairColor}
                    colors={outfit.colors}
                    pattern={outfit.pattern}
                    accessories={outfit.accessories}
                    className="w-full h-full max-h-[290px] drop-shadow-lg"
                  />
                )}

                {/* Cultural Safety Stamp / Seal */}
                <div className="absolute bottom-2 right-4 w-15 h-15 rounded-full border-2 border-[#8F2635] flex flex-col items-center justify-center bg-white/95 shadow-md transform rotate-12">
                  <span className="text-[7px] uppercase tracking-tighter text-[#8F2635] font-bold">AN TOÀN CỔ CƠ</span>
                  <span className="text-sm font-serif font-black text-[#8F2635] leading-none">{evalScore}</span>
                  <span className="text-[6.5px] text-[#286B61] font-bold">CHUẨN MỰC</span>
                </div>
              </div>

              {/* Color Palette Chips */}
              <div className="px-6 py-1.5">
                <div className="flex items-center justify-center gap-2.5">
                  {usedColors.map((col, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full border border-black/20 shadow-2xs"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-[8.5px] text-[#6C6258] font-sans font-medium">{col.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Evaluation Quote & Academic Citation */}
              <div className="px-6 py-1.5 text-center space-y-1">
                <p className="text-[10px] text-[#2C241E] italic font-serif line-clamp-2 leading-relaxed">
                  "{outfit.aiEvaluation?.evaluation || 'Bản phối gìn giữ trọn vẹn kết cấu nẹp cổ 5 khuy ngũ thường, giao thoa hơi thở đương đại trẻ trung.'}"
                </p>
                <div className="text-[8px] text-[#8F2635] font-sans font-medium tracking-wide">
                  ĐỐI CHIẾU: "TRANG PHỤC VIỆT NAM" (ĐOÀN THỊ TÌNH) & "NGÀN NĂM ÁO MŨ" (TRẦN QUANG ĐỨC)
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-6 pb-3 pt-1 border-t border-[#E5DCCE] flex items-center justify-between text-[8.5px] text-[#6C6258]">
                <span className="font-serif uppercase tracking-wider text-[#8F2635] font-semibold">
                  MẶC DI SẢN · CHẤT RIÊNG MÌNH
                </span>
                <span>SACLUUNIEN.VN</span>
              </div>
            </div>
          </div>

          {/* Export Action Controls (Col 5) */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2C241E] mb-2">
                1. Tỷ Lệ Xuất Bản
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAspectMode('9-16')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                    aspectMode === '9-16'
                      ? 'border-[#8F2635] bg-[#8F2635]/10 text-[#8F2635] font-semibold'
                      : 'border-[#E5DCCE] hover:bg-[#F7F1E7]'
                  }`}
                >
                  Instagram Story (9:16)
                </button>
                <button
                  onClick={() => setAspectMode('4-5')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                    aspectMode === '4-5'
                      ? 'border-[#8F2635] bg-[#8F2635]/10 text-[#8F2635] font-semibold'
                      : 'border-[#E5DCCE] hover:bg-[#F7F1E7]'
                  }`}
                >
                  Feed Post (4:5)
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2C241E] mb-2">
                2. Tải Tệp Hình Ảnh
              </h4>
              <div className="space-y-2.5">
                <button
                  onClick={() => handleDownload('png')}
                  disabled={isExporting}
                  className="w-full py-3 px-4 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] transition-all text-xs font-medium flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Đang kết xuất...' : 'Tải Thẻ Lookbook PNG (Độ nét cao)'}</span>
                </button>

                <button
                  onClick={() => handleDownload('jpeg')}
                  disabled={isExporting}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#E5DCCE] hover:bg-[#F7F1E7] text-[#2C241E] transition-all text-xs font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải ảnh JPEG (Dung lượng nhẹ)</span>
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2C241E] mb-2">
                3. Chia Sẻ & Liên Kết
              </h4>
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-xl border border-[#286B61] text-[#286B61] hover:bg-[#286B61]/5 transition-all text-xs font-medium flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép liên kết!' : 'Sao chép link chia sẻ'}</span>
              </button>
            </div>

            {/* Social Share Callout */}
            <div className="p-4 rounded-xl bg-[#F7F1E7] border border-[#E5DCCE] text-xs text-[#6C6258] space-y-1">
              <div className="font-semibold text-[#8F2635] font-serif">Khoe Chất Riêng:</div>
              <p>
                Tag <strong>#SacLuuNien #MacDiSanChatRiengMinh</strong> để được vinh danh trên trang chủ Lookbook cộng đồng tuần này!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
