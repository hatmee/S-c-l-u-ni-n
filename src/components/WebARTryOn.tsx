import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { GARMENTS_DATA } from '../data/garments';
import { GarmentSvgSilhouette } from './GarmentSvgSilhouette';
import { 
  Camera, 
  FlipHorizontal, 
  Download, 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  Check, 
  AlertCircle,
  X,
  Maximize2,
  Eye
} from 'lucide-react';

export const WebARTryOn: React.FC = () => {
  const { currentOutfit, setView } = useAppStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  // AR positioning controls
  const [scale, setScale] = useState<number>(1.05);
  const [offsetY, setOffsetY] = useState<number>(18);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(0.92);

  // Snapshot modal
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isFlash, setIsFlash] = useState<boolean>(false);

  const garment = GARMENTS_DATA.find((g) => g.id === currentOutfit.garmentId) || GARMENTS_DATA[0];

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setStreamActive(true);
        };
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Không thể mở camera hoặc bạn chưa cấp quyền truy cập. Bạn có thể sử dụng chế độ mô phỏng trực quan bên dưới.');
      setStreamActive(false);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleTakeSnapshot = () => {
    setIsFlash(true);
    setTimeout(() => setIsFlash(false), 200);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 720;
    const height = 1280;
    canvas.width = width;
    canvas.height = height;

    // Draw background (either video frame or studio gradient)
    if (streamActive && videoRef.current) {
      const v = videoRef.current;
      // Mirror if user facing
      if (facingMode === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(v, 0, 0, width, height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        ctx.drawImage(v, 0, 0, width, height);
      }
    } else {
      // Ambient studio gradient fallback
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#E5DCCE');
      grad.addColorStop(1, '#F7F1E7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // Render SVG Garment overlay onto the image
    const svgElem = document.getElementById('webar-garment-svg');
    if (svgElem) {
      const svgData = new XMLSerializer().serializeToString(svgElem);
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URLObj = window.URL || window.webkitURL || window;
      const blobUrl = URLObj.createObjectURL(svgBlob);

      img.onload = () => {
        const garmentW = width * scale * 0.95;
        const garmentH = height * scale * 0.85;
        const posX = (width - garmentW) / 2 + offsetX * 3;
        const posY = height * 0.15 + offsetY * 3;

        ctx.globalAlpha = opacity;
        ctx.drawImage(img, posX, posY, garmentW, garmentH);
        ctx.globalAlpha = 1.0;

        // Add Sắc Lưu Niên Watermark
        ctx.fillStyle = '#8F2635';
        ctx.font = 'bold 22px Playfair Display, serif';
        ctx.fillText('SẮC LƯU NIÊN', 40, height - 60);

        ctx.fillStyle = '#2C241E';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Mặc Di Sản · Chất Riêng Mình — WebAR Snapshot', 40, height - 35);

        const finalDataUrl = canvas.toDataURL('image/png');
        setSnapshotUrl(finalDataUrl);
        URLObj.revokeObjectURL(blobUrl);
      };
      img.src = blobUrl;
    }
  };

  const handleDownloadSnapshot = () => {
    if (!snapshotUrl) return;
    const a = document.createElement('a');
    a.href = snapshotUrl;
    a.download = `WebAR-SacLuuNien-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-[#E5DCCE] pb-5 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8F2635] font-semibold">
            Công Nghệ Thực Tế Ảo · WebAR Studio
          </span>
          <h1 className="text-2xl md:text-4xl font-serif text-[#2C241E] mt-1 tracking-tight">
            Ướm Thử Trang Phục Thời Gian Thực
          </h1>
          <p className="text-xs md:text-sm text-[#6C6258] mt-1 font-light">
            Nhận diện cơ thể & ướm thử mẫu {garment.name} trực tiếp trên camera của bạn.
          </p>
        </div>

        <button
          onClick={() => setView('canvas')}
          className="px-4 py-2 rounded-xl border border-[#8F2635] text-[#8F2635] hover:bg-[#8F2635]/5 transition-colors text-xs font-medium"
        >
          Quay lại phòng phối màu
        </button>
      </div>

      {/* Main AR Display & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* AR Viewport (Col 8) */}
        <div className="lg:col-span-8 bg-black rounded-3xl overflow-hidden relative border-2 border-[#D5B477]/40 shadow-2xl aspect-[3/4] sm:aspect-[9/14] max-h-[680px] mx-auto w-full flex items-center justify-center">
          
          {/* Flash animation */}
          {isFlash && <div className="absolute inset-0 bg-white z-40 transition-opacity duration-200" />}

          {/* Video Stream Element */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />

          {/* Camera Error / Fallback Background */}
          {(!streamActive || cameraError) && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#2C241E] via-[#1C1B1A] to-[#141312] flex flex-col items-center justify-center text-center p-6 z-10 text-white">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <Camera className="w-6 h-6 text-[#D5B477]" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#F7F1E7]">Chế Độ Mô Phỏng Thực Tế Ảo</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-sm font-light">
                {cameraError || 'Vui lòng cho phép truy cập máy ảnh để trải nghiệm camera thời gian thực.'}
              </p>
              <button
                onClick={startCamera}
                className="mt-4 px-4 py-2 rounded-xl bg-[#8F2635] text-white text-xs font-medium hover:bg-[#701D29] transition-colors"
              >
                Cấp quyền & Thử lại camera
              </button>
            </div>
          )}

          {/* Body / Face Guide Wireframe (Align indicator) */}
          <div className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-start pt-12 opacity-30">
            {/* Oval Head Guide */}
            <div className="w-36 h-48 rounded-full border border-dashed border-[#D5B477]" />
            {/* Shoulder arch */}
            <div className="w-72 h-16 border-t-2 border-dashed border-[#D5B477] -mt-4 rounded-t-full" />
          </div>

          {/* AR Garment Vector Overlay */}
          <div
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center transition-all duration-75"
            style={{
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
              opacity: opacity,
            }}
          >
            <div id="webar-garment-svg" className="w-[85%] max-w-[420px] drop-shadow-2xl">
              <GarmentSvgSilhouette
                silhouette={currentOutfit.silhouette}
                gender={currentOutfit.gender}
                hairstyle={currentOutfit.hairstyle}
                hairColor={currentOutfit.hairColor}
                colors={currentOutfit.colors}
                pattern={currentOutfit.pattern}
                accessories={currentOutfit.accessories}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Live Top Bar Tag */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-serif">{garment.name}</span>
          </div>

          {/* Live Flip Camera Button */}
          <button
            onClick={toggleFacingMode}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            title="Đổi camera trước/sau"
          >
            <FlipHorizontal className="w-5 h-5" />
          </button>

          {/* Live Snapshot Shutter Button */}
          <div className="absolute bottom-6 inset-x-0 z-30 flex items-center justify-center">
            <button
              onClick={handleTakeSnapshot}
              className="w-16 h-16 rounded-full border-4 border-white/90 bg-[#8F2635] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
              title="Chụp ảnh ướm thử (Snapshot)"
            >
              <Camera className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* AR Tuning Controls (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5DCCE] p-6 shadow-editorial space-y-6">
          <div>
            <h3 className="text-base font-serif font-bold text-[#2C241E] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#8F2635]" />
              Căn Chỉnh Tọa Độ Áo
            </h3>
            <p className="text-xs text-[#6C6258] mt-1">
              Điều chỉnh độ vừa vặn của tà áo với vóc dáng của bạn trong khung hình.
            </p>
          </div>

          {/* Scale slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#2C241E]">Thu phóng phom áo (Scale)</span>
              <span className="text-[#8F2635] font-mono">{Math.round(scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.02"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full accent-[#8F2635]"
            />
          </div>

          {/* Vertical Offset */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#2C241E]">Vị trí vai áo (Lên / Xuống)</span>
              <span className="text-[#8F2635] font-mono">{offsetY}px</span>
            </div>
            <input
              type="range"
              min="-120"
              max="120"
              step="2"
              value={offsetY}
              onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
              className="w-full accent-[#8F2635]"
            />
          </div>

          {/* Horizontal Offset */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#2C241E]">Căn giữa (Trái / Phải)</span>
              <span className="text-[#8F2635] font-mono">{offsetX}px</span>
            </div>
            <input
              type="range"
              min="-80"
              max="80"
              step="2"
              value={offsetX}
              onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
              className="w-full accent-[#8F2635]"
            />
          </div>

          {/* Opacity */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#2C241E]">Độ chân thực & Hòa sắc</span>
              <span className="text-[#8F2635] font-mono">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full accent-[#8F2635]"
            />
          </div>

          {/* Reset button */}
          <div className="pt-2 border-t border-[#E5DCCE] flex justify-between items-center">
            <button
              onClick={() => {
                setScale(1.05);
                setOffsetY(18);
                setOffsetX(0);
                setOpacity(0.92);
              }}
              className="text-xs text-[#6C6258] hover:text-[#8F2635] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại mặc định</span>
            </button>

            <button
              onClick={handleTakeSnapshot}
              className="px-4 py-2 rounded-xl bg-[#8F2635] text-white text-xs font-medium hover:bg-[#701D29] shadow-sm flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Chụp ảnh ngay</span>
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Preview Modal */}
      {snapshotUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl border border-[#E5DCCE]">
            <div className="p-4 border-b border-[#E5DCCE] flex items-center justify-between bg-[#F7F1E7]">
              <div className="font-serif font-bold text-sm text-[#2C241E]">Ảnh Ướm Thử Sắc Lưu Niên</div>
              <button
                onClick={() => setSnapshotUrl(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#6C6258] hover:bg-black/5"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-stone-100 flex justify-center">
              <img
                src={snapshotUrl}
                alt="WebAR Snapshot"
                className="rounded-xl max-h-[500px] w-auto shadow-md"
              />
            </div>

            <div className="p-4 flex items-center justify-between gap-3">
              <button
                onClick={() => setSnapshotUrl(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E5DCCE] text-xs text-[#2C241E] hover:bg-[#F7F1E7] flex-1"
              >
                Chụp lại
              </button>
              <button
                onClick={handleDownloadSnapshot}
                className="px-5 py-2.5 rounded-xl bg-[#8F2635] text-white hover:bg-[#701D29] text-xs font-medium flex items-center justify-center gap-2 flex-1 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Tải ảnh về máy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
