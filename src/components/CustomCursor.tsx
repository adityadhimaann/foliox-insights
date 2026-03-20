import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop
    const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;
    if (isMobile) return;

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, [role="button"], .cursor-pointer')) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };
    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.removeEventListener('mouseleave', leave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-screen"
      style={{
        width: hovering ? 28 : 10,
        height: hovering ? 28 : 10,
        background: 'rgba(0,229,160,0.6)',
        transform: `translate(${pos.x - (hovering ? 14 : 5)}px, ${pos.y - (hovering ? 14 : 5)}px)`,
        transition: 'width 80ms, height 80ms, transform 80ms',
        boxShadow: hovering ? '0 0 20px rgba(0,229,160,0.3)' : 'none',
      }}
    />
  );
};

export default CustomCursor;
