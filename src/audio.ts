import { useGameStore } from './store'

class AudioManager {
  private audioContext: AudioContext | null = null

  private backgroundMusic: HTMLAudioElement | null = null
  private scrubAudio: HTMLAudioElement | null = null
  private popAndWowAudio: HTMLAudioElement | null = null
  private isInitialized = false
  private wasBackgroundMusicPlaying = false // BGM이 재생 중이었는지 추적
  private fadeOutInterval: number | null = null // 페이드아웃 인터벌 ID

  constructor() {
    this.prepareAudio()
    this.setupVisibilityListeners()
  }

  private setupVisibilityListeners() {
    // 페이지가 숨겨지거나 백그라운드로 갈 때 BGM 정지
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden, stopping background music')
        // BGM이 재생 중이었는지 저장
        this.wasBackgroundMusicPlaying = this.isPlayingBackgroundMusic
        this.stopBackgroundMusic()
      } else {
        console.log('Page visible again')
        // 페이지가 다시 보이게 되면 이전에 재생 중이었다면 BGM 재시작
        if (this.wasBackgroundMusicPlaying && this.isInitialized) {
          console.log('Restarting background music after page became visible')
          this.playBackgroundMusic().catch(console.error)
        }
      }
    }

    // 페이지가 완전히 종료될 때 BGM 정지
    const handlePageHide = () => {
      console.log('Page hiding, stopping background music')
      this.stopBackgroundMusic()
    }

    // 브라우저 탭이 닫히거나 새로고침될 때 BGM 정지
    const handleBeforeUnload = () => {
      console.log('Page unloading, stopping background music')
      this.stopBackgroundMusic()
    }

    // 이벤트 리스너 등록
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('beforeunload', handleBeforeUnload)

    // PWA 관련 이벤트 (모바일에서 앱이 백그라운드로 갈 때)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'APP_BACKGROUND') {
          console.log('PWA backgrounded, stopping background music')
          this.wasBackgroundMusicPlaying = this.isPlayingBackgroundMusic
          this.stopBackgroundMusic()
        }
      })
    }
  }

  private prepareAudio() {
    // Preload audio files with optimized settings for screen recording
    this.scrubAudio = new Audio('/sound/bogeul.mp3')
    this.scrubAudio.loop = true
    this.scrubAudio.volume = 0.3
    this.scrubAudio.preload = 'auto'
    this.scrubAudio.load() // 즉시 로드
    
    // 화면 녹화 시 사운드 캡처를 위한 설정
    this.scrubAudio.setAttribute('playsinline', 'true')
    this.scrubAudio.setAttribute('webkit-playsinline', 'true')
    this.scrubAudio.setAttribute('crossorigin', 'anonymous')
    this.scrubAudio.setAttribute('allow', 'autoplay; encrypted-media')

    // PopAndWow.mp3 파일 추가
    this.popAndWowAudio = new Audio('/sound/PopAndWow.mp3')
    this.popAndWowAudio.volume = 0.4
    this.popAndWowAudio.preload = 'auto'
    this.popAndWowAudio.load() // 즉시 로드
    
    // 화면 녹화 시 사운드 캡처를 위한 설정
    this.popAndWowAudio.setAttribute('playsinline', 'true')
    this.popAndWowAudio.setAttribute('webkit-playsinline', 'true')
    this.popAndWowAudio.setAttribute('crossorigin', 'anonymous')
    this.popAndWowAudio.setAttribute('allow', 'autoplay; encrypted-media')

    this.backgroundMusic = new Audio('/sound/DreamBubbles.mp3')
    this.backgroundMusic.loop = true
    this.backgroundMusic.volume = 0.3
    this.backgroundMusic.preload = 'auto'
    this.backgroundMusic.load() // 즉시 로드
    
    // 화면 녹화 시 사운드 캡처를 위한 설정
    this.backgroundMusic.setAttribute('playsinline', 'true')
    this.backgroundMusic.setAttribute('webkit-playsinline', 'true')
    this.backgroundMusic.setAttribute('crossorigin', 'anonymous')
    this.backgroundMusic.setAttribute('allow', 'autoplay; encrypted-media')
  }

  public initializeOnUserInteraction() {
    console.log('initializeOnUserInteraction called, isInitialized:', this.isInitialized)
    
    if (this.isInitialized) {
      console.log('Audio already initialized, skipping...')
      return
    }

    try {
      console.log('Creating AudioContext...')
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // 화면 녹화 시 사운드 캡처를 위한 설정
      if (this.audioContext && 'setSinkId' in this.audioContext) {
        console.log('AudioContext supports setSinkId for screen recording')
      }
      
      this.isInitialized = true
      console.log('Audio initialized successfully, context state:', this.audioContext.state)
      
      // 모바일에서 오디오 컨텍스트 재개
      if (this.audioContext.state === 'suspended') {
        console.log('AudioContext is suspended, resuming...')
        this.audioContext.resume()
      }
      
      // 모바일에서 오디오 파일들 재로드
      console.log('Preparing audio files...')
      this.prepareAudio()
      
      // 모바일에서 오디오 파일들 미리 로드
      console.log('Preloading audio files...')
      this.preloadAudio()
      
      console.log('Audio initialization completed')
    } catch (error) {
      console.error('Failed to initialize audio:', error)
    }
  }
  
  private preloadAudio() {
    // 모바일에서 오디오 파일들을 미리 로드
    if (this.scrubAudio) {
      this.scrubAudio.load()
    }
    if (this.popAndWowAudio) {
      this.popAndWowAudio.load()
    }
    if (this.backgroundMusic) {
      this.backgroundMusic.load()
    }
  }

  public playScrub() {
    if (!this.scrubAudio || !this.isInitialized) return

    // 효과음 설정 확인
    const { soundEnabled } = useGameStore.getState()
    if (!soundEnabled) {
      console.log('Sound effects disabled, skipping scrub sound')
      return
    }

    try {
      // 기존 페이드아웃 인터벌이 있다면 정리하고 즉시 재생
      if (this.fadeOutInterval) {
        clearInterval(this.fadeOutInterval)
        this.fadeOutInterval = null
      }

      // 모바일에서 오디오 컨텍스트 재개
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }
      
      // 상세한 오디오 디버깅 (첫 번째 호출 시에만)
      if (!this.scrubAudio.hasAttribute('data-debug-done')) {
        this.debugAudioElement(this.scrubAudio, 'Scrub Sound')
        this.scrubAudio.setAttribute('data-debug-done', 'true')
      }
      
      // 딜레이 줄이기 위해 load() 호출 최소화
      if (this.scrubAudio.readyState < 2) {
        this.scrubAudio.load()
      }
      
      // 볼륨을 원래대로 복원 (페이드아웃 중이었다면)
      this.scrubAudio.volume = 0.3
      
      if (this.scrubAudio.paused) {
        // 처음 시작할 때만 currentTime = 0
        this.scrubAudio.currentTime = 0
        this.scrubAudio.play().catch((error) => {
          console.error('Failed to play scrub sound:', error)
          // 모바일에서 실패 시 빠르게 재시도
          setTimeout(() => {
            this.scrubAudio?.play().catch(console.error)
          }, 10)
        })
      }
      // 이미 재생 중이면 아무것도 하지 않음 (연속 재생 유지)
    } catch (error) {
      console.error('Failed to play scrub sound:', error)
    }
  }

  public stopScrub() {
    if (!this.scrubAudio) return

    try {
      // 기존 페이드아웃 인터벌이 있다면 정리
      if (this.fadeOutInterval) {
        clearInterval(this.fadeOutInterval)
        this.fadeOutInterval = null
      }

      // 페이드아웃 효과 적용
      const fadeOutDuration = 500 // 0.5초 동안 페이드아웃
      const fadeSteps = 20 // 20단계로 나누어 페이드아웃
      const fadeStepDuration = fadeOutDuration / fadeSteps
      const initialVolume = this.scrubAudio.volume
      const volumeStep = initialVolume / fadeSteps

      let currentStep = 0

      this.fadeOutInterval = window.setInterval(() => {
        currentStep++
        
        if (currentStep >= fadeSteps) {
          // 페이드아웃 완료 - 소리 정지
          this.scrubAudio!.pause()
          this.scrubAudio!.currentTime = 0
          this.scrubAudio!.volume = initialVolume // 볼륨 원래대로 복원
          
          // 인터벌 정리
          if (this.fadeOutInterval) {
            clearInterval(this.fadeOutInterval)
            this.fadeOutInterval = null
          }
        } else {
          // 볼륨 점진적 감소
          this.scrubAudio!.volume = Math.max(0, initialVolume - (volumeStep * currentStep))
        }
      }, fadeStepDuration)
    } catch (error) {
      console.error('Failed to stop scrub sound:', error)
    }
  }

  public isScrubPlaying(): boolean {
    return this.scrubAudio ? !this.scrubAudio.paused : false
  }

  public playPopAndWow() {
    if (!this.popAndWowAudio || !this.isInitialized) return

    // 효과음 설정 확인
    const { soundEnabled } = useGameStore.getState()
    if (!soundEnabled) {
      console.log('Sound effects disabled, skipping PopAndWow sound')
      return
    }

    try {
      // 모바일에서 오디오 컨텍스트 재개
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }
      
      // 상세한 오디오 디버깅 (첫 번째 호출 시에만)
      if (!this.popAndWowAudio.hasAttribute('data-debug-done')) {
        this.debugAudioElement(this.popAndWowAudio, 'PopAndWow Sound')
        this.popAndWowAudio.setAttribute('data-debug-done', 'true')
      }
      
      // 딜레이 줄이기 위해 load() 호출 최소화
      if (this.popAndWowAudio.readyState < 2) {
        this.popAndWowAudio.load()
      }
      
      // 볼륨 설정
      this.popAndWowAudio.volume = 0.4
      
      // 재생
      this.popAndWowAudio.currentTime = 0
      this.popAndWowAudio.play().catch((error) => {
        console.error('Failed to play PopAndWow sound:', error)
        // 모바일에서 실패 시 빠르게 재시도
        setTimeout(() => {
          this.popAndWowAudio?.play().catch(console.error)
        }, 10)
      })
    } catch (error) {
      console.error('Failed to play PopAndWow sound:', error)
    }
  }

  public playPop() {
    // PopAndWow.mp3로 대체
    this.playPopAndWow()
  }

  private isPlayingBackgroundMusic = false

  public async playBackgroundMusic(): Promise<void> {
    console.log('playBackgroundMusic called:', {
      hasBackgroundMusic: !!this.backgroundMusic,
      isInitialized: this.isInitialized,
      audioContextState: this.audioContext?.state,
      backgroundMusicPaused: this.backgroundMusic?.paused,
      backgroundMusicVolume: this.backgroundMusic?.volume,
      backgroundMusicReadyState: this.backgroundMusic?.readyState,
      isAlreadyPlaying: this.isPlayingBackgroundMusic
    })

    if (!this.backgroundMusic || !this.isInitialized) {
      console.log('Cannot play background music: missing audio or not initialized')
      return
    }

    // 이미 재생 중이면 중복 호출 방지
    if (this.isPlayingBackgroundMusic) {
      console.log('Background music is already playing, skipping...')
      return
    }

    try {
      this.isPlayingBackgroundMusic = true
      
      // 모바일에서 오디오 컨텍스트 재개
      if (this.audioContext && this.audioContext.state === 'suspended') {
        console.log('Resuming audio context...')
        await this.audioContext.resume()
        console.log('Audio context resumed:', this.audioContext.state)
      }
      
      // 상세한 오디오 디버깅 (첫 번째 호출 시에만)
      if (!this.backgroundMusic.hasAttribute('data-debug-done')) {
        this.debugAudioElement(this.backgroundMusic, 'Background Music')
        this.backgroundMusic.setAttribute('data-debug-done', 'true')
      }
      
      // 이미 재생 중이면 아무것도 하지 않음
      if (!this.backgroundMusic.paused) {
        console.log('Background music is already playing')
        return
      }
      
      // 모바일에서 오디오 파일 재로드
      console.log('Loading background music...')
      this.backgroundMusic.load()
      
      console.log('Playing background music...')
      await this.backgroundMusic.play()
      console.log('Background music started successfully')
      
    } catch (error) {
      console.error('Failed to play background music:', error)
      this.isPlayingBackgroundMusic = false
      throw error // 에러를 다시 던져서 호출자가 처리할 수 있도록
    }
  }

  private debugAudioElement(audio: HTMLAudioElement, name: string) {
    console.log(`=== ${name} Debug ===`)
    
    // 현재 속성 점검
    console.table({
      src: audio.currentSrc,
      paused: audio.paused,
      muted: audio.muted,
      volume: audio.volume,
      readyState: audio.readyState, // 4면 완전 로드
      networkState: audio.networkState // 1: idle, 2: loading, 3: no source
    })

    // 코덱 지원 확인
    const testAudio = document.createElement('audio')
    console.log('코덱 지원 확인:', {
      mp3: testAudio.canPlayType('audio/mpeg'),
      aac: testAudio.canPlayType('audio/aac'),
      ogg: testAudio.canPlayType('audio/ogg')
    })

    // 이벤트 리스너 추가 (한 번만)
    if (!audio.hasAttribute('data-debug-listeners')) {
      audio.setAttribute('data-debug-listeners', 'true')
      
      const events = ['loadstart', 'loadedmetadata', 'canplay', 'canplaythrough', 'play', 'playing', 'pause', 'ended', 'waiting', 'stalled', 'suspend', 'error', 'timeupdate']
      events.forEach(ev => {
        audio.addEventListener(ev, () => {
          console.log(`[AUDIO ${name}]`, ev, {
            readyState: audio.readyState,
            paused: audio.paused,
            currentTime: audio.currentTime,
            volume: audio.volume,
            muted: audio.muted
          })
        })
      })
    }

    // Web Audio 상태 확인
    if (this.audioContext) {
      console.log('Web Audio 상태:', {
        contextState: this.audioContext.state,
        sampleRate: this.audioContext.sampleRate,
        destinationMaxChannelCount: this.audioContext.destination.maxChannelCount
      })
    }
  }

  public stopBackgroundMusic() {
    if (!this.backgroundMusic) return

    try {
      this.backgroundMusic.pause()
      this.backgroundMusic.currentTime = 0
      this.isPlayingBackgroundMusic = false // 플래그 리셋 추가
    } catch (error) {
      console.error('Failed to stop background music:', error)
    }
  }

  public setScrubVolume(volume: number) {
    if (this.scrubAudio) {
      this.scrubAudio.volume = Math.max(0, Math.min(1, volume))
    }
  }

  public setBackgroundMusicVolume(volume: number) {
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = Math.max(0, Math.min(1, volume))
    }
  }

  public cleanup() {
    this.stopScrub()
    this.stopBackgroundMusic()
    
    // 페이드아웃 인터벌 정리
    if (this.fadeOutInterval) {
      clearInterval(this.fadeOutInterval)
      this.fadeOutInterval = null
    }
    
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    
    this.isInitialized = false
  }

  // 화면 녹화 시 사운드 캡처를 위한 전용 함수
  public enableScreenRecordingAudio() {
    console.log('Enabling screen recording audio capture...')
    
    // 모든 오디오 요소에 화면 녹화 지원 속성 추가
    const audioElements = document.querySelectorAll('audio')
    audioElements.forEach(audio => {
      audio.setAttribute('playsinline', 'true')
      audio.setAttribute('webkit-playsinline', 'true')
      audio.setAttribute('crossorigin', 'anonymous')
      audio.setAttribute('allow', 'autoplay; encrypted-media')
      console.log('Audio element configured for screen recording:', audio.src)
    })
    
    // Web Audio API를 통한 화면 녹화 지원
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        console.log('AudioContext resumed for screen recording')
      })
    }
  }
}

