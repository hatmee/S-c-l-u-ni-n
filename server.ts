import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with required User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// POST /api/cultural-stylist
app.post('/api/cultural-stylist', async (req: Request, res: Response) => {
  try {
    const { outfit } = req.body;
    if (!outfit) {
      res.status(400).json({ error: 'Missing outfit configuration in request body' });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY not configured on server',
        fallback: true,
      });
      return;
    }

    const promptText = `
Bạn là chuyên gia sử học y phục và Stylist văn hóa cao cấp của dự án "SẮC LƯU NIÊN" (Slogan: "Mặc Di Sản - Chất Riêng Mình").
Nhiệm vụ của bạn là thẩm định bản phối trang phục truyền thống Việt Nam trên bảng vẽ Moodboard dành cho giới trẻ Gen Z.

HỆ THỐNG TÀI LIỆU KHẢO CỨU BẮT BUỘC TUÂN THỦ:
1. "Trang Phục Việt Nam (Dân tộc Việt)" - TS. Đoàn Thị Tình (NXB Mỹ Thuật, 2006): Quy chuẩn về áo năm thân dài quá đầu gối, vạt cả đè vạt con, nẹp cổ đứng vuông góc hoặc lượn tròn (lập lĩnh cao 3-4cm), 5 khuy cài Ngũ Thường, khăn vấn chữ nhân, guốc mộc, xà tích bạc.
2. "Ngàn Năm Áo Mũ" - Trần Quang Đức: Cấu trúc quy chế y phục triều Lê - Nguyễn (áo ngũ thân tay chẽn, áo tấc tay thụng, áo giao lĩnh).
3. "Dệt Nên Triều Đại" - Vietnam Centre & Chuẩn phục dựng của Đại Việt Cổ Phong, Hoa Niên.
4. Tệp hình ảnh tham chiếu chuẩn: Thiết kế áo ngũ thân dáng dài màu tối cùng nẹp cổ đứng màu sáng và 5 khuy cài vàng kim.

THÔNG TIN BẢN PHỐI CỦA NGƯỜI DÙNG:
- Loại trang phục: ${outfit.garmentId} (${outfit.silhouette})
- Giới tính nhân vật: ${outfit.gender === 'nu' ? 'Phái Nữ' : 'Phái Nam'}
- Kiểu tóc nhân vật: ${outfit.hairstyle || 'Mặc định'}
- Bối cảnh (Scene): ${outfit.sceneId}
- Các món đồ / Phụ kiện trên Moodboard: ${Array.isArray(outfit.accessories) ? outfit.accessories.join(', ') : 'Không có'}
- Màu sắc các lớp (SVG Colors):
  + Thân áo: ${outfit.colors?.mainBody}
  + Nẹp cổ & 5 Khuy Ngũ Thường: ${outfit.colors?.collarAndButtons}
  + Tay áo: ${outfit.colors?.sleeves}
  + Tà lót trong: ${outfit.colors?.innerLining}
  + Quần hạ y: ${outfit.colors?.trousers}
  + Khăn vấn: ${outfit.colors?.headwear}

YÊU CẦU ĐÁNH GIÁ (JSON RESPONSE):
1. "culturalSafetyScore" (Số nguyên từ 0 - 100):
   - Đánh giá tính chuẩn mực di sản. Nếu người dùng phối sneaker hoặc kính râm retro với Áo Ngũ Thân trong bối cảnh dạo phố/cafe, hãy đánh giá đây là sự giao thoa văn hóa đương đại tích cực của Gen Z (vẫn đạt 88 - 95 điểm) MIỄN LÀ giữ nguyên nẹp cổ và hàng 5 khuy cài đúng bản gốc.
2. "evaluation": Nhận xét chuyên môn về cấu trúc (ví dụ: "Việc phối sneaker với Áo Ngũ Thân đi dạo phố là sự giao thoa thú vị, đảm bảo giữ nguyên nẹp cổ 5 khuy tôn trọng bản gốc").
3. "socialCaption": Câu caption đăng mạng xã hội (Instagram / TikTok) cuốn hút, tự hào văn hóa dân tộc.
4. "historicalInsight": Ý nghĩa lịch sử của cấu trúc y phục này (ngũ thân, ngũ khuy tượng trưng Nhân - Lễ - Nghĩa - Trí - Tín).
5. "academicNotes": Trích dẫn đối chiếu từ "Trang Phục Việt Nam" (Đoàn Thị Tình) hoặc "Ngàn Năm Áo Mũ" (Trần Quang Đức).
6. "styleTips": Mảng gồm 2-3 gợi ý tạo dáng hoặc phối màu tinh tế.
`;

    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction: 'Bạn là chuyên gia thẩm định di sản y phục truyền thống Việt Nam. Luôn phản hồi bằng tiếng Việt và tuân thủ định dạng JSON được chỉ định.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              culturalSafetyScore: {
                type: Type.INTEGER,
                description: 'Điểm an toàn văn hóa từ 0 đến 100',
              },
              evaluation: {
                type: Type.STRING,
                description: 'Đánh giá chi tiết cấu trúc trang phục và tính hài hòa',
              },
              socialCaption: {
                type: Type.STRING,
                description: 'Gợi ý caption đăng mạng xã hội Gen Z',
              },
              historicalInsight: {
                type: Type.STRING,
                description: 'Thông điệp ý nghĩa lịch sử của trang phục',
              },
              academicNotes: {
                type: Type.STRING,
                description: 'Trích dẫn đối chiếu học thuật từ sách',
              },
              styleTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Danh sách gợi ý phong cách',
              },
            },
            required: ['culturalSafetyScore', 'evaluation', 'socialCaption', 'historicalInsight', 'academicNotes', 'styleTips'],
          },
        },
      });
      responseText = response.text || '';
    } catch (primaryErr) {
      console.warn('Primary model call error, attempting retry with gemini-3.8-flash:', primaryErr);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
        },
      });
      responseText = fallbackResponse.text || '';
    }

    if (!responseText) {
      throw new Error('Empty response received from Gemini');
    }

    const parsedData = JSON.parse(responseText);
    res.json({
      ...parsedData,
      evaluatedAt: new Date().toISOString(),
      engineUsed: 'gemini',
    });
  } catch (error: any) {
    console.error('Gemini Stylist Error:', error);
    res.status(500).json({
      error: error.message || 'Internal AI evaluation error',
      fallback: true,
    });
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Sắc Lưu Niên API' });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🌸 Sắc Lưu Niên server running on http://localhost:${port} (${isDev ? 'dev' : 'production'})`);
  });
}

startServer();
