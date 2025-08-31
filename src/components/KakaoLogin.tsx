import { useState } from 'react'
import { useGameStore } from '../store'

interface KakaoLoginProps {
  onClose: () => void
}

const KakaoLogin = ({ onClose }: KakaoLoginProps) => {
  const { isLoggedIn, userProfile, loginWithKakao, logout } = useGameStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleKakaoLogin = async () => {
    if (isLoading) return // 중복 클릭 방지
    
    setIsLoading(true)
    try {
      // 모바일 환경 확인
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      // 카카오 SDK 확인
      if (typeof window.Kakao === 'undefined') {
        alert('카카오 SDK를 불러올 수 없습니다. 페이지를 새로고침해주세요.')
        return
      }

      const result = await loginWithKakao()
      if (result.success) {
        console.log('카카오 로그인 성공!')
        // Mark that welcome login has been shown
        if (typeof window !== 'undefined') {
          localStorage.setItem('hasShownWelcomeLogin', 'true')
        }
        onClose()
      } else {
        console.error('카카오 로그인 실패:', result.error)
        
        // 더 구체적인 오류 메시지
        let errorMessage = '로그인에 실패했습니다.'
        if (result.error === 'Kakao SDK not loaded') {
          errorMessage = '카카오 SDK를 불러올 수 없습니다. 페이지를 새로고침해주세요.'
        } else if (result.error === 'Kakao SDK not initialized') {
          errorMessage = '카카오 SDK 초기화에 실패했습니다. 페이지를 새로고침해주세요.'
        } else if (result.error === 'Popup blocked') {
          if (isMobile) {
            errorMessage = '모바일에서는 카카오톡 앱을 통해 로그인해주세요.'
          } else {
            errorMessage = '팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.'
          }
        } else if (result.error.includes('failed to parse error')) {
          errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.'
        }
        
        alert(errorMessage)
      }
    } catch (error) {
      console.error('카카오 로그인 오류:', error)
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-4xl mb-6">🧼</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isLoggedIn ? '로그인됨' : '카카오 로그인'}
          </h2>
          
          {isLoggedIn && userProfile ? (
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                {userProfile.profileImage && (
                  <img 
                    src={userProfile.profileImage} 
                    alt="프로필" 
                    className="w-16 h-16 rounded-full mr-4"
                  />
                )}
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-800">
                    {userProfile.nickname}
                  </p>
                  {userProfile.email && (
                    <p className="text-sm text-gray-600">{userProfile.email}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-gray-500 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-gray-600 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-gray-600 mb-6">
                카카오 계정으로 로그인하여 게임 데이터를 저장하고<br />
                다른 기기에서도 계속 플레이할 수 있습니다.
              </p>
                             <button
                 onClick={handleKakaoLogin}
                 disabled={isLoading}
                 className={`w-full py-3 px-6 rounded-2xl font-semibold transition-colors flex items-center justify-center ${
                   isLoading 
                     ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                     : 'bg-yellow-400 text-black hover:bg-yellow-500'
                 }`}
               >
                 {isLoading ? (
                   <>
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                     로그인 중...
                   </>
                 ) : (
                   <>
                     <span className="text-xl mr-2">💬</span>
                     카카오로 로그인
                   </>
                 )}
               </button>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
          >
            {isLoggedIn ? '닫기' : '나중에'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default KakaoLogin
