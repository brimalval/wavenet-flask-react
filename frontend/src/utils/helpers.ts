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
  return midiPlayer;
};

export const playBlob = (blob: Blob, player: MidiPlayer.Player) => {
  // Create Base64 encoding of the blob
  var reader = new FileReader();
  reader.readAsArrayBuffer(blob);
  reader.onloadend = function () {
    const buffer = reader.result as ArrayBuffer;
    player.loadArrayBuffer(buffer);
    player.play();
  };
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

export const placeHolderEvents: Event[] = [
  {
    track: 2,

    tick: 0,
    byteIndex: 8,
    name: "Note on",
    channel: 1,
    noteNumber: 74,
    noteName: "D5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 256,
    byteIndex: 17,
    name: "Note on",
    channel: 1,
    noteNumber: 71,
    noteName: "B4",
    velocity: 71,
  },
  {
    track: 2,

    tick: 768,
    byteIndex: 26,
    name: "Note on",
    channel: 1,
    noteNumber: 74,
    noteName: "D5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 1280,
    byteIndex: 35,
    name: "Note on",
    channel: 1,
    noteNumber: 71,
    noteName: "B4",
    velocity: 71,
  },
  {
    track: 2,

    tick: 1792,
    byteIndex: 44,
    name: "Note on",
    channel: 1,
    noteNumber: 71,
    noteName: "B4",
    velocity: 71,
  },
  {
    track: 2,

    tick: 2304,
    byteIndex: 53,
    name: "Note on",
    channel: 1,
    noteNumber: 71,
    noteName: "B4",
    velocity: 71,
  },
  {
    track: 2,

    tick: 2560,
    byteIndex: 62,
    name: "Note on",
    channel: 1,
    noteNumber: 74,
    noteName: "D5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 2816,
    byteIndex: 71,
    name: "Note on",
    channel: 1,
    noteNumber: 71,
    noteName: "B4",
    velocity: 71,
  },
  {
    track: 2,

    tick: 3328,
    byteIndex: 80,
    name: "Note on",
    channel: 1,
    noteNumber: 74,
    noteName: "D5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 3840,
    byteIndex: 89,
    name: "Note on",
    channel: 1,
    noteNumber: 83,
    noteName: "B5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 5888,
    byteIndex: 98,
    name: "Note on",
    channel: 1,
    noteNumber: 78,
    noteName: "Gb5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 6400,
    byteIndex: 107,
    name: "Note on",
    channel: 1,
    noteNumber: 83,
    noteName: "B5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 6912,
    byteIndex: 116,
    name: "Note on",
    channel: 1,
    noteNumber: 76,
    noteName: "E5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 7168,
    byteIndex: 125,
    name: "Note on",
    channel: 1,
    noteNumber: 81,
    noteName: "A5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 11264,
    byteIndex: 134,
    name: "Note on",
    channel: 1,
    noteNumber: 76,
    noteName: "E5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 11776,
    byteIndex: 143,
    name: "Note on",
    channel: 1,
    noteNumber: 76,
    noteName: "E5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 12288,
    byteIndex: 152,
    name: "Note on",
    channel: 1,
    noteNumber: 71,
    noteName: "B4",
    velocity: 71,
  },
  {
    track: 2,

    tick: 12544,
    byteIndex: 161,
    name: "Note on",
    channel: 1,
    noteNumber: 76,
    noteName: "E5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 13056,
    byteIndex: 170,
    name: "Note on",
    channel: 1,
    noteNumber: 76,
    noteName: "E5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 13568,
    byteIndex: 179,
    name: "Note on",
    channel: 1,
    noteNumber: 76,
    noteName: "E5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 13824,
    byteIndex: 188,
    name: "Note on",
    channel: 1,
    noteNumber: 76,
    noteName: "E5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 14080,
    byteIndex: 197,
    name: "Note on",
    channel: 1,
    noteNumber: 83,
    noteName: "B5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 14336,
    byteIndex: 206,
    name: "Note on",
    channel: 1,
    noteNumber: 76,
    noteName: "E5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 14592,
    byteIndex: 215,
    name: "Note on",
    channel: 1,
    noteNumber: 83,
    noteName: "B5",
    velocity: 71,
  },
  {
    track: 2,

    tick: 15104,
    byteIndex: 224,
    name: "Note on",
    channel: 1,
    noteNumber: 76,
    noteName: "E5",
    velocity: 71,
  },
];
