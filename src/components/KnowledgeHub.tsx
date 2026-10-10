import React, { useState } from 'react';
import { GARMENTS_DATA } from '../data/garments';
import { GarmentDefinition, GarmentTag } from '../types';
import { GarmentSvgSilhouette } from './GarmentSvgSilhouette';
import { useAppStore } from '../store/useAppStore';
import { BookOpen, ExternalLink, Sparkles, Filter, ChevronRight, Bookmark, Quote } from 'lucide-react';

export const KnowledgeHub: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeGarmentModal, setActiveGarmentModal] = useState<GarmentDefinition | null>(null);
  const { setGarment, setView, setStep } = useAppStore();

  const filteredGarments = selectedTag === 'all'
    ? GARMENTS_DATA
    : GARMENTS_DATA.filter((g) => g.tag === selectedTag);

  const handleTryGarment = (garmentId: string) => {
    setGarment(garmentId);
    setStep(1);
    setView('canvas');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="border-b border-[#E5DCCE] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8F2635] font-semibold">
            Tài Liệu Khảo Cứu Gốc · Cultural Knowledge Hub
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#2C241E] mt-1 tracking-tight">
            Thư Viện Di Sản & Cổ Y Điển Lệ
          </h1>
          <p className="text-sm text-[#6C6258] mt-2 max-w-3xl font-light leading-relaxed">
            Hệ thống dữ liệu học thuật quy chuẩn đối chiếu nghiêm ngặt từ <em>"Trang Phục Việt Nam (Dân tộc Việt)"</em> của TS. Đoàn Thị Tình (NXB Mỹ Thuật, 2006), <em>"Ngàn Năm Áo Mũ"</em> của Trần Quang Đức và <em>"Dệt Nên Triều Đại"</em> của Vietnam Centre.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E5DCCE] shadow-sm">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'Nguyên bản', label: 'Nguyên bản' },
            { id: 'Phục dựng', label: 'Phục dựng' },
            { id: 'Cách tân', label: 'Cách tân' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTag(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTag === tab.id
                  ? 'bg-[#8F2635] text-white shadow-2xs'
                  : 'text-[#6C6258] hover:text-[#2C241E] hover:bg-[#F7F1E7]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Garments Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGarments.map((garment) => {
          return (
            <div
              key={garment.id}
              className="bg-white rounded-2xl border border-[#E5DCCE] overflow-hidden shadow-editorial hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Card Illustration Area */}
              <div className="relative h-64 bg-gradient-to-b from-[#F7F1E7] to-white p-4 flex items-center justify-center border-b border-[#E5DCCE]">
                {/* Tag Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`text-[11px] font-medium px-2.5 py-1 rounded border shadow-2xs ${
                      garment.tag === 'Nguyên bản'
                        ? 'bg-[#286B61]/10 text-[#286B61] border-[#286B61]/30'
                        : garment.tag === 'Phục dựng'
                        ? 'bg-[#D5B477]/15 text-[#684A17] border-[#D5B477]/40'
                        : 'bg-[#8F2635]/10 text-[#8F2635] border-[#8F2635]/30'
                    }`}
                  >
                    [{garment.tag}]
                  </span>
                </div>

                <div className="absolute top-3 right-3 text-[11px] text-[#6C6258] italic font-serif">
                  {garment.era}
                </div>

                <GarmentSvgSilhouette
                  silhouette={garment.silhouette}
                  colors={garment.defaultColors}
                  className="w-full h-full max-h-[220px] drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Card Information */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2C241E] group-hover:text-[#8F2635] transition-colors">
                    {garment.name}
                  </h3>
                  <div className="text-xs text-[#8F2635] font-serif italic mt-0.5">
                    {garment.vietnameseTitle}
                  </div>
                  <p className="text-xs text-[#6C6258] mt-2 line-clamp-2 leading-relaxed">
                    {garment.brief}
                  </p>
                </div>

                {/* Anatomy Quick Breakdown */}
                <div className="p-3 bg-[#F7F1E7]/70 rounded-xl border border-[#E5DCCE] space-y-1.5 text-[11px]">
                  <div className="flex items-start gap-1.5">
                    <span className="font-semibold text-[#2C241E] min-w-[70px]">Thân áo:</span>
                    <span className="text-[#6C6258] line-clamp-1">{garment.anatomy.flaps}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-semibold text-[#2C241E] min-w-[70px]">Cổ & 5 Khuy:</span>
                    <span className="text-[#6C6258] line-clamp-1">{garment.anatomy.buttons}</span>
                  </div>
                </div>

                {/* Academic Citation Snippet */}
                {garment.academicCitation && (
                  <div className="p-3 bg-white rounded-xl border border-[#D5B477]/40 text-[10.5px] text-[#6C6258] space-y-1">
                    <div className="font-serif font-semibold text-[#8F2635] flex items-center gap-1">
                      <Quote className="w-3 h-3 text-[#D5B477]" />
                      <span>{garment.academicCitation.author} — {garment.academicCitation.bookTitle}</span>
                    </div>
                    <p className="italic line-clamp-2">
                      "{garment.academicCitation.keyQuote}"
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-[#E5DCCE] text-xs">
                  <button
                    onClick={() => setActiveGarmentModal(garment)}
                    className="text-[#6C6258] hover:text-[#8F2635] font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>Xem giải phẫu đầy đủ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleTryGarment(garment.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#8F2635] text-white hover:bg-[#701D29] font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Phối đồ ngay</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Modal for Anatomy & Reference Documentation */}
      {activeGarmentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5DCCE] overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E5DCCE] bg-[#F7F1E7] flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#8F2635] font-semibold">
                  Khảo Cứu Điển Lệ Cổ Y · [{activeGarmentModal.tag}]
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#2C241E] mt-1">
                  {activeGarmentModal.name}
                </h2>
                <div className="text-xs text-[#6C6258] mt-0.5">{activeGarmentModal.era}</div>
              </div>

              <button
                onClick={() => setActiveGarmentModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6C6258] hover:bg-black/5"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2C241E] mb-2">
                  Bối Cảnh Lịch Sử & Ý Nghĩa Văn Hóa
                </h4>
                <p className="text-xs text-[#6C6258] leading-relaxed">
                  {activeGarmentModal.historicalContext}
                </p>
              </div>

              {/* Anatomy details */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8F2635] mb-3">
                  Cấu Trúc 4 Yếu Tố Cốt Lõi (Giải Phẫu Cổ Y)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-[#E5DCCE] bg-[#F7F1E7]/40">
                    <div className="text-xs font-semibold text-[#2C241E]">1. Kết Cấu Thân Áo (Flaps)</div>
                    <div className="text-xs text-[#6C6258] mt-1">{activeGarmentModal.anatomy.flaps}</div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#E5DCCE] bg-[#F7F1E7]/40">
                    <div className="text-xs font-semibold text-[#2C241E]">2. Cổ Áo (Lập Lĩnh)</div>
                    <div className="text-xs text-[#6C6258] mt-1">{activeGarmentModal.anatomy.collar}</div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#E5DCCE] bg-[#F7F1E7]/40">
                    <div className="text-xs font-semibold text-[#2C241E]">3. Hàng Khuy Cài (Buttons)</div>
                    <div className="text-xs text-[#6C6258] mt-1">{activeGarmentModal.anatomy.buttons}</div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#E5DCCE] bg-[#F7F1E7]/40">
                    <div className="text-xs font-semibold text-[#2C241E]">4. Dáng Tay Áo (Sleeves)</div>
                    <div className="text-xs text-[#6C6258] mt-1">{activeGarmentModal.anatomy.sleeves}</div>
                  </div>
                </div>
              </div>

              {/* Academic Book Citation */}
              {activeGarmentModal.academicCitation && (
                <div className="p-4 rounded-xl bg-[#F7F1E7] border border-[#D5B477]/50 text-xs space-y-2">
                  <div className="font-serif font-bold text-[#8F2635] flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#8F2635]" />
                    <span>Trích dẫn học thuật đối chiếu:</span>
                  </div>
                  <div className="text-xs text-[#2C241E] font-medium">
                    {activeGarmentModal.academicCitation.bookTitle} — Tác giả: {activeGarmentModal.academicCitation.author} ({activeGarmentModal.academicCitation.publisherAndYear})
                  </div>
                  <p className="text-xs text-[#6C6258] italic leading-relaxed">
                    "{activeGarmentModal.academicCitation.keyQuote}"
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E5DCCE] bg-white flex justify-end gap-2">
              <button
                onClick={() => setActiveGarmentModal(null)}
                className="px-4 py-2 rounded-lg border border-[#E5DCCE] text-xs text-[#2C241E] hover:bg-[#F7F1E7]"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleTryGarment(activeGarmentModal.id);
                  setActiveGarmentModal(null);
                }}
                className="px-5 py-2 rounded-lg bg-[#8F2635] text-white hover:bg-[#701D29] text-xs font-medium flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Đưa vào phòng phối đồ</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
