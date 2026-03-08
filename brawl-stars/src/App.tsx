import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { RewardCard } from './components/RewardCard';
import { BackgroundParticles, Confetti } from './components/Effects';
import { 
  ChevronLeft,
  Info,
  Youtube, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Music2,
  Users,
  Trophy,
  Zap,
  Star,
  Gift
} from 'lucide-react';

const REWARDS = [
  {
    title: "ULTRA CHAOS DROPS",
    image: "https://i.postimg.cc/Kzk0YBdC/Rare-Chaos-Drop.png",
    subtitle: "LIMITED TIME",
    rare: true
  },
  {
    title: "2000 GEMS",
    image: "https://i.postimg.cc/2SBZKTN8/Item-7-1.png",
    subtitle: "MEGA PACK",
    rare: true
  },
  {
    title: "SIRIUS BOX",
    image: "https://i.postimg.cc/SRsX7fG7/Item-16.png",
    subtitle: "EXCLUSIVE",
    rare: true
  },
  {
    title: "KENJI",
    subtitle: "NEW LEGENDARY BRAWLER",
    image: "https://i.postimg.cc/3J0N8RSq/Item-3-webp.png",
    rare: true
  },
  {
    title: "BRAWL PASS PLUS",
    image: "https://i.postimg.cc/2jMjKYjN/Item-10-1.png",
    subtitle: "SEASON 30"
  },
  {
    title: "SIRIUS BRAWLER",
    image: "https://i.postimg.cc/mZz1D8tW/Sirius-Skin-Default.png",
    subtitle: "MYTHIC BRAWLER"
  },
  {
    title: "ULTRA BOX",
    image: "https://i.postimg.cc/VLPvNwxC/Item-11.png",
    subtitle: "ULTRA RARE",
    rare: true
  },
  {
    title: "BUFFIES",
    image: "https://i.postimg.cc/FRJF9CG1/Item-2-webp.png",
    subtitle: "COLLECTIBLE"
  },
  {
    title: "VALENTINE'S BOX",
    image: "https://i.postimg.cc/q7N4LDPm/Item-15.png",
    subtitle: "SPECIAL EVENT"
  },
  {
    title: "KEYS",
    image: "https://i.postimg.cc/TYTxSP8c/Item-4-webp.png",
    subtitle: "100x PACK"
  }
];

const WINNERS = [
  { name: "ProBrawler", reward: "Chaos Drops", time: "2m ago" },
  { name: "StarPlayer", reward: "2000 Gems", time: "5m ago" },
  { name: "BrawlKing", reward: "Sirius Box", time: "8m ago" },
  { name: "GamerX", reward: "Kenji", time: "12m ago" },
  { name: "NoobMaster", reward: "Brawl Pass", time: "15m ago" },
  { name: "Legendary_YT", reward: "Ultra Box", time: "18m ago" },
  { name: "Brawl_Star_99", reward: "2000 Gems", time: "22m ago" },
  { name: "Mortis_Main", reward: "Mortis Skin", time: "25m ago" },
  { name: "Gem_Hunter", reward: "Chaos Drops", time: "28m ago" },
  { name: "Super_Cell_Fan", reward: "Brawl Pass Plus", time: "30m ago" },
];

