import "reflect-metadata";
import { injectable } from "inversify";
import { IMusicPlayer } from "./IMusicPlayer";
import MidiPlayer, { Event } from "midi-player-js";
import Soundfont, {
  InstrumentName,
  Player as InstrumentPlayer,
} from "soundfont-player";

// Declaring it here since GrimmDude didn't export it
type PlayerEventType = "endOfFile" | "midiEvent" | "playing" | "fileLoaded";

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
  private player: MidiPlayer.Player;
  private looper: MidiPlayer.Player;
  private playCallbacks: { [x: string]: Array<(...args: any[]) => void> } = {
    midiEvent: [],
    endOfFile: [],
    playing: [],
    fileLoaded: [],
  };
  private soundProps: {
    soundFont: InstrumentPlayer | null;
  } = {
    soundFont: null,
  };
  private song: ArrayBuffer | null;
  private audioContext: AudioContext;

  constructor() {
    const playEvent = (event: any) => {
      if (event.name === "Note on") {
        this.playCallbacks.midiEvent.forEach((cb) => cb(event));
        if (this.soundProps.soundFont) {
          this.soundProps.soundFont.play(event.noteName);
        }
      } else if (event.name === "Note off") {
        if (this.soundProps.soundFont) this.soundProps.soundFont.stop();
      }
    };
    this.audioContext = new AudioContext();
    this.player = new MidiPlayer.Player(playEvent);
    this.looper = new MidiPlayer.Player(playEvent);
    this.looper.on("endOfFile", () => {
      this.looper.skipToPercent(0);
      this.looper.play();
    });
  }

  /**
   * @throws {Error}
   */
  async play() {
    if (!this.soundProps.soundFont || !this.player || !this.getSong()) {
      throw new Error("Player is not yet ready!");
    }
    if (this.player.isPlaying() || this.looper.isPlaying()) {
      throw new Error("Player is already playing!");
    }
    await this.player.play();
  }
  loop() {
    if (!this.soundProps.soundFont || !this.looper || !this.getSong()) {
      throw new PlayerNotReadyException();
    }
    if (this.player.isPlaying() || this.looper.isPlaying()) {
      throw new Error("Player is already playing!");
    }
    console.log(`Playing ${this.instrument}`);
    this.looper.play();
  }
  pause() {
    if (this.player.isPlaying()) {
      this.player.pause();
    } else if (this.looper.isPlaying()) {
      this.looper.pause();
    }
    console.log(`Pausing ${this.instrument}`);
  }
  stop() {
    if (this.player.isPlaying()) {
      this.player.stop();
    } else if (this.looper.isPlaying()) {
      this.looper.stop();
    }
    console.log(`Stopping ${this.instrument}`);
  }
  async setInstrument(
    instrument: InstrumentName,
    options?: { [x: string]: any }
  ): Promise<void> {
    try {
      this.soundProps.soundFont = await Soundfont.instrument(
        this.audioContext,
        instrument,
        options
      );
      this.instrument = instrument;
    } catch (e) {
      throw new Error(`${instrument} is not a valid instrument!`);
    }
  }
  on(event: PlayerEventType, callback: () => void): void {
    this.player.on(event, callback);
    this.looper.on(event, callback);
  }
  async loadSong(song: string | Blob | ArrayBuffer) {
    // Check if the song is an ArrayBuffer
    if (typeof song === "string") {
      // Todo: Request song from server
    } else if (song instanceof Blob) {
      const load = new Promise<ArrayBuffer>((resolve, reject) => {
        // Create Base64 encoding of the blob
        var reader = new FileReader();
        reader.readAsArrayBuffer(song as Blob);
        reader.onloadend = function () {
          const buffer = reader.result as ArrayBuffer;
          resolve(buffer);
        };
        reader.onerror = function (error) {
          reject(error);
        };
      });
      song = await load;
      this.song = song;
      this.player.loadArrayBuffer(song);
      console.log("finished loading buffer");
    } else {
      this.player.loadArrayBuffer(song as ArrayBuffer);
    }
    console.log("I've finished loading");
  }
  setPlayCallback(callback: (index: number) => void, replace = true): void {
    if (!replace) {
      this.playCallbacks.midiEvent.push(callback);
      return;
    }
    // Replace the old callback with the new one
    this.playCallbacks.midiEvent.splice(0, 1, callback);
  }
  setStopCallback(callback: () => void): void {
    this.player.on("endOfFile", callback);
    this.looper.on("endOfFile", callback);
  }
  isPlaying(): boolean {
    return this.looper.isPlaying() || this.player.isPlaying();
  }
  getSong(): string | Blob | ArrayBuffer | null {
    return this.song;
  }
  getNotes() {
    return this.getNoteEvents().map((event) => ({
      // We are guaranteed that noteName is a string
      note: event.noteName as string,
    }));
  }
  async setTempo(tempo: number) {
    await (this.player as any).setTempo(tempo);
    await (this.looper as any).setTempo(tempo);
  }
  getTempo() {
    // Return current tempo
    return this.player.tempo;
  }
  getCurrentTime(): number {
    // Return current time of currently loaded song
    const playerTick = this.player.getCurrentTick();
    const looperTick = this.looper.getCurrentTick();
    if (this.player.isPlaying() || playerTick > looperTick) {
      return this.player.getSongTime() - this.player.getSongTimeRemaining();
    } else if (this.looper.isPlaying() || looperTick > playerTick) {
      return this.looper.getSongTime() - this.looper.getSongTimeRemaining();
    }
    return 0;
  }
  getDuration(): number {
    // Return duration of currently loaded song
    return this.player.getSongTime();
  }
  getInstrument(): string {
    return this.instrument;
  }
  getPercent(): number {
    // Return current position in song
    return 1 - this.player.getSongPercentRemaining();
  }
  getVolume(): number {
    // Return current volume
    // TODO: Implement
    return 0;
  }
  off(event: string, callback: () => void): void {
    console.error(`Unimplemented - Stop listening to ${event}`);
  }
  setVolume(volume: number): void {
    console.error(`Unimplemeneted - Setting volume to ${volume}`);
  }
  skipToPercent(percent: number): void {
    console.error(`Skipping to ${percent}`);
  }

  // Extra methods
  getEvents() {
    const events = this.player.getEvents();
    // Grimmdude screwed up type definitions for .getEvents() so I made a hacky fix
    const [setupEvents, noteEvents] = events as any as [Event[], Event[]];
    const notePlayEvents = noteEvents.filter(
      (event) => event.name === "Note on"
    );
    return [setupEvents, notePlayEvents];
  }

  getNoteEvents() {
    return this.getEvents()[1];
  }

  getSetupEvents() {
    return this.getEvents()[0];
  }
}
