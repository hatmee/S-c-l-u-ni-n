import { OutfitConfig, CulturalEvaluationResult } from '../types';
import { GARMENTS_DATA, BACKGROUND_SCENES, ACCESSORIES_DATA, TRADITIONAL_COLORS } from '../data/garments';

/**
 * Deterministic cultural evaluation engine grounded in:
 * - "Trang Phục Việt Nam (Dân tộc Việt)" - TS. Đoàn Thị Tình (NXB Mỹ Thuật, 2006)
 * - "Ngàn Năm Áo Mũ" - Trần Quang Đức
 * - "Dệt Nên Triều Đại" - Vietnam Centre
 * - Chuẩn mực nghiên cứu Đại Việt Cổ Phong, Hoa Niên.
 */
export function evaluateOutfitRuleBased(outfit: OutfitConfig): CulturalEvaluationResult {
  const garment = GARMENTS_DATA.find((g) => g.id === outfit.garmentId) || GARMENTS_DATA[0];
  const scene = BACKGROUND_SCENES.find((s) => s.id === outfit.sceneId) || BACKGROUND_SCENES[0];

  let score = 88;
  const tips: string[] = [];
  let evaluationRemarks = '';
  let socialCaption = '';
  let historicalInsight = '';
  let academicNotes = '';

  const hasSneaker = outfit.accessories.includes('sneaker-chunky') || outfit.accessories.includes('asset-sneaker-chunky');
  const hasKinhRam = outfit.accessories.includes('kinh-ram-oval') || outfit.accessories.includes('asset-kinh-ram-oval');
  const hasQuatTram = outfit.accessories.includes('quat-tram-huong') || outfit.accessories.includes('asset-quat-tram');
  const hasKhanVan = outfit.accessories.includes('khan-van') || outfit.accessories.includes('asset-khan-van-den');
  const hasGuocMoc = outfit.accessories.includes('guoc-moc-quai-nhung') || outfit.accessories.includes('asset-guoc-moc');

  const mainColorObj = TRADITIONAL_COLORS.find(c => c.hex.toLowerCase() === outfit.colors.mainBody.toLowerCase());
  const mainColorName = mainColorObj?.name || 'Sắc vải truyền thống';

  // 1. Evaluate context vs accessory harmony (Grounding in historical references)
  if (scene.id === 'hoang-thanh-thang-long' || scene.id === 'co-do-hue') {
    // Sacred & Imperial Heritage spaces
    if (hasSneaker) {
      score = 85;
      evaluationRemarks = `Tại không gian tôn nghiêm như ${scene.name}, việc phối sneaker với ${garment.name} là sự giao thoa thú vị của Gen Z. Bản phối giữ trọn vẹn tinh thần di sản nhờ nẹp cổ đứng lập lĩnh và kết cấu 5 khuy ngũ thường chỉn chu đúng chuẩn nghiên cứu.`;
      tips.push('Tại không gian cung đình trang nghiêm, bạn có thể chuyển sang guốc mộc quai nhung hoặc hài thêu để đạt độ chuẩn mực lễ nghi tối đa.');
    } else {
      score = 97;
      evaluationRemarks = `Bản phối đạt độ chuẩn chỉnh xuất sắc! Trang phục ${garment.name} với dáng hình tôn nghiêm hòa quyện hoàn hảo trong không gian trầm mặc của ${scene.name}.`;
      tips.push('Thêm quạt trầm hương dát vàng khi chụp ảnh góc nghiêng để tạo phong thái ung dung của bậc danh sĩ.');
    }
  } else if (scene.id === 'cafe-indochine' || scene.id === 'studio-editorial') {
    // Urban Contemporary & Editorial
    if (hasSneaker || hasKinhRam) {
      score = 94;
      evaluationRemarks = `Việc phối sneaker và kính râm với ${garment.name} đi dạo phố/cafe là sự giao thoa văn hóa đương đại đầy ấn tượng của Gen Z, đảm bảo giữ nguyên nẹp cổ 5 khuy tôn trọng bản gốc theo đúng tinh thần "Mặc Di Sản - Chất Riêng Mình".`;
      tips.push('Tà áo phía trước buông tự nhiên hoặc khẽ vén nhẹ khi ngồi cafe tạo nếp gấp lụa tao nhã.');
    } else {
      score = 91;
      evaluationRemarks = `Phong cách cổ điển thuần khiết giữa lòng đô thị. Bản phối mang đến nốt lặng thi vị, thu hút ánh nhìn bởi sự đoan trang và tao nhã.`;
      tips.push('Bạn có thể thử kết hợp thêm một chiếc kính râm retro gọng kim để tạo nét tương phản thú vị giữa cổ điển và đương đại.');
    }
  } else {
    // Hoi An ancient town
    score = 93;
    evaluationRemarks = `Sắc thái hoài niệm rất hòa hợp với bức tường vàng rêu phong Hội An. Dáng áo ${garment.name} tung bay trong gió tạo nên khung hình đậm chất điện ảnh.`;
    tips.push('Chọn quạt xếp hoặc túi cói cầm tay để hoàn thiện vẻ đẹp thanh bình phố cổ.');
  }

  // 2. Collar and 5 Buttons Integrity Appraisal
  if (outfit.colors.collarAndButtons !== outfit.colors.mainBody) {
    score = Math.min(100, score + 3);
    tips.push('Nẹp cổ phối màu sáng tương phản (như hình chuẩn image_a3daa7) giúp làm nổi bật hàng khuy Ngũ Thường (Nhân - Lễ - Nghĩa - Trí - Tín), một điểm nhấn thị giác vô cùng đắt giá.');
  }

  // 3. Historical Insight & Academic Documentation
  historicalInsight = `${garment.name} (${garment.era}) mang kết cấu ${garment.anatomy.flaps}. ${garment.anatomy.buttons}. Trang phục không chỉ là áo mặc mà là biểu tượng đạo lý làm người của tiền nhân.`;

  academicNotes = `Đối chiếu học thuật: TS. Đoàn Thị Tình trong "Trang Phục Việt Nam" (NXB Mỹ Thuật, tr. 135, 161) ghi nhận: Áo năm thân dài quá đầu gối, cổ áo cao đứng, vuông góc, khi cài cúc tạo hai mảng đậm nhạt hài hòa; kết hợp khảo cứu "Ngàn Năm Áo Mũ" (Trần Quang Đức) và chuẩn phục dựng Đại Việt Cổ Phong.`;

  // 4. Social Caption (Gen Z Language)
  if (hasSneaker || hasKinhRam) {
    socialCaption = `Ai bảo cổ phục thì không thể "slay" dạo phố? Khoác lên mình ${garment.name} tông ${mainColorName}, giữ trọn nẹp cổ 5 khuy nhưng bước đi bằng đôi sneaker cực chất. Di sản sống là di sản được mặc mỗi ngày! #SacLuuNien #MacDiSanChatRiengMinh #AoNguThan #VietStreetwear #GenZHeritage`;
  } else {
    socialCaption = `Gói ghém nghìn năm văn hiến vào từng nếp áo ${garment.name} ✨. Một thoáng kinh kỳ giữa nhịp sống hôm nay. Tự hào cốt cách Việt! #SacLuuNien #CoPhucVietNam #HeritageVibes #AoDaiVietNam #VanHoaViet`;
  }

  return {
    culturalSafetyScore: Math.max(60, Math.min(99, score)),
    evaluation: evaluationRemarks,
    socialCaption,
    historicalInsight,
    academicNotes,
    styleTips: tips.length > 0 ? tips : ['Giữ phom dáng áo phẳng phiu và tự tin sải bước!'],
    evaluatedAt: new Date().toISOString(),
    engineUsed: 'rules-fallback',
  };
}
