import React, { useState } from 'react';
import { speakWord, soundManager } from '../utils/audio';
import { Volume2, X, Sparkles, BookOpen, Music, CheckCircle2 } from 'lucide-react';

interface PhonicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhonicsModal: React.FC<PhonicsModalProps> = ({ isOpen, onClose }) => {
  const [selectedWord, setSelectedWord] = useState<'cake' | 'field' | 'lake' | 'rhyme'>('cake');

  if (!isOpen) return null;

  const playPronunciation = (word: string, slow: boolean = false) => {
    soundManager.playPop();
    speakWord(word, slow ? 0.65 : 0.9);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-50 via-white to-amber-50/80 rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-6 py-4 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              📖
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wide flex items-center gap-2">
                单词魔法书 · Phonics Explorer
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                专为小学英语课堂设计的趣味自然拼读与发音库
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

        {/* Tab Navigation */}
        <div className="flex bg-amber-100/70 p-2 gap-2 border-b border-amber-200 overflow-x-auto">
          <button
            onClick={() => setSelectedWord('cake')}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedWord === 'cake'
                ? 'bg-rose-500 text-white shadow-md scale-102'
                : 'bg-white/70 text-rose-700 hover:bg-white'
            }`}
          >
            <span>🍰</span>
            <span>cake 蛋糕</span>
          </button>

          <button
            onClick={() => setSelectedWord('field')}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedWord === 'field'
                ? 'bg-emerald-600 text-white shadow-md scale-102'
                : 'bg-white/70 text-emerald-800 hover:bg-white'
            }`}
          >
            <span>🌾</span>
            <span>field 田野</span>
          </button>

          <button
            onClick={() => setSelectedWord('lake')}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedWord === 'lake'
                ? 'bg-sky-600 text-white shadow-md scale-102'
                : 'bg-white/70 text-sky-800 hover:bg-white'
            }`}
          >
            <span>🌊</span>
            <span>lake 湖泊</span>
          </button>

          <button
            onClick={() => setSelectedWord('rhyme')}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedWord === 'rhyme'
                ? 'bg-amber-600 text-white shadow-md scale-102'
                : 'bg-white/70 text-amber-800 hover:bg-white'
            }`}
          >
            <span>✨</span>
            <span>-ake 押韵秘籍</span>
          </button>
        </div>

        {/* Word Content Area */}
        <div className="p-6 overflow-y-auto space-y-5">
          {selectedWord === 'cake' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-rose-50 to-pink-100 p-5 rounded-3xl border-2 border-rose-200">
                <div className="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center text-6xl">
                  🍰
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-4xl font-black tracking-wider text-rose-600">cake</span>
                    <span className="text-base font-mono bg-rose-200/80 text-rose-800 px-2 py-0.5 rounded-lg">/keɪk/</span>
                    <span className="text-sm font-semibold bg-white text-rose-500 px-2 py-0.5 rounded-md shadow-xs">可数名词 · 蛋糕</span>
                  </div>
                  <p className="text-xs text-stone-600 pt-1">
                    自然拼读结构：辅音 <strong className="text-rose-600">c</strong> + 元音字母组 <strong className="text-rose-600">a_e</strong> (/eɪ/) + 尾辅音 <strong className="text-rose-600">k</strong>
                  </p>
                  <div className="flex gap-2 pt-2 justify-center sm:justify-start">
                    <button
                      onClick={() => playPronunciation('cake')}
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> 正常发音
                    </button>
                    <button
                      onClick={() => playPronunciation('c... a... k... e... cake', true)}
                      className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                    >
                      🐢 慢速拼读
                    </button>
                  </div>
                </div>
              </div>

              {/* Classroom Examples */}
              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs space-y-2">
                <h4 className="font-bold text-xs text-rose-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-rose-500" /> 课堂实用例句 (Classroom Sentences)
                </h4>
                <div 
                  onClick={() => playPronunciation('I want a piece of cake!')}
                  className="p-2.5 rounded-xl bg-rose-50/50 hover:bg-rose-100/60 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-sm text-stone-800">I want a piece of <span className="text-rose-600 underline">cake</span>! 🍰</p>
                    <p className="text-xs text-stone-500">我想吃一块蛋糕！</p>
                  </div>
                  <Volume2 className="w-4 h-4 text-rose-500" />
                </div>
                <div 
                  onClick={() => playPronunciation('A sweet cake is falling down!')}
                  className="p-2.5 rounded-xl bg-rose-50/50 hover:bg-rose-100/60 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-sm text-stone-800">A sweet <span className="text-rose-600 underline">cake</span> is falling down!</p>
                    <p className="text-xs text-stone-500">一块香甜的蛋糕正从天上落下来！</p>
                  </div>
                  <Volume2 className="w-4 h-4 text-rose-500" />
                </div>
              </div>
            </div>
          )}

          {selectedWord === 'field' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-3xl border-2 border-emerald-200">
                <div className="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center text-6xl">
                  🌾
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-4xl font-black tracking-wider text-emerald-700">field</span>
                    <span className="text-base font-mono bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-lg">/fiːld/</span>
                    <span className="text-sm font-semibold bg-white text-emerald-700 px-2 py-0.5 rounded-md shadow-xs">名词 · 田野 / 草地 / 场地</span>
                  </div>
                  <p className="text-xs text-stone-600 pt-1">
                    自然拼读结构：字母组合 <strong className="text-emerald-700">ie</strong> 发长元音 <strong className="text-emerald-700">/iː/</strong>，尾音清晰带出 <strong className="text-emerald-700">/ld/</strong>
                  </p>
                  <div className="flex gap-2 pt-2 justify-center sm:justify-start">
                    <button
                      onClick={() => playPronunciation('field')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> 正常发音
                    </button>
                    <button
                      onClick={() => playPronunciation('f... ie... l... d... field', true)}
                      className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                    >
                      🐢 慢速拼读
                    </button>
                  </div>
                </div>
              </div>

              {/* Classroom Examples */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-2">
                <h4 className="font-bold text-xs text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> 课堂核心介词短语 (Key Prepositions)
                </h4>
                <div 
                  onClick={() => playPronunciation('on the field')}
                  className="p-2.5 rounded-xl bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-sm text-stone-800"><span className="text-emerald-700 underline font-black">on the field</span> 🌾</p>
                    <p className="text-xs text-stone-500">在田野上 / 在草地上 (固定搭配介词 on)</p>
                  </div>
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div 
                  onClick={() => playPronunciation('The cake falls on the green field!')}
                  className="p-2.5 rounded-xl bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-sm text-stone-800">The cake falls <span className="text-emerald-700 underline">on the field</span>!</p>
                    <p className="text-xs text-stone-500">蛋糕落在了绿油油的草地上！</p>
                  </div>
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>
          )}

          {selectedWord === 'lake' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-sky-50 to-blue-100 p-5 rounded-3xl border-2 border-sky-200">
                <div className="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center text-6xl">
                  🌊
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-4xl font-black tracking-wider text-sky-700">lake</span>
                    <span className="text-base font-mono bg-sky-200/80 text-sky-900 px-2 py-0.5 rounded-lg">/leɪk/</span>
                    <span className="text-sm font-semibold bg-white text-sky-700 px-2 py-0.5 rounded-md shadow-xs">名词 · 湖泊</span>
                  </div>
                  <p className="text-xs text-stone-600 pt-1">
                    自然拼读结构：辅音 <strong className="text-sky-700">l</strong> + 元音字母组 <strong className="text-sky-700">a_e</strong> (/eɪ/) + 尾辅音 <strong className="text-sky-700">k</strong>
                  </p>
                  <div className="flex gap-2 pt-2 justify-center sm:justify-start">
                    <button
                      onClick={() => playPronunciation('lake')}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> 正常发音
                    </button>
                    <button
                      onClick={() => playPronunciation('l... a... k... e... lake', true)}
                      className="px-4 py-2 bg-white hover:bg-sky-50 text-sky-700 border border-sky-300 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                    >
                      🐢 慢速拼读
                    </button>
                  </div>
                </div>
              </div>

              {/* Classroom Examples */}
              <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs space-y-2">
                <h4 className="font-bold text-xs text-sky-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-sky-600" /> 课堂核心介词短语 (Key Prepositions)
                </h4>
                <div 
                  onClick={() => playPronunciation('in the lake')}
                  className="p-2.5 rounded-xl bg-sky-50/50 hover:bg-sky-100/60 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-sm text-stone-800"><span className="text-sky-700 underline font-black">in the lake</span> 🌊</p>
                    <p className="text-xs text-stone-500">在湖里 / 落在湖水中 (固定搭配介词 in)</p>
                  </div>
                  <Volume2 className="w-4 h-4 text-sky-600" />
                </div>
                <div 
                  onClick={() => playPronunciation('The cake floats in the blue lake!')}
                  className="p-2.5 rounded-xl bg-sky-50/50 hover:bg-sky-100/60 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-sm text-stone-800">The cake floats <span className="text-sky-700 underline">in the lake</span>!</p>
                    <p className="text-xs text-stone-500">蛋糕漂浮在碧蓝的湖水上！</p>
                  </div>
                  <Volume2 className="w-4 h-4 text-sky-600" />
                </div>
              </div>
            </div>
          )}

          {selectedWord === 'rhyme' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 p-5 rounded-3xl border-2 border-amber-300">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <h3 className="text-lg font-black text-amber-900">
                      Magic Rhyme Rule: -ake 词族大发现！
                    </h3>
                    <p className="text-xs text-amber-800">
                      Cake 和 Lake 结尾都含有 <span className="font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded text-amber-950">-ake</span>，它们发音完全押韵哦！
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div 
                    onClick={() => playPronunciation('c... ake... cake')}
                    className="bg-white p-3.5 rounded-2xl border-2 border-rose-300 text-center shadow-xs cursor-pointer hover:scale-102 transition-transform"
                  >
                    <div className="text-3xl mb-1">🍰</div>
                    <div className="text-2xl font-black text-rose-600">
                      <span className="text-stone-400">c + </span>ake
                    </div>
                    <div className="text-xs font-bold text-stone-600">cake 蛋糕</div>
                    <div className="mt-1 text-[11px] text-rose-500 font-semibold flex items-center justify-center gap-1">
                      <Volume2 className="w-3 h-3" /> 点击拼读
                    </div>
                  </div>

                  <div 
                    onClick={() => playPronunciation('l... ake... lake')}
                    className="bg-white p-3.5 rounded-2xl border-2 border-sky-300 text-center shadow-xs cursor-pointer hover:scale-102 transition-transform"
                  >
                    <div className="text-3xl mb-1">🌊</div>
                    <div className="text-2xl font-black text-sky-600">
                      <span className="text-stone-400">l + </span>ake
                    </div>
                    <div className="text-xs font-bold text-stone-600">lake 湖泊</div>
                    <div className="mt-1 text-[11px] text-sky-500 font-semibold flex items-center justify-center gap-1">
                      <Volume2 className="w-3 h-3" /> 点击拼读
                    </div>
                  </div>
                </div>

                {/* Extended Rhyme Family for Teacher Extension */}
                <div className="mt-4 pt-3 border-t border-amber-300/60 flex items-center justify-between text-xs text-amber-900">
                  <span className="font-bold">更多押韵扩展：</span>
                  <span 
                    onClick={() => playPronunciation('bake, make, take')}
                    className="bg-amber-200/80 px-2 py-1 rounded-lg font-mono font-bold cursor-pointer hover:bg-amber-300 flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" /> bake (烘焙) · make (制作) · take (拿取)
                  </span>
                </div>
              </div>

              {/* Classroom Rhyme Chant */}
              <div 
                onClick={() => playPronunciation('Cake, cake, on the field! Lake, lake, by the field! Sweet cake in the lake!')}
                className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between cursor-pointer hover:bg-amber-50/50"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <Music className="w-4 h-4 text-amber-600" />
                    <span>课堂跟读童谣 (Classroom Chant)</span>
                  </div>
                  <p className="text-sm font-black text-stone-800 mt-1">
                    "Cake, cake on the field! 🍰🌾"
                  </p>
                  <p className="text-sm font-black text-stone-800">
                    "Cake, cake in the lake! 🍰🌊"
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs">
                  <Volume2 className="w-4 h-4" /> 播放童谣
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-amber-50 px-6 py-3 border-t border-amber-200 flex items-center justify-between text-xs text-stone-500">
          <span>💡 提示：老师可在课堂上点击任意单词发音或进行跟读互动</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-xs hover:from-amber-600 hover:to-orange-600 transition-colors cursor-pointer"
          >
            返回游戏 (Back to Game)
          </button>
        </div>

      </div>
    </div>
  );
};
