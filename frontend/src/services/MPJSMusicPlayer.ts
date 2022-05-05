import "reflect-metadata";
import { injectable } from "inversify";
import { InstrumentName } from "soundfont-player";
import { IMusicPlayer } from "./IMusicPlayer";

// Create a custom exception for when the user tries to play a song when the player is not ready
class PlayerNotReadyException extends Error {
  constructor() {
    super("The player does not yet have a song!");
    this.name = "PlayerNotReadyException";
  }
}

@injectable()
export class MPJSMusicPlayer implements IMusicPlayer {
  private instrument: string;

  /**
   * @throws {PlayerNotReadyException}
   */
  play() {
    console.log(`Playing ${this.instrument}`);
    throw new PlayerNotReadyException();
  }
  loop() {
    console.log(`Looping ${this.instrument}`);
  }
  pause() {
    console.log(`Pausing ${this.instrument}`);
  }
  stop() {
    console.log(`Stopping ${this.instrument}`);
  }
  setInstrument(instrument: InstrumentName): void {
    this.instrument = instrument;
    console.log(`Setting instrument to ${this.instrument}`);
  }
  on(event: string, callback: () => void): void {
    console.log(`Listening to ${event}`);
  }
  async loadSong(song: string | Blob | ArrayBuffer) {
    console.log(`Loading song ${song}`);
  }
  setPlayCallback(callback: () => void): void {
    console.log(`Setting play callback`);
  }
  isPlaying(): boolean {
    console.log("Not playing by default");
    return false;
  }
  getSong(): string | Blob | ArrayBuffer | null {
    console.log("Not playing by default");
    return null;
  }
  getNotes() {
    console.log("No notes yet");
    return [] as { note: string; duration: number }[];
  }
  setTempo(tempo: number) {
    console.log(`Setting tempo to ${tempo}`);
  }
  getTempo() {
    // Return current tempo
    return 120;
  }
  getCurrentTime(): number {
    // Return current time of currently loaded song
    return 0;
  }
  getDuration(): number {
    // Return duration of currently loaded song
    return 0;
  }
  getInstrument(): string {
    return this.instrument;
  }
  getPercent(): number {
    // Return current position in song
    return 0;
  }
  getVolume(): number {
    // Return current volume
    return 0;
  }
  off(event: string, callback: () => void): void {
    console.log(`Stopped listening to ${event}`);
  }
  setVolume(volume: number): void {
    console.log(`Setting volume to ${volume}`);
  }
  skipToPercent(percent: number): void {
    console.log(`Skipping to ${percent}`);
  }
}