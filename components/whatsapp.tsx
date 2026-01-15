"use client";

import React, { useState } from 'react';

interface WhatsAppButtonProps {
  message?: string; // Tornar message opcional
  buttonColor?: string;
  buttonText?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showIcon?: boolean;
  phoneNumber?: string; // Opcional - se não fornecer, usa o número fixo
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message = 'Olá! Gostaria de mais informações.', // Mensagem padrão
  buttonColor = '#25D366',
  buttonText = 'Fale conosco no WhatsApp',
  position = 'bottom-right',
  showIcon = true,
  phoneNumber = '5519997785025' // Número padrão fixo
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPhoneNumber = (number: string): string => {
    return number.replace(/\D/g, '');
  };

  const whatsappLink = `https://wa.me/${formatPhoneNumber(phoneNumber)}?text=${encodeURIComponent(message)}`;
  
  // Alternativa com api.whatsapp.com:
  // const whatsappLink = `https://api.whatsapp.com/send?phone=${formatPhoneNumber(phoneNumber)}&text=${encodeURIComponent(message)}`;

  const getPositionStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 1000,
      padding: '12px 24px',
      borderRadius: '50px',
      backgroundColor: isHovered ? '#128C7E' : buttonColor,
      color: 'white',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      fontWeight: 600,
      fontSize: '15px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    };

    switch (position) {
      case 'bottom-right':
        return { ...baseStyle, bottom: '30px', right: '30px' };
      case 'bottom-left':
        return { ...baseStyle, bottom: '30px', left: '30px' };
      case 'top-right':
        return { ...baseStyle, top: '30px', right: '30px' };
      case 'top-left':
        return { ...baseStyle, top: '30px', left: '30px' };
      default:
        return { ...baseStyle, bottom: '30px', right: '30px' };
    }
  };

  const iconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    filter: 'brightness(0) invert(1)',
    transition: 'transform 0.3s ease',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
  };

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      style={getPositionStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="whatsapp-button"
      aria-label="Entre em contato via WhatsApp"
    >
      {showIcon && (
        <svg
          style={iconStyle}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
        </svg>
      )}
      {buttonText}
    </a>
  );
};

export default WhatsAppButton;