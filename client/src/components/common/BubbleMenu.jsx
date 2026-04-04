import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { LayoutDashboard, ReceiptText, LineChart, ArrowLeft, X } from 'lucide-react';
import './BubbleMenu.css';

const DEFAULT_ITEMS = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    page: 'dashboard',
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'Transactions',
    icon: <ReceiptText size={20} />,
    page: 'transactions',
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'Insights',
    icon: <LineChart size={20} />,
    page: 'insights',
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#fff',
  menuContentColor = '#111',
  items,
  animationEase = 'elastic.out(1, 0.8)',
  animationDuration = 0.6,
  staggerDelay = 0.08,
  onNavigate,
  activePage
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef(null);
  const itemsRef = useRef([]);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  const handleItemClick = (e, targetPage) => {
    e.preventDefault();
    onNavigate?.(targetPage);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const cards = itemsRef.current.filter(Boolean);

    if (!overlay || !cards.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex', opacity: 0 });
      gsap.to(overlay, { opacity: 1, duration: 0.3 });
      
      gsap.killTweensOf(cards);
      gsap.set(cards, { x: -20, opacity: 0, scale: 0.9 });

      gsap.to(cards, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: animationDuration,
        ease: animationEase,
        stagger: staggerDelay
      });
    } else if (showOverlay) {
      gsap.to(cards, {
        x: 20,
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power3.in',
        stagger: {
          each: 0.05,
          from: 'end'
        }
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        delay: 0.2,
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        }
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  return (
    <>
      <nav className={`bubble-menu ${className || ''}`} style={style}>
        <div className="bubble logo-bubble" onClick={() => onNavigate?.('dashboard')}>
          {logo || 'FIQ'}
        </div>

        <button
          type="button"
          className={`bubble toggle-bubble menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
        >
          {isMenuOpen ? (
            <X size={20} />
          ) : (
            <div className="flex flex-col items-center">
              <span className="menu-line" />
              <span className="menu-line short" />
            </div>
          )}
        </button>
      </nav>

      {showOverlay && (
        <div
          ref={overlayRef}
          className="bubble-menu-items"
          onClick={(e) => e.target === e.currentTarget && setIsMenuOpen(false)}
        >
          <ul className="pill-list">
            {menuItems.map((item, idx) => (
              <li key={item.label} ref={el => itemsRef.current[idx] = el}>
                <a
                  href={`#${item.page}`}
                  onClick={(e) => handleItemClick(e, item.page)}
                  className="pill-link"
                  style={{ '--hover-bg': item.hoverStyles?.bgColor }}
                >
                  <span className="item-icon" style={{ backgroundColor: item.hoverStyles?.bgColor }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
            
            {/* Dedicated Back Navigation */}
            <li ref={el => itemsRef.current[menuItems.length] = el}>
              <button
                onClick={(e) => handleItemClick(e, 'dashboard')}
                className="pill-link back-item"
              >
                <span className="item-icon bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <ArrowLeft size={18} />
                </span>
                <span>Back Home</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
