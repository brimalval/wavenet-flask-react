import Soundfont from "soundfont-player";
import MidiPlayer from "midi-player-js";

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
      console.log(event.noteName);
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
