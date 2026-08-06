import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';

// Comprehensive dataset of prominent locations in Điện Biên Province
const LOCATION_DATA = [
  {
    id: 'loc_1',
    name: 'Di tích Lịch sử Đồi A1',
    category: 'attractions',
    lat: 21.3860,
    lng: 103.0165,
    address: 'Phường Mường Thanh, TP. Điện Biên Phủ',
    desc: 'Điểm di tích quan trọng bậc nhất trong Tập đoàn cứ điểm Điện Biên Phủ, nơi ghi dấu trận đánh kịch tính năm 1954.',
    tags: ['Di tích Quốc gia đặc biệt', 'Chiến thắng 1954', 'Lịch sử Điện Biên'],
    rating: 4.9,
    phone: '0215.3825.111',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_2',
    name: 'Bảo tàng Chiến thắng Điện Biên Phủ',
    category: 'attractions',
    lat: 21.3845,
    lng: 103.0180,
    address: 'Phường Mường Thanh, TP. Điện Biên Phủ',
    desc: 'Bảo tàng hiện đại chứa bức tranh Panorama toàn cảnh Chiến dịch Điện Biên Phủ lớn nhất thế giới.',
    tags: ['Bức tranh Panorama 360', 'Bảo tàng hiện đại', 'Lịch sử & Di sản'],
    rating: 5.0,
    phone: '0215.3825.222',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_3',
    name: 'Hầm Đờ Cát (De Castries)',
    category: 'attractions',
    lat: 21.3890,
    lng: 103.0120,
    address: 'Cánh đồng Mường Thanh, TP. Điện Biên Phủ',
    desc: 'Nơi chỉ huy trung tâm của tướng De Castries, nơi lá cờ Quyết chiến Quyết thắng tung bay ngày 7/5/1954.',
    tags: ['Hầm chỉ huy 1954', 'Di tích Lịch sử', 'Tập đoàn cứ điểm'],
    rating: 4.8,
    phone: '0215.3825.333',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_4',
    name: 'Tượng đài Chiến thắng Điện Biên Phủ (Đồi D1)',
    category: 'attractions',
    lat: 21.3875,
    lng: 103.0210,
    address: 'Đồi D1, TP. Điện Biên Phủ',
    desc: 'Tượng đài bằng đồng lớn nhất Việt Nam, tọa lạc trên đỉnh đồi D1 ngắm toàn cảnh thành phố Điện Biên Phủ.',
    tags: ['Tượng đài đồng lớn nhất', 'Đồi D1', 'Biểu tượng chiến thắng'],
    rating: 4.9,
    phone: 'Đang cập nhật',
    image: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_5',
    name: 'Sở chỉ huy Chiến dịch Điện Biên Phủ - Mường Phăng',
    category: 'attractions',
    lat: 21.4480,
    lng: 103.1490,
    address: 'Xã Mường Phăng, TP. Điện Biên Phủ',
    desc: 'Nơi Đại tướng Võ Nguyên Giáp phát lệnh tổng tấn công chiến dịch, ẩn mình dưới thảm rừng nguyên sinh Mường Phăng.',
    tags: ['Đại tướng Võ Nguyên Giáp', 'Mường Phăng', 'Hán chỉ huy rừng sâu'],
    rating: 4.9,
    phone: '0215.3825.444',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_6',
    name: 'Hồ Pá Khoang - Trái tim du lịch sinh thái',
    category: 'stay',
    lat: 21.4320,
    lng: 103.1150,
    address: 'Xã Mường Phăng & Pá Khoang, Điện Biên',
    desc: 'Hồ nước ngọt thơ mộng giữa lòng núi rừng Tây Bắc, nổi tiếng với đảo hoa đào Nhật Bản và resort sinh thái.',
    tags: ['Hồ Pá Khoang', 'Đảo hoa đào', 'Du lịch sinh thái', 'Resort núi'],
    rating: 4.8,
    phone: '0215.3825.555',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_7',
    name: 'Đèo Pha Đin - Tứ đại đỉnh đèo Tây Bắc',
    category: 'attractions',
    lat: 21.5720,
    lng: 103.5180,
    address: 'Ranh giới tỉnh Điện Biên & Sơn La',
    desc: 'Cung đường đèo huyền thoại với mây vờn đỉnh núi, ngắm toàn cảnh thung lũng mây mê hoặc phượt thủ & du khách.',
    tags: ['Tứ đại đỉnh đèo', 'Săn mây Tây Bắc', 'Cảnh quan vĩ đại'],
    rating: 4.9,
    phone: 'Đang cập nhật',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_8',
    name: 'Suối khoáng nóng U Va',
    category: 'stay',
    lat: 21.3050,
    lng: 103.0020,
    address: 'Xã Noong Luam, Huyện Điện Biên',
    desc: 'Khu du lịch suối khoáng tự nhiên giàu khoáng chất kết hợp tắm khoáng, xông hơi & ẩm thực dân tộc Thái.',
    tags: ['Suối khoáng nóng', 'Nghỉ dưỡng sức khỏe', 'Tắm khoáng U Va'],
    rating: 4.7,
    phone: '0215.3825.666',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_9',
    name: 'Khách sạn Mường Thanh Grand Điện Biên',
    category: 'stay',
    lat: 21.3865,
    lng: 103.0195,
    address: '514 Võ Nguyên Giáp, TP. Điện Biên Phủ',
    desc: 'Khách sạn 4 sao đẳng cấp tại trung tâm thành phố Điện Biên Phủ, đầy đủ tiện nghi hội nghị và ẩm thực sang trọng.',
    tags: ['Khách sạn 4 sao', 'Trung tâm thành phố', 'Hội nghị'],
    rating: 4.8,
    phone: '0215.3810.056',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_10',
    name: 'Nhà hàng Ẩm thực Dân tộc Thái Bản Ten',
    category: 'food',
    lat: 21.3620,
    lng: 103.0280,
    address: 'Bản Ten, Xã Thanh Xương, Huyện Điện Biên',
    desc: 'Trải nghiệm ẩm thực dân tộc Thái đặc sắc: Thịt trâu gác bếp, Xôi nếp nương Mường Thanh, Pa pỉnh tộp (cá nướng) & giao lưu Múa xòe.',
    tags: ['Ẩm thực dân tộc Thái', 'Múa xòe', 'Pa pỉnh tộp', 'Xôi nếp nương'],
    rating: 4.9,
    phone: '0912.888.777',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_11',
    name: 'Gạo Seng Cù Mường Thanh (OCOP 5 Sao)',
    category: 'ocop',
    lat: 21.3650,
    lng: 103.0100,
    address: 'Cánh đồng Mường Thanh, Điện Biên',
    desc: 'Sản phẩm OCOP 5 sao hạt gạo dẻo thơm trứ danh được nuôi dưỡng từ dòng sông Nậm Rốm và phù sa Mường Thanh.',
    tags: ['OCOP 5 sao', 'Gạo Seng Cù', 'Nếp Mường Thanh'],
    rating: 5.0,
    phone: '0215.3825.888',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_12',
    name: 'Chè Shan Tuyết Cổ Thụ Tủa Chùa (OCOP)',
    category: 'ocop',
    lat: 21.9150,
    lng: 103.3250,
    address: 'Huyện Tủa Chùa, Tỉnh Điện Biên',
    desc: 'Trà Shan tuyết thu hoạch từ những cây chè cổ thụ hàng trăm năm tuổi trên cao nguyên đá Tủa Chùa.',
    tags: ['OCOP 4 sao', 'Chè Shan tuyết cổ thụ', 'Tủa Chùa'],
    rating: 4.9,
    phone: '0977.333.444',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_13',
    name: 'Khu công nghiệp Nam Mường Thanh',
    category: 'biz',
    lat: 21.3400,
    lng: 103.0250,
    address: 'Huyện Điện Biên, Tỉnh Điện Biên',
    desc: 'Khu công nghiệp trọng điểm xúc tiến đầu tư phát triển nông lâm sản, chế biến thực phẩm & công nghiệp hỗ trợ.',
    tags: ['Khu công nghiệp', 'Thu hút FDI', 'Chế biến nông sản'],
    rating: 4.7,
    phone: '0215.3825.999',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_14',
    name: 'Cửa khẩu Quốc tế Tây Trang',
    category: 'biz',
    lat: 21.2150,
    lng: 102.9150,
    address: 'Xã Na Ư, Huyện Điện Biên',
    desc: 'Cửa khẩu giao thương quốc tế nối Điện Biên với tỉnh Luông Pha Băng (Lào), cửa ngõ tuyến Hành lang Kinh tế Đông - Tây.',
    tags: ['Cửa khẩu Quốc tế', 'Logistics', 'Thương mại Việt - Lào'],
    rating: 4.8,
    phone: '0215.3825.777',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_15',
    name: 'Cảng hàng không Điện Biên (Sân bay Điện Biên)',
    category: 'utilities',
    lat: 21.3970,
    lng: 103.0070,
    address: 'Phường Thanh Trường, TP. Điện Biên Phủ',
    desc: 'Sân bay quốc tế nâng cấp đón được máy bay Airbus A321/A320 kết nối Điện Biên với Hà Nội, TP.HCM & quốc tế.',
    tags: ['Sân bay Điện Biên', 'Hạ tầng Hàng không', 'Kết nối toàn quốc'],
    rating: 4.9,
    phone: '0215.3824.411',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80'
  }
];

