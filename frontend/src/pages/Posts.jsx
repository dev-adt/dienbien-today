import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { CATEGORIES_DATA, ALL_CATEGORIES, getSubcategoriesByCategory, getCategoryLabel } from '../constants/categories';

export const Posts = () => {
  const { role, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentLang, t } = useTranslation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState(searchParams.get('sub_category') || '');
  const [categoriesList, setCategoriesList] = useState(CATEGORIES_DATA);

  // Lắng nghe sự thay đổi query params từ URL
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const subCat = searchParams.get('sub_category') || '';
    setSelectedCategory(cat);
    setSelectedSubCategory(subCat);
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setCategoriesList(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic categories in Posts page", err);
      }
    };
    fetchCategories();
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  // Platinum slider index state
  const [activeSlide, setActiveSlide] = useState(0);

  const demoImages = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
  ];

  const sampleDienBienPosts = [
    {
      id: 101,
      title: 'Xúc tiến Đầu tư Dự án Nông nghiệp & Chế biến Lúa gạo Mường Thanh 2026',
      slug: 'xuc-tien-dau-tu-du-an-nong-nghiep-muong-thanh',
      summary: 'Tập đoàn Nông Lâm nghiệp Điện Biên kêu gọi đối tác đầu tư dự án nhà máy chế biến gạo xuất khẩu công nghệ cao tại cánh đồng Mường Thanh.',
      body: 'Cánh đồng Mường Thanh với diện tích hơn 4.000 ha là vựa lúa lớn nhất vùng Tây Bắc. Dự án xây dựng nhà máy chế biến gạo xuất khẩu quy mô 50.000 tấn/năm nhằm nâng cao giá trị hạt gạo Seng Cù...',
      category: 'Đầu tư',
      sub_category: 'Dự án & Cơ hội hợp tác',
      type: 'Xúc tiến đầu tư',
      company_name: 'Tập đoàn Nông Lâm nghiệp Điện Biên',
      company_tier: 'Platinum',
      is_featured: 1,
      views: 1250,
      created_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 102,
      title: 'Đặc sản OCOP 5 Sao: Gạo Seng Cù Mường Thanh chính hiệu Điện Biên',
      slug: 'dac-san-ocop-5-sao-gao-seng-cu-muong-thanh',
      summary: 'Gạo Seng Cù dẻo thơm trứ danh, hạt ngọc kết tinh từ dòng sông Nậm Rốm phù sa được cấp chứng nhận OCOP 5 Sao cấp Quốc gia.',
      body: 'Gạo Seng Cù Điện Biên nổi tiếng khắp cả nước nhờ vị ngọt đậm, hương thơm tự nhiên và hàm lượng dinh dưỡng cao...',
      category: 'Doanh nghiệp',
      sub_category: 'Sản phẩm OCOP Điện Biên',
      type: 'Sản phẩm OCOP',
      company_name: 'HTX Nông nghiệp Mường Thanh',
      company_tier: 'Gold',
      is_featured: 1,
      views: 980,
      created_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 103,
      title: 'Lễ hội Hoa Ban 2026 và Chuỗi sự kiện Văn hóa Du lịch Điện Biên Phủ',
      slug: 'le-hoi-hoa-ban-2026-van-hoa-du-lich-dien-bien-phu',
      summary: 'UBND tỉnh Điện Biên chủ trì tổ chức Lễ hội Hoa Ban 2026 kết hợp Liên hoan Múa Xòe Thái và trình diễn Di sản Lịch sử 1954.',
      body: 'Lễ hội Hoa Ban năm nay hứa hẹn mang đến nhiều trải nghiệm ấn tượng cho du khách với hơn 30 hoạt động văn hóa, thể thao và ẩm thực...',
      category: 'Khám phá Điện Biên',
      sub_category: 'Văn hóa & Lễ hội Hoa Ban',
      type: 'Tin sự kiện',
      company_name: 'Công ty Du lịch Sinh thái Điện Biên Travel',
      company_tier: 'Platinum',
      is_featured: 0,
      views: 2150,
      created_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 104,
      title: 'Mở rộng đường bay Cảng hàng không Điện Biên kết nối Hà Nội & TP.HCM',
      slug: 'mo-rong-duong-bay-cang-hang-khong-dien-bien',
      summary: 'Sân bay Điện Biên nâng cấp đón dòng máy bay thân rộng A321, giúp kết nối giao thương và du lịch nhanh chóng đến trung tâm cả nước.',
      body: 'Việc mở rộng đường băng 2.400m và nhà ga hành khách hiện đại giúp Điện Biên rút ngắn khoảng cách đi lại chỉ còn 1 giờ bay từ Hà Nội...',
      category: 'Tin tức - Sự kiện',
      sub_category: 'Tin tức thời sự',
      type: 'Tin thời sự',
      company_name: 'Ban Biên tập Dienbien.today',
      company_tier: 'Platinum',
      is_featured: 1,
      views: 3400,
      created_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 105,
      title: 'Cơ hội Đầu tư Khu công nghiệp Nam Mường Thanh & Cửa khẩu Tây Trang',
      slug: 'co-hoi-dau-tu-khu-cong-nghiep-nam-muong-thanh',
      summary: 'Mô hình ưu đãi đầu tư hạ tầng logistics, kho bãi và công nghiệp chế biến xuất khẩu trên tuyến Hành lang Kinh tế Đông - Tây.',
      body: 'Cửa khẩu Quốc tế Tây Trang kết nối trực tiếp với các tỉnh Bắc Lào. Tỉnh Điện Biên áp dụng các chính sách miễn giảm thuế đất và ưu đãi doanh nghiệp FDI...',
      category: 'Đầu tư',
      sub_category: 'Khu công nghiệp & Logistics',
      type: 'Cơ hội hợp tác',
      company_name: 'Tập đoàn Đầu tư & Xây dựng Tây Bắc',
      company_tier: 'Gold',
      is_featured: 0,
      views: 1120,
      created_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 106,
      title: 'Nghỉ dưỡng Khoáng nóng U Va: Trải nghiệm Suối khoáng thiên nhiên Điện Biên',
      slug: 'nghi-duong-khoang-nong-u-va-dien-bien',
      summary: 'Khu du lịch sinh thái khoáng nóng U Va cung cấp dịch vụ tắm khoáng trị liệu, ẩm thực dân tộc và nghỉ dưỡng homestay Tây Bắc.',
      body: 'Nguồn khoáng nóng U Va giàu vi khoáng tự nhiên, nhiệt độ từ 70-80°C, là điểm hẹn thư giãn tuyệt vời cho du khách sau hành trình di sản...',
      category: 'Du lịch',
      sub_category: 'Điểm đến nổi bật',
      type: 'Giới thiệu điểm đến',
      company_name: 'Hợp tác xã Khoáng nóng U Va Resort',
      company_tier: 'Gold',
      is_featured: 0,
      views: 890,
      created_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    }
  ];

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
        const res = await fetch('/api/posts?status=approved', { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            setPosts(data.data);
          } else {
            setPosts(sampleDienBienPosts);
          }
        } else {
          setPosts(sampleDienBienPosts);
        }
      } catch (err) {
        console.error(err);
        setPosts(sampleDienBienPosts);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [token]);

  // Platinum slider posts (latest 5)
  const platinumPosts = posts
    .filter(p => p.company_tier === 'Platinum')
    .slice(0, 5);

  // Auto scroll Platinum slider
  useEffect(() => {
    if (platinumPosts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % platinumPosts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [platinumPosts.length]);

  // Filters logic
  const filteredPosts = posts.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(q) || 
      (p.company_name && p.company_name.toLowerCase().includes(q)) ||
      (p.summary && p.summary.toLowerCase().includes(q));
      
    const matchesTier = !selectedTier || p.company_tier === selectedTier;
    const matchesType = !selectedType || p.type === selectedType;
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesSubCategory = !selectedSubCategory || p.sub_category === selectedSubCategory;
    
    return matchesSearch && matchesTier && matchesType && matchesCategory && matchesSubCategory;
  });

  // Sort featured posts to the top of the main listing
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.is_featured === 1 && b.is_featured !== 1) return -1;
    if (a.is_featured !== 1 && b.is_featured === 1) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTier, selectedType, selectedCategory, selectedSubCategory]);

  // Pagination index calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  const getInitialsColors = (name) => {
    if (!name) return { bg: '#E6F1FB', fg: '#0C447C' };
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      { bg: '#E6F1FB', fg: '#0C447C' },
      { bg: '#EAF3DE', fg: '#27500A' },
      { bg: '#FAEEDA', fg: '#633806' },
      { bg: '#EEEDFE', fg: '#3C3489' },
      { bg: '#E1F5EE', fg: '#085041' },
      { bg: '#FAECE7', fg: '#712B13' }
    ];
    return colors[sum % colors.length];
  };

  return (
    <div className="public-body">
      <SEOHead 
        title={currentLang === 'en' ? 'Business Opportunities & News' : 'Bảng tin cơ hội & Quảng bá Doanh nghiệp'}
        description="Khám phá các tin đăng tìm kiếm đối tác, nhu cầu hợp tác thương mại, sự kiện kết nối đầu tư và thông tin doanh nghiệp tại Đồ Sơn, Hải Phòng."
        keywords="bảng tin doanh nghiệp, cơ hội kinh doanh, Đồ Sơn, Hải Phòng, hợp tác thương mại, quảng bá doanh nghiệp"
        url="/posts"
      />

      <Navbar />

      {/* Decorative background gradient blobs */}
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, rgba(79,70,229,0) 70%)', zIndex: -1, pointerEvents: 'none', borderRadius: '50%' }}></div>
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, rgba(16,185,129,0) 70%)', zIndex: -1, pointerEvents: 'none', borderRadius: '50%' }}></div>

      <div className="public-container" style={{ minHeight: '80vh', paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        
        {/* Title Header */}
        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <i className="ti ti-news" style={{ color: 'var(--neon-cyan)' }}></i> {t('posts_title')}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', marginBlockEnd: 0 }}>{t('posts_subtitle')}</p>
        </div>

        {/* 1. TOP PLATINUM SLIDER */}
        {!loading && !error && platinumPosts.length > 0 && (
          <div style={{ position: 'relative', height: '240px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: 'var(--surface-2)', marginBottom: '3rem', display: 'flex', alignItems: 'center' }}>
            {platinumPosts.map((p, idx) => {
              const isActive = idx === activeSlide;
              const hasValidSlideImg = p.image_url && p.image_url !== 'null' && p.image_url !== 'undefined' && p.image_url.trim() !== '';
              const postImg = hasValidSlideImg ? p.image_url : demoImages[p.id % demoImages.length];
              return (
                <div key={p.id} style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                  transition: 'opacity 0.8s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none'
                }}>
                  {/* Backdrop Cover image (Layer 1) */}
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '60%',
                    backgroundImage: `url(${postImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 1,
                    maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 100%)'
                  }} />

                  {/* Gradient overlay (Layer 2) */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, rgba(12,35,64,0.96) 0%, rgba(12,35,64,0.85) 45%, rgba(12,35,64,0.15) 100%)',
                    zIndex: 2
                  }} />
                  
                  {/* Content (Layer 3) */}
                  <div style={{ flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left', zIndex: 3, maxWidth: '600px' }}>
                    <span style={{ fontSize: '10px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <i className="ti ti-crown"></i> {t('tier_platinum_partner')}
                    </span>
                    <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', fontWeight: 700, color: '#fff', margin: '0 0 8px', lineHeight: 1.3 }}>{p.title}</h2>
                    <p style={{ fontSize: '13px', color: '#B5CFEC', margin: '0 0 15px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.summary || p.body.replace(/<[^>]*>/g, '').substring(0, 150)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                       <button onClick={() => navigate('/posts/' + (p.slug || p.id))} className="btn btn-primary" style={{ fontSize: '12px', padding: '8px 18px' }}>
                        {t('btn_read_more')} <i className="ti ti-arrow-right"></i>
                      </button>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{p.company_name}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Carousel indicator dots */}
            <div style={{ position: 'absolute', bottom: '15px', left: '2.5rem', display: 'flex', gap: '8px', zIndex: 10 }}>
              {platinumPosts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    background: idx === activeSlide ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'background 0.3s'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. FILTER BAR (NEAT & COMPACT RE-LAYOUT) */}
        <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Row 1: Search, Chuyên mục, Lĩnh vực */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', width: '100%' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <i className="ti ti-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'var(--text-muted)' }}></i>
              <input 
                type="text" 
                placeholder={t('search_posts_placeholder')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '7px 12px 7px 30px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '12.5px', outline: 'none', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
              />
            </div>

            {/* Filter by Category (Chuyên mục) */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                const cat = e.target.value;
                setSelectedCategory(cat);
                setSelectedSubCategory('');
              }}
              style={{ padding: '7px 10px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '12.5px', outline: 'none', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', cursor: 'pointer', boxSizing: 'border-box' }}
            >
              <option value="">📁 {currentLang === 'en' ? 'All categories' : 'Tất cả chuyên mục'}</option>
              {categoriesList.map(cat => (
                <option key={cat.id || cat.name} value={cat.name}>{getCategoryLabel(cat, currentLang)}</option>
              ))}
            </select>

            {/* Filter by SubCategory (Lĩnh vực) */}
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              style={{ padding: '7px 10px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '12.5px', outline: 'none', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', cursor: 'pointer', boxSizing: 'border-box' }}
            >
              <option value="">🏷️ {currentLang === 'en' ? 'All sectors' : 'Tất cả lĩnh vực'}</option>
              {(selectedCategory 
                ? ((categoriesList.find(c => c.name === selectedCategory)?.subcategories || []).map(s => typeof s === 'string' ? s : s.name))
                : categoriesList.flatMap(c => (c.subcategories || []).map(s => typeof s === 'string' ? s : s.name))
              ).map(subName => (
                <option key={subName} value={subName}>{getCategoryLabel(subName, currentLang)}</option>
              ))}
            </select>

          </div>

          {/* Row 2: Single horizontal line for Tier, Type, Reset & Stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Filter by Tier */}
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid var(--border-strong)', fontSize: '12px', outline: 'none', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', cursor: 'pointer', maxWidth: '150px' }}
              >
                <option value="">👑 {t('all_members')}</option>
                <option value="Platinum">{t('tier_platinum_members')}</option>
                <option value="Gold">{t('tier_gold_members')}</option>
                <option value="Silver">{t('tier_silver_members')}</option>
              </select>

              {/* Filter by Type */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid var(--border-strong)', fontSize: '12px', outline: 'none', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', cursor: 'pointer', maxWidth: '150px' }}
              >
                <option value="">📌 {t('all_types')}</option>
                <option value="offer">{t('type_offer')}</option>
                <option value="demand">{t('type_demand')}</option>
                <option value="cooperate">{t('type_cooperate')}</option>
              </select>

              {/* Reset filter button */}
              {(searchQuery || selectedTier || selectedType || selectedCategory || selectedSubCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTier('');
                    setSelectedType('');
                    setSelectedCategory('');
                    setSelectedSubCategory('');
                    setSearchParams({});
                  }}
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    color: '#EF4444',
                    border: '1px solid rgba(239,68,68,0.2)',
                    fontSize: '11.5px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className="ti ti-rotate-clockwise"></i> {currentLang === 'en' ? 'Reset' : 'Xóa lọc'}
                </button>
              )}
            </div>

            {/* Stats & Per Page */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{t('label_show')}:</span>
                <select
                  value={postsPerPage}
                  onChange={(e) => {
                    setPostsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '3px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--surface-3)',
                    color: 'var(--text-primary)',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
              </div>

              <span>|</span>

              <span style={{ fontWeight: 600, color: 'var(--primary-light)' }}>
                {t('found_posts')(sortedPosts.length)}
              </span>
            </div>

          </div>

        </div>

        {/* 3. POSTS DIRECTORY LIST */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <i className="ti ti-loader animate-spin" style={{ fontSize: '28px', display: 'block', margin: '0 auto 10px' }}></i> {t('loading_posts')}
            </div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }} className="glass-card">
            <i className="ti ti-alert-triangle" style={{ fontSize: '24px', display: 'block', marginBottom: '8px', color: 'var(--rose)' }}></i> Lỗi tải bài viết: {error}
          </div>
        ) : currentPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem' }} className="glass-card">
            <i className="ti ti-news" style={{ fontSize: '32px', display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}></i>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t('no_posts_found')}</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentPosts.map((p) => {
              const dateStr = p.created_at ? new Date(p.created_at).toLocaleDateString('vi-VN') : '11/06/2026';
              const hasValidListImg = p.image_url && p.image_url !== 'null' && p.image_url !== 'undefined' && p.image_url.trim() !== '';
              const pImg = hasValidListImg ? p.image_url : demoImages[p.id % demoImages.length];
              const isPlat = p.company_tier === 'Platinum';
              const isGld = p.company_tier === 'Gold';
              const avatarColors = getInitialsColors(p.company_name);
              const initials = p.company_name ? p.company_name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'HV';

              return (
                <div className="glass-card" key={p.id} style={{ position: 'relative', overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s', border: p.is_featured === 1 ? '1px solid rgba(245,158,11,0.3)' : '1px solid var(--border-strong)' }}>
                  
                  {/* Featured Badge */}
                  {p.is_featured === 1 && (
                    <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '9px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--amber-dark)', border: '1px solid rgba(245,158,11,0.3)', padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase', fontWeight: 700, zIndex: 1 }}>
                      {t('badge_featured')} <i className="ti ti-star-filled"></i>
                    </span>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', flexWrap: 'wrap', padding: '1.25rem' }}>
                    
                    {/* Cover image left */}
                    <div style={{ width: '130px', height: '100px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                      <img src={pImg} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Content center */}
                    <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}>
                      <div>
                        {/* Member avatar & details line */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div className="av-circle" style={{ width: '22px', height: '22px', fontSize: '9px', background: avatarColors.bg, color: avatarColors.fg, fontWeight: 600 }}>{initials}</div>
                          <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.company_name}</span>
                          <span style={{ 
                            fontSize: '8.5px', 
                            background: isPlat ? 'rgba(245,158,11,0.15)' : isGld ? 'rgba(245,158,11,0.1)' : 'var(--surface-0)', 
                            color: isPlat || isGld ? 'var(--amber-dark)' : 'var(--text-muted)',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}>
                            {p.company_tier || 'Silver'}
                          </span>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>· {dateStr}</span>
                        </div>

                        {/* Title */}
                        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', margin: '0 0 6px', lineHeight: 1.4 }}>{p.title}</h3>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>{p.summary || p.body.replace(/<[^>]*>/g, '').substring(0, 120)}</p>
                      </div>

                      {/* Tag & classification */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '9.5px', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '4px', background: 'rgba(2,132,199,0.08)', color: 'var(--primary-dark)', border: '1px solid rgba(2,132,199,0.15)', fontWeight: 600 }}>
                          {p.type === 'offer' ? t('type_offer_short') : p.type === 'demand' ? t('type_demand_short') : t('type_cooperate_short')}
                        </span>
                        {p.category && (
                          <span style={{ fontSize: '10.5px', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            📁 {getCategoryLabel(p.category, currentLang)}
                          </span>
                        )}
                        {p.sub_category && (
                          <span style={{ fontSize: '10.5px', color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            🏷️ {getCategoryLabel(p.sub_category, currentLang)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action button right */}
                    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, marginLeft: 'auto' }}>
                      <button onClick={() => navigate('/posts/' + (p.slug || p.id))} className="btn btn-primary" style={{ fontSize: '12.5px', padding: '8px 18px' }}>
                        {t('btn_read_post')} <i className="ti ti-book-open"></i>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '2.5rem' }}>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="btn"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(12,35,64,0.06)',
                    color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    border: '1px solid var(--border-strong)',
                    opacity: currentPage === 1 ? 0.5 : 1
                  }}
                >
                  <i className="ti ti-chevron-left"></i> {t('btn_back_prev')}
                </button>
                <span style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>
                  {t('label_page')} <strong>{currentPage}</strong> / {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="btn"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(12,35,64,0.06)',
                    color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    border: '1px solid var(--border-strong)',
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  {t('btn_go_next')} <i className="ti ti-chevron-right"></i>
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default Posts;
