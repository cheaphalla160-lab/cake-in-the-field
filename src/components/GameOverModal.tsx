import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager, speakWord } from '../utils/audio';
import { Star, Trophy, RotateCcw, Award, Volume2, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  cakeFieldCount: number;
  cakeLakeCount: number;
  onPlayAgain: () => void;
  onSaveRecord: (name: string, avatar: string, stars: number) => void;
  onOpenLeaderboard: () => void;
}

const AVATARS = ['🍓', '🐰', '🚀', '🐱', '🐻', '🦄', '⭐', '🦁', '🐬', '🌸'];

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  cakeFieldCount,
  cakeLakeCount,
  onPlayAgain,
  onSaveRecord,
  onOpenLeaderboard,
}) => {
  const [studentName, setStudentName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('⭐');
  const [hasSaved, setHasSaved] = useState(false);

  const totalCakes = cakeFieldCount + cakeLakeCount;
  
  // Calculate stars: 1 to 3
  let stars = 1;
  if (totalCakes >= 15 || score >= 1500) stars = 3;
  else if (totalCakes >= 8 || score >= 800) stars = 2;

  useEffect(() => {
    if (isOpen) {
      setHasSaved(false);
      soundManager.playFanfare();
      // Throw confetti for kids
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#10b981', '#0ea5e9', '#f59e0b', '#ec4899'],
        });
      } catch {
        // ignore if canvas not supported
      }
      speakWord(`Super job! You caught ${totalCakes} cakes!`);
    }
  }, [isOpen, totalCakes]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = studentName.trim() || '英语小明星';
    onSaveRecord(finalName, selectedAvatar, stars);
    setHasSaved(true);
    soundManager.playPop();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-50 via-white to-amber-100 rounded-3xl shadow-2xl border-4 border-amber-300 p-6 text-center space-y-4">
        
        {/* Badge & Stars */}
        <div className="relative -mt-12 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-4 border-white shadow-xl flex items-center justify-center text-4xl animate-bounce">
            🎉
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-amber-950 flex items-center justify-center gap-1.5">
            Round Complete! 太棒啦！
          </h2>
          <p className="text-xs text-amber-700 font-medium">
            你成功接住了好多蛋糕，还牢牢记住了新单词！
          </p>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 py-1">
          {[1, 2, 3].map((starNum) => {
            const isEarned = starNum <= stars;
            return (
              <div 
                key={starNum}
                className={`transition-all transform ${
                  isEarned ? 'scale-110 text-yellow-400 fill-yellow-400' : 'text-stone-300 scale-90'
                }`}
              >
                <Star className={`w-10 h-10 ${isEarned ? 'fill-current filter drop-shadow-md animate-pulse' : ''}`} />
              </div>
            );
          })}
        </div>

        {/* Score & Words Practice Review */}
        <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center border-b border-stone-100 pb-2">
            <span className="text-xs font-bold text-stone-500">本轮得分 (Total Score)</span>
            <span className="text-2xl font-black text-amber-600 font-mono">{score} pts</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div 
              onClick={() => speakWord('Cake on the field!')}
              className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between cursor-pointer hover:bg-emerald-100/70 transition-colors"
            >
              <div>
                <div className="text-[11px] font-bold text-emerald-800">🌾 On the Field</div>
                <div className="text-xs font-black text-emerald-600">草地蛋糕 × {cakeFieldCount}</div>
              </div>
              <Volume2 className="w-4 h-4 text-emerald-500" />
            </div>

            <div 
              onClick={() => speakWord('Cake in the lake!')}
              className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between cursor-pointer hover:bg-sky-100/70 transition-colors"
            >
              <div>
                <div className="text-[11px] font-bold text-sky-800">🌊 In the Lake</div>
                <div className="text-xs font-black text-sky-600">湖泊蛋糕 × {cakeLakeCount}</div>
              </div>
              <Volume2 className="w-4 h-4 text-sky-500" />
            </div>
          </div>
        </div>

        {/* Save to Leaderboard Form */}
        {!hasSaved ? (
          <form onSubmit={handleSave} className="bg-amber-100/60 p-4 rounded-2xl border border-amber-200 space-y-3">
            <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
              <span>登记上榜 · 留下你的英文名：</span>
              <span className="text-[10px] text-amber-700">选个可爱头像</span>
            </div>

            {/* Avatar list */}
            <div className="flex justify-between gap-1 overflow-x-auto py-1">
              {AVATARS.slice(0, 7).map((avatar) => (
                <button
                  type="button"
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-8 h-8 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                    selectedAvatar === avatar
                      ? 'bg-amber-400 scale-110 shadow-sm border border-amber-600'
                      : 'bg-white hover:bg-amber-50'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="例如: Emma, Leo, Tommy..."
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                maxLength={15}
                className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-black text-xs rounded-xl shadow-sm hover:from-amber-600 hover:to-yellow-600 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                保存上榜 🏆
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>成绩已成功记入班级排行榜！</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-sm rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> 再来一轮 (Play Again)
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="px-4 py-3 bg-white hover:bg-stone-50 border-2 border-amber-300 text-amber-900 font-bold text-xs rounded-2xl shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Trophy className="w-4 h-4 text-amber-500" /> 排行榜
          </button>
        </div>

      </div>
    </div>
  );
};
