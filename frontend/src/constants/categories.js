/**
 * Cấu hình 6 Chuyên mục chính và các Lĩnh vực con tương ứng
 * dùng chung cho toàn bộ ứng dụng Đồ Sơn Today.
 */

export const CATEGORIES_DATA = [
  {
    id: 'kham-pha-do-son',
    name: 'Khám phá Đồ Sơn',
    subcategories: [
      'Tổng quan Đồ Sơn',
      'Lịch sử & Di tích',
      'Văn hóa & Lễ hội'
    ]
  },
  {
    id: 'du-lich',
    name: 'Du lịch',
    subcategories: [
      'Điểm đến nổi bật',
      'Nơi lưu trú & Resort',
      'Ẩm thực & Hải sản',
      'Lịch trình gợi ý'
    ]
  },
  {
    id: 'doanh-nghiep',
    name: 'Doanh nghiệp',
    subcategories: [
      'Danh bạ doanh nghiệp',
      'Sản phẩm OCOP tiêu biểu',
      'Nhu cầu mua - bán'
    ]
  },
  {
    id: 'dau-tu',
    name: 'Đầu tư',
    subcategories: [
      'Dự án & Cơ hội hợp tác',
      'Lĩnh vực tiềm năng'
    ]
  },
  {
    id: 'cong-dong',
    name: 'Cộng đồng',
    subcategories: [
      'Người Đồ Sơn xa quê',
      'Chuyên gia & Cố vấn',
      'CLB Doanh nhân'
    ]
  },
  {
    id: 'tin-tuc-su-kien',
    name: 'Tin tức - Sự kiện',
    subcategories: [
      'Tin tức thời sự',
      'Sự kiện & Lễ hội',
      'Thông cáo & Hoạt động'
    ]
  }
];

// Helper lấy danh sách tên tất cả Chuyên mục (Category lớn)
export const ALL_CATEGORIES = CATEGORIES_DATA.map(c => c.name);

// Helper lấy tất cả Lĩnh vực con theo Chuyên mục
export const getSubcategoriesByCategory = (categoryName) => {
  const cat = CATEGORIES_DATA.find(c => c.name === categoryName);
  return cat ? cat.subcategories : [];
};

// Helper lấy tất cả Lĩnh vực con trên toàn hệ thống
export const ALL_SUBCATEGORIES = CATEGORIES_DATA.flatMap(c => c.subcategories);
