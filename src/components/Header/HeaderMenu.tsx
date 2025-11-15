import React, { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const HeaderMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10"
        style={{ background: 'transparent', border: 'none' }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl overflow-hidden z-50 animate-slide-down"
          style={{
            background: 'linear-gradient(135deg, #d73719 0%, #b02b13 100%)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="py-2">
            <a
              href="/contacto"
              className="block px-4 py-3 text-white font-semibold transition-all duration-200 hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </a>
            <a
              href="/sugerir-juego"
              className="block px-4 py-3 text-white font-semibold transition-all duration-200 hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              Dinos tu juego
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
