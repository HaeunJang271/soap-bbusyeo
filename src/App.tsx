import { useState, useEffect } from 'react'
import { useGameStore } from './store'
import { audioManager } from './audio'
import SoapPicker from './components/SoapPicker'
import FoamRitual from './components/FoamRitual'
import Settings from './components/Settings'

import Statistics from './components/Statistics'
import LoginBonus from './components/LoginBonus'
import ShareModal from './components/ShareModal'

function App() {
  const { 
    isPlaying, 
    backgroundMusicEnabled,
    checkDailyLogin 
  } = useGameStore()

  const [showSettings, setShowSettings] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)
  const [showLoginBonus, setShowLoginBonus] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [loginBonusData, setLoginBonusData] = useState<{ bonus: number; consecutiveDays: number } | null>(null)

  useEffect(() => {
    // Check daily login bonus only once
    const loginResult = checkDailyLogin()
    console.log('Login result:', JSON.stringify(loginResult, null, 2))
    if (loginResult.isNewLogin) {
      console.log('Setting login bonus data:', {
        bonus: loginResult.bonus,
        consecutiveDays: loginResult.consecutiveDays
      })
      setLoginBonusData({
        bonus: loginResult.bonus,
        consecutiveDays: loginResult.consecutiveDays
      })
      setShowLoginBonus(true)
    }
  }, []) // Run only once on mount

  useEffect(() => {
    // Initialize audio on first user interaction
    const handleFirstInteraction = () => {
      console.log('First user interaction detected')
      audioManager.initializeOnUserInteraction()
      
      // 모바일에서 약간의 지연 후 배경음악 재생
      setTimeout(() => {
        if (backgroundMusicEnabled) {
          console.log('Playing background music')
          audioManager.playBackgroundMusic()
        }
      }, 200)
      
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [backgroundMusicEnabled])

  useEffect(() => {
    // Handle background music
    if (backgroundMusicEnabled) {
      audioManager.playBackgroundMusic()
    } else {
      audioManager.stopBackgroundMusic()
    }
  }, [backgroundMusicEnabled])

  useEffect(() => {
    // Cleanup audio when component unmounts
    return () => {
      audioManager.cleanup()
    }
  }, [])



  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/imgs/배경.jpeg)' }}
      />


      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full">
        {isPlaying ? (
          <FoamRitual onHaptic={() => {}} />
        ) : (
          <SoapPicker />
        )}
      </div>



      {/* Share Button */}
      {!isPlaying && (
        <button
          onClick={() => setShowShare(true)}
          className="absolute top-4 right-36 z-20 bg-gradient-to-br from-green-400/30 to-emerald-400/30 backdrop-blur-md rounded-full p-3 text-white hover:from-green-400/40 hover:to-emerald-400/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
        >
          <div className="text-xl">📤</div>
        </button>
      )}

      {/* Statistics Button */}
      {!isPlaying && (
        <button
          onClick={() => setShowStatistics(true)}
          className="absolute top-4 right-20 z-20 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 backdrop-blur-md rounded-full p-3 text-white hover:from-blue-400/40 hover:to-cyan-400/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
        >
          <div className="text-xl">📊</div>
        </button>
      )}

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 z-30 bg-gradient-to-br from-gray-400/30 to-slate-400/30 backdrop-blur-md rounded-full p-3 text-white hover:from-gray-400/40 hover:to-slate-400/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
      >
        <div className="text-xl">⚙️</div>
      </button>

      {/* Modals */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}



      {showStatistics && (
        <Statistics onClose={() => setShowStatistics(false)} />
      )}

      {showLoginBonus && loginBonusData && (
        <LoginBonus
          bonus={loginBonusData.bonus}
          consecutiveDays={loginBonusData.consecutiveDays}
          onClose={() => setShowLoginBonus(false)}
        />
      )}

      {showShare && (
        <ShareModal
          onClose={() => setShowShare(false)}
        />
      )}

      {/* Waiting Overlay */}
      {showOverlay && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/imgs/대기.jpg)' }}
        >
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-600/30">
            <div className="text-center">
              <div className="text-4xl mb-8">🧼</div>
              <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>비누뿌셔</h1>
              <p className="text-white mb-8 text-lg drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>비누를 선택하고 문질러 거품을 만들어보세요!</p>
              <button
                onClick={() => {
                  console.log('Overlay clicked, hiding overlay')
                  setShowOverlay(false)
                  
                  // 오버레이 클릭 시 오디오 초기화 및 배경음악 재생
                  audioManager.initializeOnUserInteraction()
                  if (backgroundMusicEnabled) {
                    setTimeout(() => {
                      audioManager.playBackgroundMusic()
                    }, 200)
                  }
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                클릭하여 접속하세요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App