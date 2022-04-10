export enum Note {
  A = "A",
  Asharp = "A#",
  B = "B",
  C = "C",
  Csharp = "C#",
  D = "D",
  Dsharp = "D#",
  E = "E",
  F = "F",
  Fsharp = "F#",
  G = "G",
  Gsharp = "G#",
}
export enum Scale {
  Major = "maj",
  Minor = "min",
}

export type Key = `${Note}${Scale}`;
