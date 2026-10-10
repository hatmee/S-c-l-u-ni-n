import { evaluateOutfitRuleBased } from '../services/rulesEngine';
import { OutfitConfig } from '../types';

export interface TestCaseResult {
  name: string;
  passed: boolean;
  message?: string;
  durationMs: number;
}

export function runAutomatedTests(): TestCaseResult[] {
  const results: TestCaseResult[] = [];

  // Test 1: Sacred Space with Sneakers test
  {
    const start = performance.now();
    const outfit: OutfitConfig = {
      id: 'test-1',
      title: 'Hoàng Thành + Sneaker',
      createdAt: Date.now(),
      garmentId: 'ao-ngu-than-tay-chen',
      silhouette: 'ao-ngu-than-tay-chen',
      colors: {
        mainBody: '#1D3557',
        collarAndButtons: '#D5B477',
        sleeves: '#1D3557',
        innerLining: '#F7F1E7',
        trousers: '#F7F1E7',
        headwear: '#212025',
      },
      pattern: 'plain',
      sceneId: 'hoang-thanh-thang-long',
      accessories: ['sneaker-chunky'],
    };

    const res = evaluateOutfitRuleBased(outfit);
    const passed =
      res.culturalSafetyScore >= 75 &&
      res.culturalSafetyScore <= 90 &&
      res.evaluation.includes('Hoàng Thành Thăng Long') &&
      res.socialCaption.length > 0;

    results.push({
      name: 'Kiểm tra chấm điểm: Áo Ngũ Thân phối Sneaker tại Hoàng Thành',
      passed,
      message: passed ? `Đạt ${res.culturalSafetyScore} điểm (Cảnh báo nhẹ về bối cảnh trang nghiêm)` : 'Lỗi logic chấm điểm',
      durationMs: performance.now() - start,
    });
  }

  // Test 2: Sacred Space Traditional Clogs
  {
    const start = performance.now();
    const outfit: OutfitConfig = {
      id: 'test-2',
      title: 'Cố Đô Huế Chuẩn Mực',
      createdAt: Date.now(),
      garmentId: 'ao-tac-tay-thung',
      silhouette: 'ao-tac-tay-thung',
      colors: {
        mainBody: '#8F2635',
        collarAndButtons: '#D5B477',
        sleeves: '#8F2635',
        innerLining: '#F7F1E7',
        trousers: '#F7F1E7',
        headwear: '#8F2635',
      },
      pattern: 'cloud',
      sceneId: 'co-do-hue',
      accessories: ['khan-van', 'quat-tram-huong', 'guoc-moc-quai-nhung'],
    };

    const res = evaluateOutfitRuleBased(outfit);
    const passed = res.culturalSafetyScore >= 94 && res.evaluation.includes('xuất sắc');

    results.push({
      name: 'Kiểm tra chuẩn mực: Áo Tấc Cung Đình tại Cố Đô Huế',
      passed,
      message: passed ? `Đạt ${res.culturalSafetyScore} điểm (Chuẩn mực nghi lễ tối đa)` : 'Điểm chưa đạt chuẩn tối ưu',
      durationMs: performance.now() - start,
    });
  }

  // Test 3: Contemporary Urban Cafe Streetwear
  {
    const start = performance.now();
    const outfit: OutfitConfig = {
      id: 'test-3',
      title: 'Cafe Indochine Streetwear',
      createdAt: Date.now(),
      garmentId: 'ao-ngu-than-tay-chen',
      silhouette: 'ao-ngu-than-tay-chen',
      colors: {
        mainBody: '#286B61',
        collarAndButtons: '#D5B477',
        sleeves: '#286B61',
        innerLining: '#F7F1E7',
        trousers: '#FFFFFF',
        headwear: '#286B61',
      },
      pattern: 'damask',
      sceneId: 'cafe-indochine',
      accessories: ['sneaker-chunky', 'kinh-ram-oval'],
    };

    const res = evaluateOutfitRuleBased(outfit);
    const passed =
      res.culturalSafetyScore >= 88 &&
      res.evaluation.includes('giao thoa') &&
      res.socialCaption.includes('#SacLuuNien');

    results.push({
      name: 'Kiểm tra sáng tạo Gen Z: Ngũ Thân + Kính râm + Sneaker tại Cafe',
      passed,
      message: passed ? `Đạt ${res.culturalSafetyScore} điểm (Ghi nhận tính sáng tạo và hashtag)` : 'Sai lệch đánh giá Gen Z',
      durationMs: performance.now() - start,
    });
  }

  // Test 4: Collar & 5 Buttons Contrast Bonus Check
  {
    const start = performance.now();
    const outfit: OutfitConfig = {
      id: 'test-4',
      title: 'Khuy Ngũ Thường Nổi Bật',
      createdAt: Date.now(),
      garmentId: 'ao-ngu-than-tay-chen',
      silhouette: 'ao-ngu-than-tay-chen',
      colors: {
        mainBody: '#212025',
        collarAndButtons: '#D5B477', // contrast gold
        sleeves: '#212025',
        innerLining: '#F7F1E7',
        trousers: '#F7F1E7',
        headwear: '#212025',
      },
      pattern: 'plain',
      sceneId: 'pho-co-hoi-an',
      accessories: ['khan-van'],
    };

    const res = evaluateOutfitRuleBased(outfit);
    const passed = res.styleTips.some((tip) => tip.includes('Ngũ Thường') || tip.includes('Nẹp cổ'));

    results.push({
      name: 'Kiểm tra giải phẫu: Điểm cộng cho nẹp cổ & 5 khuy cài Ngũ Thường',
      passed,
      message: passed ? 'Nhận diện chuẩn nẹp cổ 5 khuy Nhân-Lễ-Nghĩa-Trí-Tín' : 'Thiếu lời khuyên về 5 khuy',
      durationMs: performance.now() - start,
    });
  }

  // Test 5: Academic Citations Check ("Trang Phục Việt Nam" & "Ngàn Năm Áo Mũ")
  {
    const start = performance.now();
    const outfit: OutfitConfig = {
      id: 'test-5',
      title: 'Khảo Cứu Học Thuật',
      createdAt: Date.now(),
      garmentId: 'ao-ngu-than-tay-chen',
      silhouette: 'ao-ngu-than-tay-chen',
      colors: {
        mainBody: '#1D3557',
        collarAndButtons: '#D5B477',
        sleeves: '#1D3557',
        innerLining: '#F7F1E7',
        trousers: '#F7F1E7',
        headwear: '#212025',
      },
      pattern: 'plain',
      sceneId: 'hoang-thanh-thang-long',
      accessories: [],
    };

    const res = evaluateOutfitRuleBased(outfit);
    const passed =
      res.academicNotes.includes('Đoàn Thị Tình') &&
      res.academicNotes.includes('Trang Phục Việt Nam') &&
      res.academicNotes.includes('Ngàn Năm Áo Mũ');

    results.push({
      name: 'Kiểm tra học thuật: Ánh xạ chuẩn sách "Trang Phục Việt Nam" & "Ngàn Năm Áo Mũ"',
      passed,
      message: passed ? 'Trích dẫn nguồn học thuật Đoàn Thị Tình và Trần Quang Đức chuẩn xác' : 'Thiếu nguồn học thuật',
      durationMs: performance.now() - start,
    });
  }

  return results;
}
