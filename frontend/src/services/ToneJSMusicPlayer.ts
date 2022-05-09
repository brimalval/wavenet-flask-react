import { injectable } from "inversify";
import { IMusicPlayer } from "./IMusicPlayer";
import * as Tone from "tone";
import { Midi } from "@tonejs/midi";
import Soundfont, {
  InstrumentName,
  Player as InstrumentPlayer,
} from "soundfont-player";

@injectable()
export class ToneJSMusicPlayer implements IMusicPlayer {
  private soundFont: InstrumentPlayer | null;
  private song: string | Blob | ArrayBuffer | null;
  private parsedMidi: Midi | null;
  private notePlayCallback: (noteIndex: number) => void;
  private stopCallback: () => void;
  private instrument: string;
  private volume: number = 1;

  constructor() {
    Tone.Transport.loop = true;
    this.parsedMidi = null;
  }

  async loadSong(song: string | Blob | ArrayBuffer): Promise<void> {
    if (this.song) {
      this.song = null;
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }
    if (song instanceof Blob) {
      const url = URL.createObjectURL(song);
      const midi = await Midi.fromUrl(url);
      this.parsedMidi = midi;
      Tone.Transport.loopEnd = midi.duration;
      midi.tracks[0].notes.forEach((note, index) => {
        // Convert start time of the note (in ticks) to seconds
        const startTime = midi.header.ticksToSeconds(note.ticks);
        Tone.Transport.schedule((time) => {
          this.soundFont!.play(note.name, 0, {
            gain: this.volume, // Default value is 1
          }).stop(time + midi.header.ticksToSeconds(note.durationTicks));
          if (this.notePlayCallback) {
            this.notePlayCallback(index + 1);
          }
        }, startTime);
      });
      this.song = song;
    }
  }
  getCurrentTime(): number {
    return 0;
  }
  getDuration(): number {
    return 0;
  }
  getInstrument(): string {
    return this.instrument;
  }
  getNotes(): { note: string }[] {
    if (!this.parsedMidi) {
      return [];
    }
    return this.parsedMidi.tracks[0].notes.map((note) => ({
      note: note.name,
    }));
  }
  getPercent(): number {
    return 0;
  }
  getSong(): string | Blob | ArrayBuffer | null {
    return this.song;
  }
  getTempo(): number {
    return Tone.Transport.bpm.value;
  }
  getVolume(): number {
    return this.volume;
  }
  isPlaying(): boolean {
    return Tone.Transport.state === "started";
  }
  loop(): void {}
  off(event: string, callback: () => void): void {}
  on(event: string, callback: () => void): void {}
  pause(): void {
    Tone.Transport.pause();
  }
  async play(): Promise<void> {
    if (!this.soundFont || !this.getSong()) {
      throw new Error("Player is not yet ready!");
    }
    if (this.isPlaying()) {
      throw new Error("Player is already playing!");
    }
    Tone.start();
    Tone.Transport.start();
  }
  async setInstrument(
    instrument: InstrumentName,
    options?: { [x: string]: any }
  ): Promise<void> {
    try {
      this.soundFont = await Soundfont.instrument(
        Tone.context.rawContext as AudioContext,
        instrument,
        options
      );
      this.instrument = instrument;
    } catch (error) {
      throw new Error("Error setting instrument");
    }
  }
  setPlayCallback(callback: (index: number) => void): void {
    this.notePlayCallback = callback;
  }
  setStopCallback(callback: () => void): void {
    this.stopCallback = callback;
  }
  setTempo(tempo: number): void {
    Tone.Transport.bpm.value = tempo;
  }
  setVolume(volume: number): void {
    this.volume = volume;
  }
  skipToPercent(percent: number): void {}
  stop(): void {
    Tone.Transport.pause();
    Tone.Transport.position = "0:0:0"
    if (this.stopCallback) {
      this.stopCallback();
    }
  }
}
