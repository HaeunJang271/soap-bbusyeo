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
  durability: number // 비누 내구도 (100%에서 시작)
  maxDurability: number // 최대 내구도
}

export interface Toy {
  id: string
  name: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  icon: string
  description: string
  dropRate: number // 드롭 확률 (0-1)
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

  // User Authentication
  isLoggedIn: boolean
  userProfile: {
    id: string | null
    nickname: string | null
    profileImage: string | null
    email: string | null
  } | null
  
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
  collectedToys: Toy[] // 수집된 장난감들
  
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
     texture: 'smooth',
     durability: 100,
     maxDurability: 100
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
     texture: 'bubbles',
     durability: 100,
     maxDurability: 100
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
       texture: 'stripes',
       durability: 100,
       maxDurability: 100
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
     texture: 'dots',
     durability: 100,
     maxDurability: 100
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
     texture: 'swirls',
     durability: 100,
     maxDurability: 100
   },
      {
      id: 'golden',
      name: '골든 비누',
      color: '#DAA520',
      foamColor: '#FFD700',
      foamShape: 'bubble',
      particles: 17,
      power: 0.8,
      reflectivity: 1.5,
      price: 400,
      unlocked: false,
      texture: 'sparkle',
      durability: 100,
      maxDurability: 100
    }
]

