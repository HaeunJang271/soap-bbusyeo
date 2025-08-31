import { useGameStore } from '../store'
import KakaoLogin from './KakaoLogin'
import { useState } from 'react'

interface WelcomeLoginProps {
  onClose: () => void
}

const WelcomeLogin = ({ onClose }: WelcomeLoginProps) => {
  const { isLoggedIn, userProfile } = useGameStore()
  const [showKakaoLogin, setShowKakaoLogin] = useState(false)

  const handleLoginClick = () => {
    setShowKakaoLogin(true)
  }

  const handleSkip = () => {
    // Mark that welcome login has been shown
    localStorage.setItem('hasShownWelcomeLogin', 'true')
    onClose()
  }

  // 이미 로그인된 경우 바로 닫기
  if (isLoggedIn) {
    onClose()
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 border border-white/20">
        <div className="text-center">
          {/* 헤더 */}
          <div className="text-6xl mb-4">🧼</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">비누뿌셔에 오신 것을 환영합니다!</h1>
          <p className="text-gray-600 mb-6">즐거운 비누 문지르기 게임을 시작해보세요</p>

          {/* 로그인 안내 */}
          <div className="bg-white/50 rounded-2xl p-6 mb-6 border border-white/30">
            <div className="text-2xl mb-3">💬</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">카카오 로그인</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              로그인하면 게임 데이터가 안전하게 저장되어<br />
              다른 기기에서도 계속 플레이할 수 있습니다
            </p>
            
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center justify-center">
                <span className="mr-2">✅</span>
                <span>게임 진행도 저장</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">✅</span>
                <span>획득한 장난감 보관</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">✅</span>
                <span>다른 기기에서 연속 플레이</span>
              </div>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="space-y-3">
            <button
              onClick={handleLoginClick}
              className="w-full bg-yellow-400 text-black py-4 px-6 rounded-2xl font-bold text-lg hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <span className="text-2xl mr-3">💬</span>
              카카오로 로그인하기
            </button>
            
            <button
              onClick={handleSkip}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300"
            >
              나중에 하기
            </button>
          </div>

          {/* 작은 안내문 */}
          <p className="text-xs text-gray-500 mt-4">
            언제든지 설정에서 로그인할 수 있습니다
          </p>
        </div>
      </div>

      {/* 카카오 로그인 모달 */}
      {showKakaoLogin && (
        <KakaoLogin onClose={() => setShowKakaoLogin(false)} />
      )}
    </div>
  )
}

export default WelcomeLogin
