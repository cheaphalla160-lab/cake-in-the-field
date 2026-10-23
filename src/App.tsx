import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  CakeItem, 
  TargetZone, 
  GameMode, 
  MissionTarget, 
  LeaderboardRecord, 
  FloatingFeedback,
  CakeStyle 
} from './types/game';
import { soundManager, speakWord } from './utils/audio';
import { Landscape } from './components/Landscape';
import { CakeEntity } from './components/CakeEntity';
import { TeacherToolbox } from './components/TeacherToolbox';
import { PhonicsModal } from './components/PhonicsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { GameOverModal } from './components/GameOverModal';
import { Volume2, Sparkles, Flame, CheckCircle, HelpCircle, Award } from 'lucide-react';

const INITIAL_RECORDS: LeaderboardRecord[] = [
  { id: '1', name: 'Mia 🍓', avatar: '🍓', score: 2400, stars: 3, cakeFieldCount: 12, cakeLakeCount: 12, date: '今日' },
  { id: '2', name: 'Leo 🦁', avatar: '🦁', score: 1900, stars: 3, cakeFieldCount: 9, cakeLakeCount: 10, date: '今日' },
  { id: '3', name: 'Lucy ⭐', avatar: '⭐', score: 1600, stars: 3, cakeFieldCount: 8, cakeLakeCount: 8, date: '今日' },
  { id: '4', name: 'Tommy 🚀', avatar: '🚀', score: 1200, stars: 2, cakeFieldCount: 6, cakeLakeCount: 6, date: '今日' },
  { id: '5', name: 'Amy 🌸', avatar: '🌸', score: 900, stars: 2, cakeFieldCount: 5, cakeLakeCount: 4, date: '今日' },
];

const CAKE_STYLES: CakeStyle[] = [
  'strawberry', 
  'chocolate', 
  'cupcake', 
  'blueberry', 
  'birthday', 
  'pancake'
];

