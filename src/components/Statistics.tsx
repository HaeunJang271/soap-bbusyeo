import { useGameStore } from '../store'

interface StatisticsProps {
  onClose: () => void
}

const Statistics = ({ onClose }: StatisticsProps) => {
  const { 
    totalSoapsCompleted, 
    totalPlayTime, 
    totalScrubs, 
    totalCoinsEarned,
    completedSoapTypes,
    consecutiveLoginDays
  } = useGameStore()

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${secs}초`
    } else if (minutes > 0) {
      return `${minutes}분 ${secs}초`
    } else {
      return `${secs}초`
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
        
        <h2 className="text-2xl font-bold mb-6 text-center">📊 통계</h2>
      
        <div className="space-y-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">🎯 성취</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>총 완성한 비누</span>
                <span className="font-bold">{totalSoapsCompleted}개</span>
              </div>
              <div className="flex justify-between">
                <span>총 문지르기</span>
                <span className="font-bold">{totalScrubs.toLocaleString()}회</span>
              </div>
              <div className="flex justify-between">
                <span>총 플레이 시간</span>
                <span className="font-bold">{formatTime(totalPlayTime)}</span>
              </div>
              <div className="flex justify-between">
                <span>총 획득 코인</span>
                <span className="font-bold">{totalCoinsEarned.toLocaleString()}코인</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">📅 출석</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>연속 출석</span>
                <span className="font-bold">{consecutiveLoginDays}일</span>
              </div>
              <div className="flex justify-between">
                <span>오늘 출석 보너스</span>
                <span className="font-bold">
                  {consecutiveLoginDays >= 7 ? '200코인' : 
                   consecutiveLoginDays >= 3 ? '100코인' : '50코인'}
                </span>
              </div>
              <div className="text-xs opacity-70 mt-2">
                {consecutiveLoginDays >= 7 ? '💎 7일 연속 출석 보너스!' :
                 consecutiveLoginDays >= 3 ? '🔥 3일 연속 출석 보너스!' :
                 '⭐ 매일 출석하면 보너스가 늘어나요!'}
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">🧼 완성한 비누 종류</h3>
            <div className="space-y-1">
              {completedSoapTypes.length > 0 ? (
                completedSoapTypes.map((soapType, index) => (
                  <div key={index} className="text-sm">
                    ✅ {soapType}
                  </div>
                ))
              ) : (
                <div className="text-sm opacity-70">아직 완성한 비누가 없습니다</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
