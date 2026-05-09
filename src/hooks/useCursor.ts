import { useEffect, useRef } from 'react';

export const useCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let rx = mx, ry = my;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const spawnRipple = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const el = document.createElement('span');
      el.className = 'tap-ripple';
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      document.body.appendChild(el);
      requestAnimationFrame(() => el.classList.add('tap-ripple-active'));
      setTimeout(() => el.remove(), 520);
    };

    const animate = () => {
      cx += (mx - cx) * 0.4;
      cy += (my - cy) * 0.4;
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;

      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('pointerdown', spawnRipple, true);
    const animationFrame = requestAnimationFrame(animate);

    const handleHover = () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      ring.style.width = '60px';
      ring.style.height = '60px';
    };

    const handleLeave = () => {
      cursor.style.width = '16px';
      cursor.style.height = '16px';
      ring.style.width = '40px';
      ring.style.height = '40px';
    };

    const interactiveEls = document.querySelectorAll('a, button, .skill-card, .project-card, .stat-item');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerdown', spawnRipple, true);
      cancelAnimationFrame(animationFrame);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  return { cursorRef, ringRef };
};