export default function App() {
  // Game Play State
  const [cakes, setCakes] = useState<CakeItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FloatingFeedback[]>([]);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [cakeFieldCount, setCakeFieldCount] = useState<number>(0);
  const [cakeLakeCount, setCakeLakeCount] = useState<number>(0);
  
  // Game Settings & Teacher Controls
  const [speed, setSpeed] = useState<number>(1.0); // 0.6 = turtle, 1.0 = normal, 1.4 = rabbit
  const [gameMode, setGameMode] = useState<GameMode>('free');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals
  const [isPhonicsOpen, setIsPhonicsOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);

  // Mission Mode State
  const [mission, setMission] = useState<MissionTarget>({
    zone: 'lake',
    promptEn: 'Catch the cake in the lake!',
    promptZh: '点击落在湖里的蛋糕！',
    targetCount: 3,
    currentCount: 0,
  });

  // Leaderboard data from localStorage
  const [records, setRecords] = useState<LeaderboardRecord[]>(() => {
    try {
      const saved = localStorage.getItem('CAKE_LAKE_FIELD_LEADERBOARD');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_RECORDS;
  });

  // Audio start flag on first user interaction
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // References for requestAnimationFrame loop
  const cakesRef = useRef<CakeItem[]>([]);
  cakesRef.current = cakes;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Save records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('CAKE_LAKE_FIELD_LEADERBOARD', JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  // Generate a new cake
  const spawnCake = useCallback(() => {
    if (isPausedRef.current) return;

    // Pick target side: 0-46% is field, 54-94% is lake
    // Bias towards mission zone if in mission mode
    let pickZone: TargetZone = Math.random() > 0.5 ? 'field' : 'lake';
    if (gameMode === 'mission' && mission.zone !== 'any') {
      // 60% chance to spawn in target zone so kids have plenty to click
      pickZone = Math.random() < 0.6 ? mission.zone : (mission.zone === 'field' ? 'lake' : 'field');
    }

    let xPos: number;
    if (pickZone === 'field') {
      xPos = 8 + Math.random() * 36; // 8% to 44%
    } else {
      xPos = 56 + Math.random() * 36; // 56% to 92%
    }

    const randomStyle = CAKE_STYLES[Math.floor(Math.random() * CAKE_STYLES.length)];
    const size = Math.floor(48 + Math.random() * 14); // 48 - 62 px
    const baseSpeed = (0.28 + Math.random() * 0.22) * speedRef.current;

    const newCake: CakeItem = {
      id: `${Date.now()}-${Math.random()}`,
      x: xPos,
      y: 12 + Math.random() * 4, // start just below the cloud line
      targetZone: pickZone,
      cakeStyle: randomStyle,
      speed: baseSpeed,
      size,
      wobble: 0,
      rotation: (Math.random() - 0.5) * 16,
      status: 'falling',
      createdAt: Date.now(),
    };

    setCakes(prev => [...prev.slice(-14), newCake]); // keep max active cakes manageable for kids
  }, [gameMode, mission.zone]);

  // Main animation ticker for cake falling
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (!isPausedRef.current) {
        setCakes(prevCakes => {
          const updated: CakeItem[] = [];

          for (const cake of prevCakes) {
            const nextY = cake.y + cake.speed;
            
            // Check if reached bottom / missed
            if (nextY >= 92) {
              // Cake landed at the bottom of the field or lake!
              // Gentle visual landing, play subtle sound
              if (cake.targetZone === 'lake') {
                soundManager.playSplash();
              } else {
                soundManager.playGrassChime();
              }
              // Reset combo if cake missed
              setCombo(0);
              continue; // remove cake
            }

            // Wobble slightly as it falls
            const nextRotation = cake.rotation + Math.sin(Date.now() / 300 + cake.x) * 0.3;

            updated.push({
              ...cake,
              y: nextY,
              rotation: nextRotation,
            });
          }

          return updated;
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Cake spawn interval based on speed
  useEffect(() => {
    if (isPaused) return;

    // Spawn every 1.2 to 2.2 seconds depending on speed
    const intervalMs = Math.max(900, Math.floor(1900 / speed));
    const timer = setInterval(() => {
      spawnCake();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, speed, spawnCake]);

  // Handle clicking a cake
  const handleCakeClick = (cake: CakeItem, e: React.MouseEvent) => {
    e.stopPropagation();

    // First interaction unlocks browser audio policy
    if (!hasInteracted) {
      setHasInteracted(true);
      soundManager.startBGM();
      setIsBgmPlaying(true);
    }

    // Remove the clicked cake immediately
    setCakes(prev => prev.filter(c => c.id !== cake.id));

    const isLake = cake.targetZone === 'lake';
    const newCombo = combo + 1;
    setCombo(newCombo);

    // Audio & Feedback
    soundManager.playPop();
    if (isLake) {
      soundManager.playSplash();
      setCakeLakeCount(c => c + 1);
    } else {
      soundManager.playGrassChime();
      setCakeFieldCount(c => c + 1);
    }

    // Pronunciation logic
    if (gameMode === 'mission') {
      const isTargetMission = (mission.zone === 'any') || (mission.zone === cake.targetZone);
      if (isTargetMission) {
        const nextCount = mission.currentCount + 1;
        setMission(m => ({ ...m, currentCount: nextCount }));

        if (nextCount >= mission.targetCount) {
          // Mission completed!
          soundManager.playFanfare();
          speakWord(`Awesome! You caught all cakes ${isLake ? 'in the lake' : 'on the field'}!`);
          
          // Switch to new mission
          setTimeout(() => {
            const nextZone: TargetZone = mission.zone === 'lake' ? 'field' : 'lake';
            setMission({
              zone: nextZone,
              promptEn: nextZone === 'lake' ? 'Catch 3 cakes in the lake!' : 'Catch 3 cakes on the field!',
              promptZh: nextZone === 'lake' ? '快点击落在湖泊里的蛋糕！' : '快点击落在草地上的蛋糕！',
              targetCount: 3,
              currentCount: 0,
            });
            speakWord(nextZone === 'lake' ? 'Catch the cake in the lake!' : 'Catch the cake on the field!');
          }, 1200);
        } else {
          speakWord(isLake ? 'Cake in the lake!' : 'Cake on the field!');
        }
      } else {
        // Clicked the other zone
        speakWord(isLake ? 'Oops! That is in the lake!' : 'Oops! That is on the field!');
      }
    } else if (gameMode === 'rhyme') {
      // Rhyme mode emphasizes cake & lake rhyme
      if (isLake) {
        speakWord('Cake and lake! They rhyme!');
      } else {
        speakWord('Cake on the field!');
      }
    } else {
      // Free mode
      speakWord(isLake ? 'Cake in the lake!' : 'Cake on the field!');
    }

    // Calculate score with combo multiplier
    const comboBonus = Math.min(newCombo * 20, 200);
    const addedScore = 100 + comboBonus;
    setScore(s => s + addedScore);

    // Add floating feedback popup
    const feedback: FloatingFeedback = {
      id: `${Date.now()}-${Math.random()}`,
      x: cake.x,
      y: cake.y,
      text: `+${addedScore} CAKE!`,
      subText: isLake ? 'in the lake 🌊' : 'on the field 🌾',
      zone: cake.targetZone,
      emoji: isLake ? '💧' : '🌱',
      createdAt: Date.now(),
    };
    setFeedbacks(prev => [...prev.slice(-6), feedback]);
  };

  // Clean old floating feedbacks
  useEffect(() => {
    if (feedbacks.length === 0) return;
    const timer = setTimeout(() => {
      setFeedbacks(prev => prev.filter(f => Date.now() - f.createdAt < 1200));
    }, 400);
    return () => clearTimeout(timer);
  }, [feedbacks]);

  // Toggle BGM
  const handleToggleBgm = () => {
    if (isBgmPlaying) {
      soundManager.stopBGM();
      setIsBgmPlaying(false);
    } else {
      soundManager.startBGM();
      setIsBgmPlaying(true);
      setHasInteracted(true);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Reset / Play Again
  const handlePlayAgain = () => {
    setCakes([]);
    setScore(0);
    setCombo(0);
    setCakeFieldCount(0);
    setCakeLakeCount(0);
    setIsGameOverOpen(false);
    setIsPaused(false);
    setMission(m => ({ ...m, currentCount: 0 }));
    speakWord('Ready? Go! Catch the cakes!');
  };

  // Save new leaderboard record
  const handleSaveRecord = (name: string, avatar: string, stars: number) => {
    const newRecord: LeaderboardRecord = {
      id: Date.now().toString(),
      name,
      avatar,
      score,
      stars,
      cakeFieldCount,
      cakeLakeCount,
      date: '刚刚',
    };
    setRecords(prev => [newRecord, ...prev].sort((a, b) => b.score - a.score).slice(0, 15));
  };

  // Clear leaderboard
  const handleClearRecords = () => {
    setRecords([]);
    try {
      localStorage.removeItem('CAKE_LAKE_FIELD_LEADERBOARD');
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-sky-100 overflow-hidden select-none font-sans">
      
      {/* Top Classroom Toolbox */}
      <TeacherToolbox
        isBgmPlaying={isBgmPlaying}
        onToggleBgm={handleToggleBgm}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        speed={speed}
        onSpeedChange={setSpeed}
        gameMode={gameMode}
        onModeChange={(m) => {
          setGameMode(m);
          setCombo(0);
          if (m === 'mission') {
            speakWord(mission.promptEn);
          } else if (m === 'rhyme') {
            speakWord('Cake and lake rhyme! Can you find them?');
          }
        }}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onOpenPhonics={() => setIsPhonicsOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Interactive Stage */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        
        {/* Scenic Background (Field on left, Lake on right) */}
        <Landscape 
          activeTargetZone={gameMode === 'mission' ? mission.zone : 'any'}
        />

        {/* HUD Overlay: Score, Mission Prompt, Combos */}
        <div className="absolute top-3 inset-x-0 px-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
          
          {/* Left HUD: Score & Combo */}
          <div className="flex items-center gap-3">
            {/* Score Card */}
            <div className="bg-white/90 backdrop-blur-xs px-4 py-2 rounded-2xl shadow-md border-2 border-amber-300 flex items-center gap-3 pointer-events-auto">
              <div className="text-2xl">🍰</div>
              <div>
                <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Score · 积分</div>
                <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono leading-none">
                  {score}
                </div>
              </div>
            </div>

            {/* Combo Meter */}
            {combo > 1 && (
              <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-3 py-1.5 rounded-2xl shadow-lg border border-white flex items-center gap-1.5 animate-bounce">
                <Flame className="w-5 h-5 fill-current text-yellow-300 animate-pulse" />
                <span className="font-black text-sm tracking-wider">{combo}x COMBO!</span>
              </div>
            )}
          </div>

          {/* Center HUD: Mode Mission Instruction Bar (Very clear for students & smartboards) */}
          {gameMode === 'mission' && (
            <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-lg border-2 border-rose-400 flex items-center gap-3 pointer-events-auto max-w-md animate-in fade-in">
              <button
                onClick={() => speakWord(mission.promptEn)}
                className="w-10 h-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform shrink-0"
                title="重播听音任务 (Repeat Mission Voice)"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <div>
                <div className="text-sm font-black text-rose-600 flex items-center gap-1.5">
                  <span>{mission.promptEn}</span>
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-mono">
                    {mission.currentCount}/{mission.targetCount}
                  </span>
                </div>
                <div className="text-xs text-stone-600 font-medium">
                  {mission.promptZh}
                </div>
              </div>
            </div>
          )}

          {gameMode === 'rhyme' && (
            <div 
              onClick={() => speakWord('Cake and lake rhyme! Both end with -ake!')}
              className="bg-purple-50/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border-2 border-purple-300 flex items-center gap-2.5 pointer-events-auto cursor-pointer hover:bg-purple-100/90 transition-colors"
            >
              <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
              <div>
                <span className="font-black text-xs sm:text-sm text-purple-900">
                  -ake 押韵特训: cake 🍰 与 lake 🌊
                </span>
                <p className="text-[11px] text-purple-700">点击听老师讲解押韵规律 🔊</p>
              </div>
            </div>
          )}

          {/* Right HUD: Classroom Words Practiced & Finish Round Button */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Word counters */}
            <div className="hidden sm:flex items-center gap-2 bg-white/85 px-3 py-1.5 rounded-2xl border border-stone-200 text-xs font-bold text-stone-700 shadow-xs">
              <span className="text-emerald-700">🌾 {cakeFieldCount}</span>
              <span className="text-stone-300">|</span>
              <span className="text-sky-700">🌊 {cakeLakeCount}</span>
            </div>

            {/* Finish Round Button */}
            <button
              onClick={() => {
                setIsPaused(true);
                setIsGameOverOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black text-xs sm:text-sm rounded-2xl shadow-md border-2 border-white flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-900" />
              <span>结算领奖 (Finish)</span>
            </button>
          </div>

        </div>

        {/* Falling Cakes */}
        {cakes.map(cake => (
          <CakeEntity
            key={cake.id}
            cake={cake}
            onClick={handleCakeClick}
          />
        ))}

        {/* Floating Click Feedbacks (+100 CAKE! in the lake!) */}
        {feedbacks.map(f => (
          <div
            key={f.id}
            className="absolute z-50 pointer-events-none animate-float-feedback"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >
            <div 
              className={`px-3 py-1 rounded-2xl shadow-lg border text-center flex flex-col items-center ${
                f.zone === 'lake'
                  ? 'bg-sky-500 text-white border-sky-300'
                  : 'bg-emerald-600 text-white border-emerald-300'
              }`}
            >
              <span className="text-sm sm:text-base font-black tracking-wider flex items-center gap-1">
                {f.emoji} {f.text}
              </span>
              <span className="text-[11px] font-bold text-yellow-200">
                {f.subText}
              </span>
            </div>
          </div>
        ))}

        {/* Paused Overlay */}
        {isPaused && !isGameOverOpen && (
          <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-300 text-center space-y-3 max-w-xs animate-in zoom-in-95">
              <div className="text-5xl">⏸️</div>
              <h3 className="text-xl font-black text-stone-800">课堂休息 / 游戏暂停</h3>
              <p className="text-xs text-stone-500">点击下方按钮随时继续带领同学们互动！</p>
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black rounded-xl shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                继续游戏 (Resume)
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Modals */}
      <PhonicsModal
        isOpen={isPhonicsOpen}
        onClose={() => setIsPhonicsOpen(false)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        records={records}
        onClearRecords={handleClearRecords}
      />

      <GameOverModal
        isOpen={isGameOverOpen}
        score={score}
        cakeFieldCount={cakeFieldCount}
        cakeLakeCount={cakeLakeCount}
        onPlayAgain={handlePlayAgain}
        onSaveRecord={handleSaveRecord}
        onOpenLeaderboard={() => {
          setIsGameOverOpen(false);
          setIsLeaderboardOpen(true);
        }}
      />

    </div>
  );
}
