import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { GARMENTS_DATA, HISTORICAL_TIMELINE_ERAS } from '../data/garments';
import { GarmentSvgSilhouette } from './GarmentSvgSilhouette';
import { 
  Compass, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Filter, 
  Bookmark,
  ChevronRight
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { setGarment, setStep, setView } = useAppStore();

  const [selectedEraTab, setSelectedEraTab] = useState<string>('era-nguyen');
  const [filterGender, setFilterGender] = useState<'all' | 'nam' | 'nu'>('all');
  const [filterOccasion, setFilterOccasion] = useState<string>('all');

  // Interactive Quiz State
  const [quizGender, setQuizGender] = useState<'nam' | 'nu'>('nu');
  const [quizOccasion, setQuizOccasion] = useState<string>('cuoi');
  const [quizVibe, setQuizVibe] = useState<'trangnha' | 'phongkhoang' | 'hoangquy'>('hoangquy');
  const [quizResultId, setQuizResultId] = useState<string | null>(null);

  const activeEra = HISTORICAL_TIMELINE_ERAS.find((e) => e.id === selectedEraTab) || HISTORICAL_TIMELINE_ERAS[0];

  const filteredGarments = GARMENTS_DATA.filter((g) => {
    if (filterGender !== 'all' && g.gender !== 'unisex' && g.gender !== filterGender) return false;
    if (filterOccasion !== 'all' && !g.occasions.some((o) => o.toLowerCase().includes(filterOccasion.toLowerCase()))) return false;
    return true;
  });

  const handleRunQuiz = () => {
    if (quizOccasion === 'cuoi') {
      setQuizResultId(quizGender === 'nam' ? 'ao-mang-lan' : 'ao-nhat-binh');
    } else if (quizVibe === 'hoangquy') {
      setQuizResultId(quizGender === 'nam' ? 'ao-con-mien' : 'ao-dich-y');
    } else if (quizVibe === 'phongkhoang') {
      setQuizResultId(quizGender === 'nam' ? 'ao-ngu-than-tay-chen' : 'ao-tu-than');
    } else {
      setQuizResultId('ao-tac-tay-thung');
    }
  };

  const handleSelectGarment = (id: string) => {
    setGarment(id);
    setStep(1);
    setView('moodboard');
  };

  const quizResultGarment = GARMENTS_DATA.find((g) => g.id === quizResultId);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-16">
      
      {/* Header */}
      <div className="border-b border-[#E5DCCE] pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8F2635] font-semibold">
          Hành Trình Khảo Cứu Điển Lệ · Explore Heritage
        </span>
        <h1 className="text-3xl md:text-5xl font-serif text-[#2C241E] tracking-tight">
          Khám Phá Dòng Lịch Sử Cổ Phục
        </h1>
        <p className="text-sm text-[#6C6258] font-light max-w-3xl leading-relaxed">
          Ngược dòng thời gian qua ba thời kỳ chuyển giao trang phục trọng đại của dân tộc: Tinh thần độc lập Lý - Trần, Nho điển triều Lê, và sự ra đời của quốc phục Áo Ngũ Thân thời Nguyễn.
        </p>
      </div>

      {/* 1. INTERACTIVE HISTORICAL TIMELINE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-[#2C241E] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8F2635]" />
            Dòng Thời Gian 3 Giai Đoạn Trọng Đại
          </h2>
        </div>

        {/* Era Navigation Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HISTORICAL_TIMELINE_ERAS.map((era) => {
            const isActive = era.id === selectedEraTab;
            return (
              <button
                key={era.id}
                onClick={() => setSelectedEraTab(era.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isActive
                    ? 'border-[#8F2635] bg-[#8F2635] text-white shadow-md'
                    : 'border-[#E5DCCE] bg-white text-[#2C241E] hover:bg-[#F7F1E7]'
                }`}
              >
                <div className={`text-xs uppercase tracking-wider font-semibold ${isActive ? 'text-[#F7E7A9]' : 'text-[#8F2635]'}`}>
                  {era.period}
                </div>
                <div className="font-serif font-bold text-lg mt-0.5">{era.name}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Era Detail Card */}
        <div className="bg-white rounded-3xl border border-[#E5DCCE] p-8 shadow-editorial space-y-8">
          <div className="space-y-3">
            <div className="inline-block text-xs font-semibold uppercase tracking-wider text-[#8F2635] bg-[#8F2635]/10 px-3 py-1 rounded-md">
              BƯỚC NGOẶT LỊCH SỬ
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#2C241E]">{activeEra.name}</h3>
            <p className="text-sm text-[#6C6258] leading-relaxed font-light">{activeEra.overview}</p>
            <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#E5DCCE] text-xs text-[#8F2635] italic">
              <strong>Điểm mấu chốt:</strong> {activeEra.inflectionPoint}
            </div>
          </div>

          {/* Key Features Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-[#E5DCCE] bg-[#F7F1E7]/40 space-y-1">
              <span className="text-xs font-semibold text-[#2C241E]">1. Y Phục Nam Giới</span>
              <p className="text-xs text-[#6C6258] font-light leading-relaxed">{activeEra.keyFeatures.male}</p>
            </div>
            <div className="p-4 rounded-xl border border-[#E5DCCE] bg-[#F7F1E7]/40 space-y-1">
              <span className="text-xs font-semibold text-[#2C241E]">2. Y Phục Nữ Giới</span>
              <p className="text-xs text-[#6C6258] font-light leading-relaxed">{activeEra.keyFeatures.female}</p>
            </div>
            <div className="p-4 rounded-xl border border-[#E5DCCE] bg-[#F7F1E7]/40 space-y-1">
              <span className="text-xs font-semibold text-[#2C241E]">3. Đầu Tóc & Đồ Đội</span>
              <p className="text-xs text-[#6C6258] font-light leading-relaxed">{activeEra.keyFeatures.hairAndHats}</p>
            </div>
            <div className="p-4 rounded-xl border border-[#E5DCCE] bg-[#F7F1E7]/40 space-y-1">
              <span className="text-xs font-semibold text-[#2C241E]">4. Điển Lễ Cung Đình</span>
              <p className="text-xs text-[#6C6258] font-light leading-relaxed">{activeEra.keyFeatures.court}</p>
            </div>
          </div>

          {/* Era Costumes Shortcuts */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2C241E] block mb-3">
              Trang Phục Tiêu Biểu Thời Kỳ Này
            </span>
            <div className="flex flex-wrap gap-2">
              {activeEra.representativeGarments.map((gId) => {
                const garment = GARMENTS_DATA.find((item) => item.id === gId);
                if (!garment) return null;
                return (
                  <button
                    key={gId}
                    onClick={() => handleSelectGarment(gId)}
                    className="px-4 py-2 rounded-xl border border-[#8F2635] bg-[#8F2635]/5 hover:bg-[#8F2635] text-[#8F2635] hover:text-white transition-all text-xs font-medium flex items-center gap-1.5 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{garment.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE STYLE QUIZ: "BẠN PHÙ HỢP VỚI CỔ Y NÀO?" */}
      <section className="bg-gradient-to-br from-[#F7F1E7] to-white rounded-3xl border-2 border-[#D5B477]/40 p-8 shadow-editorial space-y-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8F2635] uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Trắc Nghiệm Phong Cách Gen Z</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241E]">
            Bạn Hợp Với Dáng Cổ Y Nào?
          </h2>
          <p className="text-xs sm:text-sm text-[#6C6258] mt-1 font-light">
            Chỉ với 3 lựa chọn ngắn, AI sẽ đề xuất kiểu trang phục truyền thống tôn lên thần thái và cá tính của bạn nhất.
          </p>
        </div>

        {/* Quiz Questions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Question 1: Giới tính */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#2C241E]">
              1. Bạn chọn dáng áo cho ai?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setQuizGender('nu')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  quizGender === 'nu'
                    ? 'border-[#8F2635] bg-[#8F2635] text-white shadow-2xs'
                    : 'border-[#E5DCCE] bg-white text-[#2C241E]'
                }`}
              >
                Nữ Giới
              </button>
              <button
                onClick={() => setQuizGender('nam')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  quizGender === 'nam'
                    ? 'border-[#8F2635] bg-[#8F2635] text-white shadow-2xs'
                    : 'border-[#E5DCCE] bg-white text-[#2C241E]'
                }`}
              >
                Nam Giới
              </button>
            </div>
          </div>

          {/* Question 2: Dịp sử dụng */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#2C241E]">
              2. Dịp mặc mong muốn?
            </label>
            <select
              value={quizOccasion}
              onChange={(e) => setQuizOccasion(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#E5DCCE] bg-white text-[#2C241E] focus:outline-none focus:ring-1 focus:ring-[#8F2635]"
            >
              <option value="cuoi">Hôn lễ / Chụp ảnh cưới cổ truyền</option>
              <option value="daopho">Dạo phố cuối tuần & Cà phê</option>
              <option value="tet">Lễ tết / Chúc xuân gia đình</option>
              <option value="nghile">Đại lễ trang trọng / Đình miếu</option>
            </select>
          </div>

          {/* Question 3: Thần thái / Vibe */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#2C241E]">
              3. Thần thái bạn hướng tới?
            </label>
            <select
              value={quizVibe}
              onChange={(e) => setQuizVibe(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#E5DCCE] bg-white text-[#2C241E] focus:outline-none focus:ring-1 focus:ring-[#8F2635]"
            >
              <option value="hoangquy">Vương giả & Uy nghi cung đình</option>
              <option value="trangnha">Thanh nhã, đoan trang, nho nhã</option>
              <option value="phongkhoang">Phóng khoáng, tự nhiên, mộc mạc</option>
            </select>
          </div>
        </div>

        {/* Quiz Button */}
        <div>
          <button
            onClick={handleRunQuiz}
            className="px-6 py-2.5 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] text-xs font-medium transition-all flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Khám phá trang phục phù hợp</span>
          </button>
        </div>

        {/* Quiz Result Output */}
        {quizResultGarment && (
          <div className="p-6 rounded-2xl bg-white border border-[#D5B477] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-fadeIn">
            <div className="flex items-center gap-4">
              <div className="w-20 h-24 bg-[#F7F1E7] rounded-xl border border-[#E5DCCE] p-1 flex items-center justify-center flex-shrink-0">
                <GarmentSvgSilhouette
                  silhouette={quizResultGarment.silhouette}
                  colors={quizResultGarment.defaultColors}
                  className="w-full h-full"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#286B61] font-semibold uppercase tracking-wider">
                  GỢI Ý DÀNH RIÊNG CHO BẠN
                </span>
                <h4 className="text-xl font-serif font-bold text-[#2C241E] mt-0.5">
                  {quizResultGarment.name}
                </h4>
                <div className="text-xs text-[#8F2635] font-serif italic">{quizResultGarment.vietnameseTitle}</div>
                <p className="text-xs text-[#6C6258] mt-1 max-w-md font-light line-clamp-2">
                  {quizResultGarment.brief}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSelectGarment(quizResultGarment.id)}
              className="px-6 py-3 rounded-xl bg-[#286B61] text-white hover:bg-[#1E524A] text-xs font-medium flex items-center gap-2 self-start sm:self-auto shadow-sm"
            >
              <span>Vào phòng thử đồ ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 3. COSTUME CATALOG EXPLORER */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#2C241E] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#8F2635]" />
              Danh Mục Toàn Thể ({GARMENTS_DATA.length} Dáng Y Phục)
            </h2>
            <p className="text-xs text-[#6C6258] mt-1">Lọc theo đối tượng và dịp sử dụng cụ thể</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value as any)}
              className="text-xs p-2 rounded-lg border border-[#E5DCCE] bg-white text-[#2C241E]"
            >
              <option value="all">Tất cả giới tính</option>
              <option value="nam">Dành cho Nam</option>
              <option value="nu">Dành cho Nữ</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGarments.map((g) => (
            <div
              key={g.id}
              className="p-5 rounded-2xl bg-white border border-[#E5DCCE] shadow-editorial hover:shadow-elevated transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="h-48 bg-[#F7F1E7]/50 rounded-xl p-3 flex items-center justify-center border border-[#E5DCCE] relative">
                  <span className="absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded bg-white text-[#8F2635] border border-[#E5DCCE]">
                    [{g.tag}]
                  </span>
                  <GarmentSvgSilhouette
                    silhouette={g.silhouette}
                    colors={g.defaultColors}
                    className="w-full h-full max-h-[170px] drop-shadow-sm group-hover:scale-105 transition-transform"
                  />
                </div>

                <div>
                  <h4 className="text-lg font-serif font-bold text-[#2C241E] group-hover:text-[#8F2635] transition-colors">
                    {g.name}
                  </h4>
                  <div className="text-xs text-[#8F2635] font-serif italic">{g.era}</div>
                  <p className="text-xs text-[#6C6258] mt-1 line-clamp-2 font-light">
                    {g.brief}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5DCCE] flex items-center justify-between">
                <span className="text-[11px] text-[#286B61] font-medium">
                  {g.occasions[0] || 'Lễ hội'}
                </span>

                <button
                  onClick={() => handleSelectGarment(g.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#8F2635] text-white hover:bg-[#701D29] text-xs font-medium transition-colors"
                >
                  Phối đồ →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
