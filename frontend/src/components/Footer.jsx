import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer style={{ backgroundColor: '#0c2340', color: '#93b4d4', padding: '4rem 0 2rem', fontSize: '13px', borderTop: '1px solid rgba(2, 132, 199, 0.2)' }}>
      <div className="public-container" style={{ margin: '0 auto', maxWidth: '1360px', padding: '0 1.5rem' }}>
        {/* 5-Column Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Column 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-title, sans-serif)', fontSize: '20px', fontWeight: '800', color: '#ffffff', marginBottom: '1.2rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/doson_logo.png" alt="Logo" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
              </div>
              Đồ Sơn Today
            </div>
            <p style={{ lineHeight: '1.6', marginBottom: '1.2rem', color: '#93b4d4', fontSize: '12.5px' }}>
              Nền tảng kết nối cộng đồng, doanh nghiệp, du lịch, đầu tư và quảng bá Đồ Sơn tích hợp trí tuệ nhân tạo (AI). Cửa ngõ mở hiện đại, thân thiện và giàu bản sắc.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#cbd5e1', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><i className="ti ti-map-pin" style={{ color: '#38bdf8', marginTop: '2px' }}></i> 26 TT23, KĐT Văn Phú, Phường Kiến Hưng, Hà Nội</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><i className="ti ti-building" style={{ color: '#38bdf8', marginTop: '2px' }}></i> Văn phòng Đồ Sơn: Phường Đồ Sơn, TP. Hải Phòng</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}><i className="ti ti-mail" style={{ color: '#38bdf8' }}></i> info@adtgroup.net</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}><i className="ti ti-phone" style={{ color: '#38bdf8' }}></i> 0986 354 152</div>
            </div>
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="#" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2f0ff' }} title="Facebook"><i className="ti ti-brand-facebook"></i></a>
              <a href="#" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2f0ff' }} title="YouTube"><i className="ti ti-brand-youtube"></i></a>
              <a href="#" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2f0ff' }} title="TikTok"><i className="ti ti-brand-tiktok"></i></a>
              <a href="#" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2f0ff' }} title="Zalo"><i className="ti ti-message"></i></a>
            </div>
          </div>

          {/* Column 2: Khám phá Đồ Sơn */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('footer_col2_title')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <a href="#explore" style={{ color: '#93b4d4', textDecoration: 'none' }}>Tổng quan Đồ Sơn</a>
              <a href="#tourism" style={{ color: '#93b4d4', textDecoration: 'none' }}>Điểm đến du lịch</a>
              <a href="#tourism" style={{ color: '#93b4d4', textDecoration: 'none' }}>Ẩm thực & Hải sản</a>
              <a href="#tourism" style={{ color: '#93b4d4', textDecoration: 'none' }}>Lưu trú & Resort</a>
              <Link to="/events" style={{ color: '#93b4d4', textDecoration: 'none' }}>Sự kiện & Lễ hội</Link>
              <a href="#map" style={{ color: '#93b4d4', textDecoration: 'none' }}>Bản đồ số Đồ Sơn</a>
              <Link to="/guide" style={{ color: '#93b4d4', textDecoration: 'none' }}>Cẩm nang du khách</Link>
            </div>
          </div>

          {/* Column 3: Kết nối & Hợp tác */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('footer_col3_title')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <Link to="/members" style={{ color: '#93b4d4', textDecoration: 'none' }}>Danh bạ doanh nghiệp</Link>
              <a href="#showroom" style={{ color: '#93b4d4', textDecoration: 'none' }}>Sản phẩm OCOP Đồ Sơn</a>
              <a href="#investment" style={{ color: '#93b4d4', textDecoration: 'none' }}>Cơ hội đầu tư</a>
              <Link to="/posts" style={{ color: '#93b4d4', textDecoration: 'none' }}>Nhu cầu mua - bán</Link>
              <a href="#community" style={{ color: '#93b4d4', textDecoration: 'none' }}>Cộng đồng Đồ Sơn xa quê</a>
              <Link to="/register" style={{ color: '#93b4d4', textDecoration: 'none' }}>Trở thành thành viên</Link>
              <Link to="/register" style={{ color: '#93b4d4', textDecoration: 'none' }}>Đăng ký hồ sơ DN</Link>
            </div>
          </div>

          {/* Column 4: Trung tâm trợ giúp */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('footer_col4_title')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <Link to="/ai-chat" style={{ color: '#93b4d4', textDecoration: 'none' }}>Trợ lý AI Hướng dẫn</Link>
              <Link to="/guide" style={{ color: '#93b4d4', textDecoration: 'none' }}>Hướng dẫn tạo hồ sơ</Link>
              <Link to="/guide" style={{ color: '#93b4d4', textDecoration: 'none' }}>Liên hệ hỗ trợ</Link>
              <a href="tel:0986354152" style={{ color: '#93b4d4', textDecoration: 'none' }}>Hotline phản hồi</a>
              <a href="#" style={{ color: '#93b4d4', textDecoration: 'none' }}>Sơ đồ trang web</a>
            </div>
          </div>

          {/* Column 5: Pháp lý & Chính sách */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('footer_col5_title')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <a href="#" style={{ color: '#93b4d4', textDecoration: 'none' }}>Điều khoản sử dụng</a>
              <a href="#" style={{ color: '#93b4d4', textDecoration: 'none' }}>Chính sách bảo mật</a>
              <a href="#" style={{ color: '#93b4d4', textDecoration: 'none' }}>Chính sách Cookie</a>
              <a href="#" style={{ color: '#93b4d4', textDecoration: 'none' }}>Chính sách sử dụng AI</a>
              <a href="#" style={{ color: '#93b4d4', textDecoration: 'none' }}>Miễn trừ trách nhiệm</a>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner Box */}
        <div 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '1.5rem',
            fontSize: '11.5px',
            color: '#94a3b8',
            lineHeight: '1.6'
          }}
        >
          <strong style={{ color: '#f87171' }}>📌 {t('footer_disclaimer')}</strong>
        </div>

        {/* Bottom Rights & Links Row */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '11.5px',
            color: '#64748b'
          }}
        >
          <div>
            © 2026 <strong>Doson.today</strong>. Bản quyền thuộc về ADT Group. Cập nhật ngày: 28/07/2026.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '11.5px' }}>
              {t('footer_cookie_opt')}
            </button>
            <span>|</span>
            <span>{t('footer_licence')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
