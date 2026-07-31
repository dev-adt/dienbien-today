import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

export const Navbar = () => {
  const { role, user, logout } = useAuth();
  const { currentLang, changeLang, t, getLangDetails, LANGS } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('public-body');
    document.body.classList.remove('light-theme');
  }, []);

  const getInitials = (name) => {
    if (!name) return 'DS';
    return name.trim().split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleAnchorClick = (e, anchor) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.querySelector(anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/' + anchor);
    }
  };

  const currentLangDetails = getLangDetails();

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 12px rgba(12, 35, 64, 0.06)'
      }}
    >
      <nav 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1.5rem',
          maxWidth: '1360px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        {/* Brand Logo & Name */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0c2340 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)'
            }}
          >
            <img src="/doson_logo.png" alt="Đồ Sơn Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-title, sans-serif)', fontSize: '19px', fontWeight: '800', color: '#0c2340', lineHeight: '1.1' }}>
              Đồ Sơn
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>
              Nền tảng kết nối & quảng bá
            </div>
          </div>
        </Link>

        {/* Navigation Links - 1 Row */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="nav-link nav-dropdown" style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '13.5px' }}>
              {t('nav_explore')} <i className="ti ti-chevron-down" style={{ fontSize: '10px', marginLeft: '2px' }}></i>
            </span>
            <div className="nav-dropdown-menu">
              <a href="#explore" onClick={(e) => handleAnchorClick(e, '#explore')} className="nav-dropdown-item">Tổng quan Đồ Sơn</a>
              <a href="#explore" onClick={(e) => handleAnchorClick(e, '#explore')} className="nav-dropdown-item">Lịch sử & Di tích</a>
              <a href="#explore" onClick={(e) => handleAnchorClick(e, '#explore')} className="nav-dropdown-item">Văn hóa & Lễ hội</a>
            </div>
          </div>

          <div className="nav-link nav-dropdown" style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '13.5px' }}>
              {t('nav_tourism')} <i className="ti ti-chevron-down" style={{ fontSize: '10px', marginLeft: '2px' }}></i>
            </span>
            <div className="nav-dropdown-menu">
              <a href="#tourism" onClick={(e) => handleAnchorClick(e, '#tourism')} className="nav-dropdown-item">Điểm đến nổi bật</a>
              <a href="#tourism" onClick={(e) => handleAnchorClick(e, '#tourism')} className="nav-dropdown-item">Nơi lưu trú & Resort</a>
              <a href="#tourism" onClick={(e) => handleAnchorClick(e, '#tourism')} className="nav-dropdown-item">Ẩm thực & Hải sản</a>
              <a href="#itinerary" onClick={(e) => handleAnchorClick(e, '#itinerary')} className="nav-dropdown-item">Lịch trình gợi ý</a>
            </div>
          </div>

          <div className="nav-link nav-dropdown" style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '13.5px' }}>
              {t('nav_business')} <i className="ti ti-chevron-down" style={{ fontSize: '10px', marginLeft: '2px' }}></i>
            </span>
            <div className="nav-dropdown-menu">
              <Link to="/members" className="nav-dropdown-item">Danh bạ doanh nghiệp</Link>
              <a href="#showroom" onClick={(e) => handleAnchorClick(e, '#showroom')} className="nav-dropdown-item">Sản phẩm OCOP tiêu biểu</a>
              <Link to="/posts" className="nav-dropdown-item">Nhu cầu mua - bán</Link>
            </div>
          </div>

          <div className="nav-link nav-dropdown" style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '13.5px' }}>
              {t('nav_investment')} <i className="ti ti-chevron-down" style={{ fontSize: '10px', marginLeft: '2px' }}></i>
            </span>
            <div className="nav-dropdown-menu">
              <a href="#investment" onClick={(e) => handleAnchorClick(e, '#investment')} className="nav-dropdown-item">Dự án & Cơ hội hợp tác</a>
              <a href="#investment" onClick={(e) => handleAnchorClick(e, '#investment')} className="nav-dropdown-item">Lĩnh vực tiềm năng</a>
            </div>
          </div>

          <div className="nav-link nav-dropdown" style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '13.5px' }}>
              {t('nav_community')} <i className="ti ti-chevron-down" style={{ fontSize: '10px', marginLeft: '2px' }}></i>
            </span>
            <div className="nav-dropdown-menu">
              <a href="#community" onClick={(e) => handleAnchorClick(e, '#community')} className="nav-dropdown-item">Người Đồ Sơn xa quê</a>
              <a href="#community" onClick={(e) => handleAnchorClick(e, '#community')} className="nav-dropdown-item">Chuyên gia & Cố vấn</a>
              <a href="#community" onClick={(e) => handleAnchorClick(e, '#community')} className="nav-dropdown-item">CLB Doanh nhân</a>
            </div>
          </div>

          <Link to="/events" className="nav-link" style={{ fontWeight: '600', color: '#1e293b', fontSize: '13.5px', textDecoration: 'none' }}>
            {t('nav_news')}
          </Link>

          <Link 
            to="/ai-chat" 
            className="nav-link"
            style={{
              fontWeight: '700',
              color: '#0284c7',
              fontSize: '13px',
              textDecoration: 'none',
              backgroundColor: '#e0f2fe',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <i className="ti ti-sparkles" style={{ fontSize: '14px' }}></i>
            {t('nav_ai')}
          </Link>
        </div>

        {/* Right side Actions: Search + Lang Switcher + User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Search Button */}
          <Link 
            to="/search" 
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
              textDecoration: 'none',
              fontSize: '16px'
            }}
            title="Tìm kiếm"
          >
            <i className="ti ti-search"></i>
          </Link>

          {/* Language Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#1e293b',
                fontSize: '12px',
                fontWeight: '600',
                padding: '4px 10px',
                borderRadius: '99px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{currentLangDetails.flag}</span>
              <span>{currentLangDetails.label}</span>
              <i className="ti ti-chevron-down" style={{ fontSize: '10px' }}></i>
            </button>
            {langOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '4px 0',
                  minWidth: '110px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  zIndex: 2000
                }}
              >
                {Object.keys(LANGS).map((langKey) => (
                  <button
                    key={langKey}
                    onClick={() => {
                      changeLang(langKey);
                      setLangOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '6px 12px',
                      background: 'none',
                      border: 'none',
                      color: currentLang === langKey ? '#0284c7' : '#334155',
                      textAlign: 'left',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: currentLang === langKey ? '#f0f9ff' : 'transparent',
                      fontWeight: currentLang === langKey ? '700' : '400'
                    }}
                  >
                    <span>{LANGS[langKey].flag}</span>
                    <span>{LANGS[langKey].label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Auth Info / Avatar */}
          {role === 'guest' ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
              <Link to="/login" style={{ color: '#0c2340', textDecoration: 'none', fontWeight: '600' }}>
                {t('menu_login')}
              </Link>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <Link to="/register" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: '700' }}>
                {t('menu_register')}
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to={role === 'admin' ? "/admin-dashboard" : "/member-dashboard"}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#0c2340',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none'
                }}
                title={user?.name || 'Dashboard'}
              >
                {getInitials(user?.name)}
              </Link>
              <button
                onClick={() => logout()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title={t('menu_logout')}
              >
                <i className="ti ti-logout"></i>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0c2340',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'none',
              padding: '4px'
            }}
          >
            <i className={mobileMenuOpen ? "ti ti-x" : "ti ti-menu-2"}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Links Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          <a href="#explore" onClick={(e) => { handleAnchorClick(e, '#explore'); setMobileMenuOpen(false); }} style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '600' }}>{t('nav_explore')}</a>
          <a href="#tourism" onClick={(e) => { handleAnchorClick(e, '#tourism'); setMobileMenuOpen(false); }} style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '600' }}>{t('nav_tourism')}</a>
          <Link to="/members" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '600' }}>{t('nav_business')}</Link>
          <a href="#investment" onClick={(e) => { handleAnchorClick(e, '#investment'); setMobileMenuOpen(false); }} style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '600' }}>{t('nav_investment')}</a>
          <a href="#community" onClick={(e) => { handleAnchorClick(e, '#community'); setMobileMenuOpen(false); }} style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '600' }}>{t('nav_community')}</a>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '600' }}>{t('nav_news')}</Link>
          <Link to="/ai-chat" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0284c7', fontWeight: '700' }}>{t('nav_ai')}</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