export default function App() {
  const [claimedCount, setClaimedCount] = useState(3893);
  const [onlineCount, setOnlineCount] = useState(1038);
  const [showClaimModal, setShowClaimModal] = useState<string | null>(null);
  const [playerTag, setPlayerTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [securityToken, setSecurityToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [playerData, setPlayerData] = useState<any>(null);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setClaimedCount(prev => prev + Math.floor(Math.random() * 2));
      setOnlineCount(prev => prev + (Math.random() > 0.5 ? 2 : -2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const generateVerificationData = async (tag: string, rewardTitle: string) => {
    try {
      const rewardObj = REWARDS.find(r => r.title === rewardTitle);
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a short, technical-sounding verification message and a unique 12-character security token (hexadecimal) for a Brawl Stars player.
        Player Tag: ${tag}
        Reward: ${rewardTitle}
        Reward Type/Subtitle: ${rewardObj?.subtitle || 'Special Item'}
        Is Rare: ${rewardObj?.rare ? 'Yes' : 'No'}
        
        The message should sound like a high-security protocol or a server-side confirmation. 
        It MUST explicitly mention the player tag "${tag}" and the reward "${rewardTitle}".
        Incorporate the reward's specific type ("${rewardObj?.subtitle}") and rarity into the message to make it feel personalized and informative.
        For example: "Initializing secure transfer of ${rewardObj?.rare ? 'Legendary' : 'Premium'} ${rewardTitle} (${rewardObj?.subtitle}) to terminal ${tag}. Encryption handshake successful."
        
        Return as JSON: { "message": "...", "token": "..." }`,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      setVerificationMessage(data.message || `Manual verification required for ${rewardTitle} delivery to ${tag}.`);
      setSecurityToken(data.token || "0x" + Math.random().toString(16).slice(2, 10).toUpperCase());
    } catch (error) {
      console.error("Gemini error:", error);
      setVerificationMessage(`Security protocol triggered for ${tag}. Manual verification of ${rewardTitle} required.`);
      setSecurityToken("ERR_SEC_0x" + Math.random().toString(16).slice(2, 6).toUpperCase());
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSubmitting && generationProgress < 100 && !verificationStep) {
      interval = setInterval(() => {
        setGenerationProgress(prev => {
          const next = prev + Math.floor(Math.random() * 3) + 1;
          if (next >= 100) {
            setVerificationStep(true);
            generateVerificationData(playerTag, showClaimModal || '');
            return 100;
          }
          return next;
        });
      }, 80);
    }
    return () => clearInterval(interval);
  }, [isSubmitting, generationProgress, verificationStep, playerTag, showClaimModal]);

  const handleClaim = (title: string) => {
    setGenerationProgress(0);
    setIsSubmitting(false);
    setVerificationStep(false);
    setIsSuccess(false);
    setPlayerData(null);
    setShowClaimModal(title);
  };

  const fetchPlayerData = async () => {
    if (playerTag.length < 3) {
      alert("Please enter a valid Player Tag!");
      return;
    }

    setIsLoadingPlayer(true);
    try {
      // Remove # if present for the API call
      const tag = playerTag.startsWith('#') ? playerTag.substring(1) : playerTag;
      const response = await axios.get(`/api/brawlstars/player/${tag}`);
      setPlayerData(response.data);
      setIsSubmitting(true);
    } catch (error: any) {
      console.error("Player fetch error:", error);
      // If API key is missing or tag is invalid, we still allow "demo" mode but show a warning
      if (error.response?.status === 404) {
        alert("Player not found! Please check your tag.");
      } else {
        // Fallback for demo purposes if API key isn't set yet
        setIsSubmitting(true);
      }
    } finally {
      setIsLoadingPlayer(false);
    }
  };

  const handleVerify = () => {
    window.location.href = 'https://google.com';
  };

  const resetModal = () => {
    setIsSubmitting(false);
    setGenerationProgress(0);
    setVerificationStep(false);
    setIsSuccess(false);
    setShowClaimModal(null);
    setPlayerTag('');
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-yellow-400 selection:text-black">
      <div className="bg-pattern" />
      <BackgroundParticles />
      
      {isSuccess && <Confetti />}
      
      {/* Top Ticker */}
      <div className="relative z-50 overflow-hidden bg-black/60 py-3 backdrop-blur-md border-b border-white/5">
        <div className="animate-scroll whitespace-nowrap font-display text-sm md:text-base tracking-wider uppercase italic text-white">
          {WINNERS.map((w, i) => (
            <span key={i} className="mx-12 inline-flex items-center gap-2">
              <span className="text-yellow-400 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">{w.name}</span>
              <span className="text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">CLAIMED</span>
              <span className="text-pink-500 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">{w.reward}</span>
              <span className="text-white/40 font-sans font-bold not-italic text-[10px]">({w.time})</span>
            </span>
          ))}
        </div>
      </div>

      <main className="container mx-auto flex flex-col items-center px-4 pt-12 pb-32">
        {/* Hero Section */}
        <div className="relative mb-12 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="relative z-10"
          >
            <img 
              src="https://i.postimg.cc/g22qJ3hQ/logo-outlined-no-BG-(1).png" 
              alt="Brawl Stars Logo" 
              className="h-28 md:h-36 object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
              referrerPolicy="no-referrer"
            />
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-3 -right-6"
            >
              <Star className="h-8 w-8 text-yellow-400 fill-yellow-400 drop-shadow-glow" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-3 -left-6"
            >
              <Zap className="h-8 w-8 text-blue-400 fill-blue-400 drop-shadow-glow" />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="brawl-text-shadow mt-4 text-center font-display text-3xl md:text-5xl tracking-tight uppercase italic text-white"
          >
            FREE REWARDS HUB
          </motion.h1>
        </div>

        {/* Stats Bento */}
        <div className="mb-12 grid w-full max-w-5xl grid-cols-3 gap-2 md:gap-6">
          <motion.div 
            whileHover={{ y: -3 }}
            className="glass-panel flex flex-col items-center rounded-2xl p-3 md:p-6 text-center"
          >
            <div className="mb-2 flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-red-500/10 shadow-[inset_0_0_8px_rgba(239,68,68,0.2)]">
              <div className="h-2 w-2 md:h-3 md:w-3 animate-pulse rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
            </div>
            <span className="font-display text-xl md:text-4xl italic text-white">{claimedCount.toLocaleString()}</span>
            <span className="mt-1 text-[7px] md:text-[10px] font-black tracking-[0.1em] md:tracking-[0.15em] uppercase text-white/50 leading-tight">TOTAL CLAIMS</span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="glass-panel flex flex-col items-center rounded-2xl p-3 md:p-6 text-center"
          >
            <div className="mb-2 flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-yellow-500/10 shadow-[inset_0_0_8px_rgba(234,179,8,0.2)]">
              <Trophy className="h-4 w-4 md:h-6 md:w-6 text-yellow-500" />
            </div>
            <span className="font-display text-xl md:text-4xl italic text-white">98.2%</span>
            <span className="mt-1 text-[7px] md:text-[10px] font-black tracking-[0.1em] md:tracking-[0.15em] uppercase text-white/50 leading-tight">SUCCESS RATE</span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="glass-panel flex flex-col items-center rounded-2xl p-3 md:p-6 text-center"
          >
            <div className="mb-2 flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-blue-500/10 shadow-[inset_0_0_8px_rgba(59,130,246,0.2)]">
              <Users className="h-4 w-4 md:h-6 md:w-6 text-blue-500" />
            </div>
            <span className="font-display text-xl md:text-4xl italic text-white">{onlineCount.toLocaleString()}</span>
            <span className="mt-1 text-[7px] md:text-[10px] font-black tracking-[0.1em] md:tracking-[0.15em] uppercase text-white/50 leading-tight">PLAYERS ONLINE</span>
          </motion.div>
        </div>

        {/* Rewards Grid */}
        <div className="relative w-full max-w-6xl">
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 rounded-full bg-yellow-400" />
              <h2 className="font-display text-2xl md:text-3xl tracking-tight uppercase italic text-white">
                AVAILABLE REWARDS
              </h2>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[8px] md:text-[10px] font-black tracking-widest uppercase text-white/60">
              <Gift className="h-3 w-3" />
              UPDATED 2M AGO
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {REWARDS.map((reward, index) => (
              <RewardCard 
                key={index}
                index={index}
                title={reward.title}
                subtitle={reward.subtitle}
                image={reward.image}
                rare={reward.rare}
                onClaim={() => handleClaim(reward.title)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Claim Modal Overlay */}
      <AnimatePresence>
        {showClaimModal && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className={`relative w-full overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 ${isSubmitting ? 'max-w-xs bg-[#0a0f2c]' : 'max-w-md bg-white p-8 md:p-12'}`}
              >
                {!isSubmitting ? (
                  <>
                    {/* Back Button */}
                    <button 
                      onClick={() => setShowClaimModal(null)}
                      className="absolute left-6 top-6 flex h-8 w-8 items-center justify-center rounded-md bg-[#4a4a4a] text-white shadow-md transition-transform active:scale-90"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col items-center">
                      <h2 className="mb-8 font-display text-3xl md:text-4xl tracking-tight text-black uppercase">
                        ENTER PLAYER TAG
                      </h2>

                      {/* Input Field */}
                      <div className="relative w-full mb-6">
                        <input
                          type="text"
                          value={playerTag}
                          onChange={(e) => setPlayerTag(e.target.value.toUpperCase())}
                          placeholder="# PLAYER TAG"
                          className="w-full rounded-2xl border-[3px] border-[#3b82f6] bg-white py-4 px-6 font-display text-2xl tracking-wider text-[#3b82f6] placeholder:text-blue-200 focus:outline-none shadow-[0_4px_0_#dbeafe]"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6] text-white shadow-sm">
                          <Info className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Let's Go Button */}
                      <button 
                        onClick={fetchPlayerData}
                        disabled={isLoadingPlayer}
                        className={`group relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#ffcc00] to-[#ff9900] py-5 shadow-[0_8px_0_#cc7a00] transition-all active:translate-y-1 active:shadow-none ${isLoadingPlayer ? 'opacity-70 cursor-wait' : ''}`}
                      >
                        <span className="font-display text-4xl tracking-widest text-white brawl-text-shadow flex items-center justify-center">
                          {isLoadingPlayer ? (
                            <motion.div
                              animate={{ 
                                rotate: 360,
                                scale: [1, 1.2, 1]
                              }}
                              transition={{ 
                                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                              }}
                              className="flex items-center justify-center"
                            >
                              <Zap className="h-10 w-10 fill-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                            </motion.div>
                          ) : (
                            "LET'S GO!"
                          )}
                        </span>
                      </button>

                      {/* Footer Text */}
                      <div className="mt-8 text-center text-[8px] font-black leading-relaxed tracking-widest text-gray-400 uppercase">
                        THIS SITE IS PROTECTED BY RECAPTCHA AND THE GOOGLE <a href="#" className="text-blue-500 underline">PRIVACY POLICY</a> AND <a href="#" className="text-blue-500 underline">TERMS OF SERVICE</a> APPLY.
                      </div>
                    </div>
                  </>
                ) : verificationStep ? (
                  <div className="relative flex flex-col items-center overflow-hidden p-6 md:p-10 text-center">
                    {/* Success/Verification UI */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                    
                    <button 
                      onClick={resetModal}
                      className="absolute right-4 top-4 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all hover:bg-white/20 hover:text-white"
                    >
                      <span className="text-lg font-bold">×</span>
                    </button>

                    <div className="relative z-10 flex w-full flex-col items-center">
                      {!isSuccess ? (
                        <>
                          <div className="mb-6 flex flex-col items-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 shadow-[0_0_30px_rgba(255,204,0,0.4)]">
                              <Info className="h-8 w-8 text-[#0a0f2c]" />
                            </div>
                            <h2 className="brawl-text-shadow mb-2 font-display text-2xl md:text-3xl tracking-tight text-white uppercase italic">
                              VERIFICATION REQUIRED
                            </h2>
                            <p className="text-[10px] font-black tracking-widest text-blue-400 uppercase">
                              SECURITY PROTOCOL TRIGGERED
                            </p>
                          </div>

                          <div className="mb-8 w-full rounded-xl bg-white/5 p-4 text-left border border-white/10">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-[8px] font-black tracking-widest text-white/40 uppercase">SECURITY TOKEN</span>
                              <span className="font-mono text-[10px] text-yellow-400">{securityToken || 'LOADING...'}</span>
                            </div>
                            <p className="text-[11px] font-bold text-white/80 leading-relaxed italic">
                              "{verificationMessage || 'Analyzing player data and preparing rewards...'}"
                            </p>
                          </div>

                          <button 
                            onClick={handleVerify}
                            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-blue-500 to-blue-700 py-4 shadow-[0_6px_0_#1e40af] transition-all active:translate-y-1 active:shadow-none"
                          >
                            <span className="font-display text-2xl tracking-widest text-white brawl-text-shadow">
                              VERIFY NOW
                            </span>
                          </button>

                          <p className="mt-6 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                            COMPLETE ONE QUICK TASK TO RECEIVE YOUR REWARD
                          </p>
                        </>
                      ) : (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center py-8"
                        >
                          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                            <Star className="h-12 w-12 text-white fill-white" />
                          </div>
                          <h2 className="brawl-text-shadow mb-4 font-display text-4xl tracking-tight text-white uppercase italic">
                            SUCCESS!
                          </h2>
                          <p className="mb-8 text-sm font-bold text-white/80 leading-relaxed">
                            Your reward <span className="text-yellow-400">{showClaimModal}</span> has been successfully queued for <span className="text-blue-400">{playerData?.name || playerTag}</span>.
                            {playerData?.isDemo && <span className="block mt-2 text-[10px] text-yellow-500/40 uppercase tracking-widest">[DEMO MODE - CONNECT API KEY FOR REAL DATA]</span>}
                          </p>
                          <button 
                            onClick={resetModal}
                            className="rounded-xl bg-white/10 px-8 py-3 text-xs font-black tracking-widest uppercase text-white hover:bg-white/20 transition-colors"
                          >
                            BACK TO HUB
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center overflow-hidden p-6 md:p-8 text-center">
                    {/* Technical Background Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />
                    
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />

                    {/* Close Button */}
                    <button 
                      onClick={resetModal}
                      className="absolute right-4 top-4 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all hover:bg-white/20 hover:text-white"
                    >
                      <span className="text-lg font-bold">×</span>
                    </button>

                    <div className="relative z-10 flex w-full flex-col items-center">
                      <div className="mb-6 flex flex-col items-center">
                        <h2 className="brawl-text-shadow mb-0.5 font-display text-2xl md:text-3xl tracking-tight text-white uppercase italic">
                          GENERATING...
                        </h2>
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                            <p className="text-[9px] font-black tracking-[0.2em] uppercase text-blue-400/80">
                              TARGET: {playerData?.name || playerTag || 'PLAYER'} {playerData?.trophies ? `(${playerData.trophies} 🏆)` : ''}
                              {playerData?.isDemo && <span className="ml-2 text-yellow-500/60">[DEMO]</span>}
                            </p>
                          </div>
                      </div>

                      {/* Reward Image with Hardware Feel */}
                      <div className="relative mb-8 flex h-32 w-32 items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl animate-pulse" />
                        {/* Circular Dashed Track */}
                        <div className="absolute inset-0 rounded-full border border-dashed border-blue-500/20 animate-[spin_10s_linear_infinite]" />
                        
                        <motion.img 
                          animate={{ 
                            scale: [0.95, 1.05, 0.95],
                            y: [0, -5, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          src={REWARDS.find(r => r.title === showClaimModal)?.image} 
                          alt="Reward" 
                          className="relative z-10 h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Technical Progress Section */}
                      <div className="w-full space-y-3">
                        <div className="flex items-end justify-between px-1">
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="text-[8px] font-black tracking-widest text-blue-500/60 uppercase">STATUS</span>
                            <span className="text-[10px] font-black tracking-widest text-white uppercase">
                              {generationProgress < 30 ? 'INITIALIZING' : 
                               generationProgress < 60 ? 'CRACKING' : 
                               generationProgress < 90 ? 'INJECTING' : 'FINALIZING'}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[8px] font-black tracking-widest text-blue-500/60 uppercase">PROGRESS</span>
                            <span className="font-mono text-xs font-bold text-white tracking-tighter">
                              {generationProgress.toString().padStart(3, '0')}%
                            </span>
                          </div>
                        </div>
                        
                        {/* Hardware Style Progress Bar */}
                        <div className="relative h-3 w-full overflow-hidden rounded-sm bg-black/60 p-0.5 ring-1 ring-white/10">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${generationProgress}%` }}
                            className="h-full rounded-[1px] bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                          />
                          {/* Grid Overlay on Progress Bar */}
                          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent 95%, rgba(0,0,0,0.5) 95%)', backgroundSize: '4% 100%' }} />
                        </div>

                        {/* Micro Details */}
                        <div className="flex justify-between px-1 text-[7px] font-mono text-blue-500/40 uppercase tracking-widest">
                          <span>0x7F4A9B2</span>
                          <span>STABLE CONNECTION</span>
                          <span>v2.0.4</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 bg-[#050a1a] py-24 text-white border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col justify-between gap-16 md:flex-row">
            <div className="max-w-xs">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Supercell_logo.svg/1200px-Supercell_logo.svg.png" 
                alt="Supercell" 
                className="h-10 mb-8 opacity-80"
              />
              <p className="text-sm font-bold text-white/40 leading-relaxed mb-8">
                Supercell is a mobile game developer based in Helsinki, Finland, with offices in San Francisco, Seoul and Shanghai.
              </p>
              <div className="flex gap-4">
                <Youtube className="h-5 w-5 cursor-pointer text-white/40 transition-colors hover:text-white" />
                <Facebook className="h-5 w-5 cursor-pointer text-white/40 transition-colors hover:text-white" />
                <Instagram className="h-5 w-5 cursor-pointer text-white/40 transition-colors hover:text-white" />
                <Twitter className="h-5 w-5 cursor-pointer text-white/40 transition-colors hover:text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-16 gap-y-12">
              <div>
                <h4 className="mb-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/20">GAMES</h4>
                <ul className="space-y-3 text-sm font-bold text-white/60">
                  <li className="hover:text-white cursor-pointer transition-colors">Brawl Stars</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Clash of Clans</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Clash Royale</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Hay Day</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-6 text-[10px] font-black tracking-[0.3em] uppercase text-white/20">SUPPORT</h4>
                <ul className="space-y-3 text-sm font-bold text-white/60">
                  <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Parent's Guide</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Safe & Fair Play</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-24 flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-12 md:flex-row">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-black tracking-widest uppercase text-white/30">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
              <a href="#" className="hover:text-white transition-colors">Legal</a>
            </div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              © 2026 SUPERCELL OY. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
