import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  twinkle: number;
  twinkleSpeed: number;
  driftX: number;
  driftY: number;
  offsetX: number;
  offsetY: number;
}

interface Nebula {
  x: number;
  y: number;
  r: number;
  hue: number;
  alpha: number;
  vx: number;
  vy: number;
}

interface Planet {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  r: number;
  color: string;
  glow: string;
  ring?: boolean;
  ringColor?: string;
  ringTilt?: number;
  ringRotation: number;
  ringSpeed: number;
  ringBands?: number;
  vx: number;
  vy: number;
  motionVX: number;
  motionVY: number;
  textureSeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  speed: number;
  angle: number;
  life: number;
  color: string;
}

export const useGalaxy = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const planetsRef = useRef<Planet[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false, isHold: false });
  const timeRef = useRef(0);

  const IS_EDGE_BROWSER = typeof navigator !== 'undefined' && /\bEdg\//.test(navigator.userAgent);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Initial setup
    const STAR_COUNT = IS_EDGE_BROWSER ? 400 : 850;
    starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * 2400 - 1200,
      y: Math.random() * 2400 - 1200,
      z: Math.random() * 2400,
      size: Math.random() * 0.75 + 0.08,
      color: ['#ffffff', '#f4f8ff', '#e8f0ff', '#fff6df', '#dff4ff'][Math.floor(Math.random() * 5)],
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.03,
      driftX: (Math.random() - 0.5) * 0.2,
      driftY: (Math.random() - 0.5) * 0.2,
      offsetX: 0,
      offsetY: 0,
    }));

    const NEBULA_COUNT = IS_EDGE_BROWSER ? 3 : 5;
    nebulaeRef.current = Array.from({ length: NEBULA_COUNT }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 150 + Math.random() * 300,
      hue: [160, 200, 280, 340, 60, 120][i],
      alpha: 0.04 + Math.random() * 0.06,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
    }));

    planetsRef.current = [
      { x: W * 0.15, y: H * 0.25, r: 58, color: '#78a1b3', glow: '#9fc7db', ring: true, ringColor: 'rgba(210,225,235,0.34)', ringTilt: 0.34, ringRotation: 0, ringSpeed: 0.006, ringBands: 3, vx: 0.03, vy: 0.02, motionVX: 0, motionVY: 0, textureSeed: Math.random() * 1000, homeX: W * 0.15, homeY: H * 0.25 },
      { x: W * 0.85, y: H * 0.6, r: 42, color: '#b07a63', glow: '#d59c82', ring: false, ringRotation: 0, ringSpeed: 0, vx: -0.04, vy: 0.015, motionVX: 0, motionVY: 0, textureSeed: Math.random() * 1000, homeX: W * 0.85, homeY: H * 0.6 },
      { x: W * 0.75, y: H * 0.15, r: 30, color: '#7f90a8', glow: '#a8b7cc', ring: true, ringColor: 'rgba(190,206,226,0.3)', ringTilt: 0.5, ringRotation: Math.PI / 4, ringSpeed: -0.01, ringBands: 2, vx: 0.02, vy: -0.03, motionVX: 0, motionVY: 0, textureSeed: Math.random() * 1000, homeX: W * 0.75, homeY: H * 0.15 },
      { x: W * 0.1, y: H * 0.75, r: 34, color: '#9a8f6b', glow: '#c5b88e', ring: false, ringRotation: 0, ringSpeed: 0, vx: 0.035, vy: -0.02, motionVX: 0, motionVY: 0, textureSeed: Math.random() * 1000, homeX: W * 0.1, homeY: H * 0.75 },
      { x: W * 0.62, y: H * 0.78, r: 26, color: '#7f6a7a', glow: '#b094a9', ring: false, ringRotation: 0, ringSpeed: 0, vx: -0.022, vy: 0.018, motionVX: 0, motionVY: 0, textureSeed: Math.random() * 1000, homeX: W * 0.62, homeY: H * 0.78 },
      { x: W * 0.28, y: H * 0.12, r: 24, color: '#6e8b79', glow: '#98b8a5', ring: true, ringColor: 'rgba(188,210,198,0.3)', ringTilt: 0.62, ringRotation: Math.PI / 3, ringSpeed: 0.008, ringBands: 2, vx: 0.018, vy: 0.02, motionVX: 0, motionVY: 0, textureSeed: Math.random() * 1000, homeX: W * 0.28, homeY: H * 0.12 },
    ];

    const animate = () => {
      timeRef.current++;
      ctx.clearRect(0, 0, W, H);

      // Background
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H));
      bg.addColorStop(0, '#09235a');
      bg.addColorStop(0.45, '#04143c');
      bg.addColorStop(1, '#020b24');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Nebulae
      nebulaeRef.current.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -300) n.x = W + 300;
        if (n.x > W + 300) n.x = -300;
        if (n.y < -300) n.y = H + 300;
        if (n.y > H + 300) n.y = -300;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, `hsla(${n.hue}, 100%, 60%, ${n.alpha})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Stars
      const maxDepth = 4200;
      const STAR_INTERACTION_RADIUS = 150;
      starsRef.current.forEach(s => {
        s.z -= 0.26;
        if (s.z <= 0) {
          s.z = maxDepth;
          s.x = Math.random() * 2400 - 1200;
          s.y = Math.random() * 2400 - 1200;
        }
        s.twinkle += s.twinkleSpeed;
        s.x += s.driftX;
        s.y += s.driftY;

        let px = (s.x / s.z) * W + W / 2 + s.offsetX;
        let py = (s.y / s.z) * H + H / 2 + s.offsetY;

        if (mouseRef.current.isHold) {
          const dx = mouseRef.current.x - px;
          const dy = mouseRef.current.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const holdRadius = STAR_INTERACTION_RADIUS * 2.4;
          if (dist < holdRadius) {
            const pull = (holdRadius - dist) / holdRadius;
            s.offsetX += (dx / dist) * pull * 4.4;
            s.offsetY += (dy / dist) * pull * 4.4;
          }
        } else if (mouseRef.current.isActive) {
          const dx = px - mouseRef.current.x;
          const dy = py - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < STAR_INTERACTION_RADIUS) {
            const force = (STAR_INTERACTION_RADIUS - dist) / STAR_INTERACTION_RADIUS;
            s.offsetX += (dx / dist) * force * 2.8;
            s.offsetY += (dy / dist) * force * 2.8;
          }
        }

        s.offsetX *= mouseRef.current.isHold ? 0.9 : 0.94;
        s.offsetY *= mouseRef.current.isHold ? 0.9 : 0.94;

        const brightness = Math.max(0, 1 - s.z / maxDepth);
        const twinkleAlpha = 0.5 + 0.5 * Math.sin(s.twinkle);
        const size = Math.max(0.09, brightness * s.size * 2.4);

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = 0.34 + brightness * twinkleAlpha * 1.2;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Planets
      planetsRef.current.forEach((p, i) => {
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.x += (dx / dist) * force * 1.8;
          p.y += (dy / dist) * force * 1.8;
        }

        p.x += p.vx * Math.sin(timeRef.current * 0.001 + i);
        p.y += p.vy * Math.cos(timeRef.current * 0.0008 + i);
        p.x += p.motionVX;
        p.y += p.motionVY;
        p.motionVX *= 0.97;
        p.motionVY *= 0.97;
        p.motionVX += (p.homeX - p.x) * 0.0026;
        p.motionVY += (p.homeY - p.y) * 0.0026;

        // Draw planet
        const grad = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.1, p.x, p.y, p.r);
        grad.addColorStop(0, '#fff8');
        grad.addColorStop(0.3, p.color);
        grad.addColorStop(1, p.color + '44');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (p.ring) {
          p.ringRotation += p.ringSpeed;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.ringRotation);
          ctx.scale(1, p.ringTilt || 0.35);
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 1.6, 0, Math.PI * 2);
          ctx.strokeStyle = p.ringColor || 'rgba(255,255,255,0.2)';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isActive = true;
    };

    const handleMouseDown = () => (mouseRef.current.isHold = true);
    const handleMouseUp = () => (mouseRef.current.isHold = false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [canvasRef]);
};
