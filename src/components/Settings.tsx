import React from 'react'
import { useGameStore } from '../store'
import { audioManager } from '../audio'

interface SettingsProps {
  onClose: () => void
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { 
    soundEnabled, 
    hapticEnabled, 
    backgroundMusicEnabled,
    lowPerformanceMode,
    toggleSound, 
    toggleHaptic, 
    toggleBackgroundMusic,
    toggleLowPerformanceMode
  } = useGameStore()

  // 진동 지원 여부 확인
  const isVibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator

  const handleBackgroundMusicToggle = () => {
    toggleBackgroundMusic()
    if (backgroundMusicEnabled) {
      audioManager.stopBackgroundMusic()
    } else {
      audioManager.playBackgroundMusic()
    }
  }

  const handleSoundToggle = () => {
    toggleSound()
    // 효과음이 꺼지면 현재 재생 중인 효과음도 정지
    if (soundEnabled) {
      audioManager.stopScrub()
    }
  }

  const handleHapticToggle = () => {
    toggleHaptic()
    // 진동이 켜지면 테스트 진동 실행
    if (!hapticEnabled) {
      // 진동 지원 확인 및 테스트
      if ('vibrate' in navigator) {
        try {
          // 테스트 진동 패턴: 짧은 진동 3번
          navigator.vibrate([50, 100, 50, 100, 50])
        } catch (error) {
          console.log('Vibration test failed:', error)
        }
      } else {
        console.log('Vibration not supported on this device')
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-white max-w-md mx-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center">⚙️ 설정</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg">🔊 효과음</span>
            <button
              onClick={handleSoundToggle}
              className={`w-12 h-6 rounded-full transition-colors ${
                soundEnabled ? 'bg-blue-500' : 'bg-gray-400'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                soundEnabled ? 'transform translate-x-6' : 'transform translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg">🎵 배경음악</span>
            <button
              onClick={handleBackgroundMusicToggle}
              className={`w-12 h-6 rounded-full transition-colors ${
                backgroundMusicEnabled ? 'bg-blue-500' : 'bg-gray-400'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                backgroundMusicEnabled ? 'transform translate-x-6' : 'transform translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg">📳 진동</span>
              {!isVibrationSupported && (
                <span className="text-xs text-yellow-300 opacity-80">이 기기에서는 지원되지 않습니다</span>
              )}
            </div>
            <button
              onClick={handleHapticToggle}
              disabled={!isVibrationSupported}
              className={`w-12 h-6 rounded-full transition-colors ${
                hapticEnabled && isVibrationSupported ? 'bg-blue-500' : 'bg-gray-400'
              } ${!isVibrationSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                hapticEnabled && isVibrationSupported ? 'transform translate-x-6' : 'transform translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg">⚡ 저사양 모드</span>
              <span className="text-xs text-blue-300 opacity-80">성능 향상을 위해 파티클을 줄입니다</span>
            </div>
            <button
              onClick={toggleLowPerformanceMode}
              className={`w-12 h-6 rounded-full transition-colors ${
                lowPerformanceMode ? 'bg-blue-500' : 'bg-gray-400'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                lowPerformanceMode ? 'transform translate-x-6' : 'transform translate-x-1'
              }`} />
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm opacity-70">
          설정이 자동으로 저장됩니다
        </div>
      </div>
    </div>
  )
}

export default Settings
