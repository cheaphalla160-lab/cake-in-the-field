import React from 'react';
import { TargetZone } from '../types/game';
import { speakWord, soundManager } from '../utils/audio';

interface LandscapeProps {
  onZoneClick?: (zone: TargetZone) => void;
  activeTargetZone?: TargetZone | 'any';
}

export const Landscape: React.FC<LandscapeProps> = ({ onZoneClick, activeTargetZone }) => {
  const handleFieldClick = (e: React.MouseEvent) => {
    // Only trigger if clicked on the background, not propagated from a cake
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.zone-bg')) {
      soundManager.playGrassChime();
      speakWord('Field! F-I-E-L-D, field. A sunny green field!');
      onZoneClick?.('field');
    }
  };

  const handleLakeClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.zone-bg')) {
      soundManager.playSplash();
      speakWord('Lake! L-A-K-E, lake. A cool blue lake!');
      onZoneClick?.('lake');
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-auto">
      {/* SKY BACKGROUND with pastel gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 h-[45%]" />

      {/* SUN & RAINBOW */}
      <div className="absolute top-4 left-8 flex items-center gap-3">
        {/* Smiling Sun */}
        <div 
          onClick={() => {
            speakWord('Hello! Sunny day for cakes!');
          }}
          className="relative cursor-pointer transition-transform hover:scale-110 active:scale-95"
          title="Click the sun!"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-300 rounded-full border-4 border-amber-400 shadow-lg shadow-amber-200 flex items-center justify-center animate-pulse">
            <span className="text-3xl sm:text-4xl select-none">☀️</span>
          </div>
          {/* Sun rays pulse */}
          <div className="absolute -inset-2 bg-yellow-200/30 rounded-full animate-ping -z-10" />
        </div>

        {/* Mini Rainbow */}
        <div className="hidden sm:block opacity-85">
          <svg className="w-24 h-14" viewBox="0 0 100 60">
            <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#f87171" strokeWidth="4" />
            <path d="M 16 55 A 34 34 0 0 1 84 55" fill="none" stroke="#fbbf24" strokeWidth="4" />
            <path d="M 22 55 A 28 28 0 0 1 78 55" fill="none" stroke="#34d399" strokeWidth="4" />
            <path d="M 28 55 A 22 22 0 0 1 72 55" fill="none" stroke="#60a5fa" strokeWidth="4" />
            <path d="M 34 55 A 16 16 0 0 1 66 55" fill="none" stroke="#a78bfa" strokeWidth="4" />
          </svg>
        </div>
      </div>

      {/* FLOATING CLOUDS in the sky */}
      <div className="absolute top-6 left-[25%] animate-[float_14s_ease-in-out_infinite] opacity-90">
        <div className="relative bg-white/95 rounded-full w-28 h-10 shadow-sm flex items-center justify-center px-3 border border-white">
          <div className="absolute -top-4 left-4 w-10 h-10 bg-white rounded-full" />
          <div className="absolute -top-6 right-5 w-12 h-12 bg-white rounded-full" />
          <span className="text-xs font-bold text-sky-500 z-10">☁️ Soft Clouds</span>
        </div>
      </div>

      <div className="absolute top-10 right-[20%] animate-[float_18s_ease-in-out_infinite_reverse] opacity-85">
        <div className="relative bg-white/90 rounded-full w-32 h-11 shadow-sm flex items-center justify-center px-4 border border-white">
          <div className="absolute -top-5 left-5 w-12 h-12 bg-white rounded-full" />
          <div className="absolute -top-7 right-6 w-14 h-14 bg-white rounded-full" />
          <span className="text-xs font-bold text-amber-500 z-10">🍰 Cake Rain!</span>
        </div>
      </div>

      {/* FLYING BIRDS */}
      <div className="absolute top-14 left-[52%] flex gap-2 text-sky-600/70 text-sm animate-[bounce_4s_ease-in-out_infinite]">
        <span>🕊️</span>
        <span className="mt-2 text-xs">🕊️</span>
      </div>

      {/* MAIN SPLIT LANDSCAPE: LEFT = FIELD (草地), RIGHT = LAKE (湖泊) */}
      <div className="absolute top-[40%] bottom-0 inset-x-0 flex">
        
        {/* ================= LEFT: THE FIELD (草地/田野) ================= */}
        <div 
          onClick={handleFieldClick}
          className={`zone-bg relative w-1/2 h-full overflow-hidden transition-all duration-300 cursor-pointer ${
            activeTargetZone === 'field' ? 'ring-4 ring-emerald-400/80' : ''
          }`}
          style={{
            background: 'linear-gradient(180deg, #86efac 0%, #4ade80 25%, #22c55e 70%, #15803d 100%)'
          }}
          title="点击认识田野 (Click to learn FIELD)"
        >
          {/* Gentle rolling grass hills texture */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#166534_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
          
          {/* Soft Hill Silhouettes */}
          <svg className="absolute -top-12 left-0 w-full h-24 fill-emerald-300 opacity-60" viewBox="0 0 500 100" preserveAspectRatio="none">
            <path d="M0,40 Q120,5 250,35 T500,20 L500,100 L0,100 Z" />
          </svg>
          <svg className="absolute -top-6 left-0 w-full h-20 fill-emerald-400 opacity-80" viewBox="0 0 500 100" preserveAspectRatio="none">
            <path d="M0,25 Q160,50 320,15 T500,30 L500,100 L0,100 Z" />
          </svg>

          {/* LARGE FIELD SIGNPOST */}
          <div className="absolute top-4 left-6 z-10 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playGrassChime();
                speakWord('Field! F-I-E-L-D, /fiːld/! On the field!');
              }}
              className="group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white px-4 py-2 rounded-2xl shadow-lg border-2 border-emerald-200 transform hover:scale-105 active:scale-95 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-inner group-hover:rotate-6 transition-transform">
                🌾
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-wider text-yellow-300">FIELD</span>
                  <span className="text-xs bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-100 font-mono">/fiːld/</span>
                </div>
                <div className="text-[11px] text-emerald-100 font-medium">草地 / 田野 · 点我发音 🔊</div>
              </div>
            </button>
            <div className="w-2.5 h-6 bg-amber-800 rounded-b-md mx-auto shadow-sm" />
          </div>

          {/* Cute Decorative Field Elements */}
          {/* Picnic Blanket */}
          <div className="absolute bottom-8 left-10 sm:left-16 pointer-events-none opacity-95">
            <div className="w-24 h-16 sm:w-32 sm:h-20 bg-red-400 border-2 border-red-500 rounded-lg shadow-md transform -rotate-3 [background-image:repeating-linear-gradient(45deg,#ef4444_0,#ef4444_8px,#fecaca_8px,#fecaca_16px)] flex items-center justify-around p-2">
              <span className="text-xl sm:text-2xl animate-bounce">🧺</span>
              <span className="text-lg">🫖</span>
              <span className="text-lg">🍓</span>
            </div>
          </div>

          {/* Flowers blooming across the field */}
          <div className="absolute bottom-6 left-[40%] text-xl animate-pulse">🌻</div>
          <div className="absolute bottom-16 left-[25%] text-lg">🌼</div>
          <div className="absolute bottom-28 left-[15%] text-base">🌸</div>
          <div className="absolute bottom-20 left-[48%] text-lg">🌷</div>
          <div className="absolute bottom-4 left-[58%] text-base">🌼</div>

          {/* Cute Bunny */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playGrassChime();
              speakWord('The cute bunny is eating cake on the field!');
            }}
            className="absolute bottom-12 right-10 text-3xl sm:text-4xl cursor-pointer hover:scale-125 transition-transform" 
            title="A bunny on the field!"
          >
            🐰
            <div className="text-[10px] text-center font-bold text-emerald-900 bg-white/80 px-1 rounded shadow-xs">
              on the field
            </div>
          </div>

          {/* Butterflies fluttering */}
          <div className="absolute top-28 left-[35%] text-xl animate-[bounce_3s_ease-in-out_infinite]">
            🦋
          </div>
          <div className="absolute top-44 left-[18%] text-lg animate-[bounce_4s_ease-in-out_infinite_reverse]">
            🐝
          </div>
        </div>

        {/* ================= MIDDLE BORDER: PATHWAY / SHORELINE ================= */}
        <div className="relative w-4 -mx-2 z-20 flex flex-col items-center justify-between pointer-events-none py-2">
          <div className="w-2 h-full bg-amber-200/80 rounded-full border border-amber-300 shadow-inner flex flex-col justify-around py-4">
            <div className="w-3 h-2 bg-stone-300 rounded-full -ml-0.5" />
            <div className="w-2.5 h-2 bg-stone-400 rounded-full -ml-0.5" />
            <div className="w-3 h-2 bg-stone-300 rounded-full -ml-0.5" />
            <div className="w-2 h-2 bg-stone-400 rounded-full -ml-0.5" />
            <div className="w-3.5 h-2.5 bg-stone-300 rounded-full -ml-0.5" />
          </div>
        </div>

        {/* ================= RIGHT: THE LAKE (湖泊) ================= */}
        <div 
          onClick={handleLakeClick}
          className={`zone-bg relative w-1/2 h-full overflow-hidden transition-all duration-300 cursor-pointer ${
            activeTargetZone === 'lake' ? 'ring-4 ring-cyan-400/80' : ''
          }`}
          style={{
            background: 'linear-gradient(180deg, #67e8f9 0%, #38bdf8 25%, #0284c7 65%, #0369a1 100%)'
          }}
          title="点击认识湖泊 (Click to learn LAKE)"
        >
          {/* Animated Water Ripples Effect */}
          <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#e0f2fe_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

          {/* Waving water lines */}
          <svg className="absolute top-0 left-0 w-full h-8 text-sky-200/40 animate-[pulse_3s_ease-in-out_infinite]" viewBox="0 0 500 50" preserveAspectRatio="none">
            <path d="M0,25 Q125,45 250,25 T500,25 L500,50 L0,50 Z" fill="currentColor" />
          </svg>
          <svg className="absolute top-12 left-0 w-full h-6 text-cyan-100/30 animate-[pulse_4s_ease-in-out_infinite]" viewBox="0 0 500 40" preserveAspectRatio="none">
            <path d="M0,20 Q125,5 250,20 T500,20 L500,40 L0,40 Z" fill="currentColor" />
          </svg>
          <svg className="absolute top-28 left-0 w-full h-6 text-blue-200/25 animate-[pulse_3.5s_ease-in-out_infinite]" viewBox="0 0 500 40" preserveAspectRatio="none">
            <path d="M0,20 Q125,35 250,20 T500,20 L500,40 L0,40 Z" fill="currentColor" />
          </svg>

          {/* LARGE LAKE SIGNPOST */}
          <div className="absolute top-4 right-6 z-10 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playSplash();
                speakWord('Lake! L-A-K-E, /leɪk/! In the lake!');
              }}
              className="group flex items-center gap-2.5 bg-gradient-to-r from-sky-600 to-cyan-700 hover:from-sky-500 hover:to-cyan-600 text-white px-4 py-2 rounded-2xl shadow-lg border-2 border-sky-200 transform hover:scale-105 active:scale-95 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-inner group-hover:-rotate-6 transition-transform">
                🌊
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-wider text-cyan-200">LAKE</span>
                  <span className="text-xs bg-sky-900/60 px-1.5 py-0.5 rounded text-sky-100 font-mono">/leɪk/</span>
                </div>
                <div className="text-[11px] text-sky-100 font-medium">湖泊 / 水面 · 点我发音 🔊</div>
              </div>
            </button>
            <div className="w-2.5 h-6 bg-amber-800 rounded-b-md mx-auto shadow-sm" />
          </div>

          {/* Cute Floating Ducks on the Lake */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playSplash();
              speakWord('The cute yellow duck is swimming in the lake!');
            }}
            className="absolute bottom-20 left-12 text-3xl sm:text-4xl cursor-pointer hover:scale-125 transition-transform animate-[bounce_3s_ease-in-out_infinite]"
            title="A duck swimming in the lake!"
          >
            🦆
            <div className="text-[10px] text-center font-bold text-sky-900 bg-white/80 px-1 rounded shadow-xs">
              in the lake
            </div>
          </div>

          {/* Mini duckling */}
          <div className="absolute bottom-16 left-28 text-2xl animate-[bounce_3s_ease-in-out_infinite_0.4s]">
            🐥
          </div>

          {/* Water Lilies & Lotus */}
          <div className="absolute bottom-8 right-16 sm:right-24 flex items-center gap-3 pointer-events-none">
            <span className="text-3xl animate-pulse">🪷</span>
            <span className="text-2xl">🌿</span>
          </div>

          <div className="absolute bottom-28 right-8 text-2xl">
            🪷
          </div>

          {/* Cute Little Sailboat */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playSplash();
              speakWord('Sailing on the blue lake!');
            }}
            className="absolute top-24 right-20 text-3xl sm:text-4xl cursor-pointer hover:scale-125 transition-transform animate-[float_6s_ease-in-out_infinite]"
            title="Boat on the lake!"
          >
            ⛵
          </div>

          {/* Jumping Fish */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playSplash();
              speakWord('Fish jumping in the lake!');
            }}
            className="absolute bottom-10 right-48 text-2xl cursor-pointer hover:scale-125 transition-transform animate-[bounce_2.5s_ease-in-out_infinite]"
          >
            🐟
          </div>

          {/* Reeds / Cattails at edge */}
          <div className="absolute bottom-2 left-2 flex gap-1 pointer-events-none text-emerald-300/80 text-xl">
            <span>🌾</span>
            <span>🌿</span>
          </div>
        </div>

      </div>

      {/* Floating Instructions Banner for Younger Learners */}
      <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none z-10 px-4">
        <div className="bg-white/85 backdrop-blur-xs text-stone-700 px-4 py-1.5 rounded-full shadow-md border border-stone-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span className="text-emerald-600 font-bold">🌾 Field (田野)</span>
          <span className="text-stone-300">|</span>
          <span className="text-rose-500 font-bold">🍰 Cake (蛋糕)</span>
          <span className="text-stone-300">|</span>
          <span className="text-sky-600 font-bold">🌊 Lake (湖泊)</span>
          <span className="text-stone-300">·</span>
          <span className="text-amber-700 hidden sm:inline">点击蛋糕大声跟读！</span>
        </div>
      </div>
    </div>
  );
};
