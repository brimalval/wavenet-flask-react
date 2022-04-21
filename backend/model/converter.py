from music21 import note, stream, converter
from bidict import bidict


class Converter:
    # Function to create a music21 stream from a list of notes

    def __init__(self):
        self.notes_map = bidict({
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
        self.duration_map = bidict({
            'whole': 0,
            'half': 1,
            'quarter': 2,
            'eighth': 3,
            '16th': 4,
        })
        self.MAX_NOTE_VAL = 119

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
