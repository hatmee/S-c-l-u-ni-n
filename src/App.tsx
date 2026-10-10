import React, { useState, useEffect } from 'react';
import { useAppStore, AppView } from './store/useAppStore';
import { HomePage } from './components/HomePage';
import { MoodboardCanvas } from './components/MoodboardCanvas';
import { MixMatchCanvas } from './components/MixMatchCanvas';
import { ExplorePage } from './components/ExplorePage';
import { CulturalCorner } from './components/CulturalCorner';
import { KnowledgeHub } from './components/KnowledgeHub';
import { Dashboard } from './components/Dashboard';
import { WeeklyNotificationModal } from './components/WeeklyNotificationModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { TraditionalBackground } from './components/TraditionalBackground';
import { 
  Home,
  Sliders, 
  Layers, 
  Compass, 
  Scroll, 
  BookOpen, 
  Bookmark, 
  Bell, 
  ShieldCheck, 
  Download, 
  Menu, 
  X, 
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';

export default function App() {
  const { 
    currentView, 
    setView, 
    showWeeklyNotificationModal, 
    setShowWeeklyNotificationModal,
    darkMode,
    toggleDarkMode
  } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTestRunner, setShowTestRunner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Capture PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Sync dark class on document element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const navLinks: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'home', label: 'Trang Chủ', icon: <Home className="w-4 h-4" /> },
    { view: 'moodboard', label: 'Phòng Thử Đồ 2D', icon: <Sliders className="w-4 h-4" /> },
    { view: 'canvas', label: 'Phối Đồ Từng Lớp', icon: <Layers className="w-4 h-4" /> },
    { view: 'explore', label: 'Khám Phá', icon: <Compass className="w-4 h-4" /> },
    { view: 'culture', label: 'Góc Văn Hóa', icon: <Scroll className="w-4 h-4" /> },
    { view: 'knowledge', label: 'Thư Viện Di Sản', icon: <BookOpen className="w-4 h-4" /> },
    { view: 'dashboard', label: 'Lookbook', icon: <Bookmark className="w-4 h-4" /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-300 ${
      darkMode ? 'bg-[#141214] text-[#F7F1E7]' : 'bg-[#F7F1E7] text-[#2C241E]'
    } bg-rice-paper`}>
      {/* Traditional Vietnamese Background Patterns Layer */}
      <TraditionalBackground />
      
      {/* Editorial Top Notification Bar */}
      <div className="bg-[#8F2635] text-white px-4 py-1.5 text-xs text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="font-serif italic">Tuần Lễ Di Sản:</span>
        <span>Khám phá bộ phối Áo Ngũ Thân & Phụ kiện đương đại Gen Z cùng AI Stylist</span>
        <button
          onClick={() => setShowWeeklyNotificationModal(true)}
          className="underline hover:text-[#D5B477] ml-2 text-[11px] font-semibold"
        >
          Xem gợi ý tuần →
        </button>
      </div>

      {/* Main Editorial Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5DCCE] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Slogan */}
          <button
            onClick={() => setView('home')}
            className="text-left group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-[#8F2635] border border-[#D5B477] flex items-center justify-center text-[#D5B477] font-serif font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2C241E] block leading-none">
                SẮC LƯU NIÊN
              </span>
              <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#8F2635] uppercase font-semibold block mt-1">
                Mặc Di Sản · Chất Riêng Mình
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#8F2635] text-white shadow-2xs'
                      : 'text-[#6C6258] hover:text-[#2C241E] hover:bg-[#F7F1E7]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Medium Screen (Tablet/Laptop) Navigation with dropdown or compact tabs */}
          <nav className="hidden md:flex xl:hidden items-center gap-1">
            {navLinks.slice(0, 5).map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                    isActive ? 'bg-[#8F2635] text-white' : 'text-[#6C6258] hover:bg-[#F7F1E7]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Utility Tools & Actions */}
          <div className="flex items-center gap-2">
            
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 border ${
                darkMode
                  ? 'border-[#D5B477]/50 bg-[#D5B477]/15 text-[#D5B477] hover:bg-[#D5B477]/25 shadow-xs'
                  : 'border-[#E5DCCE] bg-white text-[#6C6258] hover:text-[#8F2635] hover:bg-[#F7F1E7]'
              }`}
              title={darkMode ? 'Chuyển sang Nền Sáng (Kem Ngà)' : 'Chuyển sang Nền Tối (Sơn Mài)'}
              aria-label="Chuyển đổi giao diện Sáng / Tối"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-[#D5B477] transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-[#8F2635] transition-transform hover:-rotate-12" />
              )}
              <span className="text-xs font-serif font-medium hidden lg:inline">
                {darkMode ? 'Nền Tối' : 'Nền Sáng'}
              </span>
            </button>

            {/* PWA Install Button if available */}
            {deferredPrompt && (
              <button
                onClick={handleInstallPWA}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#286B61] text-[#286B61] hover:bg-[#286B61]/5 text-xs font-medium transition-colors"
                title="Cài đặt PWA lên thiết bị"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Cài App</span>
              </button>
            )}

            {/* Test Runner Button */}
            <button
              onClick={() => setShowTestRunner(true)}
              className="p-2 rounded-lg text-[#6C6258] hover:text-[#286B61] hover:bg-[#F7F1E7] transition-colors relative"
              title="Quy trình kiểm thử tự động (QA)"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Notification Drawer Button */}
            <button
              onClick={() => setShowWeeklyNotificationModal(true)}
              className="p-2 rounded-lg text-[#6C6258] hover:text-[#8F2635] hover:bg-[#F7F1E7] transition-colors relative"
              title="Gợi ý phối đồ hàng tuần"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#8F2635] absolute top-1.5 right-1.5 animate-pulse" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#2C241E] hover:bg-[#F7F1E7]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5DCCE] bg-white px-4 py-3 space-y-1 shadow-lg">
            {navLinks.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setView(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-medium flex items-center gap-3 transition-colors ${
                  currentView === item.view
                    ? 'bg-[#8F2635] text-white'
                    : 'text-[#6C6258] hover:bg-[#F7F1E7]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {/* Mobile Dark Mode Toggle Item */}
            <button
              onClick={() => {
                toggleDarkMode();
              }}
              className={`w-full mt-2 px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
                darkMode
                  ? 'border-[#D5B477]/40 bg-[#D5B477]/10 text-[#D5B477]'
                  : 'border-[#E5DCCE] bg-[#F7F1E7] text-[#2C241E]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {darkMode ? <Sun className="w-4 h-4 text-[#D5B477]" /> : <Moon className="w-4 h-4 text-[#8F2635]" />}
                <span>Chế độ giao diện:</span>
              </div>
              <span className="text-[11px] font-serif font-bold">
                {darkMode ? '🌙 Nền Tối (Sơn Mài)' : '☀️ Nền Sáng (Kem Ngà)'}
              </span>
            </button>

            {deferredPrompt && (
              <button
                onClick={() => {
                  handleInstallPWA();
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 px-3.5 py-2 rounded-xl text-xs font-medium text-[#286B61] bg-[#286B61]/10 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Cài đặt ứng dụng PWA</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main View Container */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'moodboard' && <MoodboardCanvas />}
        {currentView === 'canvas' && <MixMatchCanvas />}
        {currentView === 'explore' && <ExplorePage />}
        {currentView === 'culture' && <CulturalCorner />}
        {currentView === 'knowledge' && <KnowledgeHub />}
        {currentView === 'dashboard' && <Dashboard />}
      </main>

      {/* Editorial Luxury Footer */}
      <footer className="mt-16 bg-[#2C241E] text-[#E5DCCE] border-t border-[#8F2635]/30">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Brand column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8F2635] border border-[#D5B477] flex items-center justify-center text-[#D5B477] font-serif font-black text-sm">
                  S
                </div>
                <span className="font-serif text-xl font-bold tracking-tight text-white">
                  SẮC LƯU NIÊN
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-light max-w-sm">
                Nền tảng Progressive Web App kết nối di sản y phục truyền thống Việt Nam (Áo Ngũ Thân, Áo Tấc, Nhật Bình, Cổn Miện, Địch Y) với phòng thử đồ 2D Digital Moodboard, vector SVG động và trí tuệ nhân tạo Gemini AI.
              </p>
              <div className="text-xs text-[#D5B477] font-serif italic">
                "Mặc Di Sản - Chất Riêng Mình"
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="md:col-span-3 space-y-2 text-xs">
              <div className="font-semibold text-white uppercase tracking-wider mb-2 font-serif">
                Phân Hệ Trực Tuyến
              </div>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setView('home')} className="hover:text-[#D5B477] transition-colors">
                    Trang Chủ (Atelier Home)
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('moodboard')} className="hover:text-[#D5B477] transition-colors">
                    Phòng Thử Đồ 2D (Digital Moodboard)
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('canvas')} className="hover:text-[#D5B477] transition-colors">
                    Phối Đồ Từng Lớp (SVG Studio)
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('explore')} className="hover:text-[#D5B477] transition-colors">
                    Khám Phá (3 Giai Đoạn Lịch Sử)
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('culture')} className="hover:text-[#D5B477] transition-colors">
                    Góc Văn Hóa (Chuyên Đề Điển Cố)
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('knowledge')} className="hover:text-[#D5B477] transition-colors">
                    Thư Viện Di Sản (Bách Khoa Cổ Y)
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('dashboard')} className="hover:text-[#D5B477] transition-colors">
                    Lookbook Cá Nhân
                  </button>
                </li>
              </ul>
            </div>

            {/* Heritage Research & Academic References */}
            <div className="md:col-span-4 space-y-2 text-xs">
              <div className="font-semibold text-white uppercase tracking-wider mb-2 font-serif">
                Hệ Thống Tài Liệu Tham Khảo Gốc
              </div>
              <p className="text-stone-400 font-light leading-relaxed">
                Nghiên cứu cấu trúc chuẩn mực dựa trên: <em>Trang Phục Việt Nam (Dân tộc Việt)</em> - TS. Đoàn Thị Tình (NXB Mỹ Thuật, 2006); <em>Ngàn Năm Áo Mũ</em> - Trần Quang Đức; <em>Dệt Nên Triều Đại</em> - Vietnam Centre; cùng tư liệu khảo cứu của Đại Việt Cổ Phong, V’style Việt Cổ Phục & Hoa Niên.
              </p>
              <div className="pt-2 text-[11px] text-stone-400">
                © 2026 SẮC LƯU NIÊN. All rights reserved. Designed for Vietnamese Heritage Preservation.
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* Global Modals */}
      {showWeeklyNotificationModal && (
        <WeeklyNotificationModal onClose={() => setShowWeeklyNotificationModal(false)} />
      )}

      {showTestRunner && (
        <TestRunnerModal onClose={() => setShowTestRunner(false)} />
      )}

    </div>
  );
}
