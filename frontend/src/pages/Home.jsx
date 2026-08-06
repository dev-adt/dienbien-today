import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingAIBot from '../components/FloatingAIBot';
import InteractiveMap from '../components/InteractiveMap';
import SEOHead from '../components/SEOHead';

export const Home = () => {
  const { role, token } = useAuth();
  const { t, currentLang } = useTranslation();
  const navigate = useNavigate();

  // Typing Effect State (Types once on enter, then stays static on 1st sentence)
  const heroTitleText = "Điện Biên kết nối Việt Nam và Thế giới bằng Trí tuệ nhân tạo";
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    if (isTypingDone) return;

    if (charIndex < heroTitleText.length) {
      const timer = setTimeout(() => {
        setDisplayText(heroTitleText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timer);
    } else {
      setIsTypingDone(true);
    }
  }, [charIndex, isTypingDone]);

  // Realtime Weather State (Open-Meteo API for Điện Biên Phủ: 21.3857, 103.0188)
  const [weatherData, setWeatherData] = useState({
    temp: 24,
    desc: 'Thời tiết Điện Biên mát mẻ, thích hợp du lịch & khám phá',
    time: 'Vừa cập nhật',
    icon: 'ti-sun',
    aqi: 'Tốt (AQI 32)',
    loading: true
  });

  // Modal State for Destination & Detail
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [activeCultureTab, setActiveCultureTab] = useState('gallery');

  // Fetch Live Weather for Điện Biên Phủ
  useEffect(() => {
    const fetchLiveWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=21.3857&longitude=103.0188&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FHo_Chi_Minh'
        );
        if (res.ok) {
          const data = await res.json();
          const current = data.current;
          if (current) {
            const temp = Math.round(current.temperature_2m);
            const wind = Math.round(current.wind_speed_10m);
            const code = current.weather_code;

            let desc = 'Trời trong xanh, khí hậu núi rừng tuyệt đẹp';
            let icon = 'ti-sun';

            if (code === 0 || code === 1) {
              desc = `Nắng đẹp Tây Bắc, gió mát ${wind} km/h`;
              icon = 'ti-sun';
            } else if (code === 2 || code === 3) {
              desc = `Nắng nhẹ, mây vờn đỉnh núi ${wind} km/h`;
              icon = 'ti-cloud-sun';
            } else if (code >= 51) {
              desc = `Mưa nhỏ vùng cao, gió ${wind} km/h`;
              icon = 'ti-cloud-rain';
            }

            setWeatherData({
              temp,
              desc,
              time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' hôm nay',
              icon,
              aqi: 'Tốt (AQI 28)',
              loading: false
            });
          }
        }
      } catch (err) {
        console.log('Open-Meteo Dien Bien weather note:', err);
      }
    };

    fetchLiveWeather();
    const interval = setInterval(fetchLiveWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  // 8 Major Categories (Specification Requirement 9: Khám phá Điện Biên)
  const khamPhaCategories = [
    { id: 'lich-su', title: 'Lịch sử Vĩ đại', count: '12 Di tích', icon: '🏰', bg: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', desc: 'Đồi A1, Hầm Đờ Cát, Sở chỉ huy Mường Phăng' },
    { id: 'du-lich', title: 'Du lịch & Sinh thái', count: '18 Danh thắng', icon: '🏔️', bg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', desc: 'Hồ Pá Khoang, Đèo Pha Đin, Suối khoáng U Va' },
    { id: 'am-thuc', title: 'Ẩm thực Tây Bắc', count: '25+ Món ngon', icon: '🍲', bg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', desc: 'Thịt trâu gác bếp, Pa pỉnh tộp, Xôi nếp nương' },
    { id: 'con-nguoi', title: 'Con người & Bản sắc', count: '19 Dân tộc', icon: '🤝', bg: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80', desc: 'Dân tộc Thái, Mông, Khơ Mú giàu lòng hiếu khách' },
    { id: 'le-hoi', title: 'Lễ hội Văn hóa', count: '10+ Lễ hội', icon: '🌸', bg: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', desc: 'Lễ hội Hoa Ban, Lễ hội Thành Bản Phủ, Múa Xòe' },
    { id: 'ocop', title: 'Sản phẩm OCOP', count: '45+ Đặc sản', icon: '🌾', bg: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80', desc: 'Gạo Seng Cù, Trà Shan Tuyết Tủa Chùa, Macca' },
    { id: 'ban-lang', title: 'Bản làng Văn hóa', count: '15 Bản du lịch', icon: '🏡', bg: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80', desc: 'Bản Ten, Bản Che Căn, Bản Mến trải nghiệm số' },
    { id: 'thien-nhien', title: 'Thiên nhiên Hùng vĩ', count: '100% Xanh', icon: '🌿', bg: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80', desc: 'Rừng nguyên sinh Mường Phăng, Cao nguyên Tủa Chùa' }
  ];

  // Featured Destinations (Specification Requirement 10: Điểm đến nổi bật)
  const featuredDestinations = [
    {
      id: 'a1',
      name: 'Di tích Lịch sử Đồi A1',
      tag: 'Di tích Quốc gia Đặc biệt',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      aiSummary: 'Trận chiến 39 ngày đêm kịch tính năm 1954. Nơi dấu chân lịch sử Điện Biên Phủ lừng lẫy năm châu, chấn động địa cầu.',
      detail: 'Đồi A1 nằm ở phường Mường Thanh, TP. Điện Biên Phủ. Đây là cứ điểm quan trọng bậc nhất trong hệ thống phòng thủ của quân Pháp. Tại đây có ngôi mộ tập thể các anh hùng liệt sĩ và quả bộc phá 968kg tạo nên hố bộc phá lịch sử.',
      rating: 4.9,
      reviews: 1280
    },
    {
      id: 'ham-de-castries',
      name: 'Hầm Đờ Cát (De Castries)',
      tag: 'Hầm chỉ huy 1954',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
      aiSummary: 'Căn hầm chỉ huy kiên cố nhất của tướng De Castries, nơi lá cờ Quyết chiến Quyết thắng cắm lên chiều 7/5/1954.',
      detail: 'Hầm Đờ Cát dài 20m, rộng 8m, nằm ở trung tâm tập đoàn cứ điểm Điện Biên Phủ. Hầm được xây dựng vòm sắt, ván gỗ và bao cát kiên cố, hiện nay vẫn giữ nguyên kiến trúc nguyên bản.',
      rating: 4.8,
      reviews: 950
    },
    {
      id: 'bao-tang-panorama',
      name: 'Bảo tàng Chiến thắng Điện Biên Phủ',
      tag: 'Bức tranh Panorama 360°',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      aiSummary: 'Chứa bức tranh Panorama sơn dầu lớn nhất thế giới với 4.500 nhân vật tái hiện toàn bộ 56 ngày đêm chiến dịch.',
      detail: 'Bảo tàng được thiết kế hình nón xoe cách điệu mũ nan của chiến sĩ Điện Biên. Bên trong trưng bày hàng ngàn kỷ vật và tác phẩm nghệ thuật Panorama quy mô quốc tế.',
      rating: 5.0,
      reviews: 2100
    },
    {
      id: 'ho-pa-khoang',
      name: 'Hồ Pá Khoang & Đảo Hoa Đào',
      tag: 'Du lịch Sinh thái',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      aiSummary: 'Trái tim xanh của Điện Biên với diện tích mặt nước hơn 600ha, khí hậu quanh năm mát mẻ và đảo hoa đào tuyệt đẹp.',
      detail: 'Hồ Pá Khoang nằm ở xã Mường Phăng, ẩn mình giữa núi rừng trập trùng. Đây là điểm hẹn lý tưởng cho cắm trại, du thuyền và thưởng ngoạn hoa đào nở rộ xuân về.',
      rating: 4.8,
      reviews: 870
    },
    {
      id: 'deo-pha-din',
      name: 'Đèo Pha Đin - Huyền thoại Tây Bắc',
      tag: 'Tứ đại đỉnh đèo',
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
      aiSummary: 'Một trong tứ đại đỉnh đèo Việt Nam dài 32km, cung đường săn mây bạt ngàn và hoa dại khoe sắc.',
      detail: 'Pha Đin tiếng Thái nghĩa là "Trời và Đất". Nơi đây có Khu du lịch Pha Đin Pass rực rỡ sắc hoa và view thung lũng mây đẹp ngỡ ngàng.',
      rating: 4.9,
      reviews: 1420
    },
    {
      id: 'suoi-khoang-u-va',
      name: 'Suối khoáng nóng U Va',
      tag: 'Nghỉ dưỡng & Sức khỏe',
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
      aiSummary: 'Dòng khoáng nóng thiên nhiên giàu vi chất giải tỏa mệt mỏi, kết hợp văn hóa ẩm thực và Múa xòe dân tộc Thái.',
      detail: 'Suối khoáng U Va nằm cách trung tâm thành phố 15km. Nơi đây có phong cảnh sông suối hữu tình và nguồn nước khoáng tự nhiên phun trào từ lòng đất.',
      rating: 4.7,
      reviews: 640
    }
  ];

  // Investment Indicators (Specification Requirement 11: Đầu tư)
  const investmentStats = [
    { label: 'Dự án FDI & Trong nước', value: '185+', sub: 'Tổng vốn 45.000 tỷ VNĐ', color: '#0B5FFF' },
    { label: 'Khu công nghiệp & Cụm CN', value: '06', sub: 'Nam Mường Thanh, Tây Trang...', color: '#14B86A' },
    { label: 'Cửa khẩu Quốc tế Tây Trang', value: '100%', sub: 'Tuyến Hành lang Đông - Tây', color: '#F6B800' },
    { label: 'Cảng hàng không Điện Biên', value: 'Airbus A321', sub: 'Nâng cấp kết nối toàn cầu', color: '#0B5FFF' }
  ];

  // OCOP Products (Specification Requirement 13: Sản phẩm OCOP 3D)
  const ocopProducts = [
    { name: 'Gạo Seng Cù Mường Thanh', star: '5 SAO OCOP', producer: 'HTX Nông nghiệp Mường Thanh', price: '38.000đ / kg', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80', aiIntro: 'Gạo Seng Cù dẻo thơm trứ danh, hạt ngọc kết tinh từ dòng sông Nậm Rốm phù sa.' },
    { name: 'Thịt Trâu Gác Bếp Tây Bắc', star: '4 SAO OCOP', producer: 'Cơ sở Sản xuất Điện Biên Food', price: '820.000đ / kg', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', aiIntro: 'Ướp hạt mắc khén, hạt dổi rừng chuẩn vị dân tộc Thái, sấy khói củi nhãn đậm đà.' },
    { name: 'Chè Shan Tuyết Cổ Thụ Tủa Chùa', star: '4 SAO OCOP', producer: 'HTX Trà Shan Tuyết Tủa Chùa', price: '450.000đ / hũ', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', aiIntro: 'Thu hoạch từ chè cổ thụ 200 tuổi trên cao nguyên đá Tủa Chùa bạt ngàn mây trắng.' },
    { name: 'Macca Điện Biên sấy nứt vỏ', star: '4 SAO OCOP', producer: 'Công ty Cổ phần Nông nghiệp Điện Biên', price: '220.000đ / hộp', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', aiIntro: 'Hạt macca giàu dinh dưỡng trồng trên đất đỏ bazan vùng cao Tây Bắc.' }
  ];

  // Enterprise Directory (Specification Requirement 12)
  const enterpriseList = [
    { name: 'Tập đoàn Nông Lâm nghiệp Điện Biên', field: 'Nông nghiệp & OCOP', logo: '🌾', aiDesc: 'Đơn vị tiên phong sản xuất lúa gạo chất lượng cao & xuất khẩu nông sản.' },
    { name: 'Công ty Du lịch Sinh thái Điện Biên Travel', field: 'Du lịch & Lữ hành', logo: '✈️', aiDesc: 'Chuyên tổ chức tour di sản lịch sử 1954 & trải nghiệm văn hóa bản làng.' },
    { name: 'Tập đoàn Đầu tư & Xây dựng Tây Bắc', field: 'Hạ tầng & Đô thị', logo: '🏗️', aiDesc: 'Chủ đầu tư các khu đô thị thông minh và hạ tầng giao thông trọng điểm.' },
    { name: 'Hợp tác社 Khoáng nóng U Va Resort', field: 'Nghỉ dưỡng & Health Care', logo: '♨️', aiDesc: 'Phát triển tổ hợp du lịch khoáng nóng tự nhiên và chăm sóc sức khỏe.' }
  ];

  // AI Applications Block Cards
  const aiAppCards = [
    {
      title: 'AI cho người dân',
      icon: '🤖',
      badge: 'CÔNG DÂN SỐ',
      desc: 'Trợ lý AI đa ngôn ngữ hỗ trợ người dân & du khách tra cứu di sản, thông tin du lịch, dịch vụ hành chính công và tiện ích đời sống 24/7.',
      isNvidia: false
    },
    {
      title: 'AI cho chính quyền',
      icon: '🏛️',
      badge: 'CHÍNH QUYỀN SỐ',
      desc: 'Giải pháp AI phân tích dữ liệu kinh tế - xã hội, tự động hóa báo cáo, hỗ trợ điều hành đô thị thông minh và ra quyết định chiến lược.',
      isNvidia: false
    },
    {
      title: 'AI cho doanh nghiệp',
      icon: '🏢',
      badge: 'DOANH NGHIỆP SỐ',
      desc: 'Bộ giải pháp Trí tuệ Nhân tạo giúp doanh nghiệp tự động hóa CSKH, tư vấn thương mại, tiếp thị đa kênh và tối ưu hóa vận hành.',
      isNvidia: false
    },
    {
      title: 'Chương trình đào tạo NVIDIA Deep Learning Institute',
      icon: '🎓',
      badge: 'NVIDIA DLI',
      desc: 'Chương trình đào tạo chuẩn quốc tế hợp tác cùng NVIDIA DLI nhằm phát triển nguồn nhân lực chất lượng cao về AI & Điện toán hiệu năng cao tại Điện Biên.',
      isNvidia: true
    }
  ];

  // Default Featured Posts for Home
  const defaultFeaturedPosts = [
    {
      id: 101,
      title: 'Xúc tiến Đầu tư Dự án Nông nghiệp & Chế biến Lúa gạo Mường Thanh 2026',
      summary: 'Tập đoàn Nông Lâm nghiệp Điện Biên kêu gọi đối tác đầu tư dự án nhà máy chế biến gạo xuất khẩu công nghệ cao.',
      category: 'Đầu tư',
      sub_category: 'Dự án & Cơ hội hợp tác',
      company_name: 'Tập đoàn Nông Lâm nghiệp Điện Biên',
      image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      aiSummary: 'Dự án quy mô 50.000 tấn/năm nâng tầm thương hiệu hạt gạo Seng Cù Mường Thanh ra thị trường quốc tế.'
    },
    {
      id: 102,
      title: 'Khai mạc Lễ hội Hoa Ban 2026 & Ngày hội Văn hóa Du lịch Điện Biên Phủ',
      summary: 'UBND tỉnh Điện Biên chủ trì chuỗi 30 hoạt động văn hóa, thể thao, liên hoan múa xòe và hội chợ OCOP Tây Bắc.',
      category: 'Khám phá Điện Biên',
      sub_category: 'Văn hóa & Lễ hội Hoa Ban',
      company_name: 'Công ty Du lịch Sinh thái Điện Biên Travel',
      image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      aiSummary: 'Dự kiến thu hút hơn 200.000 lượt du khách, mở ra cơ hội quảng bá di sản lịch sử 1954 vĩ đại.'
    },
    {
      id: 103,
      title: 'Mở rộng đường bay Cảng hàng không Điện Biên kết nối Hà Nội & TP.HCM',
      summary: 'Sân bay Điện Biên nâng cấp đón dòng máy bay thân rộng A321, rút ngắn thời gian di chuyển còn 1 giờ bay.',
      category: 'Tin tức - Sự kiện',
      sub_category: 'Tin tức thời sự',
      company_name: 'Ban Biên tập Dienbien.today',
      image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
      aiSummary: 'Động lực bứt phá hạ tầng giao thông kết nối giao thương trực tiếp giữa Điện Biên với 2 đầu đất nước.'
    }
  ];

  // Default Home Members Cards
  const defaultHomeMembers = [
    {
      id: 1,
      name: 'Tập đoàn Nông Lâm nghiệp Điện Biên',
      tier: 'Platinum',
      industry: 'Nông nghiệp & OCOP',
      city: 'TP. Điện Biên Phủ',
      description: 'Chuyên sản xuất lúa gạo Seng Cù Mường Thanh chất lượng cao & xuất khẩu nông sản Tây Bắc.',
      initials: 'DB',
      bg: '#E6F1FB',
      fg: '#0C447C'
    },
    {
      id: 2,
      name: 'Công ty Du lịch Sinh thái Điện Biên Travel',
      tier: 'Platinum',
      industry: 'Du lịch & Lữ hành',
      city: 'TP. Điện Biên Phủ',
      description: 'Chuyên tổ chức tour di sản lịch sử Điện Biên Phủ 1954, trải nghiệm văn hóa bản làng & trekking.',
      initials: 'DT',
      bg: '#EAF3DE',
      fg: '#27500A'
    },
    {
      id: 3,
      name: 'Tập đoàn Đầu tư & Xây dựng Tây Bắc',
      tier: 'Gold',
      industry: 'Hạ tầng & Đô thị',
      city: 'TP. Điện Biên Phủ',
      description: 'Chủ đầu tư hạ tầng khu công nghiệp Nam Mường Thanh, cụm logistics Cửa khẩu Quốc tế Tây Trang.',
      initials: 'TB',
      bg: '#FAEEDA',
      fg: '#633806'
    },
    {
      id: 4,
      name: 'Hợp tác xã Khoáng nóng U Va Resort',
      tier: 'Gold',
      industry: 'Nghỉ dưỡng & Health Care',
      city: 'Huyện Điện Biên',
      description: 'Tổ hợp du lịch sinh thái khoáng nóng tự nhiên U Va, tắm bùn trị liệu & homestay văn hóa Thái.',
      initials: 'UV',
      bg: '#EEEDFE',
      fg: '#3C3489'
    }
  ];

  const [homePosts, setHomePosts] = useState(defaultFeaturedPosts);
  const [homeMembers, setHomeMembers] = useState(defaultHomeMembers);

  useEffect(() => {
    fetch('/api/posts?status=approved')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setHomePosts(data.data.slice(0, 3));
        }
      })
      .catch(() => {});

    fetch('/api/members?status=approved')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          const mapped = data.data.slice(0, 4).map(m => ({
            id: m.id,
            name: m.name,
            tier: m.tier || 'Silver',
            industry: m.industry || 'Doanh nghiệp',
            city: m.city || 'TP. Điện Biên Phủ',
            description: m.description || 'Hội viên doanh nghiệp chính thức trên Dienbien.today',
            initials: (m.name || 'DB').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            bg: m.tier === 'Platinum' ? '#E6F1FB' : m.tier === 'Gold' ? '#FAEEDA' : '#EAF3DE',
            fg: m.tier === 'Platinum' ? '#0C447C' : m.tier === 'Gold' ? '#633806' : '#27500A'
          }));
          setHomeMembers(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      {/* SEO Dynamic Head */}
      <SEOHead
        title="Trang chủ"
        description="Dienbien.today - Nền tảng Thương hiệu Số AI tiên phong của tỉnh Điện Biên. Quảng bá du lịch, di sản lịch sử 1954, kết nối doanh nghiệp và xúc tiến đầu tư."
        keywords="Điện Biên, Dienbien.today, du lịch Điện Biên, Đồi A1, Hầm Đờ Cát, Mường Phăng, sản phẩm OCOP, đầu tư Điện Biên"
      />

      {/* Header Navbar */}
      <Navbar />

      {/* SECTION 1: HERO SECTION (Specification Requirement 6) */}
      <section
        id="hero"
        style={{
          position: 'relative',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0E1320 0%, #161D2F 50%, #0B5FFF 100%)',
          color: '#ffffff'
        }}
      >
        {/* Background Visual Showcase (Flycam imagery/backdrop overlay) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.28,
            filter: 'contrast(110%) brightness(80%)'
          }}
        />

        {/* Gradient Dark Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(14, 19, 32, 0.4) 0%, rgba(14, 19, 32, 0.95) 100%)'
          }}
        />

        <div className="public-container" style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'center' }}>
          {/* Top AI Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(11, 95, 255, 0.2)', border: '1px solid rgba(11, 95, 255, 0.5)', padding: '6px 18px', borderRadius: '30px', marginBottom: '24px', backdropFilter: 'blur(10px)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#14B86A', display: 'inline-block' }} className="ai-bot-pulse"></span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.08em', color: '#4A8CFF' }}>DIGITAL CITY BRAND POWERED BY AI</span>
          </div>

          {/* Typing Main Title */}
          <h1
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: '800',
              lineHeight: '1.25',
              marginBottom: '20px',
              maxWidth: '1000px',
              margin: '0 auto 20px auto',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {displayText}
            {!isTypingDone && <span className="typing-cursor"></span>}
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#CBD5E1', maxWidth: '750px', margin: '0 auto 36px auto', lineHeight: '1.6', fontWeight: '400' }}>
            Nền tảng thương hiệu số AI chính thức đại diện tỉnh Điện Biên. Nơi di sản lịch sử Điện Biên Phủ giao thoa cùng công nghệ trí tuệ nhân tạo tương lai.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <a
              href="#kham-pha"
              style={{
                background: 'linear-gradient(135deg, #0B5FFF 0%, #0040C1 100%)',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1rem',
                boxShadow: '0 10px 25px rgba(11, 95, 255, 0.4)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Khám phá Điện Biên 🚀
            </a>

            <a
              href="#dau-tu"
              style={{
                background: 'linear-gradient(135deg, #14B86A 0%, #0E854B 100%)',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1rem',
                boxShadow: '0 10px 25px rgba(20, 184, 106, 0.3)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Đầu tư tại Điện Biên 💼
            </a>

            <button
              onClick={() => {
                const el = document.getElementById('ai-assistant');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '14px 28px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Trò chuyện với AI 🤖
            </button>
          </div>

          {/* Live Weather Ticker */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', background: 'rgba(22, 29, 47, 0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '10px 22px', backdropFilter: 'blur(12px)', fontSize: '0.88rem' }}>
            <span style={{ color: '#F6B800', fontSize: '1.2rem' }}>☀️</span>
            <span>TP. Điện Biên Phủ: <strong style={{ color: '#4A8CFF' }}>{weatherData.temp}°C</strong></span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ color: '#CBD5E1' }}>{weatherData.desc}</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ color: '#14B86A', fontWeight: '700' }}>AQI: {weatherData.aqi}</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: KHÁM PHÁ ĐIỆN BIÊN (Specification Requirement 9) */}
      <section id="kham-pha" style={{ padding: '5rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: '#0B5FFF', fontWeight: '800', letterSpacing: '0.1em', fontSize: '0.85rem' }}>AI EXPLORE CATEGORIES</span>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.4rem', fontWeight: '800', marginTop: '6px' }}>Khám Phá Điện Biên</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '8px auto 0 auto' }}>
            8 hạng mục thương hiệu số giúp du khách & nhà đầu tư trải nghiệm toàn diện vẻ đẹp Tây Bắc.
          </p>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid-4-cols">
          {khamPhaCategories.map((item) => (
            <div
              key={item.id}
              className="hover-zoom-card"
              style={{
                borderRadius: '20px',
                height: '320px',
                position: 'relative',
                cursor: 'pointer',
                boxShadow: 'var(--shadow)'
              }}
              onClick={() => {
                setSelectedDestination({
                  name: `Danh mục: ${item.title}`,
                  aiSummary: `AI Điện Biên đã tổng hợp dữ liệu chi tiết cho mục "${item.title}". Bao gồm: ${item.desc}.`,
                  detail: `Khám phá hệ thống dữ liệu số về ${item.title} tại Điện Biên với hàng ngàn hình ảnh 360°, bản đồ di tích và thông tin tương tác AI.`,
                  image: item.bg,
                  rating: 5.0,
                  reviews: 420
                });
                setModalOpen(true);
              }}
            >
              <img src={item.bg} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(70%)' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.2rem' }}>{item.icon}</span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', backdropFilter: 'blur(8px)' }}>{item.count}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#E2E8F0', opacity: 0.9 }}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: ỨNG DỤNG AI & DEEP LEARNING (Vị trí giữa Khám Phá Điện Biên & Điểm Đến Nổi Bật) */}
      <section id="ung-dung-ai" style={{ padding: '5rem 1.5rem', backgroundColor: 'var(--surface-1)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(11, 95, 255, 0.12)', border: '1px solid rgba(11, 95, 255, 0.3)', padding: '6px 18px', borderRadius: '30px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.08em', color: '#0B5FFF' }}>AI APPLICATIONS & DEEP LEARNING</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.4rem', fontWeight: '800', marginTop: '4px' }}>Ứng Dụng AI</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '8px auto 0 auto' }}>
              Hệ sinh thái Trí tuệ Nhân tạo toàn diện hỗ trợ Chuyển đổi số, nâng cao chất lượng cuộc sống & thúc đẩy Kinh tế - Xã hội tỉnh Điện Biên.
            </p>
          </div>

          <div className="grid-4-cols">
            {aiAppCards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/posts?category=${encodeURIComponent('Ứng dụng AI')}&sub_category=${encodeURIComponent(card.title)}`)}
                style={{
                  backgroundColor: 'var(--surface-2)',
                  borderRadius: '24px',
                  border: card.isNvidia ? '2px solid #76B900' : '1px solid var(--border)',
                  padding: '2rem 1.75rem',
                  position: 'relative',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow)',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden'
                }}
                className="hover-zoom-card"
              >
                {card.badge && (
                  <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: card.isNvidia ? '#76B900' : '#0B5FFF', color: '#ffffff', fontSize: '0.7rem', fontWeight: '800', padding: '4px 10px', borderRadius: '12px', letterSpacing: '0.05em' }}>
                    {card.badge}
                  </span>
                )}

                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.35', color: card.isNvidia ? '#76B900' : 'var(--text-primary)' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
                    {card.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: card.isNvidia ? '#76B900' : '#0B5FFF' }}>
                    Xem chi tiết ➔
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: ĐIỂM ĐẾN NỔI BẬT & AI NARRATOR (Specification Requirement 10) */}
      <section id="diem-den" style={{ padding: '5rem 1.5rem', backgroundColor: 'var(--surface-0)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: '#14B86A', fontWeight: '800', letterSpacing: '0.1em', fontSize: '0.85rem' }}>FEATURED DESTINATIONS</span>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.4rem', fontWeight: '800', marginTop: '6px' }}>Điểm Đến Nổi Bật</h2>
            </div>
            <button
              onClick={() => setMapModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #0B5FFF 0%, #14B86A 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '30px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow)'
              }}
            >
              <span>🗺️ Mở Bản đồ Tương tác Điện Biên</span>
            </button>
          </div>

          {/* Destination Cards Grid */}
          <div className="grid-3-cols">
            {featuredDestinations.map((dest) => (
              <div
                key={dest.id}
                style={{
                  backgroundColor: 'var(--surface-2)',
                  borderRadius: '24px',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                className="hover-zoom-card"
              >
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#0B5FFF', color: '#ffffff', fontSize: '0.75rem', fontWeight: '700', padding: '4px 12px', borderRadius: '12px' }}>{dest.tag}</span>
                  <span style={{ position: 'absolute', bottom: '16px', right: '16px', backgroundColor: 'rgba(0,0,0,0.75)', color: '#F6B800', fontSize: '0.8rem', fontWeight: '800', padding: '4px 10px', borderRadius: '10px', backdropFilter: 'blur(6px)' }}>★ {dest.rating}</span>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '10px' }}>{dest.name}</h3>
                    
                    {/* AI Introduction Box */}
                    <div style={{ backgroundColor: 'var(--surface-0)', borderLeft: '4px solid #14B86A', padding: '10px 14px', borderRadius: '0 12px 12px 0', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                      <span style={{ fontWeight: '700', color: '#14B86A' }}>🤖 AI Giới thiệu: </span>
                      {dest.aiSummary}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDestination(dest);
                      setModalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--surface-0)',
                      border: '1px solid var(--border)',
                      color: '#0B5FFF',
                      padding: '10px 0',
                      borderRadius: '14px',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#0B5FFF';
                      e.target.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--surface-0)';
                      e.target.style.color = '#0B5FFF';
                    }}
                  >
                    Xem chi tiết di tích & 3D tour →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: ĐẦU TƯ TẠI ĐIỆN BIÊN (Specification Requirement 11: Landing Đầu tư) */}
      <section id="dau-tu" style={{ padding: '6rem 1.5rem', background: 'linear-gradient(135deg, #0E1320 0%, #1B243B 100%)', color: '#ffffff' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: '#F6B800', fontWeight: '800', letterSpacing: '0.1em', fontSize: '0.85rem' }}>INVESTMENT & ECONOMY HUB</span>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.5rem', fontWeight: '800', marginTop: '8px' }}>Xúc Tiến Đầu Tư Tại Điện Biên</h2>
            <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '700px', margin: '10px auto 0 auto' }}>
              Cơ hội đầu tư đột phá với chính sách ưu đãi vượt trội, hạ tầng kết nối hàng không quốc tế & cửa khẩu biên giới.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid-4-cols" style={{ marginBottom: '4rem' }}>
            {investmentStats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '24px',
                  padding: '2rem',
                  textAlign: 'center',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <div style={{ fontSize: '2.8rem', fontWeight: '800', color: stat.color, marginBottom: '6px', fontFamily: 'var(--font-title)' }}>{stat.value}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1', opacity: 0.8 }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div style={{ background: 'linear-gradient(135deg, #0B5FFF 0%, #14B86A 100%)', borderRadius: '28px', padding: '3rem 2rem', textAlign: 'center', boxShadow: '0 20px 50px rgba(11, 95, 255, 0.3)' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px' }}>Sẵn Sàng Mở Rộng Đầu Tư Tại Điện Biên?</h3>
            <p style={{ fontSize: '1rem', opacity: 0.9, maxWidth: '650px', margin: '0 auto 24px auto' }}>
              Hệ thống AI Điện Biên hỗ trợ tra cứu quy hoạch đất đai, thủ tục cấp phép đầu tư & kết nối trực tiếp với Ban Quản lý các Khu công nghiệp.
            </p>
            <button
              onClick={() => alert("Trợ lý AI Đầu tư Điện Biên đang sẵn sàng kết nối bạn với Sở Kế hoạch & Đầu tư tỉnh Điện Biên!")}
              style={{
                background: '#ffffff',
                color: '#0B5FFF',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
            >
              Khám phá cơ hội đầu tư ngay 📊
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: SẢN PHẨM OCOP ĐIỆN BIÊN 3D (Specification Requirement 13) */}
      <section id="ocop" style={{ padding: '5rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: '#14B86A', fontWeight: '800', letterSpacing: '0.1em', fontSize: '0.85rem' }}>OCOP REGIONAL SPECIALTIES</span>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.4rem', fontWeight: '800', marginTop: '6px' }}>Sản Phẩm OCOP Đặc Sản</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', margin: '8px auto 0 auto' }}>
            Nông sản & đặc sản Điện Biên đạt chuẩn 4-5 sao OCOP quốc gia tích hợp thẻ 3D tương tác.
          </p>
        </div>

        <div className="grid-4-cols">
          {ocopProducts.map((prod, idx) => (
            <div
              key={idx}
              className="ocop-card-3d"
              style={{
                backgroundColor: 'var(--surface-2)',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1rem', position: 'relative' }}>
                  <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#F6B800', color: '#0E1320', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '10px' }}>{prod.star}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '4px' }}>{prod.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>🏭 {prod.producer}</div>

                <div style={{ backgroundColor: 'var(--surface-0)', padding: '10px', borderRadius: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>
                  <span style={{ color: '#14B86A', fontWeight: '700' }}>🤖 AI Thẩm định: </span>
                  {prod.aiIntro}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0B5FFF' }}>{prod.price}</span>
                <button
                  onClick={() => alert(`Đã ghi nhận yêu cầu đặt mua sản phẩm ${prod.name} qua Trợ lý AI!`)}
                  style={{
                    background: '#14B86A',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Đặt mua hàng 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: DOANH NGHIỆP ĐIỆN BIÊN (Specification Requirement 12: Directory) */}
      <section id="doanh-nghiep" style={{ padding: '5rem 1.5rem', backgroundColor: 'var(--surface-0)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: '#0B5FFF', fontWeight: '800', letterSpacing: '0.1em', fontSize: '0.85rem' }}>ENTERPRISE DIRECTORY</span>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.4rem', fontWeight: '800', marginTop: '6px' }}>Doanh Nghiệp Tiêu Biểu</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Danh bạ các doanh nghiệp hàng đầu tại Điện Biên được xác thực hồ sơ số bởi AI.
            </p>
          </div>

          <div className="grid-4-cols">
            {enterpriseList.map((ent, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--surface-2)',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--surface-0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>{ent.logo}</div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>{ent.name}</h3>
                    <span style={{ fontSize: '0.78rem', color: '#0B5FFF', fontWeight: '700' }}>{ent.field}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '14px' }}>
                  {ent.aiDesc}
                </p>
                <button
                  onClick={() => alert(`Đang kết nối tới đại diện doanh nghiệp ${ent.name}...`)}
                  style={{
                    width: '100%',
                    background: 'var(--surface-0)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    padding: '8px 0',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Liên hệ hợp tác 🤝
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: VĂN HÓA & DI SẢN (Specification Requirement 14: Gallery & Timeline) */}
      <section id="van-hoa" style={{ padding: '5rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: '#F6B800', fontWeight: '800', letterSpacing: '0.1em', fontSize: '0.85rem' }}>CULTURE & HERITAGE GALLERY</span>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.4rem', fontWeight: '800', marginTop: '6px' }}>Văn Hóa & Di Sản Tây Bắc</h2>
        </div>

        {/* Culture Gallery Showcase */}
        <div className="grid-3-cols">
          <div style={{ background: 'var(--surface-2)', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>🌸 Lễ Hội Hoa Ban</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Sự kiện văn hóa du lịch lớn nhất năm của tỉnh Điện Biên vào tháng 3 hàng năm, tôn vinh sắc hoa ban trắng rợp núi rừng Tây Bắc.
            </p>
          </div>
          <div style={{ background: 'var(--surface-2)', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>💃 Nghệ Thuật Múa Xòe Thái</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Di sản văn hóa phi vật thể đại diện của nhân loại được UNESCO vinh danh. Biểu tượng của sự đoàn kết và lòng hiếu khách.
            </p>
          </div>
          <div style={{ background: 'var(--surface-2)', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>🕶️ Trải Nghiệm Virtual 360°</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Công nghệ số hóa di sản 3D/VR giúp du khách khám phá hầm chỉ huy Mường Phăng và đỉnh đèo Pha Đin qua không gian ảo.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: TIN TỨC MAGAZINE (Specification Requirement 15) */}
      <section id="tin-tuc" style={{ padding: '5rem 1.5rem', backgroundColor: 'var(--surface-0)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: '#0B5FFF', fontWeight: '800', letterSpacing: '0.1em', fontSize: '0.85rem' }}>NEWS & MAGAZINE</span>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.4rem', fontWeight: '800', marginTop: '6px' }}>Tin Tức & Truyền Thông AI</h2>
          </div>

          <div className="grid-3-cols" style={{ marginBottom: '3rem' }}>
            {homePosts.map((post, pIdx) => (
              <div 
                key={pIdx} 
                onClick={() => navigate('/posts')}
                style={{ backgroundColor: 'var(--surface-2)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {post.image_url && (
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img src={post.image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ backgroundColor: '#0B5FFF', color: '#ffffff', fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '10px' }}>
                      {post.category || 'TIN NỔI BẬT'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{post.company_name}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 10px 0', lineHeight: 1.35 }}>{post.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.summary}
                  </p>
                  {post.aiSummary && (
                    <div style={{ backgroundColor: 'var(--surface-0)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)', borderLeft: '3px solid #0B5FFF' }}>
                      <strong>🤖 AI Summary:</strong> {post.aiSummary}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigate('/posts')}
              style={{
                backgroundColor: '#0B5FFF',
                color: '#ffffff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '16px',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(11, 95, 255, 0.3)',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Xem tất cả bài viết ➔
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 9: THÀNH VIÊN CỘNG ĐỒNG (Specification Requirement 16) */}
      <section id="thanh-vien" style={{ padding: '5rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: '#14B86A', fontWeight: '800', letterSpacing: '0.1em', fontSize: '0.85rem' }}>COMMUNITY MEMBERS</span>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.4rem', fontWeight: '800', marginTop: '6px' }}>Cộng Đồng Hội Viên</h2>
        </div>

        <div className="grid-4-cols" style={{ marginBottom: '2.5rem' }}>
          {homeMembers.map((mem, idx) => (
            <div key={idx} style={{ backgroundColor: 'var(--surface-2)', borderRadius: '20px', border: '1px solid var(--border)', padding: '1.5rem', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: mem.bg, color: mem.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: '800', margin: '0 auto 12px auto', border: '2px solid var(--border)' }}>
                {mem.initials}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '4px' }}>{mem.name}</h3>
              <span style={{ backgroundColor: mem.tier === 'Platinum' ? 'rgba(11,95,255,0.15)' : mem.tier === 'Gold' ? 'rgba(246,184,0,0.15)' : 'rgba(20,184,106,0.15)', color: mem.tier === 'Platinum' ? '#0B5FFF' : mem.tier === 'Gold' ? '#D97706' : '#14B86A', fontSize: '0.75rem', fontWeight: '800', padding: '3px 12px', borderRadius: '12px', display: 'inline-block', margin: '4px 0 10px 0' }}>
                HỘI VIÊN {mem.tier.toUpperCase()}
              </span>
              <p style={{ fontSize: '0.78rem', color: '#0B5FFF', fontWeight: '700', margin: '0 0 8px 0' }}>{mem.industry} · {mem.city}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {mem.description}
              </p>
              <button
                onClick={() => navigate('/members')}
                style={{
                  width: '100%',
                  background: 'var(--surface-0)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  padding: '8px 0',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Liên hệ hợp tác 🤝
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/members')}
            style={{
              backgroundColor: '#0B5FFF',
              color: '#ffffff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '16px',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(11, 95, 255, 0.3)',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Xem toàn bộ Danh bạ Doanh nghiệp & Hội viên ➔
          </button>
        </div>
      </section>

      {/* MODAL: DESTINATION DETAIL */}
      {modalOpen && selectedDestination && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: 'var(--surface-2)', borderRadius: '28px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
            <div style={{ height: '240px', position: 'relative' }}>
              <img src={selectedDestination.image} alt={selectedDestination.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: '#ffffff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <div style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px' }}>{selectedDestination.name}</h2>
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '14px', borderRadius: '14px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', borderLeft: '4px solid #0B5FFF' }}>
                <strong>🤖 Trợ lý AI Điện Biên đánh giá: </strong>
                {selectedDestination.aiSummary}
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-primary)', marginBottom: '24px' }}>
                {selectedDestination.detail}
              </p>
              <button onClick={() => setModalOpen(false)} style={{ width: '100%', background: '#0B5FFF', color: '#ffffff', border: 'none', padding: '12px 0', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' }}>
                Đóng thông tin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INTERACTIVE MAP */}
      {mapModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', padding: '1rem', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff', padding: '10px 16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>🗺️ Bản đồ Tương tác Di tích & Địa điểm Điện Biên</h3>
            <button onClick={() => setMapModalOpen(false)} style={{ background: '#EF4444', color: '#ffffff', border: 'none', padding: '6px 16px', borderRadius: '20px', fontWeight: '700', cursor: 'pointer' }}>Đóng Bản Đồ</button>
          </div>
          <div style={{ flex: 1, borderRadius: '20px', overflow: 'hidden', backgroundColor: 'var(--surface-2)' }}>
            <InteractiveMap />
          </div>
        </div>
      )}

      {/* Floating AI Bot Assistant */}
      <FloatingAIBot />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
