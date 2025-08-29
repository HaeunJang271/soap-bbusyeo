import React, { useEffect, useState } from 'react'

interface LoginBonusProps {
  bonus: number
  consecutiveDays: number
  onClose: () => void
}

const LoginBonus: React.FC<LoginBonusProps> = ({ bonus, consecutiveDays, onClose }) => {
  const [show, setShow] = useState(false)
  
  console.log('LoginBonus component - Props:', JSON.stringify({ 
    bonus: bonus, 
    consecutiveDays: consecutiveDays,
    bonusType: typeof bonus,
    consecutiveDaysType: typeof consecutiveDays
  }, null, 2))

  useEffect(() => {
    // Show animation after a short delay
    const timer = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onClose, 300) // Wait for animation
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const getBonusMessage = () => {
    if (consecutiveDays >= 7) {
      return "🎉 7일 연속 출석! 대박 보너스!"
    } else if (consecutiveDays >= 3) {
      return "🔥 3일 연속 출석! 특별 보너스!"
    } else {
      return "✨ 일일 출석 보너스!"
    }
  }

  const getBonusIcon = () => {
    if (consecutiveDays >= 7) return "💎"
    if (consecutiveDays >= 3) return "🔥"
    return "⭐"
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div 
        className={`bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 text-white text-center shadow-2xl transform transition-all duration-300 ${
          show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="text-6xl mb-4 animate-bounce">
          {getBonusIcon()}
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          {getBonusMessage()}
        </h2>
        
        <div className="text-lg mb-4">
          <span className="font-bold text-2xl">{consecutiveDays}일차</span> 출석
        </div>
        
        <div className="bg-white/20 rounded-lg p-4 mb-6">
          <div className="text-3xl font-bold text-yellow-200">
            +{bonus} 코인
          </div>
          <div className="text-sm opacity-90">
            지급되었습니다!
          </div>
        </div>
        
        <button
          onClick={() => {
            setShow(false)
            setTimeout(onClose, 300)
          }}
          className="bg-white/20 hover:bg-white/30 rounded-lg px-6 py-2 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  )
}

export default LoginBonus
