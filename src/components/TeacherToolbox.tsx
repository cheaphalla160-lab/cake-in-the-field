import React from 'react';
import { GameMode } from '../types/game';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Trophy, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause,
  Sliders,
  Sparkles
} from 'lucide-react';
import { speakWord } from '../utils/audio';

interface TeacherToolboxProps {
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenPhonics: () => void;
  onOpenLeaderboard: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const TeacherToolbox: React.FC<TeacherToolboxProps> = ({
  isBgmPlaying,
  onToggleBgm,
  isMuted,
  onToggleMute,
  speed,
  onSpeedChange,
  gameMode,
  onModeChange,
  isPaused,
  onTogglePause,
  onOpenPhonics,
  onOpenLeaderboard,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="relative z-30 w-full bg-white/90 backdrop-blur-md border-b-2 border-amber-200 shadow-sm px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Brand / Title & Quick Word Audio Badges */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-2xl shadow-sm border border-white">
            🍰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-stone-800">
                Cake in Lake & Field
              </h1>
              <span className="hidden sm:inline-block bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                小学趣味英语课堂
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <span>速听发音:</span>
              <button 
                onClick={() => speakWord('cake')} 
                className="hover:text-rose-600 hover:underline font-bold text-stone-700 cursor-pointer"
                title="点读 cake"
              >
                cake 🍰
              </button>
              <span>·</span>
              <button 
                onClick={() => speakWord('field')} 
                className="hover:text-emerald-600 hover:underline font-bold text-stone-700 cursor-pointer"
                title="点读 field"
              >
                field 🌾
              </button>
              <span>·</span>
              <button 
                onClick={() => speakWord('lake')} 
                className="hover:text-sky-600 hover:underline font-bold text-stone-700 cursor-pointer"
                title="点读 lake"
              >
                lake 🌊
              </button>
            </div>
          </div>
        </div>

        {/* Game Mode Pill Selector */}
        <div className="flex items-center bg-stone-100/90 p-1 rounded-2xl border border-stone-200 text-xs font-bold">
          <button
            onClick={() => onModeChange('free')}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              gameMode === 'free'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            自由抓捕
          </button>
          <button
            onClick={() => onModeChange('mission')}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              gameMode === 'mission'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🎯 听音指令
          </button>
          <button
            onClick={() => onModeChange('rhyme')}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              gameMode === 'rhyme'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ✨ 押韵闯关
          </button>
        </div>

        {/* Speed Adjustment (Turtle / Normal / Rabbit) */}
        <div className="hidden md:flex items-center gap-1 bg-stone-100/80 px-2 py-1 rounded-2xl border border-stone-200 text-xs">
          <span className="text-stone-500 font-bold text-[11px] pr-1">速度:</span>
          <button
            onClick={() => onSpeedChange(0.6)}
            className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition-all ${
              speed <= 0.7 ? 'bg-white text-emerald-700 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
            title="慢速（适合低年级一二年级）"
          >
            🐢 慢速
          </button>
          <button
            onClick={() => onSpeedChange(1.0)}
            className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition-all ${
              speed > 0.7 && speed < 1.3 ? 'bg-white text-blue-700 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
            title="标准速度（适合三四年级）"
          >
            🚶 标准
          </button>
          <button
            onClick={() => onSpeedChange(1.4)}
            className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition-all ${
              speed >= 1.3 ? 'bg-white text-orange-700 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
            title="挑战速度（反应挑战）"
          >
            🐇 挑战
          </button>
        </div>

        {/* Classroom Controls: BGM, Sound, Phonics Book, Leaderboard, Fullscreen */}
        <div className="flex items-center gap-1.5">
          {/* Pause / Play Game */}
          <button
            onClick={onTogglePause}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs border ${
              isPaused 
                ? 'bg-amber-500 text-white border-amber-600 animate-pulse' 
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
            }`}
            title={isPaused ? '恢复游戏 (Resume)' : '暂停游戏 (Pause)'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Cheerful BGM Music Box */}
          <button
            onClick={onToggleBgm}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs border ${
              isBgmPlaying
                ? 'bg-pink-100 text-pink-700 border-pink-300 ring-2 ring-pink-200'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-400 border-stone-200'
            }`}
            title={isBgmPlaying ? '关闭背景音乐 (Mute BGM)' : '开启欢快背景音乐 (Play Cheerful BGM)'}
          >
            <Music className={`w-4 h-4 ${isBgmPlaying ? 'animate-bounce' : ''}`} />
          </button>

          {/* SFX Mute/Unmute */}
          <button
            onClick={onToggleMute}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs border ${
              !isMuted
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                : 'bg-rose-100 text-rose-600 border-rose-300'
            }`}
            title={isMuted ? '取消静音 (Unmute)' : '游戏音效静音 (Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Phonics & Cards Explorer */}
          <button
            onClick={onOpenPhonics}
            className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer"
            title="打开单词魔法书/教具"
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">单词魔法书</span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-amber-950 px-3 py-1.5 rounded-xl font-black text-xs shadow-xs transition-transform active:scale-95 cursor-pointer"
            title="查看班级排行榜"
          >
            <Trophy className="w-4 h-4 text-amber-900" />
            <span className="hidden sm:inline">排行榜</span>
          </button>

          {/* Fullscreen Button for Smartboards */}
          <button
            onClick={onToggleFullscreen}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 flex items-center justify-center shadow-xs transition-all cursor-pointer"
            title={isFullscreen ? '退出全屏' : '白板全屏互动模式 (Fullscreen)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
};
