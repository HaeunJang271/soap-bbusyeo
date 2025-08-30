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
    toggleSound, 
    toggleHaptic, 
    toggleBackgroundMusic 
  } = useGameStore()

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
            <span className="text-lg">📳 진동</span>
            <button
              onClick={toggleHaptic}
              className={`w-12 h-6 rounded-full transition-colors ${
                hapticEnabled ? 'bg-blue-500' : 'bg-gray-400'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                hapticEnabled ? 'transform translate-x-6' : 'transform translate-x-1'
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
