import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useGameStore } from '../store'
import { audioManager } from '../audio'
import ShareModal from './ShareModal'

interface FoamRitualProps {
  onHaptic: () => void
}

interface Point {
  x: number
  y: number
  timestamp: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  shape: string
  // Bubble animation properties
  isBubble: boolean
  growthRate: number
  maxSize: number
  popThreshold: number
  wobble: number
  wobbleSpeed: number
}

const FoamRitual: React.FC<FoamRitualProps> = ({ onHaptic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const foamCanvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)
  const { 
    selectedSoap, 
    selectedTool, 
    progress, 
    updateProgress, 
    setIsPlaying,
    coins,
    addCoins,
    soundEnabled,
    incrementScrubs,
    addPlayTime,
    incrementSoapsCompleted,
    addCompletedSoapType
  } = useGameStore()
  
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPoint, setLastPoint] = useState<Point | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [fps, setFps] = useState(60)
  const [lastFrameTime, setLastFrameTime] = useState(0)
  const [showCompletion, setShowCompletion] = useState(false)
  const [hasShownCompletion, setHasShownCompletion] = useState(false)
  const [showShare, setShowShare] = useState(false)

  // Update progress ref when progress changes
  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  // Check for completion - show only once
  useEffect(() => {
    if (progress >= 100 && !hasShownCompletion) {
      try {
        console.log('Soap completed! Progress:', progress, 'HasShownCompletion:', hasShownCompletion)
        audioManager.playPop()
        setShowCompletion(true)
        setHasShownCompletion(true)
        
        // Give bonus coins for completion
        const bonusCoins = 200 // 100% 달성 보너스 코인
        addCoins(bonusCoins)
      } catch (error) {
        console.error('Error in completion effect:', error)
      }
    }
  }, [progress, hasShownCompletion])

  // Reset completion state when soap changes
  useEffect(() => {
    console.log('Soap changed, resetting completion state:', selectedSoap.name)
    setHasShownCompletion(false)
    setShowCompletion(false)
    updateProgress(0)
  }, [selectedSoap, updateProgress])

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current
    const foamCanvas = foamCanvasRef.current
    if (!canvas || !foamCanvas) return

    const ctx = canvas.getContext('2d')
    const foamCtx = foamCanvas.getContext('2d')
    if (!ctx || !foamCtx) return

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      foamCanvas.width = rect.width * window.devicePixelRatio
      foamCanvas.height = rect.height * window.devicePixelRatio
      
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      foamCtx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  // FPS counter
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()

    const updateFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(updateFPS)
    }

    updateFPS()
  }, [])

  // Particle animation loop
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => {
        return prev
          .map(particle => {
            // Update life
            const newLife = particle.life - 1
            
            // Update position
            const newX = particle.x + particle.vx
            const newY = particle.y + particle.vy
            
            // Apply gravity
            const newVy = particle.vy + (particle.isBubble ? 0.05 : 0.15)
            
            // Update bubble properties
            let newSize = particle.size
            let newWobble = particle.wobble
            let shouldPop = false
            
            if (particle.isBubble) {
              // Grow bubble
              if (newSize < particle.maxSize) {
                newSize += particle.growthRate
              }
              
              // Wobble effect
              newWobble += particle.wobbleSpeed
              const wobbleOffset = Math.sin(newWobble) * 1.5
              
              // Check for pop
              const lifeRatio = newLife / particle.maxLife
              const sizeRatio = newSize / particle.maxSize
              
              if (lifeRatio < particle.popThreshold && sizeRatio > 0.7) { // Original threshold
                shouldPop = true
                console.log('Bubble popping!', {
                  soapName: selectedSoap?.name,
                  lifeRatio,
                  sizeRatio,
                  popThreshold: particle.popThreshold
                })
              }
            }
            
            // Return updated particle or null if should be removed
            if (newLife <= 0 || shouldPop) {
              // Create pop effect if bubble pops
              if (shouldPop) {
                // Create pop particles
                const popParticles: Particle[] = []
                for (let i = 0; i < 8; i++) { // Original count
                  const angle = (i * Math.PI * 2) / 8
                  const speed = 2 + Math.random() * 3 // Original speed
                  
                  popParticles.push({
                    x: newX,
                    y: newY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 30 + Math.random() * 20, // Original life
                    maxLife: 50,
                    size: 1 + Math.random() * 2, // Original size
                    color: particle.color,
                    shape: 'circle',
                    isBubble: false,
                    growthRate: 0,
                    maxSize: 3, // Original max size
                    popThreshold: 1,
                    wobble: 0,
                    wobbleSpeed: 0
                  })
                }
                
                // Add pop particles to state
                setTimeout(() => {
                  setParticles(current => [...current, ...popParticles])
                }, 0)
              }
              return null
            }
            
            return {
              ...particle,
              x: newX + (particle.isBubble ? Math.sin(newWobble) * 1.5 : 0),
              y: newY,
              vx: particle.vx,
              vy: newVy,
              life: newLife,
              size: newSize,
              wobble: newWobble
            }
          })
          .filter(Boolean) as Particle[]
      })
    }

    const interval = setInterval(animateParticles, 32) // Slower animation for stability
    return () => clearInterval(interval)
  }, [])

  // Get canvas coordinates from event
  const getCanvasPoint = useCallback((event: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0, timestamp: Date.now() }

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      timestamp: Date.now()
    }
  }, [])

  // Draw foam on offscreen canvas
  const drawFoam = useCallback((point: Point, pressure: number) => {
    const foamCanvas = foamCanvasRef.current
    if (!foamCanvas || !selectedSoap) return

    const ctx = foamCanvas.getContext('2d')
    if (!ctx) return

    const radius = 20 + pressure * 10
    const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius)
    
    // Use soap-specific foam color
    const foamColor = selectedSoap.foamColor
    gradient.addColorStop(0, `${foamColor}CC`) // 80% opacity
    gradient.addColorStop(0.5, `${foamColor}66`) // 40% opacity
    gradient.addColorStop(1, `${foamColor}00`) // 0% opacity

    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
    ctx.fill()
  }, [selectedSoap])

  // Create particles
  const createParticles = useCallback((x: number, y: number, count: number) => {
    if (!selectedSoap) return

    console.log('Creating particles:', { x, y, count, soapName: selectedSoap.name })

    const newParticles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const isBubble = true // All soaps now have bubble effects
      const baseSize = 3 + Math.random() * 4 // Smaller size for stability
      const maxSize = isBubble ? baseSize * 2.5 : baseSize // Reduced max size
      
      const particle = {
        x: x + (Math.random() - 0.5) * 20, // Reduced spread
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3, // Reduced movement
        vy: -Math.random() * 2 - 1, // Reduced upward movement
        life: 80 + Math.random() * 80, // Shorter life
        maxLife: 160,
        size: baseSize,
        color: selectedSoap.foamColor,
        shape: selectedSoap.foamShape,
        // Bubble animation properties
        isBubble: isBubble,
        growthRate: isBubble ? 0.03 + Math.random() * 0.05 : 0, // Slower growth
        maxSize: maxSize,
        popThreshold: isBubble ? 0.7 + Math.random() * 0.2 : 1, // Original threshold
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.1 + Math.random() * 0.15 // Slower wobble
      }
      
      newParticles.push(particle)
    }

    // Debug logging
    console.log(`Created ${newParticles.length} particles for ${selectedSoap.name}:`, {
      soapName: selectedSoap.name,
      foamShape: selectedSoap.foamShape,
      isBubble: newParticles[0]?.isBubble,
      color: selectedSoap.foamColor,
      particles: newParticles.length,
      firstParticle: newParticles[0]
    })

    setParticles(prev => [...prev, ...newParticles])
  }, [selectedSoap])





  // Handle drawing
  const handleDraw = useCallback((point: Point, pressure: number) => {
    if (!selectedSoap) return

    // Track scrub pattern for pattern-based challenges
    if (lastPoint) {
      const dx = point.x - lastPoint.x
      const dy = point.y - lastPoint.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance > 10) { // Minimum distance to count as a scrub
        let direction = ''

      }
    }

    // Create fewer particles for stability
    const particleCount = Math.max(1, Math.floor(selectedSoap.particles * pressure * 0.5)) // Ensure at least 1 particle
    
    console.log('handleDraw:', {
      soapName: selectedSoap.name,
      particles: selectedSoap.particles,
      pressure,
      calculatedCount: particleCount,
      point: { x: point.x, y: point.y }
    })
    createParticles(point.x, point.y, particleCount)
    
    // Update progress - faster progression with tool efficiency consideration
    const baseIncrement = selectedSoap.particles * 0.03 // 기본 증가량을 3배로 증가
    const toolMultiplier = Math.min(pressure, 2.0) // 도구 효율성을 2배로 제한
    const progressIncrement = baseIncrement * toolMultiplier
    const newProgress = Math.min(100, progressRef.current + progressIncrement)
    
    // Debug progress increment
    if (Math.random() < 0.1) { // 10% 확률로 로그 출력 (너무 많은 로그 방지)
      console.log('Progress increment:', {
        soapName: selectedSoap.name,
        particles: selectedSoap.particles,
        pressure,
        baseIncrement,
        toolMultiplier,
        progressIncrement,
        currentProgress: progressRef.current,
        newProgress
      })
    }
    
    updateProgress(newProgress)
    
    // Haptic feedback
    onHaptic()
    
    // Audio feedback
    if (soundEnabled) {
      audioManager.playScrub()
    }
    
    setLastPoint(point)
  }, [selectedSoap, createParticles, updateProgress, onHaptic, soundEnabled, lastPoint])

  // Event handlers
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const point: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      timestamp: Date.now()
    }

    setIsDrawing(true)
    setLastPoint(point)
    
    const pressure = selectedTool?.efficiency || 1.0
    handleDraw(point, pressure)
  }, [handleDraw, selectedTool])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const point: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      timestamp: Date.now()
    }

    const pressure = selectedTool?.efficiency || 1.0
    handleDraw(point, pressure)
  }, [isDrawing, handleDraw, selectedTool])

  const handlePointerUp = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault()
    setIsDrawing(false)
    setLastPoint(null)
    
    // Stop music
    audioManager.stopScrub()
  }, [])

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const render = () => {
      const currentTime = performance.now()
      setLastFrameTime(currentTime)

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw soap base
      if (selectedSoap) {
        const centerX = canvas.width / (2 * window.devicePixelRatio)
        const centerY = canvas.height / (2 * window.devicePixelRatio)
        const size = Math.min(canvas.width, canvas.height) / (3 * window.devicePixelRatio)

        // Soap gradient
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size)
        gradient.addColorStop(0, selectedSoap.color)
        gradient.addColorStop(0.7, selectedSoap.color)
        gradient.addColorStop(1, '#ffffff')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2)
        ctx.fill()

        // Draw texture pattern
        if (selectedSoap) {
          const texture = selectedSoap.texture
          
          switch (texture) {
            case 'bubbles':
              // Draw small bubbles pattern
              for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2) / 8
                const radius = size * 0.3
                const x = centerX + Math.cos(angle) * radius
                const y = centerY + Math.sin(angle) * radius
                const bubbleSize = 3 + Math.random() * 4

                ctx.fillStyle = `rgba(255, 255, 255, 0.3)`
                ctx.beginPath()
                ctx.arc(x, y, bubbleSize, 0, Math.PI * 2)
                ctx.fill()
              }
              break

            case 'stripes':
              // Draw vertical stripes
              for (let i = 0; i < 5; i++) {
                const x = centerX - size * 0.4 + (i * size * 0.2)
                ctx.fillStyle = `rgba(255, 255, 255, 0.2)`
                ctx.fillRect(x, centerY - size * 0.3, 2, size * 0.6)
              }
              break

            case 'dots':
              // Draw scattered dots
              for (let i = 0; i < 12; i++) {
                const x = centerX + (Math.random() - 0.5) * size * 0.6
                const y = centerY + (Math.random() - 0.5) * size * 0.6
                const dotSize = 2 + Math.random() * 3

                ctx.fillStyle = `rgba(255, 255, 255, 0.4)`
                ctx.beginPath()
                ctx.arc(x, y, dotSize, 0, Math.PI * 2)
                ctx.fill()
              }
              break

            case 'waves':
              // Draw wavy lines
              for (let i = 0; i < 3; i++) {
                const y = centerY - size * 0.2 + (i * size * 0.2)
                ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`
                ctx.lineWidth = 2
                ctx.beginPath()
                
                for (let x = centerX - size * 0.4; x <= centerX + size * 0.4; x += 5) {
                  const waveY = y + Math.sin((x - centerX) * 0.02) * 8
                  if (x === centerX - size * 0.4) {
                    ctx.moveTo(x, waveY)
                  } else {
                    ctx.lineTo(x, waveY)
                  }
                }
                ctx.stroke()
              }
              break

            case 'crystals':
              // Draw crystal-like patterns
              for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI * 2) / 6
                const radius = size * 0.25
                const x = centerX + Math.cos(angle) * radius
                const y = centerY + Math.sin(angle) * radius
                const crystalSize = 4 + Math.random() * 3

                ctx.fillStyle = `rgba(255, 255, 255, 0.5)`
                ctx.beginPath()
                ctx.moveTo(x, y - crystalSize)
                ctx.lineTo(x + crystalSize * 0.5, y)
                ctx.lineTo(x, y + crystalSize)
                ctx.lineTo(x - crystalSize * 0.5, y)
                ctx.closePath()
                ctx.fill()
              }
              break

            case 'smooth':
            default:
              // No texture for smooth soap
              break
          }
        }

        // Shine effect
        const shineGradient = ctx.createRadialGradient(
          centerX - size * 0.3, centerY - size * 0.3, 0,
          centerX - size * 0.3, centerY - size * 0.3, size * 0.5
        )
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = shineGradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw particles with enhanced effects
      particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife
        
        if (particle.isBubble) {
          // Debug logging for bubble rendering
          if (Math.random() < 0.01) { // Log 1% of bubble renders to avoid spam
            console.log('Rendering bubble:', {
              soapName: selectedSoap?.name,
              isBubble: particle.isBubble,
              size: particle.size,
              color: particle.color,
              alpha
            })
          }
          
          // Draw enhanced bubble with density effects
          
          // Simple density calculation
          let density = 0
          const nearbyCount = particles.filter(p => {
            const distance = Math.sqrt((p.x - particle.x) ** 2 + (p.y - particle.y) ** 2)
            return distance < 30 && p !== particle
          }).length
          density = Math.min(nearbyCount / 5, 1)
          
          // Outer glow effect (like the image)
          if (density > 0.2) {
            const glowSize = particle.size * (1 + density * 1.5)
            const glowAlpha = Math.floor(alpha * 255 * density * 0.6).toString(16).padStart(2, '0')
            ctx.fillStyle = `${particle.color}${glowAlpha}`
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2)
            ctx.fill()
          }
          
          // Base bubble with gradient (like the soft pink cloud)
          const gradient = ctx.createRadialGradient(
            particle.x - particle.size * 0.3, 
            particle.y - particle.size * 0.3, 
            0,
            particle.x, 
            particle.y, 
            particle.size
          )
          gradient.addColorStop(0, `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`)
          gradient.addColorStop(0.6, `${particle.color}${Math.floor(alpha * 255 * 0.8).toString(16).padStart(2, '0')}`)
          gradient.addColorStop(1, `${particle.color}${Math.floor(alpha * 255 * 0.2).toString(16).padStart(2, '0')}`)
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          
          // Multiple highlights for 3D effect (like the sparkles)
          const highlightSize1 = particle.size * 0.8
          const highlightSize2 = particle.size * 0.4
          const highlightAlpha1 = Math.floor(alpha * 255 * 0.9).toString(16).padStart(2, '0')
          const highlightAlpha2 = Math.floor(alpha * 255 * 0.6).toString(16).padStart(2, '0')
          
          // Primary highlight
          ctx.fillStyle = `rgba(255, 255, 255, ${highlightAlpha1})`
          ctx.beginPath()
          ctx.arc(particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, highlightSize1, 0, Math.PI * 2)
          ctx.fill()
          
          // Secondary highlight
          ctx.fillStyle = `rgba(255, 255, 255, ${highlightAlpha2})`
          ctx.beginPath()
          ctx.arc(particle.x - particle.size * 0.2, particle.y - particle.size * 0.2, highlightSize2, 0, Math.PI * 2)
          ctx.fill()
          
          // Soft outline for definition
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.floor(alpha * 255 * 0.4).toString(16).padStart(2, '0')})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.stroke()
        } else {
          // Draw regular particles
          ctx.fillStyle = `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`

          ctx.beginPath()
          if (particle.shape === 'star') {
            // Draw star
            const spikes = 5
            const outerRadius = particle.size
            const innerRadius = particle.size * 0.5
            
            for (let i = 0; i < spikes * 2; i++) {
              const angle = (i * Math.PI) / spikes
              const radius = i % 2 === 0 ? outerRadius : innerRadius
              const x = particle.x + Math.cos(angle) * radius
              const y = particle.y + Math.sin(angle) * radius
              
              if (i === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            ctx.closePath()
          } else if (particle.shape === 'heart') {
            // Draw heart
            const size = particle.size
            ctx.moveTo(particle.x, particle.y + size * 0.3)
            ctx.bezierCurveTo(
              particle.x, particle.y, 
              particle.x - size, particle.y, 
              particle.x - size, particle.y + size * 0.3
            )
            ctx.bezierCurveTo(
              particle.x - size, particle.y + size * 0.6, 
              particle.x, particle.y + size * 0.8, 
              particle.x, particle.y + size * 0.8
            )
            ctx.bezierCurveTo(
              particle.x, particle.y + size * 0.6, 
              particle.x + size, particle.y + size * 0.6, 
              particle.x + size, particle.y + size * 0.3
            )
            ctx.bezierCurveTo(
              particle.x + size, particle.y, 
              particle.x, particle.y, 
              particle.x, particle.y + size * 0.3
            )
          } else {
            // Draw circle (default)
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          }
          ctx.fill()
        }
      })

      // Draw foam overlay
      const foamCanvas = foamCanvasRef.current
      if (foamCanvas) {
        ctx.drawImage(foamCanvas, 0, 0)
      }

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [selectedSoap, particles])

  // Check for completion - show only once
  useEffect(() => {
    if (progress >= 100 && !hasShownCompletion) {
      try {
        console.log('Soap completed! Progress:', progress, 'HasShownCompletion:', hasShownCompletion)
        audioManager.playPop()
        setShowCompletion(true)
        setHasShownCompletion(true)
        
        // Give bonus coins for completion
        const bonusCoins = 200 // 100% 달성 보너스 코인
        addCoins(bonusCoins)
      } catch (error) {
        console.error('Error in completion effect:', error)
      }
    }
  }, [progress, hasShownCompletion])



  return (
    <div className="w-full h-full relative">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e as any)}
        onTouchMove={(e) => handlePointerMove(e as any)}
        onTouchEnd={(e) => handlePointerUp(e as any)}
      />
      
      {/* Offscreen foam canvas */}
      <canvas
        ref={foamCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-0"
      />

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white">
          <div className="text-sm font-medium">진행도: {Math.round(Math.min(progress, 100))}%</div>
          <div className="w-32 h-2 bg-white/30 rounded-full mt-1">
            <div 
              className="h-full bg-white rounded-full transition-all duration-[10ms]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          

        </div>
      </div>

      {/* Coin Display */}
      <div className="absolute top-24 right-4 z-20">
        <div className="bg-yellow-500/90 backdrop-blur-sm rounded-lg p-3 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <div>
              <div className="text-sm opacity-90">라이브 후원</div>
              <div className="font-bold text-lg">{coins.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* FPS Counter */}
      <div className="absolute top-20 left-4 z-20">
        <div className="bg-black/20 backdrop-blur-sm rounded px-2 py-1 text-white text-xs">
          FPS: {fps}
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => {
          setIsPlaying(false)
          setShowCompletion(false)
          setHasShownCompletion(false)
          updateProgress(0) // 진행도 초기화
        }}
        className="absolute bottom-4 left-4 z-20 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors"
      >
        ← 뒤로
      </button>

      {/* Completion Message */}
      {showCompletion && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">완성!</h2>
            <p className="text-gray-600 mb-4">거품이 완벽하게 만들어졌습니다!</p>
            <div className="text-yellow-600 font-bold mb-6">
              +200 코인 후원 받았습니다!
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsPlaying(false)
                  setShowCompletion(false)
                  setHasShownCompletion(false)
                  updateProgress(0) // 진행도 초기화
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
              >
                홈으로 돌아가기
              </button>
              <button
                onClick={() => setShowShare(true)}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
              >
                📤 공유하기
              </button>
              <button
                onClick={() => {
                  setShowCompletion(false)
                  setHasShownCompletion(false) // 완성창을 다시 보여줄 수 있도록 초기화
                  updateProgress(0) // 진행도 초기화
                }}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                계속하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <ShareModal
          onClose={() => setShowShare(false)}
          score={100}
          soapName={selectedSoap.name}
        />
      )}
    </div>
  )
}

export default FoamRitual
