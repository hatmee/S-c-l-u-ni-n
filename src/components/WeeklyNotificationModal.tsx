import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { WEEKLY_STYLING_TIPS } from '../data/garments';
import { requestPushNotificationPermission, sendLocalNotification } from '../services/notificationService';
import { Bell, Sparkles, X, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface WeeklyNotificationModalProps {
  onClose: () => void;
}

export const WeeklyNotificationModal: React.FC<WeeklyNotificationModalProps> = ({ onClose }) => {
  const { setLayerColor, setGarment, setView, setStep, notificationPermission, setNotificationPermission } = useAppStore();
  const [subscribed, setSubscribed] = useState(notificationPermission === 'granted');
  const [selectedTipIndex, setSelectedTipIndex] = useState(0);

  const currentTip = WEEKLY_STYLING_TIPS[selectedTipIndex];

  const handleSubscribePush = async () => {
    const res = await requestPushNotificationPermission();
    setNotificationPermission(res);
    if (res === 'granted') {
      setSubscribed(true);
    }
  };

  const handleApplyTip = () => {
    // Apply first palette color to body, second to collar, third to accessories
    if (currentTip.paletteTheme[0]) setLayerColor('mainBody', currentTip.paletteTheme[0]);
    if (currentTip.paletteTheme[1]) setLayerColor('trousers', currentTip.paletteTheme[1]);
    if (currentTip.paletteTheme[2]) setLayerColor('collarAndButtons', currentTip.paletteTheme[2]);

    if (currentTip.id === 'tip-2') {
      setGarment('ao-tac-tay-thung');
    } else if (currentTip.id === 'tip-3') {
      setGarment('ao-nhat-binh');
    } else {
      setGarment('ao-ngu-than-tay-chen');
    }

    setStep(1);
    setView('canvas');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E5DCCE] relative">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#8F2635] to-[#701D29] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D5B477] font-semibold">
                SẮC LƯU NIÊN NOTIFICATIONS
              </span>
              <h3 className="text-lg font-serif font-bold">Gợi Ý Phối Đồ Hàng Tuần</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Push Notification Subscribe Banner */}
          <div className="p-4 rounded-2xl bg-[#F7F1E7] border border-[#E5DCCE] flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-serif font-bold text-[#2C241E]">
                {subscribed ? 'Đã bật thông báo đẩy tuần' : 'Nhận thông báo phong cách mỗi thứ Hai'}
              </div>
              <p className="text-[11px] text-[#6C6258] mt-0.5">
                Cập nhật xu hướng cổ phục giao thoa Gen Z trực tiếp trên thiết bị.
              </p>
            </div>

            <button
              onClick={handleSubscribePush}
              disabled={subscribed}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 flex-shrink-0 ${
                subscribed
                  ? 'bg-[#286B61]/15 text-[#286B61] cursor-default'
                  : 'bg-[#8F2635] text-white hover:bg-[#701D29] shadow-xs'
              }`}
            >
              {subscribed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã nhận</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Bật ngay</span>
                </>
              )}
            </button>
          </div>

          {/* Weekly Tip Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8F2635] uppercase tracking-wider">
                Bản Phối Tiêu Điểm
              </span>
              <div className="flex items-center gap-1">
                {WEEKLY_STYLING_TIPS.map((tip, idx) => (
                  <button
                    key={tip.id}
                    onClick={() => setSelectedTipIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      selectedTipIndex === idx ? 'bg-[#8F2635] w-6' : 'bg-[#E5DCCE]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-[#E5DCCE] bg-gradient-to-br from-white to-[#F7F1E7] shadow-sm space-y-3">
              <h4 className="text-base font-serif font-bold text-[#2C241E]">
                {currentTip.weekTitle}
              </h4>
              <div className="text-xs text-[#8F2635] font-serif italic">
                {currentTip.garmentRecommendation}
              </div>

              {/* Theme Palette */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-[#6C6258]">Bảng màu:</span>
                {currentTip.paletteTheme.map((color, i) => (
                  <span
                    key={i}
                    className="w-5 h-5 rounded-full border border-black/15 shadow-2xs"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <p className="text-xs text-[#6C6258] leading-relaxed italic">
                "{currentTip.stylingNote}"
              </p>

              <div className="pt-2 text-[11px] text-[#286B61] font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Bối cảnh phù hợp: {currentTip.context}</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E5DCCE] text-xs text-[#2C241E] hover:bg-[#F7F1E7]"
            >
              Để sau
            </button>
            <button
              onClick={handleApplyTip}
              className="px-5 py-2.5 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] text-xs font-medium flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Áp dụng bản phối này</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
