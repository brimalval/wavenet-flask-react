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

export const setupPlayer = async (instrument: Soundfont.InstrumentName) => {
  // Set up the player
  var soundfontPlayer = await Soundfont.instrument(new AudioContext(), instrument);
  const midiPlayer = new MidiPlayer.Player(function (event: any) {
    if (event.name === "Note on") {
      soundfontPlayer.play(event.noteName);
    } else if (event.name === "Note off") {
      soundfontPlayer.stop();
    }
  });
  return midiPlayer;
}

export const playBlob = async (blob: Blob, instrument: Soundfont.InstrumentName, player?: MidiPlayer.Player) => {
   player ??= await setupPlayer(instrument);
  // Create Base64 encoding of the blob
  var reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = function () {
    var base64data = reader.result;
    const url = base64data?.toString();
    if (url && player) {
      player.loadDataUri(url);
      player.play();
    }
  };
};
