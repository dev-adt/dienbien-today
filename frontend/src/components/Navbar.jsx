import { CATEGORIES_DATA } from '../constants/categories';

export const Navbar = () => {
  const { role, user, logout } = useAuth();
  const { currentLang, changeLang, t, LANGS } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [categories, setCategories] = useState(CATEGORIES_DATA);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setCategories(data.data);
          }
        }
      } catch (e) {
        console.warn("Using fallback CATEGORIES_DATA", e);
      }
    };
    fetchCats();
  }, []);

  // Dark Mode Toggle initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('dbt_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dbt_theme', newTheme);
  };

  const getInitials = (name) => {
    if (!name) return 'DB';
    return name.trim().split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { label: 'Trang chủ', path: '/', anchor: '#hero', catKey: null },
    { label: 'Khám phá', path: '/posts?category=Khám phá Điện Biên', anchor: '#kham-pha', catKey: 'Khám phá Điện Biên' },
    { label: 'Du lịch', path: '/posts?category=Du lịch', anchor: '#diem-den', catKey: 'Du lịch' },
    { label: 'Đầu tư', path: '/posts?category=Đầu tư', anchor: '#dau-tu', catKey: 'Đầu tư' },
    { label: 'Doanh nghiệp', path: '/posts?category=Doanh nghiệp', anchor: '#doanh-nghiep', catKey: 'Doanh nghiệp' },
    { label: 'Sản phẩm OCOP', path: '/posts?sub_category=Sản phẩm OCOP Điện Biên', anchor: '#ocop', catKey: null },
    { label: 'Văn hóa', path: '/posts?sub_category=Văn hóa %26 Lễ hội Hoa Ban', anchor: '#van-hoa', catKey: null },
    { label: 'Tin tức', path: '/posts?category=Tin tức - Sự kiện', anchor: '#tin-tuc', catKey: 'Tin tức - Sự kiện' },
    { label: 'AI Assistant', path: '/ai-chat', anchor: '#ai-assistant', catKey: null },
    { label: 'Thành viên', path: '/members', anchor: '#thanh-vien', catKey: 'Cộng đồng' },
    { label: 'Liên hệ', path: '/', anchor: '#footer', catKey: null },
  ];

  const getSubcategories = (catKey) => {
    if (!catKey) return [];
    const cat = categories.find(c => c.name === catKey || (c.name && c.name.includes(catKey.split(' ')[0])));
    if (!cat) return [];
    if (cat.subs) return cat.subs.map(s => s.vi || s.name || s);
    if (cat.subcategories) return cat.subcategories;
    return [];
  };

  const handleNavClick = (e, link) => {
    if (link.anchor && location.pathname === '/' && link.path === '/') {
      e.preventDefault();
      const targetEl = document.querySelector(link.anchor);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileMenuOpen(false);
      }
    } else {
      setMobileMenuOpen(false);
      navigate(link.path);
    }
  };

  // Supported languages according to requirement 18
  const languagesList = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' }
  ];

  const activeLangDetails = languagesList.find(l => l.code === currentLang) || languagesList[0];

  return (
    <header className="header-wrapper" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: isDarkMode ? '#0E1320' : '#ffffff', borderBottom: '1px solid var(--border)', transition: 'background-color 0.3s ease' }}>
      {/* Announcement Bar */}
      <div 
        style={{
          background: 'linear-gradient(90deg, #0B5FFF 0%, #14B86A 60%, #F6B800 100%)',
          color: '#ffffff',
          fontSize: '12px',
          padding: '6px 0',
          fontWeight: '500'
        }}
      >
        <div 
          className="public-container"
          style={{
            margin: '0 auto',
            maxWidth: '1360px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 1.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <span 
              style={{
                backgroundColor: 'rgba(255,255,255,0.25)',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '12px',
                letterSpacing: '0.05em'
              }}
            >
              AI NATIVE PLATFORM
            </span>
            <span style={{ fontSize: '12px', fontWeight: '500' }}>
              ⚡ Cổng thông tin Thương hiệu Số & AI hỗ trợ xúc tiến du lịch, kinh tế Điện Biên
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px' }}>
            <span>📍 TP. Điện Biên Phủ, Tỉnh Điện Biên</span>
            <span style={{ opacity: 0.8 }}>|</span>
            <span>📞 (0215) 3.825.888</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="public-container" style={{ margin: '0 auto', maxWidth: '1360px', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/dienbien_logo.svg" alt="Dienbien.today" style={{ height: '44px', width: 'auto' }} />
        </Link>

        {/* Desktop Navigation Menu (11 items with dynamic subcategory dropdowns) */}
        <nav className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          {navLinks.map((link, idx) => {
            const subs = getSubcategories(link.catKey);
            const hasSubs = subs.length > 0;
            return (
              <div 
                key={idx} 
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredCategory(idx)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <a
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  style={{
                    color: hoveredCategory === idx ? '#0B5FFF' : 'var(--text-primary)',
                    textDecoration: 'none',
                    fontSize: '0.86rem',
                    fontWeight: '600',
                    transition: 'color 0.2s ease',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 0'
                  }}
                >
                  {link.label}
                  {hasSubs && <i className="ti ti-chevron-down" style={{ fontSize: '10px', opacity: 0.7 }}></i>}
                </a>

                {/* Subcategories Dropdown */}
                {hasSubs && hoveredCategory === idx && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '14px',
                      padding: '8px 0',
                      minWidth: '210px',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                      zIndex: 2000
                    }}
                  >
                    {subs.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        onClick={() => {
                          setHoveredCategory(null);
                          navigate(`/posts?category=${encodeURIComponent(link.catKey)}&sub_category=${encodeURIComponent(sub)}`);
                        }}
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.82rem',
                          fontWeight: '500',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-0)';
                          e.currentTarget.style.color = '#0B5FFF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Dark Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? "Chuyển sang Chế độ Sáng" : "Chuyển sang Dark Mode"}
            style={{
              background: 'var(--surface-0)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              transition: 'var(--transition)'
            }}
          >
            <i className={isDarkMode ? "ti ti-sun" : "ti ti-moon"} style={{ fontSize: '1.2rem', color: isDarkMode ? '#F6B800' : '#0B5FFF' }}></i>
          </button>

          {/* Multi-Language Dropdown (9 languages) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                background: 'var(--surface-0)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '5px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}
            >
              <span>{activeLangDetails.flag}</span>
              <span>{activeLangDetails.code.toUpperCase()}</span>
              <i className="ti ti-chevron-down" style={{ fontSize: '0.8rem' }}></i>
            </button>

            {langOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '160px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '8px 0',
                  zIndex: 1100
                }}
              >
                {languagesList.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      changeLang(l.code);
                      setLangOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '8px 14px',
                      border: 'none',
                      background: currentLang === l.code ? 'var(--primary-glow)' : 'transparent',
                      color: currentLang === l.code ? '#0B5FFF' : 'var(--text-primary)',
                      fontWeight: currentLang === l.code ? '700' : '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Controls */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to={role === 'admin' ? '/admin' : role === 'creator' ? '/creator' : '/member'}
                style={{
                  background: '#0B5FFF',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{getInitials(user.name)}</span>
                <span>{user.name}</span>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link
                to="/login"
                style={{
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  padding: '6px 10px'
                }}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                style={{
                  background: 'linear-gradient(135deg, #0B5FFF 0%, #14B86A 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  padding: '7px 14px',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(11, 95, 255, 0.25)'
                }}
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <i className={mobileMenuOpen ? "ti ti-x" : "ti ti-menu-2"}></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--surface-2)',
            borderTop: '1px solid var(--border)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.path + link.anchor}
              onClick={(e) => handleNavClick(e, link)}
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: '600',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)'
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1200px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
