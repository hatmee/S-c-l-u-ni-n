import React, { useState } from 'react';
import { CULTURAL_ARTICLES, GARMENTS_DATA } from '../data/garments';
import { CulturalArticle } from '../types';
import { useAppStore } from '../store/useAppStore';
import { 
  Scroll, 
  BookOpen, 
  Quote, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  X, 
  Search,
  BookMarked
} from 'lucide-react';

export const CulturalCorner: React.FC = () => {
  const { setGarment, setStep, setView } = useAppStore();
  const [selectedArticle, setSelectedArticle] = useState<CulturalArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const categories = ['all', 'Triết lý Y phục', 'Điển chế Cung đình', 'Phụ kiện & Nón mũ'];

  const filteredArticles = CULTURAL_ARTICLES.filter((art) => {
    if (activeCategory !== 'all' && art.category !== activeCategory) return false;
    if (searchKeyword.trim() && !art.title.toLowerCase().includes(searchKeyword.toLowerCase()) && !art.summary.toLowerCase().includes(searchKeyword.toLowerCase())) {
      return false;
    }
    return true;
  });

  const glossaryItems = [
    { term: 'Lập lĩnh (立領)', desc: 'Cổ áo đứng cao 3-4cm, ôm khít quanh chân cổ, thể hiện tính đoan chính, khiêm cung của người mặc.' },
    { term: 'Giao lĩnh (交領)', desc: 'Cổ áo giao nhau trước ngực, vạt trái đè lên vạt phải tạo hình chữ Y; kiểu áo cổ xưa nhất phương Đông.' },
    { term: 'Viên lĩnh (圓領)', desc: 'Áo cổ tròn ôm sát chân cổ gài cúc bên vai phải, dùng làm quan phục và long bào triều đình.' },
    { term: 'Đối khâm (對襟)', desc: 'Hai vạt áo trước chạy thẳng song song đối xứng nhau, thường mặc khoác ngoài buông thõng tiện phục.' },
    { term: 'Đường trung phùng', desc: 'Đường may sống lưng chính giữa thân áo ghép hai khổ vải, tượng trưng cho đạo trung dung, ngay thẳng.' },
    { term: 'Vạt cả & Vạt con', desc: 'Vạt cả là 4 thân ngoài tượng trưng tứ thân phụ mẫu; vạt con là thân thứ 5 bên trong tượng trưng người mặc.' },
    { term: 'Bổ tử (補子)', desc: 'Tấm vải thêu hình vuông đính trước ngực và sau lưng áo quan lại: ban văn vẽ chim, ban võ vẽ thú để định phẩm cấp.' },
    { term: 'Khăn lươn & Khăn đóng', desc: 'Khăn vấn nhiều nếp có độn tóc của phụ nữ và khăn đóng tạo hình chữ nhân trước trán của nam giới.' },
  ];

  const handleTryRelatedGarment = (garmentId: string) => {
    setGarment(garmentId);
    setStep(1);
    setView('moodboard');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-16">
      
      {/* Header */}
      <div className="border-b border-[#E5DCCE] pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8F2635] font-semibold">
          Chuyên Đề Khảo Cứu Di Sản · Cultural Corner
        </span>
        <h1 className="text-3xl md:text-5xl font-serif text-[#2C241E] tracking-tight">
          Góc Văn Hóa: Thấu Triệt Cổ Y
        </h1>
        <p className="text-sm text-[#6C6258] font-light max-w-3xl leading-relaxed">
          Nơi lưu giữ các bài khảo cứu chuyên sâu về triết lý ngũ thân ngũ thường, điển chế Cổn Miện 12 chương, bí ẩn dải viền ngũ hành và nét sinh hoạt trang điểm ngàn năm của người Việt.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E5DCCE] shadow-2xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#8F2635] text-white shadow-2xs'
                  : 'text-[#6C6258] hover:text-[#2C241E] hover:bg-[#F7F1E7]'
              }`}
            >
              {cat === 'all' ? 'Tất cả chuyên đề' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-[#6C6258] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết, điển cố..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E5DCCE] bg-white text-[#2C241E] focus:outline-none focus:ring-1 focus:ring-[#8F2635]"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-3xl border border-[#E5DCCE] p-8 shadow-editorial hover:shadow-elevated transition-all flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F2635] font-semibold uppercase tracking-wider bg-[#8F2635]/10 px-2.5 py-1 rounded">
                  {article.category}
                </span>
                <span className="text-[#6C6258] flex items-center gap-1 font-light">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readingMinutes} phút đọc
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-[#2C241E] group-hover:text-[#8F2635] transition-colors leading-snug">
                  {article.title}
                </h3>
                <div className="text-xs text-[#8F2635] font-serif italic mt-1">
                  {article.subtitle}
                </div>
              </div>

              <p className="text-xs text-[#6C6258] leading-relaxed font-light">
                {article.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5DCCE] flex items-center justify-between">
              <span className="text-[11px] text-[#286B61] font-medium truncate max-w-[200px]">
                {article.authorOrSource}
              </span>

              <button
                onClick={() => setSelectedArticle(article)}
                className="px-4 py-2 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <span>Đọc bài viết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. GLOSSARY OF CULTURAL TERMS (Từ Điển Thuật Ngữ Cổ Y) */}
      <section className="bg-white rounded-3xl border border-[#E5DCCE] p-8 shadow-editorial space-y-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8F2635] font-semibold">
            BẢN TRA CỨU NHANH
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#2C241E] mt-1 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-[#8F2635]" />
            Thuật Ngữ Cổ Y Thường Gặp
          </h2>
          <p className="text-xs text-[#6C6258] font-light mt-1">
            Các định nghĩa chuẩn mực giúp bạn dễ dàng đối chiếu khi thảo luận và tìm hiểu về cổ phục Việt.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {glossaryItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-[#E5DCCE] bg-[#F7F1E7]/40 space-y-1.5">
              <h4 className="text-xs font-serif font-bold text-[#8F2635]">{item.term}</h4>
              <p className="text-[11.5px] text-[#6C6258] leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E5DCCE] overflow-hidden my-6 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E5DCCE] bg-[#F7F1E7] flex items-start justify-between flex-shrink-0">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#8F2635] font-semibold">
                  {selectedArticle.category} · {selectedArticle.readingMinutes} phút đọc
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2C241E]">
                  {selectedArticle.title}
                </h2>
                <div className="text-xs text-[#6C6258] italic">
                  Nguồn nghiên cứu: {selectedArticle.authorOrSource}
                </div>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6C6258] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content (Scrollable) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-[#2C241E]">
              {selectedArticle.content.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-base font-serif font-bold text-[#8F2635]">
                    {sec.heading}
                  </h4>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-xs sm:text-sm text-[#2C241E] leading-relaxed font-light">
                      {p}
                    </p>
                  ))}
                  {sec.quote && (
                    <div className="p-4 rounded-2xl bg-[#F7F1E7] border-l-4 border-[#8F2635] text-xs sm:text-sm italic font-serif text-[#2C241E] my-3">
                      "{sec.quote}"
                    </div>
                  )}
                </div>
              ))}

              {/* Related Garments to Try */}
              {selectedArticle.relatedGarmentIds.length > 0 && (
                <div className="pt-6 border-t border-[#E5DCCE] space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#2C241E] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#8F2635]" />
                    <span>Trang Phục Liên Quan Đến Bài Viết Này</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.relatedGarmentIds.map((gId) => {
                      const g = GARMENTS_DATA.find((item) => item.id === gId);
                      if (!g) return null;
                      return (
                        <button
                          key={gId}
                          onClick={() => {
                            handleTryRelatedGarment(gId);
                            setSelectedArticle(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] text-xs font-medium flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>Thử phối {g.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E5DCCE] bg-[#F7F1E7] flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl border border-[#E5DCCE] text-xs text-[#2C241E] hover:bg-white"
              >
                Đóng bài viết
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
