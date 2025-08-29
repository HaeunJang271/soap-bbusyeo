class AudioManager {
  private audioContext: AudioContext | null = null

  private backgroundMusic: HTMLAudioElement | null = null
  private scrubAudio: HTMLAudioElement | null = null
  private popAudio: HTMLAudioElement | null = null
  private isInitialized = false

  constructor() {
    this.prepareAudio()
  }

  private prepareAudio() {
    // Preload audio files with optimized settings
    this.scrubAudio = new Audio('/sound/bogeul.mp3')
    this.scrubAudio.loop = true
    this.scrubAudio.volume = 0.3
    this.scrubAudio.preload = 'auto'
    this.scrubAudio.load() // 즉시 로드

    this.popAudio = new Audio('/sound/pop.mp3')
    this.popAudio.volume = 0.2
    this.popAudio.preload = 'auto'
    this.popAudio.load() // 즉시 로드

    this.backgroundMusic = new Audio('/sound/DreamBubbles.mp3')
    this.backgroundMusic.loop = true
    this.backgroundMusic.volume = 0.3 // 볼륨 증가 (0.1 -> 0.3)
    this.backgroundMusic.preload = 'auto'
    this.backgroundMusic.load() // 즉시 로드
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
    if (this.popAudio) {
      this.popAudio.load()
    }
    if (this.backgroundMusic) {
      this.backgroundMusic.load()
    }
  }

  public playScrub() {
    if (!this.scrubAudio || !this.isInitialized) return

    try {
      // 모바일에서 오디오 컨텍스트 재개
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }
      
      // 딜레이 줄이기 위해 load() 호출 최소화
      if (this.scrubAudio.readyState < 2) {
        this.scrubAudio.load()
      }
      
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
      this.scrubAudio.pause()
      this.scrubAudio.currentTime = 0
    } catch (error) {
      console.error('Failed to stop scrub sound:', error)
    }
  }

  public isScrubPlaying(): boolean {
    return this.scrubAudio ? !this.scrubAudio.paused : false
  }

  public playPop() {
    if (!this.popAudio || !this.isInitialized) return

    try {
      this.popAudio.currentTime = 0
      this.popAudio.play().catch(console.error)
    } catch (error) {
      console.error('Failed to play pop sound:', error)
    }
  }

  public async playBackgroundMusic(): Promise<void> {
    console.log('playBackgroundMusic called:', {
      hasBackgroundMusic: !!this.backgroundMusic,
      isInitialized: this.isInitialized,
      audioContextState: this.audioContext?.state,
      backgroundMusicPaused: this.backgroundMusic?.paused,
      backgroundMusicVolume: this.backgroundMusic?.volume,
      backgroundMusicReadyState: this.backgroundMusic?.readyState
    })

    if (!this.backgroundMusic || !this.isInitialized) {
      console.log('Cannot play background music: missing audio or not initialized')
      return
    }

    try {
      // 모바일에서 오디오 컨텍스트 재개
      if (this.audioContext && this.audioContext.state === 'suspended') {
        console.log('Resuming audio context...')
        await this.audioContext.resume()
        console.log('Audio context resumed:', this.audioContext.state)
      }
      
      // 모바일에서 오디오 파일 재로드
      console.log('Loading background music...')
      this.backgroundMusic.load()
      
      if (this.backgroundMusic.paused) {
        console.log('Playing background music...')
        await this.backgroundMusic.play()
        console.log('Background music started successfully')
      } else {
        console.log('Background music is already playing')
      }
    } catch (error) {
      console.error('Failed to play background music:', error)
      throw error // 에러를 다시 던져서 호출자가 처리할 수 있도록
    }
  }

  public stopBackgroundMusic() {
    if (!this.backgroundMusic) return

    try {
      this.backgroundMusic.pause()
      this.backgroundMusic.currentTime = 0
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
    
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    
    this.isInitialized = false
  }
}

export const audioManager = new AudioManager()
