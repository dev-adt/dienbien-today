import React, { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export const FloatingAIBot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'ai',
      text: 'Xin chào! Tôi là AI Điện Biên. Tôi có thể giúp bạn:\n✓ Tìm điểm du lịch\n✓ Đặt lịch trình\n✓ Tra cứu doanh nghiệp\n✓ Tìm cơ hội đầu tư\n✓ Hướng dẫn sự kiện\n✓ Giới thiệu văn hóa\n✓ Giải đáp thông tin địa phương'
    }
  ]);

  const quickPrompts = [
    { label: '🗺️ Điểm du lịch Điện Biên', prompt: 'Gợi ý các điểm du lịch nổi tiếng nhất ở Điện Biên' },
    { label: '📅 Đặt lịch trình 3N2Đ', prompt: 'Lên lịch trình du lịch Điện Biên 3 ngày 2 đêm' },
    { label: '🏢 Doanh nghiệp & FDI', prompt: 'Tra cứu danh sách doanh nghiệp và cơ hội đầu tư Điện Biên' },
    { label: '🌾 Sản phẩm OCOP', prompt: 'Giới thiệu sản phẩm OCOP đặc sản Điện Biên' },
    { label: '🌸 Văn hóa & Lễ hội', prompt: 'Tìm hiểu lễ hội Hoa Ban và văn hóa dân tộc Thái' },
  ];

  const handleSend = (textToSend) => {
    const prompt = textToSend || userInput;
    if (!prompt.trim()) return;

    // Add User Message
    setChatHistory(prev => [...prev, { sender: 'user', text: prompt }]);
    setUserInput('');

    // AI Response simulation
    setTimeout(() => {
      let responseText = `Cảm ơn câu hỏi của bạn về "${prompt}". Trợ lý AI Điện Biên đang truy xuất dữ liệu từ Digital City Brand Database... Bạn có thể khám phá thêm tại các danh mục trên website hoặc trao đổi trực tiếp với tôi!`;
      if (prompt.includes('du lịch') || prompt.includes('lịch trình')) {
        responseText = `🤖 AI Điện Biên gợi ý lịch trình 3N2Đ:\n• Ngày 1: Đồi A1 - Bảo tàng Chiến thắng - Hầm Đờ Cát\n• Ngày 2: Sở chỉ huy Mường Phăng - Hồ Pá Khoang\n• Ngày 3: Chinh phục Đèo Pha Đin - Trải nghiệm Suối khoáng U Va & Múa xòe Thái.`;
      } else if (prompt.includes('đầu tư') || prompt.includes('doanh nghiệp')) {
        responseText = `💼 Xúc tiến đầu tư Điện Biên:\nTỉnh Điện Biên ưu đãi đầu tư vào các KCN Nam Mường Thanh, hạ tầng Logistics cửa khẩu Tây Trang & Cảng hàng không Điện Biên.`;
      }

      setChatHistory(prev => [...prev, { sender: 'ai', text: responseText }]);
    }, 800);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setUserInput('Gợi ý cho tôi các điểm du lịch lịch sử ở Điện Biên');
      }, 3000);
    }
  };

  return (
    <div
      id="ai-assistant"
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}
    >
      {/* Interactive Floating Chat Window */}
      {isOpen && (
        <div
          style={{
            width: '360px',
            maxHeight: '520px',
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            marginBottom: '16px',
            backdropFilter: 'blur(12px)',
            animation: 'floatY 0.4s ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0B5FFF 0%, #14B86A 100%)',
              color: '#ffffff',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px'
                }}
              >
                <img src="/favicon.svg" alt="AI Điện Biên" style={{ width: '100%', height: '100%' }} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Trợ lý AI Điện Biên</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Digital City Brand Powered by AI</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#ffffff',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="ti ti-x" style={{ fontSize: '1rem' }}></i>
            </button>
          </div>

          {/* Chat Messages Body */}
          <div
            style={{
              padding: '14px',
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '300px',
              backgroundColor: 'var(--surface-0)'
            }}
          >
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  backgroundColor: msg.sender === 'user' ? '#0B5FFF' : 'var(--surface-2)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  whiteSpace: 'pre-line',
                  border: msg.sender === 'ai' ? '1px solid var(--border)' : 'none'
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--surface-2)', borderTop: '1px solid var(--border)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.prompt)}
                style={{
                  background: 'var(--surface-0)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Box with Voice Button */}
          <div style={{ padding: '10px 12px', backgroundColor: 'var(--surface-2)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleVoice}
              title={isListening ? "Đang nghe giọng nói..." : "Nói chuyện bằng Giọng nói AI (Voice)"}
              style={{
                background: isListening ? '#EF4444' : 'var(--surface-0)',
                color: isListening ? '#ffffff' : '#0B5FFF',
                border: '1px solid var(--border)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <i className={isListening ? "ti ti-microphone-off" : "ti ti-microphone"} style={{ fontSize: '1.1rem' }}></i>
            </button>

            <input
              type="text"
              placeholder={isListening ? "Đang lắng nghe giọng nói..." : "Hỏi AI Điện Biên..."}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                outline: 'none',
                backgroundColor: 'var(--surface-0)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />

            <button
              onClick={() => handleSend()}
              style={{
                background: '#0B5FFF',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <i className="ti ti-send" style={{ fontSize: '1rem' }}></i>
            </button>
          </div>
        </div>
      )}

      {/* Main Glowing Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ai-bot-pulse animate-float"
        title="Trò chuyện với AI Điện Biên"
        style={{
          background: 'linear-gradient(135deg, #0B5FFF 0%, #14B86A 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50px',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(11, 95, 255, 0.4)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#ffffff', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/favicon.svg" alt="AI Điện Biên" style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.02em', color: '#ffffff' }}>AI Điện Biên</div>
          <div style={{ fontSize: '0.7rem', color: '#F6B800', fontWeight: '700' }}>● Trợ lý 24/7</div>
        </div>
      </button>
    </div>
  );
};

export default FloatingAIBot;
