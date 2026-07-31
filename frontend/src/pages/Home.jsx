import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingAIBot from '../components/FloatingAIBot';

export const Home = () => {
  const { role, token } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State
  const [stats, setStats] = useState({ members: 0, posts: 0, events: 0 });
  const [latestPosts, setLatestPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [featuredMembers, setFeaturedMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  
  // Search & Map state
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [mapCategory, setMapCategory] = useState('all');

  // Scroll to Top state
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Modal State for Posts
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Map Ref
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Listen to scroll position for Scroll-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper for Member Colors
  const getMemberInitialsColors = (name) => {
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

  // Fetch Public Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/public-stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  // Fetch Latest Approved Posts (Max 3, featured first)
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
        const res = await fetch('/api/posts?status=approved', { headers });
        if (res.ok) {
          const data = await res.json();
          const allPosts = data.data || [];
          const featured = allPosts.filter(p => p.is_featured === 1);
          const normal = allPosts.filter(p => p.is_featured !== 1);
          setLatestPosts([...featured, ...normal].slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching latest posts:', err);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchLatestPosts();
  }, [token]);

  // Fetch Upcoming Events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
        const res = await fetch('/api/events?limit=3&upcoming=true', { headers });
        if (res.ok) {
          const data = await res.json();
          setEvents(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, [token]);

  // Fetch Featured Members
  useEffect(() => {
    const fetchFeaturedMembers = async () => {
      try {
        const res = await fetch('/api/members?status=approved');
        if (res.ok) {
          const data = await res.json();
          const all = data.data || [];
          const featured = all.filter(m => m.is_featured === 1);
          setFeaturedMembers(featured.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured members:', err);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchFeaturedMembers();
  }, []);

  // Leaflet Map Initialization
  useEffect(() => {
    const initLeafletMap = () => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = window.L;
      if (!L) return;

      const map = L.map(mapContainerRef.current).setView([20.7077, 106.7865], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      fetch('/Đồ Sơn.geojson')
        .then(res => res.json())
        .then(geojson => {
          L.geoJSON(geojson, {
            style: {
              color: '#0284c7',
              weight: 3,
              opacity: 0.8,
              fillColor: '#38bdf8',
              fillOpacity: 0.15
            }
          }).addTo(map);
        })
        .catch(err => console.log('GeoJSON load note:', err));

      const locations = [
        { name: "Khu du lịch Đồi Rồng (Dragon Ocean)", lat: 20.695, lng: 106.772, category: "stay", desc: "Resort & Công viên nước" },
        { name: "Đảo Hòn Dấu & Ngọn Hải Đăng", lat: 20.669, lng: 106.814, category: "attractions", desc: "Di tích & Danh thắng" },
        { name: "Bến K15 - Tàu Không Số", lat: 20.676, lng: 106.808, category: "attractions", desc: "Di tích Lịch sử Quốc gia" },
        { name: "Biệt thự Bảo Đại", lat: 20.686, lng: 106.795, category: "attractions", desc: "Điểm tham quan lịch sử" },
        { name: "Nhà hàng Hải Sản Vạn Hương", lat: 20.688, lng: 106.785, category: "food", desc: "Hải sản tươi sống Đồ Sơn" },
        { name: "HTX Táo Bàng Đồ Sơn", lat: 20.720, lng: 106.765, category: "ocop", desc: "Đặc sản OCOP 4 sao" }
      ];

      locations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng]).addTo(map);
        marker.bindPopup(`<b>${loc.name}</b><br/>${loc.desc}`);
      });
    };

    if (window.L) {
      initLeafletMap();
    } else {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initLeafletMap();
      document.body.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const openEventDetail = (event) => {
    if (!token) {
      if (confirm('Vui lòng đăng nhập để xem chi tiết địa điểm và thông tin mô tả sự kiện. Đến trang đăng nhập?')) {
        navigate('/login');
      }
      return;
    }
    setSelectedEvent(event);
    setEventModalOpen(true);
  };

  const handleToggleEventInterest = async (eventId) => {
    if (!token) {
      alert('Vui lòng đăng nhập để thực hiện tính năng này.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`/api/events/${eventId}/interest`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents(prev => prev.map(e => {
          if (e.id === eventId) {
            const diff = data.is_interested ? 1 : -1;
            return {
              ...e,
              is_interested: data.is_interested,
              interest_count: Math.max(0, (e.interest_count || 0) + diff)
            };
          }
          return e;
        }));

        if (selectedEvent && selectedEvent.id === eventId) {
          setSelectedEvent(prev => {
            const diff = data.is_interested ? 1 : -1;
            return {
              ...prev,
              is_interested: data.is_interested,
              interest_count: Math.max(0, (prev.interest_count || 0) + diff)
            };
          });
        }
      } else {
        alert(data.error || 'Có lỗi xảy ra.');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAiQuestionSubmit = (e) => {
    e.preventDefault();
    if (aiQuestion.trim()) {
      navigate(`/ai-chat?q=${encodeURIComponent(aiQuestion)}`);
    }
  };

  // Gradient text style helper
  const gradientTitleStyle = {
    fontFamily: 'var(--font-title, sans-serif)',
    background: 'linear-gradient(135deg, #0c2340 0%, #0284c7 60%, #0369a1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block'
  };

  // Fallback demo posts with rich images matching the user's reference design
  const demoNewsList = [
    {
      id: 1,
      title: 'Tháp Tường Long – di tích lịch sử văn hóa nghìn năm tuổi Hải Phòng',
      image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      author_name: 'Đồi Rồng Đồ Sơn',
      created_at: '10/7/2026',
      is_featured: 1
    },
    {
      id: 2,
      title: 'Hội thảo khoa học "Văn hóa biển trong thời đại Hùng Vương": Làm rõ vị trí, vai trò của biển...',
      image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
      author_name: 'Đồi Rồng Đồ Sơn',
      created_at: '10/7/2026',
      is_featured: 1
    },
    {
      id: 3,
      title: 'Bến tàu không số K15 tại quận Đồ Sơn - Di tích lịch sử Quốc gia đặc biệt',
      image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      author_name: 'Đồi Rồng Đồ Sơn',
      created_at: '10/7/2026',
      is_featured: 0
    }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      <Navbar />

      {/* Floating AI Bot widget */}
      <FloatingAIBot />

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Lướt lên đầu trang"
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            zIndex: 9998,
            transition: 'transform 0.2s ease, opacity 0.2s ease'
          }}
        >
          <i className="ti ti-arrow-up"></i>
        </button>
      )}

      {/* BLOCK 1: Hero Banner */}
      <section 
        id="hero"
        style={{
          background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 50%, #f8fafc 100%)',
          padding: '4rem 1.5rem 3rem',
          textAlign: 'center',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ffffff', border: '1px solid #bae6fd', color: '#0284c7', fontSize: '11px', fontWeight: '700', padding: '5px 14px', borderRadius: '99px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(2, 132, 199, 0.1)' }}>
            <i className="ti ti-sparkles"></i>
            <span>{t('hero_badge_v2')}</span>
          </div>

          {/* Title with Vibrant Theme Gradient */}
          <h1 style={{ ...gradientTitleStyle, fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', lineHeight: '1.25', marginBottom: '1.2rem' }}>
            {t('hero_title_v2')}
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#475569', maxWidth: '820px', margin: '0 auto 2.5rem', lineHeight: '1.7' }}>
            {t('hero_sub_v2')}
          </p>

          {/* Intelligent Search Box */}
          <form 
            onSubmit={handleSearchSubmit}
            style={{
              backgroundColor: '#ffffff',
              padding: '6px 6px 6px 16px',
              borderRadius: '99px',
              boxShadow: '0 10px 30px rgba(12, 35, 64, 0.1), 0 0 0 1px rgba(2, 132, 199, 0.15)',
              display: 'flex',
              alignItems: 'center',
              maxWidth: '750px',
              margin: '0 auto 1.5rem'
            }}
          >
            <i className="ti ti-search" style={{ fontSize: '20px', color: '#0284c7', marginRight: '10px' }}></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('hero_search_place')}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '14px',
                color: '#1e293b',
                background: 'transparent'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '99px',
                padding: '10px 24px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
              }}
            >
              <i className="ti ti-search"></i>
              <span>{t('hero_search_btn')}</span>
            </button>
          </form>

          {/* Quick Search Chips */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: '#64748b', marginBottom: '2.5rem' }}>
            <span style={{ fontWeight: '600' }}>{t('hero_quick_suggest')}</span>
            <button onClick={() => setSearchQuery('Đi đâu cuối tuần')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '3px 10px', color: '#334155', cursor: 'pointer', fontSize: '12px' }}>{t('quick_tag_1')}</button>
            <button onClick={() => setSearchQuery('Ăn hải sản')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '3px 10px', color: '#334155', cursor: 'pointer', fontSize: '12px' }}>{t('quick_tag_2')}</button>
            <button onClick={() => setSearchQuery('Khách sạn ven biển')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '3px 10px', color: '#334155', cursor: 'pointer', fontSize: '12px' }}>{t('quick_tag_3')}</button>
            <button onClick={() => setSearchQuery('Doanh nghiệp Đồ Sơn')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '3px 10px', color: '#334155', cursor: 'pointer', fontSize: '12px' }}>{t('quick_tag_4')}</button>
            <button onClick={() => setSearchQuery('Cơ hội đầu tư')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '3px 10px', color: '#334155', cursor: 'pointer', fontSize: '12px' }}>{t('quick_tag_5')}</button>
          </div>

          {/* 3 Main Hero Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a 
              href="#explore" 
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '14px',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
              }}
            >
              {t('btn_explore_doson')}
            </a>
            <Link 
              to="/ai-chat" 
              style={{
                backgroundColor: '#0369a1',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '14px',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="ti ti-robot"></i>
              {t('btn_ask_ai')}
            </Link>
            <Link 
              to="/register" 
              style={{
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                fontWeight: '700',
                fontSize: '14px',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                border: '1px solid #bae6fd'
              }}
            >
              {t('btn_become_member')}
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* BLOCK 2: Quick Access Shortcuts */}
        <section id="quick-access" style={{ padding: '4rem 0 3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('qa_badge')}</span>
            <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800', marginTop: '6px' }}>{t('qa_title')}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { icon: 'ti-compass', title: t('qa_1_title'), desc: t('qa_1_desc'), link: '#explore', color: '#0284c7', bg: '#e0f2fe' },
              { icon: 'ti-route', title: t('qa_2_title'), desc: t('qa_2_desc'), link: '#itinerary', color: '#10b981', bg: '#d1fae5' },
              { icon: 'ti-bed', title: t('qa_3_title'), desc: t('qa_3_desc'), link: '#tourism', color: '#f59e0b', bg: '#fef3c7' },
              { icon: 'ti-soup', title: t('qa_4_title'), desc: t('qa_4_desc'), link: '#tourism', color: '#ef4444', bg: '#fee2e2' },
              { icon: 'ti-building-store', title: t('qa_5_title'), desc: t('qa_5_desc'), link: '/members', color: '#8b5cf6', bg: '#ede9fe' },
              { icon: 'ti-award', title: t('qa_6_title'), desc: t('qa_6_desc'), link: '#showroom', color: '#ec4899', bg: '#fce7f3' },
              { icon: 'ti-chart-line', title: t('qa_7_title'), desc: t('qa_7_desc'), link: '#investment', color: '#0ea5e9', bg: '#e0f2fe' },
              { icon: 'ti-users', title: t('qa_8_title'), desc: t('qa_8_desc'), link: '#community', color: '#14b8a6', bg: '#ccfbf1' }
            ].map((item, idx) => (
              <a 
                key={idx} 
                href={item.link.startsWith('/') ? undefined : item.link}
                onClick={item.link.startsWith('/') ? () => navigate(item.link) : undefined}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s, boxShadow 0.2s'
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  <i className={`ti ${item.icon}`}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0c2340', margin: '0 0 4px 0' }}>{item.title}</h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* BLOCK 3: AI Assistant Box */}
        <section id="ai-box" style={{ marginBottom: '4rem' }}>
          <div 
            style={{
              backgroundColor: '#0c2340',
              backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(2, 132, 199, 0.3) 0%, transparent 60%)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              color: '#ffffff',
              boxShadow: '0 12px 32px rgba(12, 35, 64, 0.2)'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(2, 132, 199, 0.3)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px', marginBottom: '1rem' }}>
              <i className="ti ti-robot"></i>
              <span>{t('ai_box_badge')}</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: '700', marginBottom: '1.5rem', color: '#ffffff' }}>
              {t('ai_box_title')}
            </h2>

            <form onSubmit={handleAiQuestionSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '800px', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder={t('ai_box_placeholder')}
                style={{
                  flex: 1,
                  minWidth: '260px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="ti ti-send"></i>
                <span>{t('ai_box_btn')}</span>
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '12.5px', color: '#93b4d4' }}>
              <span style={{ fontWeight: '600' }}>{t('ai_prompt_prefix')}</span>
              {[
                t('ai_p1'),
                t('ai_p2'),
                t('ai_p3'),
                t('ai_p4')
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/ai-chat?q=${encodeURIComponent(p)}`)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#e2f0ff',
                    borderRadius: '16px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  📍 {p}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* BLOCK 4: Weather & Today Fast Updates */}
        <section id="today-highlights" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Weather Card */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase' }}>{t('weather_title')}</span>
                <span style={{ fontSize: '11px', backgroundColor: '#d1fae5', color: '#059669', fontWeight: '700', padding: '2px 8px', borderRadius: '99px' }}>{t('weather_status_badge')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1rem' }}>
                <i className="ti ti-sun" style={{ fontSize: '42px', color: '#f59e0b' }}></i>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#0c2340', leading: '1' }}>{t('weather_temp')}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{t('weather_desc')}</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <i className="ti ti-info-circle"></i> {t('weather_source')}
              </div>
            </div>

            {/* Today Fast Update Card */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase', marginBottom: '8px' }}>{t('today_badge')}</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', marginBottom: '8px', lineHeight: '1.4' }}>{t('today_title')}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '1rem' }}>{t('today_desc')}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '12px' }}>
                <span style={{ color: '#94a3b8' }}><i className="ti ti-clock"></i> {t('today_time')}</span>
                <Link to="/events" style={{ color: '#0284c7', fontWeight: '700', textDecoration: 'none' }}>{t('today_link')}</Link>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCK 5: Local Identity (Khám phá Đồ Sơn) */}
        <section id="explore" style={{ marginBottom: '4rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('identity_badge')}</span>
            <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800', marginTop: '4px' }}>{t('identity_title')}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              { title: t('id_1_t'), desc: t('id_1_d'), icon: 'ti-palmtree' },
              { title: t('id_2_t'), desc: t('id_2_d'), icon: 'ti-building-monument' },
              { title: t('id_3_t'), desc: t('id_3_d'), icon: 'ti-masks-theater' },
              { title: t('id_4_t'), desc: t('id_4_d'), icon: 'ti-user-heart' },
              { title: t('id_5_t'), desc: t('id_5_d'), icon: 'ti-book' },
              { title: t('id_6_t'), desc: t('id_6_d'), icon: 'ti-history' }
            ].map((item, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>
                  <i className={`ti ${item.icon}`}></i>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 6: Tourism & Dining Experiences */}
        <section id="tourism" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('tourism_badge')}</span>
              <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800', marginTop: '4px' }}>{t('tourism_title')}</h2>
            </div>
            <Link to="/search" style={{ color: '#0284c7', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>{t('btn_all_services')} &gt;</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              {
                badge: t('tour_item1_badge'),
                verified: t('badge_verified'),
                title: t('tour_item1_t'),
                price: t('tour_item1_price'),
                img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
              },
              {
                badge: t('tour_item2_badge'),
                verified: t('badge_verified'),
                title: t('tour_item2_t'),
                price: t('tour_item2_price'),
                img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
              },
              {
                badge: t('tour_item3_badge'),
                verified: t('badge_verified'),
                title: t('tour_item3_t'),
                price: t('tour_item3_price'),
                img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
              }
            ].map((item, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(12,35,64,0.85)', color: '#ffffff', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '6px' }}>{item.badge}</span>
                  <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#d1fae5', color: '#059669', fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px' }}>{item.verified}</span>
                </div>
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', marginBottom: '8px' }}>{item.title}</h3>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#ef4444', marginBottom: '1rem' }}>{item.price}</div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto', display: 'flex', gap: '8px' }}>
                    <button onClick={() => navigate(`/ai-chat?q=${encodeURIComponent(item.title)}`)} style={{ flex: 1, backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: '#334155' }}>
                      <i className="ti ti-robot"></i> {t('btn_ask_ai_short')}
                    </button>
                    <a href="#map" style={{ flex: 1, backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '6px', padding: '8px', fontSize: '12px', fontWeight: '700', color: '#0284c7', textDecoration: 'none', textAlign: 'center' }}>
                      <i className="ti ti-map-pin"></i> {t('btn_directions')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 7: Suggested Itineraries */}
        <section id="itinerary" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('itin_badge')}</span>
              <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800', marginTop: '4px' }}>{t('itin_title')}</h2>
            </div>
            <Link to="/ai-chat" style={{ backgroundColor: '#0284c7', color: '#ffffff', fontWeight: '700', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none' }}>
              {t('btn_custom_ai')}
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {[
              { tag: t('itin1_tag'), title: t('itin1_t'), steps: t('itin1_s') },
              { tag: t('itin2_tag'), title: t('itin2_t'), steps: t('itin2_s') },
              { tag: t('itin3_tag'), title: t('itin3_t'), steps: t('itin3_s') }
            ].map((tour, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '3px 10px', borderRadius: '6px', width: 'fit-content', marginBottom: '10px' }}>{tour.tag}</span>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0c2340', marginBottom: '10px' }}>{tour.title}</h3>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', flex: 1, marginBottom: '1.2rem' }}>📍 {tour.steps}</p>
                <button 
                  onClick={() => alert('Đã lưu hành trình vào tài khoản cá nhân!')}
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer' }}
                >
                  <i className="ti ti-bookmark"></i> {t('btn_save_itin')}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 8: Digital Showroom (Doanh nghiệp & OCOP) */}
        <section id="showroom" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('showroom_badge')}</span>
              <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800', marginTop: '4px' }}>{t('showroom_title')}</h2>
            </div>
            <Link to="/members" style={{ color: '#0284c7', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>{t('btn_all_biz')} &gt;</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {[
              {
                badge: t('sr1_badge'),
                status: t('badge_verified'),
                title: t('sr1_t'),
                desc: t('sr1_d')
              },
              {
                badge: t('sr2_badge'),
                status: t('sr2_tag'),
                title: t('sr2_t'),
                desc: t('sr2_d')
              },
              {
                badge: t('sr3_badge'),
                status: t('badge_verified'),
                title: t('sr3_t'),
                desc: t('sr3_d')
              }
            ].map((item, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600' }}>{item.badge}</span>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>{item.status}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', flex: 1, marginBottom: '1.2rem' }}>{item.desc}</p>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', gap: '8px' }}>
                  <Link to="/members" style={{ flex: 1, backgroundColor: '#0284c7', color: '#ffffff', textAlign: 'center', borderRadius: '6px', padding: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                    {t('btn_view_profile')}
                  </Link>
                  <Link to="/guide" style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#334155', textAlign: 'center', borderRadius: '6px', padding: '8px', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>
                    {t('btn_contact_now')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 9: Investment & Collaboration (Dark Container) */}
        <section id="investment" style={{ marginBottom: '4rem' }}>
          <div 
            style={{
              backgroundColor: '#0c2340',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              color: '#ffffff',
              boxShadow: '0 12px 32px rgba(12, 35, 64, 0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('invest_badge')}</span>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>{t('invest_title')}</h2>
              </div>
              <Link to="/register" style={{ backgroundColor: '#0284c7', color: '#ffffff', fontWeight: '700', fontSize: '13px', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none' }}>
                {t('btn_post_proposal')}
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {[
                { owner: t('inv1_owner'), title: t('inv1_t'), target: t('inv1_target'), date: t('inv1_date') },
                { owner: t('inv2_owner'), title: t('inv2_t'), target: t('inv2_target'), date: t('inv2_date') },
                { owner: t('inv3_owner'), title: t('inv3_t'), target: t('inv3_target'), date: t('inv3_date') }
              ].map((item, idx) => (
                <div key={idx} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '600', marginBottom: '6px' }}>🔹 {item.owner}</span>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '10px', lineHeight: '1.4' }}>{item.title}</h3>
                  <div style={{ fontSize: '12.5px', color: '#93b4d4', marginBottom: '6px' }}>{item.target}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '1.2rem' }}>🕒 {item.date}</div>
                  <Link to="/register" style={{ marginTop: 'auto', backgroundColor: '#0284c7', color: '#ffffff', textAlign: 'center', borderRadius: '6px', padding: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                    {t('btn_connect_now')}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BLOCK 10: Events & Festivals */}
        <section id="events" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('events_badge')}</span>
              <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800', marginTop: '4px' }}>{t('events_title')}</h2>
            </div>
            <Link to="/events" style={{ color: '#0284c7', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>{t('btn_all_events')} &gt;</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {loadingEvents ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                <i className="ti ti-loader animate-spin" style={{ fontSize: '24px', display: 'block', margin: '0 auto 10px' }}></i> {t('loading_events_list')}
              </div>
            ) : events.length > 0 ? (
              events.map((e) => {
                const dateStr = e.event_date ? new Date(e.event_date).toLocaleDateString('vi-VN') : '15/07/2026';
                return (
                  <div key={e.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', backgroundColor: '#e0f2fe', color: '#0284c7', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>SẮP DIỄN RA</span>
                      <button 
                        onClick={() => handleToggleEventInterest(e.id)}
                        style={{ background: 'none', border: 'none', color: e.is_interested ? '#f59e0b' : '#94a3b8', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <i className={e.is_interested ? "ti ti-star-filled" : "ti ti-star"}></i>
                        <span style={{ fontSize: '12px' }}>{e.interest_count || 0}</span>
                      </button>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', marginBottom: '8px' }}>{e.title}</h3>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>📅 {dateStr}</div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '1rem' }}>🏛️ {e.organizer || 'Đồ Sơn'}</div>
                    <button onClick={() => openEventDetail(e)} style={{ marginTop: 'auto', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>
                      {t('btn_view_details')}
                    </button>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                {t('no_upcoming_events')}
              </div>
            )}
          </div>
        </section>

        {/* BLOCK 11: Community Network */}
        <section id="community" style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('community_badge')}</span>
            <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800', marginTop: '4px' }}>{t('community_title')}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { title: t('com1_t'), desc: t('com1_d') },
              { title: t('com2_t'), desc: t('com2_d') },
              { title: t('com3_t'), desc: t('com3_d') }
            ].map((com, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0c2340', marginBottom: '10px' }}>{com.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', flex: 1, marginBottom: '1.2rem' }}>{com.desc}</p>
                <Link to="/register" style={{ backgroundColor: '#0284c7', color: '#ffffff', textAlign: 'center', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
                  {t('btn_join_community')}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 12: News & Articles - Redesigned Cards with Image Thumbnails (Max 3, Direct Link to Detail Page) */}
        <section id="news" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('news_badge')}</span>
              <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800', marginTop: '4px' }}>{t('news_title')}</h2>
            </div>
            <Link to="/posts" style={{ color: '#0284c7', fontWeight: '700', fontSize: '14px', textDecoration: 'none', backgroundColor: 'rgba(2, 132, 199, 0.08)', padding: '6px 14px', borderRadius: '99px' }}>
              {t('btn_all_news')} &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {(latestPosts.length > 0 ? latestPosts : demoNewsList).slice(0, 3).map((post) => {
              const imageUrl = post.image_url || post.image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80";
              const dateStr = post.created_at ? (new Date(post.created_at).toLocaleDateString('vi-VN') !== 'Invalid Date' ? new Date(post.created_at).toLocaleDateString('vi-VN') : post.created_at) : '10/7/2026';
              const publisherName = post.author_name || post.company_name || "Đồi Rồng Đồ Sơn";
              
              return (
                <div 
                  key={post.id}
                  onClick={() => navigate(`/posts/${post.id}`)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(12, 35, 64, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.25s ease, boxShadow 0.25s ease'
                  }}
                >
                  {/* Thumbnail Image Header */}
                  <div style={{ height: '180px', position: 'relative', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                    <img 
                      src={imageUrl} 
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {post.is_featured === 1 && (
                      <span 
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: '#f59e0b',
                          color: '#000000',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                          letterSpacing: '0.04em'
                        }}
                      >
                        NỔI BẬT ⭐
                      </span>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 
                      style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#0c2340',
                        lineHeight: '1.5',
                        marginBottom: '1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '4.5em'
                      }}
                    >
                      {post.title}
                    </h3>

                    {/* Publisher Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                      <div 
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: '#e0f2fe',
                          color: '#0284c7',
                          fontSize: '10px',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #bae6fd'
                        }}
                      >
                        ĐÔ
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                        {publisherName}
                      </span>
                    </div>

                    {/* Footer Row: Date + Đọc bài Button */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                        {dateStr}
                      </span>
                      <button
                        onClick={(evt) => {
                          evt.stopPropagation();
                          navigate(`/posts/${post.id}`);
                        }}
                        style={{
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
                        }}
                      >
                        Đọc bài
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="map" style={{ marginBottom: '4rem' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase' }}>{t('map_badge')}</span>
                <h2 style={{ ...gradientTitleStyle, fontSize: '24px', fontWeight: '800', marginTop: '2px' }}>{t('map_title')}</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => alert('GPS location enabled')} style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>📍 {t('map_gps_btn')}</button>
                <button onClick={() => navigate('/ai-chat')} style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>🤖 {t('map_ask_ai_btn')}</button>
              </div>
            </div>

            {/* Category Filters */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '1rem' }}>
              {['all', 'attractions', 'stay', 'food', 'biz', 'ocop', 'utilities'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMapCategory(cat)}
                  style={{
                    backgroundColor: mapCategory === cat ? '#0284c7' : '#f1f5f9',
                    color: mapCategory === cat ? '#ffffff' : '#334155',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t(`map_filter_${cat}`)}
                </button>
              ))}
            </div>

            {/* Leaflet Map Canvas */}
            <div 
              ref={mapContainerRef} 
              style={{ width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', zIndex: 1 }}
            />
          </div>
        </section>

        {/* BLOCK 14: Ecosystem Roles */}
        <section id="roles" style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('join_badge')}</span>
            <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800', marginTop: '4px' }}>{t('join_title')}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { title: t('role1_t'), desc: t('role1_d'), btn: t('role1_btn') },
              { title: t('role2_t'), desc: t('role2_d'), btn: t('role2_btn') },
              { title: t('role3_t'), desc: t('role3_d'), btn: t('role3_btn') },
              { title: t('role4_t'), desc: t('role4_d'), btn: t('role4_btn') }
            ].map((roleItem, idx) => (
              <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', marginBottom: '8px' }}>{roleItem.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', flex: 1, marginBottom: '1.2rem' }}>{roleItem.desc}</p>
                <Link to="/register" style={{ backgroundColor: '#0284c7', color: '#ffffff', textAlign: 'center', borderRadius: '8px', padding: '8px', fontSize: '12.5px', fontWeight: '700', textDecoration: 'none' }}>
                  {roleItem.btn}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 15: Newsletter Subscription */}
        <section id="newsletter" style={{ marginBottom: '4rem' }}>
          <div style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '20px', padding: '2.5rem 2rem', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t('nl_badge')}</span>
            <h2 style={{ ...gradientTitleStyle, fontSize: '26px', fontWeight: '800', marginTop: '4px', marginBottom: '8px' }}>{t('nl_title')}</h2>
            <p style={{ fontSize: '14px', color: '#475569', maxWidth: '600px', margin: '0 auto 1.5rem' }}>{t('nl_sub')}</p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã đăng ký nhận bản tin Doson.today!'); }} style={{ display: 'flex', gap: '10px', maxWidth: '550px', margin: '0 auto 1rem', flexWrap: 'wrap' }}>
              <input
                type="email"
                required
                placeholder={t('nl_placeholder')}
                style={{ flex: 1, minWidth: '240px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
              <button type="submit" style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px 20px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                {t('nl_btn')}
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '12.5px', color: '#475569' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> {t('nl_cb1')}</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> {t('nl_cb2')}</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> {t('nl_cb3')}</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> {t('nl_cb4')}</label>
            </div>
          </div>
        </section>

        {/* BLOCK 16: Partners Logo Bar */}
        <section id="partners" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
            {t('partners_badge')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap', opacity: 0.75, fontWeight: '800', color: '#0c2340', fontSize: '15px' }}>
            <span>ADT GROUP</span>
            <span>DOSON TOURISM</span>
            <span>OCOP HẢI PHÒNG</span>
            <span>HIỆP HỘI DOANH NGHIỆP ĐỒ SƠN</span>
          </div>
        </section>

      </div>

      <Footer />

      {/* Event Details Modal */}
      {eventModalOpen && selectedEvent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,14,30,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '550px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', margin: 0 }}>
                📅 {t('event_details_title')}
              </h3>
              <button onClick={() => setEventModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            
            <div style={{ marginBottom: '1.5rem', maxHeight: '50vh', overflowY: 'auto', textAlign: 'left' }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#0284c7', fontWeight: '700' }}>{t('label_event_name')}</span>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0c2340' }}>{selectedEvent.title}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#0284c7', fontWeight: '700' }}>{t('label_organizer')}</span>
                <div style={{ fontSize: '13px', color: '#334155' }}>{selectedEvent.organizer || 'Đồ Sơn'}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#0284c7', fontWeight: '700' }}>{t('label_location')}</span>
                <div style={{ fontSize: '13px', color: '#334155' }}>{selectedEvent.location || 'Đồ Sơn, Hải Phòng'}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#0284c7', fontWeight: '700' }}>{t('label_event_description')}</span>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>{selectedEvent.description || 'Không có mô tả chi tiết cho sự kiện này.'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => handleToggleEventInterest(selectedEvent.id)}
                style={{ backgroundColor: selectedEvent.is_interested ? '#fef3c7' : '#f1f5f9', color: selectedEvent.is_interested ? '#d97706' : '#334155', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                <i className={selectedEvent.is_interested ? "ti ti-star-filled" : "ti ti-star"}></i> {selectedEvent.is_interested ? "Đã quan tâm" : "Quan tâm sự kiện"}
              </button>
              <button onClick={() => setEventModalOpen(false)} style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                {t('btn_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