export const audioManager = new AudioManager()

// 전역 디버깅 함수 (콘솔에서 직접 호출 가능)
export const debugAllAudio = () => {
  console.log('=== 전체 오디오 디버깅 ===')
  
  // 모든 audio 요소 찾기
  const audioElements = document.querySelectorAll('audio')
  console.log('발견된 audio 요소 개수:', audioElements.length)
  
  audioElements.forEach((el, index) => {
    console.log(`--- Audio Element ${index + 1} ---`)
    console.table({
      src: el.currentSrc,
      paused: el.paused,
      muted: el.muted,
      volume: el.volume,
      readyState: el.readyState,
      networkState: el.networkState
    })
  })
  
  // 코덱 지원 확인
  const testAudio = document.createElement('audio')
  console.log('브라우저 코덱 지원:', {
    mp3: testAudio.canPlayType('audio/mpeg'),
    aac: testAudio.canPlayType('audio/aac'),
    ogg: testAudio.canPlayType('audio/ogg'),
    wav: testAudio.canPlayType('audio/wav')
  })
  
  // Web Audio API 지원 확인
  const AC = window.AudioContext || (window as any).webkitAudioContext
  if (AC) {
    const ctx = new AC()
    console.log('Web Audio API 상태:', {
      contextState: ctx.state,
      sampleRate: ctx.sampleRate
    })
    ctx.close()
  } else {
    console.log('Web Audio API 미지원')
  }
}
