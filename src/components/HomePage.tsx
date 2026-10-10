import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { GARMENTS_DATA, HISTORICAL_TIMELINE_ERAS, CULTURAL_ARTICLES } from '../data/garments';
import { GarmentSvgSilhouette } from './GarmentSvgSilhouette';
import { 
  Sparkles, 
  Sliders, 
  Layers, 
  BookOpen, 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  Scroll, 
  Palette,
  ExternalLink
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setView, setGarment, setStep } = useAppStore();

  const handleQuickTry = (garmentId: string) => {
    setGarment(garmentId);
    setStep(1);
    setView('moodboard');
  };

  const featuredGarments = [
    GARMENTS_DATA.find((g) => g.id === 'ao-ngu-than-tay-chen')!,
    GARMENTS_DATA.find((g) => g.id === 'ao-tac-tay-thung')!,
    GARMENTS_DATA.find((g) => g.id === 'ao-nhat-binh')!,
    GARMENTS_DATA.find((g) => g.id === 'ao-con-mien')!,
    GARMENTS_DATA.find((g) => g.id === 'ao-dich-y')!,
    GARMENTS_DATA.find((g) => g.id === 'ao-tu-than')!,
  ].filter(Boolean);

  return (
    <div className="w-full">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F1E7] via-white to-[#F7F1E7] border-b border-[#E5DCCE] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text (Col 7) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-[#8F2635]/10 border border-[#8F2635]/20 px-3.5 py-1.5 rounded-full text-xs text-[#8F2635] font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NỀN TẢNG THỜI TRANG CỔ PHỤC GEN Z</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#2C241E] tracking-tight leading-[1.15]">
                Mặc Di Sản, <br />
                <span className="text-[#8F2635] italic">Chất Riêng Mình.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#6C6258] font-light max-w-xl leading-relaxed">
                Khám phá và sáng tạo phong cách cổ phục Việt Nam từ triều Lý, Trần, Lê đến thời Nguyễn. Kết hợp bảng vẽ 2D Digital Moodboard, vector SVG động chuẩn xác và trí tuệ nhân tạo Gemini AI thẩm định văn hóa.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setView('moodboard')}
                  className="px-6 py-3.5 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] transition-all text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-md hover:shadow-lg"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Vào Phòng Thử Đồ 2D</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setView('explore')}
                  className="px-5 py-3.5 rounded-xl border border-[#286B61] text-[#286B61] hover:bg-[#286B61]/5 transition-all text-xs sm:text-sm font-medium flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Khám Phá Dòng Lịch Sử</span>
                </button>

                <button
                  onClick={() => setView('culture')}
                  className="px-5 py-3.5 rounded-xl border border-[#D5B477] text-[#684A17] hover:bg-[#D5B477]/10 transition-all text-xs sm:text-sm font-medium flex items-center gap-2"
                >
                  <Scroll className="w-4 h-4" />
                  <span>Góc Văn Hóa</span>
                </button>
              </div>

              {/* Academic Trust Strip */}
              <div className="pt-6 border-t border-[#E5DCCE] flex items-center gap-4 text-xs text-[#6C6258]">
                <ShieldCheck className="w-5 h-5 text-[#286B61] flex-shrink-0" />
                <span>
                  Quy chuẩn khảo cứu nghiêm ngặt từ <em>"Trang Phục Việt Nam"</em> (TS. Đoàn Thị Tình) & <em>"Ngàn Năm Áo Mũ"</em> (Trần Quang Đức).
                </span>
              </div>
            </div>

            {/* Right Hero Visual (Col 5) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl bg-white border-2 border-[#D5B477]/50 p-6 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-radial from-amber-50/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Visual Label */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-serif font-bold text-[#8F2635]">TIÊU ĐIỂM HOÀNG QUÝ</span>
                  <span className="text-[10px] text-[#286B61] bg-[#286B61]/10 px-2 py-0.5 rounded font-mono">
                    Chuẩn image_a3daa7
                  </span>
                </div>

                <div className="h-[360px] flex items-center justify-center">
                  <GarmentSvgSilhouette
                    silhouette="ao-ngu-than-tay-chen"
                    colors={{
                      mainBody: '#1D3557',
                      collarAndButtons: '#D5B477',
                      sleeves: '#1D3557',
                      innerLining: '#F7F1E7',
                      trousers: '#F7F1E7',
                      headwear: '#212025',
                    }}
                    className="w-full h-full max-h-[350px] drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="pt-4 border-t border-[#E5DCCE] text-center space-y-1">
                  <h3 className="font-serif font-bold text-base text-[#2C241E]">
                    Áo Ngũ Thân Lập Lĩnh Nam
                  </h3>
                  <p className="text-xs text-[#6C6258] italic font-light">
                    Thân áo lam sẫm, nẹp cổ đứng sáng màu & 5 khuy cài Ngũ Thường
                  </p>
                  <button
                    onClick={() => handleQuickTry('ao-ngu-than-tay-chen')}
                    className="mt-2 w-full py-2 rounded-lg bg-[#8F2635] text-white text-xs font-medium hover:bg-[#701D29] transition-colors"
                  >
                    Thử phối màu món đồ này →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Historical Eras Overview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8F2635] font-semibold">
            DÒNG CHẢY Y PHỤC VIỆT
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#2C241E]">
            Ba Giai Đoạn Lịch Sử Trọng Yếu
          </h2>
          <p className="text-xs sm:text-sm text-[#6C6258] font-light">
            Mỗi triều đại mang một triết lý thẩm mỹ và quy thức trang phục độc đáo phản ánh khí phách thời đại.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HISTORICAL_TIMELINE_ERAS.map((era, idx) => (
            <div
              key={era.id}
              onClick={() => setView('explore')}
              className="bg-white rounded-2xl border border-[#E5DCCE] p-6 shadow-editorial hover:shadow-elevated transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#8F2635]/10 text-[#8F2635] font-serif font-bold flex items-center justify-center text-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-serif font-bold text-[#2C241E] group-hover:text-[#8F2635] transition-colors">
                  {era.name}
                </h3>
                <div className="text-xs text-[#8F2635] font-medium font-serif">{era.period}</div>
                <p className="text-xs text-[#6C6258] leading-relaxed font-light">
                  {era.overview}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5DCCE] flex items-center justify-between text-xs font-medium text-[#8F2635]">
                <span>Khám phá mốc lịch sử</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Costumes Showcase */}
      <section className="py-16 bg-white border-y border-[#E5DCCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#8F2635] font-semibold">
                BỘ SƯU TẬP TIÊU BIỂU
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#2C241E] mt-1">
                Các Dáng Áo Cổ Phục Nổi Bật
              </h2>
            </div>

            <button
              onClick={() => setView('knowledge')}
              className="text-xs font-semibold text-[#8F2635] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Xem toàn bộ thư viện ({GARMENTS_DATA.length} dáng áo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGarments.map((garment) => (
              <div
                key={garment.id}
                className="rounded-2xl border border-[#E5DCCE] bg-[#F7F1E7]/40 overflow-hidden hover:shadow-elevated transition-all flex flex-col justify-between group"
              >
                <div className="p-6 h-64 flex items-center justify-center bg-white border-b border-[#E5DCCE] relative">
                  <span className="absolute top-3 left-3 text-[10px] font-medium px-2 py-0.5 rounded bg-[#8F2635]/10 text-[#8F2635] border border-[#8F2635]/20">
                    [{garment.tag}]
                  </span>
                  <GarmentSvgSilhouette
                    silhouette={garment.silhouette}
                    colors={garment.defaultColors}
                    className="w-full h-full max-h-[220px] drop-shadow-md group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-[#2C241E] group-hover:text-[#8F2635] transition-colors">
                      {garment.name}
                    </h4>
                    <div className="text-xs text-[#8F2635] font-serif italic">{garment.era}</div>
                    <p className="text-xs text-[#6C6258] mt-1.5 line-clamp-2 font-light">
                      {garment.brief}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleQuickTry(garment.id)}
                      className="flex-1 py-2 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] text-xs font-medium transition-colors"
                    >
                      Thử phối 2D
                    </button>
                    <button
                      onClick={() => {
                        setGarment(garment.id);
                        setStep(1);
                        setView('canvas');
                      }}
                      className="py-2 px-3 rounded-xl border border-[#E5DCCE] bg-white hover:bg-[#F7F1E7] text-xs font-medium text-[#2C241E]"
                    >
                      Đổi màu SVG
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Highlights Teaser */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8F2635] font-semibold">
              GÓC VĂN HÓA & KHẢO CỨU
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#2C241E] mt-1">
              Hiểu Sâu Để Mặc Đúng
            </h2>
          </div>

          <button
            onClick={() => setView('culture')}
            className="text-xs font-semibold text-[#8F2635] hover:underline flex items-center gap-1"
          >
            <span>Đọc tất cả bài viết</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CULTURAL_ARTICLES.slice(0, 2).map((art) => (
            <div
              key={art.id}
              onClick={() => setView('culture')}
              className="p-6 rounded-2xl bg-white border border-[#E5DCCE] shadow-editorial hover:shadow-elevated transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F2635] font-semibold uppercase tracking-wider">{art.category}</span>
                <span className="text-[#6C6258]">{art.readingMinutes} phút đọc</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#2C241E] group-hover:text-[#8F2635] transition-colors">
                {art.title}
              </h3>
              <p className="text-xs text-[#6C6258] leading-relaxed font-light">
                {art.summary}
              </p>
              <div className="text-[11px] text-[#286B61] font-medium pt-1">
                Nguồn: {art.authorOrSource} →
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