// Category metadata for icons & badges
const CATEGORY_META = {
  all: { label: 'Tất cả địa điểm', color: '#0B5FFF', icon: '📍', pinColor: '#0B5FFF' },
  attractions: { label: 'Điểm du lịch & Di tích Lịch sử', color: '#0B5FFF', icon: '🏰', pinColor: '#0B5FFF' },
  stay: { label: 'Lưu trú / Resort', color: '#14B86A', icon: '🏨', pinColor: '#14B86A' },
  food: { label: 'Ẩm thực Tây Bắc', color: '#F6B800', icon: '🍲', pinColor: '#F6B800' },
  ocop: { label: 'Sản phẩm OCOP', color: '#14B86A', icon: '🌾', pinColor: '#14B86A' },
  utilities: { label: 'Sân bay / Y tế / Tiện ích', color: '#0B5FFF', icon: '✈️', pinColor: '#0B5FFF' },
  biz: { label: 'Doanh nghiệp & Xúc tiến', color: '#0040C1', icon: '🏢', pinColor: '#0040C1' }
};

export default function InteractiveMap() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCategory, setMapCategory] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedLocId, setSelectedLocId] = useState(null);
  const [userGps, setUserGps] = useState(null);
  const [locatingGps, setLocatingGps] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersMapRef = useRef(new Map());
  const sliderRef = useRef(null);

  // Helper to build accurate Google Maps Directions URL (uses official business POI & address)
  const getGoogleMapsDirUrl = (loc) => {
    const destinationQuery = `${loc.name}, ${loc.address}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}`;
  };

  // Filtered locations calculation
  const filteredLocations = useMemo(() => {
    return LOCATION_DATA.filter(loc => {
      const matchCat = mapCategory === 'all' || loc.category === mapCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchName = loc.name.toLowerCase().includes(q);
      const matchDesc = loc.desc.toLowerCase().includes(q);
      const matchAddr = loc.address.toLowerCase().includes(q);
      const matchTags = loc.tags.some(tag => tag.toLowerCase().includes(q));
      const matchCatLabel = (CATEGORY_META[loc.category]?.label || '').toLowerCase().includes(q);

      return matchName || matchDesc || matchAddr || matchTags || matchCatLabel;
    });
  }, [mapCategory, searchQuery]);

  // Category counts map
  const categoryCounts = useMemo(() => {
    const counts = { all: LOCATION_DATA.length };
    Object.keys(CATEGORY_META).forEach(cat => {
      if (cat !== 'all') {
        counts[cat] = LOCATION_DATA.filter(l => l.category === cat).length;
      }
    });
    return counts;
  }, []);

  // Keyboard shortcut ESC for fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Invalidate Leaflet size whenever container resizes or fullscreen toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullscreen, sidebarOpen]);

  // Reset slider position when filter changes
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [filteredLocations]);

  // Initialize Leaflet Map (PERSISTENT SINGLE MOUNT - NEVER UNMOUNTS)
  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      if (!mapContainerRef.current || mapInstanceRef.current || !isMounted) return;
      const L = window.L;
      if (!L) return;

      // Default view centered on Điện Biên Phủ
      const map = L.map(mapContainerRef.current, {
        center: [21.3857, 103.0188],
        zoom: 12,
        zoomControl: true
      });
      mapInstanceRef.current = map;
      setMapReady(true);

      // Voyager tile layer (clean & high resolution)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Load Đồ Sơn GeoJSON boundary
      fetch('/Đồ Sơn.geojson')
        .then(res => res.json())
        .then(geojson => {
          if (mapInstanceRef.current) {
            L.geoJSON(geojson, {
              style: {
                color: '#0284c7',
                weight: 3,
                opacity: 0.85,
                fillColor: '#38bdf8',
                fillOpacity: 0.12,
                dashArray: '5, 5'
              }
            }).addTo(mapInstanceRef.current);
          }
        })
        .catch(err => console.log('GeoJSON load note:', err));
    };

    if (window.L) {
      initMap();
    } else {
      // Inject Leaflet CSS & JS dynamically if not loaded
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => initMap();
        document.body.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Markers on Map whenever filteredLocations or mapReady changes
  useEffect(() => {
    const L = window.L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    // Clear previous markers
    markersMapRef.current.forEach((marker) => {
      map.removeLayer(marker);
    });
    markersMapRef.current.clear();

    // Create custom pins for each location with CATEGORY EMOJI ICON
    filteredLocations.forEach((loc, index) => {
      const meta = CATEGORY_META[loc.category] || CATEGORY_META.all;

      // Custom HTML DivIcon Pin displaying Category Emoji Icon (🏰, 🏨, 🍤, 🏅, 🏥, 🏢)
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${meta.pinColor};
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2.5px solid #ffffff;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 16px;
              line-height: 1;
            ">${meta.icon}</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -34]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

      // Custom Rich Popup Content
      const googleMapsDirUrl = getGoogleMapsDirUrl(loc);
      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; width: 270px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="
              background-color: ${meta.color}15;
              color: ${meta.color};
              font-weight: 700;
              font-size: 10.5px;
              padding: 3px 8px;
              border-radius: 12px;
              text-transform: uppercase;
            ">
              ${meta.icon} ${meta.label}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #d97706;">
              ★ ${loc.rating}
            </span>
          </div>

          <h3 style="font-size: 15px; font-weight: 800; color: #0c2340; margin: 0 0 6px 0; line-height: 1.35;">
            #${index + 1}. ${loc.name}
          </h3>

          <p style="font-size: 12px; color: #475569; margin: 0 0 8px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
            ${loc.desc}
          </p>

          <div style="font-size: 11.5px; color: #64748b; margin-bottom: 10px; display: flex; align-items: flex-start; gap: 4px;">
            <span>📍</span>
            <span style="flex: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${loc.address}</span>
          </div>

          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;">
            ${loc.tags.slice(0, 3).map(t => `<span style="font-size: 10px; background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px;">#${t}</span>`).join('')}
          </div>

          <div style="display: flex; gap: 6px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
            <a href="${googleMapsDirUrl}" target="_blank" rel="noopener noreferrer" style="
              flex: 1;
              background-color: #0284c7;
              color: #ffffff;
              text-decoration: none;
              text-align: center;
              font-size: 11.5px;
              font-weight: 700;
              padding: 6px 10px;
              border-radius: 6px;
              display: inline-block;
            ">
              🗺️ Chỉ đường
            </a>
            <button onclick="window.askAiAboutLoc('${encodeURIComponent(loc.name)}')" style="
              flex: 1;
              background-color: #f0f9ff;
              color: #0369a1;
              border: 1px solid #bae6fd;
              font-size: 11.5px;
              font-weight: 700;
              padding: 6px 10px;
              border-radius: 6px;
              cursor: pointer;
            ">
              🤖 Hỏi AI
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedLocId(loc.id);
        if (sliderRef.current && sliderRef.current.children[index]) {
          sliderRef.current.children[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });

      markersMapRef.current.set(loc.id, marker);
    });

    // Attach global ask AI handler for popup button
    window.askAiAboutLoc = (encodedName) => {
      const name = decodeURIComponent(encodedName);
      navigate(`/ai-chat?q=${encodeURIComponent('Cho tôi thông tin chi tiết và kinh nghiệm tham quan ' + name + ' ở Đồ Sơn')}`);
    };

    // Auto-fit bounds if filtered items exist
    if (filteredLocations.length > 0 && map) {
      if (filteredLocations.length === 1) {
        const single = filteredLocations[0];
        map.flyTo([single.lat, single.lng], 16, { duration: 1 });
        const m = markersMapRef.current.get(single.id);
        if (m) m.openPopup();
      } else {
        const bounds = L.latLngBounds(filteredLocations.map(l => [l.lat, l.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  }, [filteredLocations, mapReady, navigate]);

  // Locate User GPS
  const handleLocateGps = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ Định vị GPS.');
      return;
    }

    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocatingGps(false);
        const { latitude, longitude } = pos.coords;
        setUserGps({ lat: latitude, lng: longitude });

        const L = window.L;
        const map = mapInstanceRef.current;
        if (L && map) {
          map.flyTo([latitude, longitude], 15);
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'gps-user-pin',
              html: `<div style="background:#ef4444; width:18px; height:18px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 12px #ef4444;"></div>`,
              iconSize: [18, 18],
              iconAnchor: [9, 9]
            })
          }).addTo(map).bindPopup('📍 Vị trí GPS hiện tại của bạn').openPopup();
        }
      },
      (err) => {
        setLocatingGps(false);
        alert('Không thể lấy vị trí GPS. Vui lòng cho phép quyền vị trí trên trình duyệt.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fly to location when clicking a card
  const handleSelectCard = (loc) => {
    setSelectedLocId(loc.id);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([loc.lat, loc.lng], 16, { duration: 1 });
      const marker = markersMapRef.current.get(loc.id);
      if (marker) {
        marker.openPopup();
      }
    }
  };

  // Scroll Slider horizontally
  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Jump to specific card by index
  const jumpToCard = (idx, loc) => {
    if (sliderRef.current && sliderRef.current.children[idx]) {
      sliderRef.current.children[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    handleSelectCard(loc);
  };

  // Toggle Fullscreen Mode
  const toggleFullscreen = () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    if (nextState) {
      setSidebarOpen(true);
    }
  };

  return (
    <div 
      className={isFullscreen ? 'fullscreen-map-wrapper' : 'standard-map-wrapper'}
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 99999 : 1,
        backgroundColor: '#ffffff',
        borderRadius: isFullscreen ? 0 : '20px',
        border: isFullscreen ? 'none' : '1px solid #e2e8f0',
        padding: isFullscreen ? 0 : '1.5rem',
        boxShadow: isFullscreen ? 'none' : '0 4px 20px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : 'auto',
        overflow: isFullscreen ? 'hidden' : 'visible'
      }}
    >
      {/* 
        1. STANDARD INLINE HEADER & FILTERS (RENDERED BEFORE MAP IN INLINE MODE)
      */}
      {!isFullscreen && (
        <>
          {/* MAP HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('map_badge')}
                </span>
                <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                  {filteredLocations.length} / {LOCATION_DATA.length} {t('map_filter_all')}
                </span>
              </div>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #0c2340 0%, #0284c7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                {t('map_title')}
              </h2>
            </div>

            {/* Action Controls Top Right */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                onClick={handleLocateGps}
                disabled={locatingGps}
                style={{ 
                  backgroundColor: locatingGps ? '#e2e8f0' : '#f8fafc', 
                  color: '#334155',
                  border: '1px solid #cbd5e1', 
                  borderRadius: '10px', 
                  padding: '8px 14px', 
                  fontSize: '12.5px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                📍 {locatingGps ? 'Đang định vị...' : t('map_gps_btn')}
              </button>

              <button 
                onClick={toggleFullscreen}
                style={{ 
                  backgroundColor: '#f0f9ff', 
                  color: '#0284c7',
                  border: '1px solid #bae6fd', 
                  borderRadius: '10px', 
                  padding: '8px 14px', 
                  fontSize: '12.5px', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                ⛶ {t('map_fullscreen_btn')} (Chuyên nghiệp)
              </button>

              <button 
                onClick={() => navigate('/ai-chat')}
                style={{ 
                  backgroundColor: '#0284c7', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '10px', 
                  padding: '8px 14px', 
                  fontSize: '12.5px', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                }}
              >
                🤖 {t('map_ask_ai_btn')}
              </button>
            </div>
          </div>

          {/* SEARCH BOX & FILTERS ROW */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.2rem' }}>
            {/* Search Input Box */}
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Tìm kiếm bãi tắm, biệt thự Bảo Đại, ngọn hải đăng, resort, hải sản, sản phẩm OCOP..."
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = '#0284c7';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.borderColor = '#cbd5e1';
                }}
              />
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#e2e8f0',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'thin' }}>
              {Object.keys(CATEGORY_META).map((cat) => {
                const isSelected = mapCategory === cat;
                const meta = CATEGORY_META[cat];
                const count = categoryCounts[cat] || 0;

                return (
                  <button
                    key={cat}
                    onClick={() => setMapCategory(cat)}
                    style={{
                      backgroundColor: isSelected ? meta.color : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#334155',
                      border: isSelected ? 'none' : '1px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '7px 14px',
                      fontSize: '12.5px',
                      fontWeight: isSelected ? '700' : '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 4px 12px ${meta.color}40` : 'none'
                    }}
                  >
                    <span>{meta.icon}</span>
                    <span>{t(`map_filter_${cat}`)}</span>
                    <span style={{
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                      color: isSelected ? '#ffffff' : '#475569',
                      fontSize: '11px',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontWeight: '700'
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* 
        2. CRITICAL: PERSISTENT LEAFLET MAP CANVAS DOM NODE
        NEVER INSIDE ANY CONDITIONAL TERNARY OPERATOR!
        ALWAYS REMAINS MOUNTED IN THE EXACT SAME POSITION IN THE REACT DOM TREE!
      */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: isFullscreen ? '100vh' : '420px', 
          position: isFullscreen ? 'absolute' : 'relative',
          inset: isFullscreen ? 0 : 'auto',
          borderRadius: isFullscreen ? 0 : '16px', 
          overflow: 'hidden', 
          border: isFullscreen ? 'none' : '1px solid #cbd5e1', 
          marginBottom: isFullscreen ? 0 : '1.2rem',
          zIndex: 1,
          backgroundColor: '#cbd5e1'
        }}
      />

      {/* 
        3. STANDARD INLINE LOCATION SLIDER (RENDERED BELOW MAP IN INLINE MODE)
      */}
      {!isFullscreen && (
        <div style={{ marginTop: '0.5rem' }}>
          {/* Slider Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0c2340', margin: 0 }}>
                Danh sách địa điểm ({filteredLocations.length})
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                • Dạng slide 1 hàng (Lướt xem nhanh)
              </span>
            </div>

            {/* Slider Prev / Next Controls */}
            {filteredLocations.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => scrollSlider('left')}
                  title="Lướt sang trái"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#334155',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                  }}
                >
                  ◀
                </button>
                <button
                  onClick={() => scrollSlider('right')}
                  title="Lướt sang phải"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#334155',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                  }}
                >
                  ▶
                </button>
              </div>
            )}
          </div>

          {/* Quick Index Jump Pills (#1, #2, #3...) */}
          {filteredLocations.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '8px',
              scrollbarWidth: 'none'
            }}>
              {filteredLocations.map((loc, idx) => {
                const isSelected = selectedLocId === loc.id;
                const meta = CATEGORY_META[loc.category] || CATEGORY_META.all;
                return (
                  <button
                    key={`pill_${loc.id}`}
                    onClick={() => jumpToCard(idx, loc)}
                    style={{
                      backgroundColor: isSelected ? '#0284c7' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#475569',
                      border: isSelected ? 'none' : '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '3px 9px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{meta.icon}</span>
                    <span>#{idx + 1}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Horizontal Slider (Single Row) */}
          {filteredLocations.length > 0 ? (
            <div
              ref={sliderRef}
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                padding: '8px 2px 14px 2px',
                scrollbarWidth: 'thin'
              }}
            >
              {filteredLocations.map((loc, index) => {
                const meta = CATEGORY_META[loc.category] || CATEGORY_META.all;
                const isSelected = selectedLocId === loc.id;
                const googleMapsDirUrl = getGoogleMapsDirUrl(loc);

                return (
                  <div
                    key={loc.id}
                    onClick={() => handleSelectCard(loc)}
                    style={{
                      minWidth: '290px',
                      maxWidth: '290px',
                      flexShrink: 0,
                      scrollSnapAlign: 'start',
                      backgroundColor: '#ffffff',
                      border: isSelected ? `2px solid ${meta.color}` : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.2rem 1.1rem 1.1rem 1.1rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? `0 8px 24px ${meta.color}30` : '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                      }
                    }}
                  >
                    {/* Stylized Index Badge (#01, #02...) */}
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '14px',
                      backgroundColor: isSelected ? meta.color : '#0c2340',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      letterSpacing: '0.03em'
                    }}>
                      #{String(index + 1).padStart(2, '0')}
                    </div>

                    <div>
                      {/* Category & Rating */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginTop: '2px' }}>
                        <span style={{
                          backgroundColor: `${meta.color}15`,
                          color: meta.color,
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '10px'
                        }}>
                          {meta.icon} {meta.label}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#d97706' }}>
                          ★ {loc.rating}
                        </span>
                      </div>

                      {/* Location Name */}
                      <h4 style={{ fontSize: '14.5px', fontWeight: '800', color: '#0c2340', margin: '0 0 6px 0', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {loc.name}
                      </h4>

                      {/* Short Description */}
                      <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px 0', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {loc.desc}
                      </p>
                    </div>

                    <div>
                      {/* Address */}
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>📍</span>
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{loc.address}</span>
                      </div>

                      {/* Bottom Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: '700' }}>
                          🎯 Định vị bản đồ
                        </span>
                        <a
                          href={googleMapsDirUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: '11px',
                            color: '#ffffff',
                            backgroundColor: '#0284c7',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: '700'
                          }}
                        >
                          Chỉ đường
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 8px 0' }}>
                Không tìm thấy địa điểm nào khớp với bộ lọc & từ khóa tìm kiếm.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setMapCategory('all'); }}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Xóa bộ lọc & Thử lại
              </button>
            </div>
          )}
        </div>
      )}

      {/* 
        4. FULLSCREEN FLOATING OVERLAYS (ONLY ACTIVE WHEN ISFULLSCREEN IS TRUE)
      */}
      {isFullscreen && (
        <>
          {/* FLOATING ACTION BAR (TOP RIGHT) */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 1000,
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <button 
              onClick={handleLocateGps}
              disabled={locatingGps}
              style={{ 
                backgroundColor: '#ffffff', 
                color: '#334155',
                border: '1px solid #cbd5e1', 
                borderRadius: '10px', 
                padding: '10px 16px', 
                fontSize: '13px', 
                fontWeight: '700', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}
            >
              📍 {locatingGps ? 'Đang định vị...' : t('map_gps_btn')}
            </button>

            <button 
              onClick={() => navigate('/ai-chat')}
              style={{ 
                backgroundColor: '#0284c7', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '10px', 
                padding: '10px 16px', 
                fontSize: '13px', 
                fontWeight: '700', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
              }}
            >
              🤖 {t('map_ask_ai_btn')}
            </button>

            <button 
              onClick={toggleFullscreen}
              style={{ 
                backgroundColor: '#0c2340', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '10px', 
                padding: '10px 16px', 
                fontSize: '13px', 
                fontWeight: '700', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
              }}
            >
              ✕ Thu nhỏ (ESC)
            </button>
          </div>

          {/* FLOATING TOGGLE BUTTON IF SIDEBAR COLLAPSED */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 1000,
                backgroundColor: '#ffffff',
                color: '#0c2340',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>▶ Danh sách địa điểm</span>
              <span style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '11px', padding: '2px 7px', borderRadius: '10px' }}>
                {filteredLocations.length}
              </span>
            </button>
          )}

          {/* FLOATING GOOGLE MAPS STYLE LEFT SIDEBAR PANEL */}
          {sidebarOpen && (
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              bottom: '16px',
              width: '360px',
              maxWidth: 'calc(100vw - 32px)',
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.97)',
              backdropFilter: 'blur(12px)',
              borderRadius: '18px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              {/* Sidebar Header: Search & Close Button */}
              <div style={{ padding: '14px 14px 10px 14px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase' }}>
                    🗺️ BẢN ĐỒ ĐỒ SƠN ({filteredLocations.length})
                  </span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    title="Ẩn thanh bên"
                    style={{
                      background: '#f1f5f9',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    ◀ Ẩn danh sách
                  </button>
                </div>

                {/* Search Box */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="🔍 Tìm kiếm địa điểm, bãi tắm, resort..."
                    style={{
                      width: '100%',
                      padding: '10px 36px 10px 36px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#94a3b8' }}>
                    🔍
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: '#e2e8f0',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        color: '#475569'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Filter Pills inside Sidebar */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingTop: '10px', scrollbarWidth: 'none' }}>
                  {Object.keys(CATEGORY_META).map((cat) => {
                    const isSelected = mapCategory === cat;
                    const meta = CATEGORY_META[cat];

                    return (
                      <button
                        key={`side_${cat}`}
                        onClick={() => setMapCategory(cat)}
                        style={{
                          backgroundColor: isSelected ? meta.color : '#f1f5f9',
                          color: isSelected ? '#ffffff' : '#334155',
                          border: 'none',
                          borderRadius: '14px',
                          padding: '5px 11px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {meta.icon} {t(`map_filter_${cat}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Scrollable Vertical Places List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc, index) => {
                    const meta = CATEGORY_META[loc.category] || CATEGORY_META.all;
                    const isSelected = selectedLocId === loc.id;
                    const googleMapsDirUrl = getGoogleMapsDirUrl(loc);

                    return (
                      <div
                        key={`side_card_${loc.id}`}
                        onClick={() => handleSelectCard(loc)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: isSelected ? `2px solid ${meta.color}` : '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          boxShadow: isSelected ? `0 4px 14px ${meta.color}25` : '0 2px 4px rgba(0,0,0,0.03)',
                          transition: 'all 0.15s ease',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: meta.color }}>
                            #{String(index + 1).padStart(2, '0')} • {meta.icon} {meta.label}
                          </span>
                          <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#d97706' }}>
                            ★ {loc.rating}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: '#0c2340', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                          {loc.name}
                        </h4>

                        <p style={{ fontSize: '11.5px', color: '#475569', margin: '0 0 8px 0', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {loc.desc}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            📍 {loc.address.split(',')[0]}
                          </span>
                          <a
                            href={googleMapsDirUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              fontSize: '10.5px',
                              color: '#ffffff',
                              backgroundColor: '#0284c7',
                              padding: '3px 8px',
                              borderRadius: '5px',
                              textDecoration: 'none',
                              fontWeight: '700'
                            }}
                          >
                            Chỉ đường
                          </a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '13px' }}>
                    Không tìm thấy địa điểm nào.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
