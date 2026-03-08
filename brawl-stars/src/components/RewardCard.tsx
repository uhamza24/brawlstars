import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { Sparkle } from './Effects';

interface RewardCardProps {
  title: string;
  subtitle?: string;
  image: string;
  onClaim: () => void;
  index: number;
  rare?: boolean;
}

export const RewardCard: React.FC<RewardCardProps> = ({ title, subtitle, image, onClaim, index, rare }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05, 
        rotate: index % 2 === 0 ? 1 : -1,
        transition: { duration: 0.2 }
      }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl md:rounded-3xl border-[3px] md:border-4 border-black/30 bg-gradient-to-b from-[#4a0e8f] to-[#1a0536] p-1 md:p-1.5 shadow-2xl transition-all ${rare ? 'ring-2 md:ring-4 ring-yellow-400/50 shadow-[0_0_40px_rgba(255,204,0,0.3)]' : ''}`}
    >
      {/* Inner Border/Glow */}
      <div className="absolute inset-0 rounded-[0.9rem] md:rounded-[1.4rem] border border-white/10 pointer-events-none z-20"></div>
      
      {/* Sunburst Background Effect */}
      <div className="sunburst absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity"></div>
      
      {/* Sparkles for Rare Items */}
      {rare && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <Sparkle style={{ top: '10%', left: '10%', animationDelay: '0s', transform: 'scale(1.2)' }} />
          <Sparkle style={{ top: '20%', right: '15%', animationDelay: '0.5s', transform: 'scale(0.8)' }} />
          <Sparkle style={{ bottom: '30%', left: '20%', animationDelay: '0.2s', transform: 'scale(1.1)' }} />
          <Sparkle style={{ bottom: '15%', right: '10%', animationDelay: '0.7s', transform: 'scale(0.9)' }} />
        </div>
      )}

      {/* Animated Shine Effect */}
      <motion.div 
        animate={{ 
          x: ['-100%', '200%'],
          opacity: [0, 0.2, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatDelay: 2,
          ease: "linear"
        }}
        className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center p-3 md:p-4 text-center">
        <h3 className="brawl-text-shadow mb-1 font-display text-base md:text-xl lg:text-2xl tracking-tighter uppercase italic text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="mb-3 text-[7px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-white/50">
            {subtitle}
          </p>
        )}
        
        <div className="relative my-3 md:my-6 flex h-24 md:h-40 w-full items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_75%)]" />
          {rare && <div className="absolute inset-0 rounded-full bg-yellow-400/10 blur-3xl animate-pulse" />}
          <motion.img 
            animate={{ 
              y: [0, -6, 0],
              rotate: [0, 2, 0, -2, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            src={image} 
            alt={title} 
            className={`h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform ${rare ? 'drop-shadow-[0_0_20px_rgba(255,204,0,0.4)]' : ''}`}
            referrerPolicy="no-referrer"
          />
        </div>
        
        <button 
          onClick={onClaim}
          className="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#ffcc00] to-[#ff9900] py-2 md:py-4 font-display text-sm md:text-xl tracking-wider uppercase italic text-[#4a0e8f] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_6px_0_rgba(0,0,0,0.3)] md:shadow-[0_10px_0_rgba(0,0,0,0.4)] active:shadow-none"
        >
          <span className="relative z-10">CLAIM</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />
        </button>
      </div>
    </motion.div>
  );
};
