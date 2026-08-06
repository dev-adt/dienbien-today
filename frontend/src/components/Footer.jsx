import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';

export const Footer = () => {
  const { t } = useTranslation();
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setSubscribed(true);
      setEmailSub('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer id="footer" style={{ backgroundColor: '#0E1320', color: '#94A3B8', padding: '4.5rem 0 2rem', fontSize: '13px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontFamily: 'var(--font-body)' }}>
      <div className="public-container" style={{ margin: '0 auto', maxWidth: '1360px', padding: '0 1.5rem' }}>
        
        {/* Newsletter Subscription Banner (Requirement 17) */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(11, 95, 255, 0.15) 0%, rgba(20, 184, 106, 0.15) 100%)',
            border: '1px solid rgba(11, 95, 255, 0.3)',
            borderRadius: '24px',
            padding: '2rem 2.5rem',
            marginBottom: '3.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div>
            <h3 style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: '800', marginBottom: '4px', fontFamily: 'var(--font-title)' }}>
              📫 Đăng ký Nhận tin Thương hiệu Số Điện Biên
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.88rem' }}>
              Cập nhật sự kiện Lễ hội Hoa Ban, cơ hội xúc tiến đầu tư & bản tin trí tuệ nhân tạo định kỳ.
            </p>
          </div>

          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', minWidth: '320px', flex: '1 1 320px', maxWidth: '480px' }}>
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(22, 29, 47, 0.8)',
                color: '#ffffff',
                outline: 'none',
                fontSize: '0.88rem'
              }}
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #0B5FFF 0%, #14B86A 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {subscribed ? 'Đã đăng ký! ✓' : 'Đăng ký ngay'}
            </button>
          </form>
        </div>

        {/* 5-Column Main Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '2.5rem', marginBottom: '3.5rem' }}>
          
          {/* Column 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
              <img src="/dienbien_logo.svg" alt="Dienbien.today" style={{ height: '42px', width: 'auto' }} />
            </div>
            <p style={{ lineHeight: '1.6', marginBottom: '1.2rem', color: '#94A3B8', fontSize: '12.5px' }}>
              Cổng thông tin & Nền tảng Thương hiệu Số chính thức đại diện tỉnh Điện Biên. Kết nối Việt Nam và Thế giới.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#CBD5E1', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><i className="ti ti-map-pin" style={{ color: '#0B5FFF', marginTop: '2px' }}></i> Phường Điện Biên Phủ, Tỉnh Điện Biên</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><i className="ti ti-mail" style={{ color: '#14B86A' }}></i> info@dienbien.today</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><i className="ti ti-phone" style={{ color: '#F6B800' }}></i> (0215) 3.825.888</div>
            </div>
          </div>

          {/* Column 2: Khám phá & Du lịch */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '800', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Khám Phá Điện Biên
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <a href="#hero" style={{ color: '#94A3B8', textDecoration: 'none' }}>Di tích Lịch sử 1954</a>
              <a href="#diem-den" style={{ color: '#94A3B8', textDecoration: 'none' }}>Đồi A1 & Hầm Đờ Cát</a>
              <a href="#diem-den" style={{ color: '#94A3B8', textDecoration: 'none' }}>Sở chỉ huy Mường Phăng</a>
              <a href="#diem-den" style={{ color: '#94A3B8', textDecoration: 'none' }}>Hồ Pá Khoang & Đèo Pha Đin</a>
              <a href="#van-hoa" style={{ color: '#94A3B8', textDecoration: 'none' }}>Văn hóa Dân tộc Thái, Mông</a>
            </div>
          </div>

          {/* Column 3: Xúc tiến & Doanh nghiệp */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '800', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Kinh Tế & Đầu Tư
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <a href="#dau-tu" style={{ color: '#94A3B8', textDecoration: 'none' }}>Cơ hội Đầu tư FDI</a>
              <a href="#dau-tu" style={{ color: '#94A3B8', textDecoration: 'none' }}>Khu công nghiệp Nam Mường Thanh</a>
              <a href="#dau-tu" style={{ color: '#94A3B8', textDecoration: 'none' }}>Cửa khẩu Quốc tế Tây Trang</a>
              <a href="#ocop" style={{ color: '#94A3B8', textDecoration: 'none' }}>Đặc sản OCOP 5 Sao</a>
              <a href="#doanh-nghiep" style={{ color: '#94A3B8', textDecoration: 'none' }}>Danh bạ Doanh nghiệp Số</a>
            </div>
          </div>

          {/* Column 4: AI & Hỗ trợ */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '800', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Công Nghệ AI Native
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <a href="#ai-assistant" style={{ color: '#94A3B8', textDecoration: 'none' }}>Trợ lý AI Điện Biên 24/7</a>
              <a href="#ai-assistant" style={{ color: '#94A3B8', textDecoration: 'none' }}>Lên Lịch trình Du lịch AI</a>
              <a href="#ai-assistant" style={{ color: '#94A3B8', textDecoration: 'none' }}>Tra cứu Quy hoạch AI</a>
              <a href="#ai-assistant" style={{ color: '#94A3B8', textDecoration: 'none' }}>Dịch tự động 9 Ngôn ngữ</a>
            </div>
          </div>

          {/* Column 5: Social Channels & QR Code (Requirement 17) */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '800', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Kết Nối Mạng Xã Hội & QR
            </h4>
            
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1.2rem' }}>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF0000', fontSize: '1.2rem' }} title="YouTube"><i className="ti ti-brand-youtube"></i></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1877F2', fontSize: '1.2rem' }} title="Facebook"><i className="ti ti-brand-facebook"></i></a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '1.2rem' }} title="TikTok"><i className="ti ti-brand-tiktok"></i></a>
              <a href="https://zalo.me" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0068FF', fontSize: '1.2rem' }} title="Zalo OA"><i className="ti ti-message-circle-2"></i></a>
            </div>

            {/* QR Code Container */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '56px', height: '56px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/favicon.svg" alt="QR Code" style={{ width: '100%', height: '100%' }} />
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1' }}>
                <div style={{ fontWeight: '700', color: '#ffffff' }}>Zalo OA & App Mobile</div>
                <div>Quét QR để trải nghiệm AI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '12px', color: '#64748B' }}>
          <div>
            © 2026 <strong>Dienbien.today</strong> — Digital City Brand Powered by AI. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Bản quyền thông tin UBND Tỉnh Điện Biên</span>
            <span>|</span>
            <span>Kiến trúc AI Native Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
