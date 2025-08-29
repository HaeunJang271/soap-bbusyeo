import React from 'react'

interface ShareModalProps {
  onClose: () => void
  score?: number
  soapName?: string
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, score, soapName }) => {
  const shareText = `🧼 비누뿌셔에서 ${soapName || '비누'}를 완성했어요! ${score ? `진행도: ${score}%` : ''} 🎉`
  const shareUrl = window.location.href

  const shareToKakao = () => {
    if (window.Kakao) {
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '🧼 비누뿌셔',
          description: shareText,
          imageUrl: 'https://via.placeholder.com/300x200/87CEEB/FFFFFF?text=비누뿌셔',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '게임하기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      })
    } else {
      // 카카오 SDK가 없는 경우 URL 복사
      copyToClipboard(shareUrl)
    }
  }

  const shareToNaver = () => {
    const naverUrl = `https://share.naver.com/web/shareView?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('🧼 비누뿌셔')}`
    window.open(naverUrl, '_blank')
  }

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(facebookUrl, '_blank')
  }

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('링크가 클립보드에 복사되었습니다!')
    }).catch(() => {
      // 폴백: 구식 방법
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('링크가 클립보드에 복사되었습니다!')
    })
  }

  const shareToClipboard = () => {
    copyToClipboard(`${shareText}\n${shareUrl}`)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-2xl p-6 text-center shadow-2xl max-w-sm mx-4">
        <div className="text-4xl mb-4">📤</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">공유하기</h2>
        <p className="text-gray-600 mb-6">{shareText}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={shareToKakao}
            className="flex flex-col items-center p-4 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl transition-colors"
          >
            <div className="text-2xl mb-1">💬</div>
            <div className="text-sm font-medium">카카오톡</div>
          </button>
          
          <button
            onClick={shareToNaver}
            className="flex flex-col items-center p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
          >
            <div className="text-2xl mb-1">🟢</div>
            <div className="text-sm font-medium">네이버</div>
          </button>
          
          <button
            onClick={shareToFacebook}
            className="flex flex-col items-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <div className="text-2xl mb-1">📘</div>
            <div className="text-sm font-medium">페이스북</div>
          </button>
          
          <button
            onClick={shareToTwitter}
            className="flex flex-col items-center p-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-colors"
          >
            <div className="text-2xl mb-1">🐦</div>
            <div className="text-sm font-medium">트위터</div>
          </button>
        </div>
        
        <button
          onClick={shareToClipboard}
          className="w-full mb-4 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
        >
          📋 링크 복사하기
        </button>
        
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  )
}

export default ShareModal
