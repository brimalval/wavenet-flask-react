from music21 import note, stream, converter
from bidict import bidict


notes_map = bidict({
    'C': 0,
    'C#': 5,
    'D': 10,
    'D#': 15,
    'E': 20,
    'F': 25,
    'F#': 30,
    'G': 35,
    'G#': 40,
    'A': 45,
    'A#': 50,
    'B': 55,
})
duration_map = bidict({
    'whole': 0,
    'half': 1,
    'quarter': 2,
    'eighth': 3,
    '16th': 4,
})
MAX_NOTE_VAL = 119
# Distance of each note in the major scale from the tonic note multiplied by 5
major_scale_interval = [0, 10, 20, 25, 35, 45, 55, 60, 70, 80, 85, 95, 105, 115]
# Distance of each note in the minor scale from the tonic note multiplied by 5
minor_scale_interval = [0, 10, 15, 25, 35, 40, 50, 60, 70, 75, 85, 95, 100, 110]


class Converter:
    # Function to create a music21 stream from a list of notes

    def create_midi_stream(self, notes):
        stream_result = stream.Stream()
        for note_int in notes:
            stream_result.append(self.map_int_to_note(note_int))
        return stream_result

    # Function to write a music21 stream to a midi file
    def create_song_from_ints(self, notes, file_name="output"):
        stream_result = self.create_midi_stream(notes)
        stream_result.write('midi', f'{file_name}.mid')

    # Function to map integers to music21 notes
    @staticmethod
    def map_int_to_note(note_int):
        if note_int > MAX_NOTE_VAL:
            raise Exception(f'{note_int} is not a valid note integer')
        # Pitches come in groups of 5, get the pitch by floor dividing by 5 then modulus 12
        pitch_int = ((note_int // 5) % 12)
        pitch = list(notes_map.keys())[pitch_int]
        # An octave is 12 notes with 5 durations each, so get the octave by dividing by 60
        # Add the minimum octave to the answer to get the correct octave
        # TODO: Make minimum octave configurable as a global constant
        octave = (note_int // 60) + 4
        # Get the duration by modulus 5
        duration = list(duration_map.keys())[note_int % 5]
        # Create a music21 note with the correct pitch and duration
        note_result = note.Note(pitch + str(octave))
        note_result.duration.type = duration
        return note_result
    
    def get_scale(self, key):
        # Last three letters of key are the scale type
        scale = key[-3:]
        # First two letters of key are the tonic unless the second letter is a sharp
        tonic = key[:2] if key[1] == "#" else key[0]
        # Get the scale interval by checking if the scale is major or minor
        scale_interval = major_scale_interval if scale == "maj" else minor_scale_interval
        # Get the scale by mapping the tonic note to the scale interval
        scale = [notes_map[tonic] + interval for interval in scale_interval]
        # Filter out notes that are out of range
        scale = [note_int for note_int in scale if note_int <= MAX_NOTE_VAL]

        return scale

# Test code
if __name__ == "__main__":
    testme = Converter()
    scale = testme.get_scale("Bmaj")
    print(testme.get_scale("Bmaj"))
    converted = [testme.map_int_to_note(item) for item in scale]
    i = 0
    for item in converted:
        print(scale[i], item.fullName)
        i += 1
    scale = testme.get_scale("Bmin")
    print(testme.get_scale("Bmin"))
    print("converted", [testme.map_int_to_note(item).fullName for item in scale])
