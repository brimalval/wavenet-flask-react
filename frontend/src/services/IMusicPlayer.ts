export interface IMusicPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  getInstrument(): string;
  getNotes(): { note: string; duration: number }[];
  getPercent(): number;
  getSong(): string | Blob | ArrayBuffer | null;
  getTempo(): number;
  getVolume(): number;
  isPlaying(): boolean;
  loadSong(song: string | Blob | ArrayBuffer): Promise<void>;
  loop(): void;
  off(event: string, callback: () => void): void;
  on(event: string, callback: () => void): void;
  pause(): void;
  play(): void;
  setInstrument(instrument: string): void;
  setPlayCallback(callback: () => void): void;
  setTempo(tempo: number): void;
  setVolume(volume: number): void;
  skipToPercent(percent: number): void;
  stop(): void;
}