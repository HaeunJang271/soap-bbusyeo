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
    // Preload audio files
    this.scrubAudio = new Audio('/sound/bogeul.mp3')
    this.scrubAudio.loop = true
    this.scrubAudio.volume = 0.3

    this.popAudio = new Audio('/sound/pop.mp3')
    this.popAudio.volume = 0.2

    this.backgroundMusic = new Audio('/sound/DreamBubbles.mp3')
    this.backgroundMusic.loop = true
    this.backgroundMusic.volume = 0.1
  }

  public initializeOnUserInteraction() {
    if (this.isInitialized) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.isInitialized = true
      console.log('Audio initialized successfully')
      
      // 모바일에서 오디오 컨텍스트 재개
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }
    } catch (error) {
      console.error('Failed to initialize audio:', error)
    }
  }

  public playScrub() {
    if (!this.scrubAudio || !this.isInitialized) return

    try {
      if (this.scrubAudio.paused) {
        this.scrubAudio.currentTime = 0
        this.scrubAudio.play().catch(console.error)
      }
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

  public playPop() {
    if (!this.popAudio || !this.isInitialized) return

    try {
      this.popAudio.currentTime = 0
      this.popAudio.play().catch(console.error)
    } catch (error) {
      console.error('Failed to play pop sound:', error)
    }
  }

  public playBackgroundMusic() {
    if (!this.backgroundMusic || !this.isInitialized) return

    try {
      if (this.backgroundMusic.paused) {
        this.backgroundMusic.play().catch(console.error)
      }
    } catch (error) {
      console.error('Failed to play background music:', error)
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
