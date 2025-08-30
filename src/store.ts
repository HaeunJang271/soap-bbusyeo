import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Soap {
  id: string
  name: string
  color: string
  foamColor: string
  foamShape: 'bubble' | 'foam'
  isBubble?: boolean
  particles: number
  power: number
  reflectivity: number
  price: number
  unlocked: boolean
  texture?: string
}

export interface Tool {
  id: string
  name: string
  icon: string
  price: number
  unlocked: boolean
  efficiency: number
}



export interface GameState {
  // Game state
  isPlaying: boolean
  selectedSoap: Soap
  selectedTool: Tool
  progress: number
  gameStartTime: number | null

  
  // Settings
  soundEnabled: boolean
  hapticEnabled: boolean
  backgroundMusicEnabled: boolean
  lowPerformanceMode: boolean
  
  // Economy
  coins: number
  totalCoinsEarned: number
  
  // Items
  availableSoaps: Soap[]
  availableTools: Tool[]
  

  
  // Statistics
  totalSoapsCompleted: number
  totalPlayTime: number
  totalScrubs: number
  completedSoapTypes: string[]
  lastLoginDate: string | null
  consecutiveLoginDays: number
}

export const availableSoaps: Soap[] = [
     {
     id: 'basic',
     name: '기본 비누',
     color: '#E6F3FF',
     foamColor: '#FFFFFF',
     foamShape: 'foam',
     particles: 10,
     power: 0.3,
     reflectivity: 1,
     price: 0,
     unlocked: true,
     texture: 'smooth'
   },
     {
     id: 'rose',
     name: '장미 비누',
     color: '#FFE6F3',
     foamColor: '#FFE6F3',
     foamShape: 'bubble',
     isBubble: true,
     particles: 15,
     power: 0.6,
     reflectivity: 1.3,
     price: 100,
     unlocked: false,
     texture: 'bubbles'
   },
                       {
       id: 'lemon',
       name: '레몬 비누',
       color: '#FFFACD',
       foamColor: '#FFFACD',
       foamShape: 'foam',
       particles: 8,
       power: 0.4,
       reflectivity: 1.5,
       price: 150,
       unlocked: false,
       texture: 'stripes'
     },
     {
     id: 'mint',
     name: '민트 비누',
     color: '#E6FFF3',
     foamColor: '#E6FFF3',
     foamShape: 'foam',
     particles: 12,
     power: 0.5,
     reflectivity: 1.2,
     price: 200,
     unlocked: false,
     texture: 'dots'
   },
   {
     id: 'lavender',
     name: '라벤더 비누',
     color: '#E6E6FA',
     foamColor: '#E6E6FA',
     foamShape: 'foam',
     particles: 18,
     power: 0.7,
     reflectivity: 1.4,
     price: 300,
     unlocked: false,
     texture: 'swirls'
   },
      {
      id: 'golden',
      name: '골든 비누',
      color: '#DAA520',
      foamColor: '#FFD700',
      foamShape: 'bubble',
      particles: 25,
      power: 0.8,
      reflectivity: 1.5,
      price: 1000,
      unlocked: false,
      texture: 'sparkle'
    }
]

export const availableTools: Tool[] = [
  {
    id: 'hand',
    name: '손',
    icon: '👐',
    price: 0,
    unlocked: true,
    efficiency: 1
  },
  {
    id: 'brush',
    name: '거품볼',
    icon: '🧽',
    price: 500,
    unlocked: false,
    efficiency: 1.5
  },
  {
    id: 'brush-tool',
    name: '브러시',
    icon: '🪥',
    price: 800,
    unlocked: false,
    efficiency: 2.0
  },
  {
    id: 'sponge',
    name: '스폰지',
    icon: '🧽',
    price: 1200,
    unlocked: false,
    efficiency: 2.5
  }
]





