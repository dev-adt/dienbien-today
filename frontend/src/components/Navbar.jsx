import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
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

  // Dynamic Navigation Links generated directly from Admin categories API
  const dynamicNavLinks = [
    ...categories
      .filter(c => c.status !== 'inactive')
      .map(c => ({
        label: c.name,
        path: `/posts?category=${encodeURIComponent(c.name)}`,
        catObj: c
      })),
    { label: 'Trợ lý AI', path: '/ai-chat', catObj: null },
  ];

  const getSubcategories = (catObj) => {
    if (!catObj) return [];
    if (Array.isArray(catObj.subcategories)) {
      return catObj.subcategories.map(s => typeof s === 'string' ? s : (s.name || s.vi || ''));
    }
    if (Array.isArray(catObj.sub_objects)) {
      return catObj.sub_objects.filter(s => s.status !== 'inactive').map(s => s.name);
    }
    if (Array.isArray(catObj.subs)) {
      return catObj.subs.map(s => typeof s === 'string' ? s : (s.vi || s.name || ''));
    }
    return [];
  };

  const handleNavClick = (e, link) => {
    if (link.path === '/' && location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobileMenuOpen(false);
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

        {/* Desktop Navigation Menu (Dynamic items from Admin Categories API) */}
        <nav className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          {dynamicNavLinks.map((link, idx) => {
            const subs = getSubcategories(link.catObj);
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
                          navigate(`/posts?category=${encodeURIComponent(link.label)}&sub_category=${encodeURIComponent(sub)}`);
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
                to={role === 'admin' ? '/admin-dashboard' : role === 'creator' ? '/creator-dashboard' : '/member-dashboard'}
                title={`Bảng điều khiển: ${user.name}`}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#0B5FFF',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(11, 95, 255, 0.3)',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {getInitials(user.name)}
              </Link>

              <button
                onClick={logout}
                title="Đăng xuất"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
              >
                <i className="ti ti-logout" style={{ fontSize: '0.9rem' }}></i>
                <span>Đăng xuất</span>
              </button>
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
            gap: '8px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          {dynamicNavLinks.map((link, idx) => {
            const subs = getSubcategories(link.catObj);
            const hasSubs = subs.length > 0;
            return (
              <div key={idx} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                <a
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  style={{
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    padding: '6px 0',
                    display: 'block'
                  }}
                >
                  {link.label}
                </a>

                {hasSubs && (
                  <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                    {subs.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate(`/posts?category=${encodeURIComponent(link.label)}&sub_category=${encodeURIComponent(sub)}`);
                        }}
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          padding: '4px 0',
                          cursor: 'pointer'
                        }}
                      >
                        • {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
