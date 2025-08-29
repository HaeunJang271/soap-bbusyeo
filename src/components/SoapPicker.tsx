import React, { useState, useEffect } from 'react'
import { useGameStore } from '../store'
import LoginBonus from './LoginBonus'

const SoapPicker: React.FC = () => {
  const { 
    selectedSoap, 
    selectedTool, 
    coins, 
    availableSoaps,
    availableTools,
    setSelectedSoap, 
    setSelectedTool, 
    setIsPlaying,
    setGameStartTime,

    checkDailyLogin,
    spendCoins,
    unlockSoap,
    unlockTool
  } = useGameStore()
  
  const [showLoginBonus, setShowLoginBonus] = useState(false)
  
  // Check daily login on component mount
  useEffect(() => {
    const loginResult = checkDailyLogin()
    if (loginResult.isNewLogin) {
      setShowLoginBonus(true)
    }
  }, [checkDailyLogin])

  const handleSoapSelect = (soap: any) => {
    if (!soap.unlocked) {
      if (coins >= soap.price) {
        // 구매 가능한 경우
        console.log('Purchasing soap:', soap.name, 'for', soap.price, 'coins')
        spendCoins(soap.price)
        unlockSoap(soap.id)
        // 구매 후 즉시 선택하지 않고, 스토어 업데이트를 기다림
        setTimeout(() => {
          setSelectedSoap(soap)
        }, 100)
      } else {
        // 돈이 부족한 경우 클릭 무시
        console.log('Not enough coins to purchase soap:', soap.name, 'Need:', soap.price, 'Have:', coins)
        return
      }
    } else {
      // 이미 해금된 비누 선택
      setSelectedSoap(soap)
    }
  }

  const handleToolSelect = (tool: any) => {
    if (!tool.unlocked) {
      if (coins >= tool.price) {
        // 구매 가능한 경우
        console.log('Purchasing tool:', tool.name, 'for', tool.price, 'coins')
        spendCoins(tool.price)
        unlockTool(tool.id)
        // 구매 후 즉시 선택하지 않고, 스토어 업데이트를 기다림
        setTimeout(() => {
          setSelectedTool(tool)
        }, 100)
      } else {
        // 돈이 부족한 경우 클릭 무시
        console.log('Not enough coins to purchase tool:', tool.name, 'Need:', tool.price, 'Have:', coins)
        return
      }
    } else {
      // 이미 해금된 도구 선택
      setSelectedTool(tool)
    }
  }

  const handleStartGame = () => {
    setGameStartTime(Date.now())
    setIsPlaying(true)
  }

     return (
     <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto">
       <div className="text-center mb-6 mt-4">
         <h1 className="text-4xl font-bold text-white mb-2">🧼 비누뿌셔</h1>
         <p className="text-white/80 text-lg">비누를 선택하고 문질러 거품을 만들어보세요!</p>
       </div>

             

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               {/* Soap Selection */}
             <div className="mb-6 w-full max-w-2xl mx-auto">
              {/* Coins Display - Above the title */}
              <div className="flex justify-center mb-4">
                <div className="bg-yellow-500/90 backdrop-blur-sm rounded-lg px-4 py-3 text-white shadow-lg">
                  <div className="text-center">
                    <div className="font-bold text-lg">{coins.toLocaleString()}</div>
                    <div className="text-xs opacity-90">라이브 후원</div>
                  </div>
                </div>
              </div>
              
                             {/* Title */}
               <h2 className="text-2xl font-bold text-white mb-4">비누 선택</h2>
            <div className="grid grid-cols-3 gap-4">
              {availableSoaps.map((soap) => (
                                                 <button
                  key={soap.id}
                  onClick={() => handleSoapSelect(soap)}
                  className={`rounded-2xl p-4 transition-all duration-300 shadow-lg ${
                    selectedSoap.id === soap.id
                      ? 'bg-white scale-105'
                      : !soap.unlocked && coins < soap.price
                      ? 'bg-white/30 opacity-50 cursor-not-allowed'
                      : 'bg-white/30 hover:scale-105 hover:shadow-xl'
                  }`}
                >
                                     {/* Inner Soap Visual */}
                   <div
                     className={`w-full h-16 rounded-xl mb-3 flex items-center justify-center ${
                       selectedSoap.id === soap.id ? '' : 'opacity-50'
                     }`}
                     style={{ backgroundColor: soap.color }}
                   >
                     <span className="text-2xl">🫧</span>
                   </div>
                  
                  {/* Text Content */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2 relative">
                      <div className="text-sm font-bold text-black">{soap.name}</div>
                      {!soap.unlocked && (
                        <div className="absolute right-0 text-yellow-500 text-sm">🔒</div>
                      )}
                    </div>
                    
                                         <div className="text-xs text-gray-700 space-y-1">
                       <div>광택: {soap.power}</div>
                       <div>파티클: {soap.particles}</div>
                       <div>거품: {soap.reflectivity}</div>
                     </div>
                    
                    {soap.unlocked ? (
                      <div className="text-green-600 text-xs mt-2">보유중</div>
                    ) : (
                      <div className={`text-xs mt-2 ${
                        coins >= soap.price ? 'text-yellow-600' : 'text-red-500'
                      }`}>
                        💰 {soap.price}
                        {coins < soap.price && <span className="block text-xs">부족</span>}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

                                                       {/* Tool Selection */}
         <div className="mb-6 w-full max-w-2xl mx-auto">
                     <h2 className="text-2xl font-bold text-white mb-4">도구 선택</h2>
          <div className="grid grid-cols-3 gap-4">
            {availableTools.map((tool) => (
                                           <button
                key={tool.id}
                onClick={() => handleToolSelect(tool)}
                className={`rounded-2xl p-4 transition-all duration-300 shadow-lg ${
                  selectedTool.id === tool.id
                    ? 'bg-white scale-105'
                    : !tool.unlocked && coins < tool.price
                    ? 'bg-white/30 opacity-50 cursor-not-allowed'
                    : 'bg-white/30 hover:scale-105 hover:shadow-xl'
                }`}
              >
                {/* Tool Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{tool.icon}</div>
                  {!tool.unlocked && (
                    <div className="text-yellow-500 text-sm">🔒</div>
                  )}
                </div>
                
                {/* Tool Name */}
                <div className="text-black text-sm font-semibold mb-2">{tool.name}</div>
                
                {/* Efficiency */}
                <div className="text-gray-700 text-xs">
                  효율: {tool.efficiency}x
                </div>
                
                {/* Price or Status */}
                {tool.unlocked ? (
                  <div className="text-green-600 text-xs mt-2">보유중</div>
                ) : (
                  <div className={`text-xs mt-2 ${
                    coins >= tool.price ? 'text-yellow-600' : 'text-red-500'
                  }`}>
                    💰 {tool.price}
                    {coins < tool.price && <span className="block text-xs">부족</span>}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

                           {/* Start Button */}
                 <button
           onClick={handleStartGame}
           className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mb-8"
         >
           게임 시작!
         </button>

                 {/* Login Bonus Modal */}
         {showLoginBonus && (
           <LoginBonus
             bonus={0}
             consecutiveDays={0}
             onClose={() => setShowLoginBonus(false)}
           />
         )}
    </div>
  )
}

export default SoapPicker
