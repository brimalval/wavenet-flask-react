import Soundfont from "soundfont-player";
import MidiPlayer, { Event } from "midi-player-js";

export const downloadBlob = (blob: Blob, fileName?: string) => {
  const blobType = blob.type ?? "audio/mp3";
  blob = new Blob([blob], { type: blobType });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName ?? `Download.mid`;
  link.click();
  link.remove();
};

export const setupPlayer = async (
  instrument: Soundfont.InstrumentName,
  songBlob?: Blob,
  notePlayCallback?: () => any
) => {
  // Set up the player
  var soundfontPlayer = await Soundfont.instrument(
    new AudioContext(),
    instrument
  );
  const midiPlayer = new MidiPlayer.Player(function (event: any) {
    if (event.name === "Note on" && event.velocity > 0) {
      if (notePlayCallback) {
        notePlayCallback();
      }
      soundfontPlayer.play(event.noteName);
    } else if (event.name === "Note off") {
      soundfontPlayer.stop();
    }
  });
  // TODO: Figure out how to fix the tempo getting changed once the loop restarts
  // For some reason midi-player-js type defs don't say that stop and play are async
  midiPlayer.on("endOfFile", async () => {
    await midiPlayer.skipToPercent(0);
    // await midiPlayer.play();
  });
  if (songBlob) {
    await loadBlob(songBlob, midiPlayer);
  }
  return midiPlayer;
};

export const loadBlob: (
  blob: Blob,
  player: MidiPlayer.Player
) => Promise<MidiPlayer.Player> = (blob, player) => {
  return new Promise((resolve, reject) => {
    // Create Base64 encoding of the blob
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = function () {
      const buffer = reader.result as ArrayBuffer;
      player.loadArrayBuffer(buffer);
      resolve(player);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
};

export const getEvents = (player: MidiPlayer.Player) => {
  const events = player.getEvents();
  // Grimmdude screwed up type definitions for .getEvents() so I made a hacky fix
  const [setupEvents, noteEvents] = events as any as [Event[], Event[]];
  const notePlayEvents = noteEvents.filter((event) => event.name === "Note on");
  return [setupEvents, notePlayEvents];
};

export const getNoteEvents = (player: MidiPlayer.Player) => {
  return getEvents(player)[1];
};

export const getSetupEvents = (player: MidiPlayer.Player) => {
  return getEvents(player)[0];
};
