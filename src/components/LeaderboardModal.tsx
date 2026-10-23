import React from 'react';
import { LeaderboardRecord } from '../types/game';
import { Trophy, Medal, Star, X, Trash2, Award } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: LeaderboardRecord[];
  onClearRecords: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  records,
  onClearRecords,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 to-white rounded-3xl shadow-2xl border-4 border-yellow-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 px-6 py-4 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
              🏆
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wide flex items-center gap-2">
                班级分数排行榜
              </h2>
              <p className="text-xs text-yellow-100 font-medium">
                Word Master Leaderboard · 英语小达人荣誉榜
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center transition-transform cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {records.length === 0 ? (
            <div className="text-center py-12 text-stone-400 space-y-2">
              <Trophy className="w-12 h-12 mx-auto text-amber-200" />
              <p className="font-bold">还没有记录，快来当第一个小冠军吧！</p>
            </div>
          ) : (
            records.map((item, index) => {
              const isTop1 = index === 0;
              const isTop2 = index === 1;
              const isTop3 = index === 2;

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    isTop1
                      ? 'bg-gradient-to-r from-yellow-100/90 to-amber-100/90 border-amber-300 shadow-sm'
                      : isTop2
                      ? 'bg-gradient-to-r from-slate-100/90 to-slate-200/90 border-slate-300 shadow-xs'
                      : isTop3
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-orange-200 shadow-xs'
                      : 'bg-white border-stone-100 hover:bg-stone-50'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="w-8 flex items-center justify-center font-black text-lg">
                    {isTop1 ? (
                      <span className="text-2xl">🥇</span>
                    ) : isTop2 ? (
                      <span className="text-2xl">🥈</span>
                    ) : isTop3 ? (
                      <span className="text-2xl">🥉</span>
                    ) : (
                      <span className="text-stone-400 text-sm font-mono">{index + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-xl shrink-0">
                    {item.avatar || '⭐'}
                  </div>

                  {/* Player info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-800 text-base truncate">
                        {item.name}
                      </span>
                      {isTop1 && (
                        <span className="bg-yellow-400 text-amber-950 font-black text-[10px] px-1.5 py-0.5 rounded-md shadow-2xs">
                          冠军
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                      <span>🌾 Field: {item.cakeFieldCount}</span>
                      <span>·</span>
                      <span>🌊 Lake: {item.cakeLakeCount}</span>
                    </div>
                  </div>

                  {/* Score & Stars */}
                  <div className="text-right">
                    <div className="text-lg font-black text-amber-600 font-mono">
                      {item.score} <span className="text-xs text-stone-500 font-sans">分</span>
                    </div>
                    <div className="flex items-center justify-end text-yellow-500 text-xs gap-0.5">
                      {Array.from({ length: Math.min(3, item.stars) }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('确定要清空本轮班级排行榜数据吗？')) {
                onClearRecords();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-500 transition-colors cursor-pointer py-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>清空重置榜单</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-bold rounded-xl shadow-xs hover:from-amber-500 hover:to-yellow-600 transition-colors cursor-pointer"
          >
            关闭 (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