// 장난감 데이터
export const availableToys: Toy[] = [
  {
    id: 'rubber-duck',
    name: '고무 오리',
    rarity: 'common',
    icon: '🦆',
    description: '귀여운 고무 오리 장난감',
    dropRate: 0.4
  },
  {
    id: 'bubble-blower',
    name: '비눗방울',
    rarity: 'common',
    icon: '🫧',
    description: '거품을 불어주는 장난감',
    dropRate: 0.35
  },
  {
    id: 'soap-car',
    name: '비누 자동차',
    rarity: 'rare',
    icon: '🚗',
    description: '비누로 만든 미니 자동차',
    dropRate: 0.15
  },
  {
    id: 'crystal-ball',
    name: '수정구',
    rarity: 'rare',
    icon: '🔮',
    description: '반짝이는 수정구',
    dropRate: 0.1
  },
  {
    id: 'golden-coin',
    name: '황금 동전',
    rarity: 'epic',
    icon: '🪙',
    description: '희귀한 황금 동전',
    dropRate: 0.05
  },
  {
    id: 'diamond-ring',
    name: '다이아몬드 반지',
    rarity: 'epic',
    icon: '💍',
    description: '빛나는 다이아몬드 반지',
    dropRate: 0.03
  },
  {
    id: 'magic-wand',
    name: '마법 지팡이',
    rarity: 'legendary',
    icon: '🪄',
    description: '마법의 힘이 깃든 지팡이',
    dropRate: 0.01
  },
  {
    id: 'rainbow-unicorn',
    name: '무지개 유니콘',
    rarity: 'legendary',
    icon: '🦄',
    description: '전설의 무지개 유니콘',
    dropRate: 0.005
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
  toggleLowPerformanceMode: () => void
  
  // Economy actions
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => void
  
  // Unlock actions
  unlockSoap: (soapId: string) => void
  unlockTool: (toolId: string) => void
  
  // Toy actions
  addToy: (toy: Toy) => void
  getRandomToy: () => Toy | null
  
  // Statistics actions
  incrementSoapsCompleted: () => void
  addPlayTime: (seconds: number) => void
  incrementScrubs: () => void
  addCompletedSoapType: (soapType: string) => void
  checkDailyLogin: () => { bonus: number; consecutiveDays: number; isNewLogin: boolean }
  
  // Soap durability actions
  decreaseSoapDurability: (soapId: string, amount: number) => void
  
  // Authentication actions
  loginWithKakao: () => Promise<{ success: boolean; userInfo?: any; error?: any }>
  logout: () => void
  checkKakaoLoginStatus: () => boolean
  updateNickname: (newNickname: string) => void
}>()(
  persist(
    (set, get) => ({
             // Initial state
       isPlaying: false,
       selectedSoap: availableSoaps[0],
       selectedTool: availableTools[0],
       progress: 0,
       gameStartTime: null,

       // User Authentication
       isLoggedIn: false,
       userProfile: null,

       
             availableSoaps: availableSoaps,
      availableTools: availableTools,
      collectedToys: [] as Toy[],
      
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
        addToy: (toy) => {
          console.log('Adding toy:', toy.name)
          set(prev => ({
            collectedToys: [...prev.collectedToys, toy]
          }))
        },
        getRandomToy: () => {
          const random = Math.random()
          let cumulativeRate = 0
          
          for (const toy of availableToys) {
            cumulativeRate += toy.dropRate
            if (random <= cumulativeRate) {
              return toy
            }
          }
          
          return null
        },
        decreaseSoapDurability: (soapId, amount) => {
          console.log('Decreasing soap durability:', soapId, amount)
          set(prev => {
            const updatedSoaps = prev.availableSoaps.map(soap => 
              soap.id === soapId 
                ? { ...soap, durability: Math.max(0, soap.durability - amount) }
                : soap
            )
            
            // 선택된 비누도 업데이트
            const updatedSelectedSoap = prev.selectedSoap.id === soapId
              ? { ...prev.selectedSoap, durability: Math.max(0, prev.selectedSoap.durability - amount) }
              : prev.selectedSoap
            
            return {
              availableSoaps: updatedSoaps,
              selectedSoap: updatedSelectedSoap
            }
          })
        },
        
        // 카카오 로그인 관련 액션들
        loginWithKakao: async () => {
          try {
            if (!window.Kakao) {
              return { success: false, error: 'Kakao SDK not loaded' }
            }

            // 카카오 SDK 초기화 확인
            if (!(window.Kakao as any).isInitialized()) {
              return { success: false, error: 'Kakao SDK not initialized' }
            }

            // 카카오 로그인 요청
            await new Promise<any>((resolve, reject) => {
              (window.Kakao as any).Auth.login({
                success: (authObj: any) => {
                  resolve(authObj)
                },
                fail: (err: any) => {
                  console.error('Kakao Auth login failed:', err)
                  reject(err)
                }
              })
            })

            // 사용자 정보 가져오기
            const userInfo = await new Promise<any>((resolve, reject) => {
              (window.Kakao as any).API.request({
                url: '/v2/user/me',
                success: (res: any) => {
                  resolve(res)
                },
                fail: (err: any) => {
                  console.error('Kakao API request failed:', err)
                  reject(err)
                }
              })
            })

            // 상태 업데이트 - 기존 닉네임 유지 (localStorage에서 직접 확인)
            set(() => {
              // localStorage에서 저장된 사용자 프로필 확인 (별도 키로 저장)
              let existingNickname = localStorage.getItem('user-nickname')
              
              console.log('🔧 localStorage user-nickname:', existingNickname)
              
              if (!existingNickname) {
                // 기존 방식으로도 확인
                const savedData = localStorage.getItem('soap-game-storage')
                console.log('🔧 localStorage savedData:', savedData)
                
                if (savedData) {
                  try {
                    const parsedData = JSON.parse(savedData)
                    console.log('🔧 parsedData:', parsedData)
                    
                    if (parsedData.state && parsedData.state.userProfile && parsedData.state.userProfile.nickname) {
                      existingNickname = parsedData.state.userProfile.nickname
                      console.log('🔧 Found nickname in state:', existingNickname)
                    } else if (parsedData.userProfile && parsedData.userProfile.nickname) {
                      existingNickname = parsedData.userProfile.nickname
                      console.log('🔧 Found nickname in root:', existingNickname)
                    } else {
                      console.log('🔧 No nickname found in localStorage')
                    }
                  } catch (error) {
                    console.error('Failed to parse localStorage data:', error)
                  }
                }
              }
              
              const kakaoNickname = userInfo.properties?.nickname || userInfo.kakao_account?.profile?.nickname || '사용자'
              
              console.log('🔧 loginWithKakao - existingNickname from localStorage:', existingNickname)
              console.log('🔧 loginWithKakao - kakaoNickname:', kakaoNickname)
              console.log('🔧 loginWithKakao - final nickname:', existingNickname || kakaoNickname)
              
              return {
                isLoggedIn: true,
                userProfile: {
                  id: userInfo.id.toString(),
                  nickname: existingNickname || kakaoNickname, // 기존 닉네임이 있으면 유지
                  profileImage: userInfo.properties?.profile_image || userInfo.kakao_account?.profile?.profile_image_url || null,
                  email: userInfo.kakao_account?.email || null
                }
              }
            })

            return { success: true, userInfo }
          } catch (error) {
            console.error('loginWithKakao error:', error)
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
          }
        },

        logout: () => {
          if (window.Kakao) {
            (window.Kakao as any).Auth.logout()
          }
          set(() => ({
            isLoggedIn: false,
            userProfile: null
          }))
        },

        checkKakaoLoginStatus: () => {
          if (!window.Kakao) {
            return false
          }
          return (window.Kakao as any).Auth.getAccessToken() !== null
        },

        updateNickname: (newNickname: string) => {
          console.log('🔧 updateNickname called with:', newNickname)
          set((state) => {
            console.log('🔧 Current userProfile:', state.userProfile)
            const updatedProfile = state.userProfile ? {
              ...state.userProfile,
              nickname: newNickname
            } : null
            console.log('🔧 Updated userProfile:', updatedProfile)
            
            // localStorage에 즉시 저장 (별도 키로도 저장)
            localStorage.setItem('user-nickname', newNickname)
            console.log('🔧 Saved nickname to user-nickname key:', newNickname)
            
            const currentData = localStorage.getItem('soap-game-storage')
            if (currentData) {
              try {
                const parsedData = JSON.parse(currentData)
                parsedData.state = parsedData.state || {}
                parsedData.state.userProfile = updatedProfile
                localStorage.setItem('soap-game-storage', JSON.stringify(parsedData))
                console.log('🔧 Saved to localStorage immediately')
              } catch (error) {
                console.error('Failed to save to localStorage:', error)
              }
            }
            
            return {
              userProfile: updatedProfile
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
        collectedToys: state.collectedToys,

        totalSoapsCompleted: state.totalSoapsCompleted,
        totalPlayTime: state.totalPlayTime,
        totalScrubs: state.totalScrubs,
        completedSoapTypes: state.completedSoapTypes,
        lastLoginDate: state.lastLoginDate,
        consecutiveLoginDays: state.consecutiveLoginDays,
        
        // User authentication data
        isLoggedIn: state.isLoggedIn,
        userProfile: state.userProfile,
      })
    }
  )
)
