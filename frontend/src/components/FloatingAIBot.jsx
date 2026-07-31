import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export const FloatingAIBot = () => {
  const { t } = useTranslation();

  return (
    <a
      href="https://chatgpt.com/g/g-6a696c51b9088191b8f3a0c54a04ef66-doson-today"
      target="_blank"
      rel="noopener noreferrer"
      className="floating-ai-bot"
      title={t('floating_ai_tooltip') || "Trợ lý AI Doson.today"}
      style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, filter 0.3s ease'
      }}
    >
      <div
        className="floating-ai-icon-wrapper"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          padding: '3px',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.45), 0 0 0 4px rgba(2, 132, 199, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <img
          src="/ai_robot_avatar-removebg.png"
          alt="AI Assistant"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '50%',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }}
        />
        <span
          style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '12px',
            height: '12px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            border: '2px solid #ffffff'
          }}
          title="Online"
        />
      </div>
      <span
        style={{
          marginTop: '6px',
          backgroundColor: 'rgba(12, 35, 64, 0.88)',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: '600',
          padding: '3px 8px',
          borderRadius: '12px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          whiteSpace: 'nowrap'
        }}
      >
        {t('floating_ai_label') || "Trợ lý AI"}
      </span>
    </a>
  );
};

export default FloatingAIBot;
