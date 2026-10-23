import React from 'react';
import { CakeItem } from '../types/game';

interface CakeEntityProps {
  cake: CakeItem;
  onClick: (cake: CakeItem, event: React.MouseEvent) => void;
}

export const CakeEntity: React.FC<CakeEntityProps> = ({ cake, onClick }) => {
  // Select emoji and visual style according to cakeStyle
  const getCakeVisual = () => {
    switch (cake.cakeStyle) {
      case 'strawberry':
        return { emoji: '🍰', color: 'from-pink-400 to-rose-500', name: 'Strawberry Cake' };
      case 'chocolate':
        return { emoji: '🎂', color: 'from-amber-700 to-yellow-900', name: 'Chocolate Cake' };
      case 'cupcake':
        return { emoji: '🧁', color: 'from-purple-400 to-indigo-500', name: 'Cupcake' };
      case 'blueberry':
        return { emoji: '🫐🍰', color: 'from-blue-400 to-indigo-600', name: 'Blueberry Cake' };
      case 'pancake':
        return { emoji: '🥞', color: 'from-amber-400 to-amber-600', name: 'Pancake' };
      case 'birthday':
      default:
        return { emoji: '🎂', color: 'from-amber-300 to-pink-500', name: 'Party Cake' };
    }
  };

  const visual = getCakeVisual();
  const isLake = cake.targetZone === 'lake';

  return (
    <div
      onClick={(e) => onClick(cake, e)}
      className="absolute cursor-pointer select-none group transform -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-90"
      style={{
        left: `${cake.x}%`,
        top: `${cake.y}%`,
        zIndex: Math.floor(cake.y) + 30,
      }}
    >
      <div 
        className="flex flex-col items-center"
        style={{
          transform: `rotate(${cake.rotation}deg)`,
        }}
      >
        {/* Parachute / Balloon hanging above cake */}
        <div className="relative flex flex-col items-center">
          {/* Parachute canopy */}
          <div 
            className={`w-12 h-6 rounded-t-full shadow-md border border-white/60 flex items-center justify-center text-[10px] font-bold text-white ${
              isLake ? 'bg-gradient-to-r from-sky-400 to-blue-500' : 'bg-gradient-to-r from-emerald-400 to-green-600'
            }`}
          >
            <span>{isLake ? '💧' : '🌱'}</span>
          </div>
          {/* Strings */}
          <div className="flex justify-between w-8 h-2.5">
            <div className="w-[1px] h-full bg-white/70 rotate-[-15deg]" />
            <div className="w-[1px] h-full bg-white/70 rotate-[15deg]" />
          </div>
        </div>

        {/* The Cake Core with gentle bobbing/hover effect */}
        <div 
          className="relative rounded-2xl p-1.5 transition-all duration-150 group-hover:scale-115"
          style={{ width: `${cake.size}px`, height: `${cake.size}px` }}
        >
          {/* Glow circle behind */}
          <div className="absolute inset-0 bg-white/60 rounded-full blur-xs group-hover:bg-yellow-200/80 transition-colors" />

          {/* Cake Icon */}
          <div className="relative w-full h-full flex items-center justify-center text-4xl sm:text-5xl drop-shadow-md select-none">
            {visual.emoji}
          </div>

          {/* Word Badge: "CAKE" */}
          <div className="absolute -bottom-2 inset-x-0 flex justify-center">
            <span className="bg-white/95 text-rose-600 font-extrabold text-[11px] sm:text-xs px-2 py-0.5 rounded-full shadow-sm border border-rose-200 tracking-wider flex items-center gap-0.5 whitespace-nowrap group-hover:bg-rose-500 group-hover:text-white transition-colors">
              CAKE
            </span>
          </div>

          {/* Sparkles around cake */}
          <span className="absolute -top-1 -right-1 text-xs animate-ping">✨</span>
        </div>

        {/* Destination Hint Tag for students to anticipate location */}
        <div className="mt-2.5">
          <span 
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs border ${
              isLake 
                ? 'bg-sky-100 text-sky-800 border-sky-300' 
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            {isLake ? '🌊 to Lake' : '🌾 to Field'}
          </span>
        </div>
      </div>
    </div>
  );
};
