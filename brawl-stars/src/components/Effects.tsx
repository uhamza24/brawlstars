import React, { useMemo } from 'react';
import { Star } from 'lucide-react';

export const BackgroundParticles: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 12 + 4,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      type: Math.random() > 0.7 ? 'star' : 'circle',
      color: ['rgba(255,255,255,0.1)', 'rgba(59,130,246,0.1)', 'rgba(255,204,0,0.1)'][Math.floor(Math.random() * 3)]
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle flex items-center justify-center"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            bottom: '-20px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            color: p.color,
            backgroundColor: p.type === 'circle' ? p.color : 'transparent'
          }}
        >
          {p.type === 'star' && <Star className="w-full h-full fill-current" />}
        </div>
      ))}
    </div>
  );
};

export const Sparkle: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div className="sparkle absolute pointer-events-none" style={style}>
      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
    </div>
  );
};

export const Confetti: React.FC = () => {
  const pieces = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: ['#ffcc00', '#ff00ff', '#00ffff', '#ff4444'][Math.floor(Math.random() * 4)],
      size: Math.random() * 10 + 5,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 0.5,
      rotate: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[110]">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: '2px',
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s linear forwards`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