export const useGameStore = create<GameState & {
  // Game actions
  setIsPlaying: (playing: boolean) => void
  setSelectedSoap: (soap: Soap) => void
  setSelectedTool: (tool: Tool) => void
  updateProgress: (progress: number) => void
  setGameStartTime: (time: number | null) => void
  
  // Settings actions
  toggleSound: () => void
  toggleHaptic: () => void
  toggleBackgroundMusic: () => void
  
  // Economy actions
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => void
  
  // Unlock actions
  unlockSoap: (soapId: string) => void
  unlockTool: (toolId: string) => void
  

  
  // Statistics actions
  incrementSoapsCompleted: () => void
  addPlayTime: (seconds: number) => void
  incrementScrubs: () => void
  addCompletedSoapType: (soapType: string) => void
  checkDailyLogin: () => { bonus: number; consecutiveDays: number; isNewLogin: boolean }
}>()(
  persist(
    (set, get) => ({
             // Initial state
       isPlaying: false,
       selectedSoap: availableSoaps[0],
       selectedTool: availableTools[0],
       progress: 0,
       gameStartTime: null,

       
       availableSoaps: availableSoaps,
       availableTools: availableTools,
      
      soundEnabled: true,
      hapticEnabled: true,
      backgroundMusicEnabled: true,
      lowPerformanceMode: false,
      
      coins: 0,
      totalCoinsEarned: 0,
      

      
      totalSoapsCompleted: 0,
      totalPlayTime: 0,
      totalScrubs: 0,
      completedSoapTypes: [] as string[],
      lastLoginDate: null,
      consecutiveLoginDays: 0,
      
      // Game actions
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setSelectedSoap: (soap) => set({ selectedSoap: soap }),
      setSelectedTool: (tool) => set({ selectedTool: tool }),
      updateProgress: (progress) => set({ progress: Math.min(100, Math.max(0, progress)) }),
      setGameStartTime: (time) => set({ gameStartTime: time }),

      
      // Settings actions
      toggleSound: () => set(prev => ({ soundEnabled: !prev.soundEnabled })),
      toggleHaptic: () => set(prev => ({ hapticEnabled: !prev.hapticEnabled })),
      toggleBackgroundMusic: () => set(prev => ({ backgroundMusicEnabled: !prev.backgroundMusicEnabled })),
      toggleLowPerformanceMode: () => set(prev => ({ lowPerformanceMode: !prev.lowPerformanceMode })),
      
      // Economy actions
            addCoins: (amount) => set(prev => {
        console.log('Adding coins:', {
          amount,
          currentCoins: prev.coins,
          newCoins: prev.coins + amount,
          totalEarned: prev.totalCoinsEarned + amount,
          timestamp: new Date().toISOString()
        })
        return {
          coins: prev.coins + amount,
          totalCoinsEarned: prev.totalCoinsEarned + amount
        }
      }),
      spendCoins: (amount) => set(prev => {
        console.log('Spending coins:', {
          amount,
          currentCoins: prev.coins,
          newCoins: Math.max(0, prev.coins - amount)
        })
        return { coins: Math.max(0, prev.coins - amount) }
      }),

      

      
      // Statistics actions
          incrementSoapsCompleted: () => set(prev => {
      console.log('incrementSoapsCompleted called, current:', prev.totalSoapsCompleted, 'new:', prev.totalSoapsCompleted + 1)
      return { totalSoapsCompleted: prev.totalSoapsCompleted + 1 }
    }),
    addPlayTime: (seconds) => set(prev => {
      console.log('addPlayTime called, adding:', seconds, 'current:', prev.totalPlayTime, 'new:', prev.totalPlayTime + seconds)
      return { totalPlayTime: prev.totalPlayTime + seconds }
    }),
    incrementScrubs: () => set(prev => {
      console.log('incrementScrubs called, current:', prev.totalScrubs, 'new:', prev.totalScrubs + 1)
      return { totalScrubs: prev.totalScrubs + 1 }
    }),
      addCompletedSoapType: (soapType) => set(prev => ({ 
        completedSoapTypes: prev.completedSoapTypes.includes(soapType) 
          ? prev.completedSoapTypes 
          : [...prev.completedSoapTypes, soapType]
      })),
      checkDailyLogin: () => {
        const today = new Date().toDateString()
        const state = get()
        
        console.log('checkDailyLogin - Current state:', JSON.stringify({
          lastLoginDate: state.lastLoginDate,
          consecutiveLoginDays: state.consecutiveLoginDays,
          today: today
        }, null, 2))
        
        // 첫 로그인인 경우 (lastLoginDate가 null)
        if (state.lastLoginDate === null) {
          console.log('First login detected, giving 50 coins')
          
          // 상태를 먼저 업데이트
          set(prev => ({ 
            lastLoginDate: today,
            consecutiveLoginDays: 1,
            coins: prev.coins + 50,
            totalCoinsEarned: prev.totalCoinsEarned + 50
          }))
          
          // 결과를 즉시 반환
          return {
            bonus: 50,
            consecutiveDays: 1,
            isNewLogin: true
          }
        }
        
        if (state.lastLoginDate !== today) {
          // Calculate consecutive days
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const isConsecutive = state.lastLoginDate === yesterday.toDateString()
          
          const newConsecutiveDays = isConsecutive ? state.consecutiveLoginDays + 1 : 1
          
          // Calculate bonus based on consecutive days (1일차부터 시작)
          let bonus = 0
          if (newConsecutiveDays === 1) bonus = 50      // 1일차
          else if (newConsecutiveDays === 2) bonus = 50  // 2일차
          else if (newConsecutiveDays === 3) bonus = 100 // 3일차
          else if (newConsecutiveDays >= 7) bonus = 200  // 7일차 이상
          else bonus = 100 // 4-6일차
          
          set(prev => ({ 
            lastLoginDate: today,
            consecutiveLoginDays: newConsecutiveDays,
            coins: prev.coins + bonus,
            totalCoinsEarned: prev.totalCoinsEarned + bonus
          }))
          
          // Return bonus info for notification
          return {
            bonus,
            consecutiveDays: newConsecutiveDays,
            isNewLogin: true
          }
        }
        
        return { bonus: 0, consecutiveDays: state.consecutiveLoginDays, isNewLogin: false }
      },
       collectDailyLoginBonus: () => {
         const state = get()
         // 1일차부터 시작하는 보상 계산
         let reward = 0
         if (state.consecutiveLoginDays === 1) reward = 50      // 1일차
         else if (state.consecutiveLoginDays === 2) reward = 50  // 2일차
         else if (state.consecutiveLoginDays === 3) reward = 100 // 3일차
         else if (state.consecutiveLoginDays >= 7) reward = 200  // 7일차 이상
         else reward = 100 // 4-6일차
         
         set(prev => ({ 
           coins: prev.coins + reward,
           totalCoinsEarned: prev.totalCoinsEarned + reward
         }))
       },
        unlockSoap: (soapId) => {
          console.log('Unlocking soap:', soapId)
          set(prev => {
            const updatedSoaps = prev.availableSoaps.map(soap => 
              soap.id === soapId ? { ...soap, unlocked: true } : soap
            )
            console.log('Updated soaps:', updatedSoaps.map(s => ({ id: s.id, name: s.name, unlocked: s.unlocked })))
            return {
              availableSoaps: updatedSoaps
            }
          })
        },
        unlockTool: (toolId) => {
          console.log('Unlocking tool:', toolId)
          set(prev => {
            const updatedTools = prev.availableTools.map(tool => 
              tool.id === toolId ? { ...tool, unlocked: true } : tool
            )
            console.log('Updated tools:', updatedTools.map(t => ({ id: t.id, name: t.name, unlocked: t.unlocked })))
            return {
              availableTools: updatedTools
            }
          })
        },
      }),
    {
      name: 'soap-game-storage',
                   partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        hapticEnabled: state.hapticEnabled,
        backgroundMusicEnabled: state.backgroundMusicEnabled,
        coins: state.coins,
        totalCoinsEarned: state.totalCoinsEarned,
        availableSoaps: state.availableSoaps,
        availableTools: state.availableTools,

        totalSoapsCompleted: state.totalSoapsCompleted,
        totalPlayTime: state.totalPlayTime,
        totalScrubs: state.totalScrubs,
        completedSoapTypes: state.completedSoapTypes,
        lastLoginDate: state.lastLoginDate,
        consecutiveLoginDays: state.consecutiveLoginDays,
      })
    }
  )
)
