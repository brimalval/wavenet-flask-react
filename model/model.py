from model.wavenet import WaveNet
from tensorflow import keras
import numpy as np
from model.converter import Converter


class Model:
    def __init__(self, residual_channel, skip_channel, stack_size, kernel_size, layer_size, output_classes,
                 sequence_length):
        self.model = WaveNet(residual_channel, skip_channel, stack_size, kernel_size, layer_size, output_classes,
                             sequence_length)
        self.converter = Converter()
        self.print_summary()

    def print_summary(self):
        print(self.model.model().summary())

    def load(self, directory):
        """Load a model's weights from a directory.

        Args:
            directory (string): The directory that the model's weights are stored in.
        """        
        self.model.built = True
        self.model.load_weights(directory)

    def filter_note_with_key(self, y, key):
        """Filters the output of the model to only include notes that match the key.

        Args:
            y (int[]): The output of the model that is to be filtered.
            key (string): The key of the output melody.

        Returns:
            int[]: The filtered output of the model.
        """        
        key = self.converter.get_scale(key)
        max_note_prob = 0
        max_note = key[0]
        for k in key:
            for i in range(5):
                if max_note_prob < y[k + i]:
                    max_note_prob = y[k + i]
                    max_note = k + i
        return max_note

    def predict(self, x_data, note_length, sequence_length,  key, output_classes, is_varied, note_duration=None, file_name=None, get_stream=True, prime_melody=False):
        """Gives a series of notes based on the input data.

        Args:
            x_data (int[]): The "priming melody" or "seed melody" of the model.
            note_length (int): The length of the output melody.
            sequence_length (int): The number of features/inputs accepted by the model at each
            time step.
            key (string): The key of the output melody.
            output_classes (int): The number of possible outputs of the model.
            is_varied (bool): Whether the durations of the notes of the output melody are varied.
            note_duration (string, optional): The duration that all the notes in 
            the melody will have if is_varied is True. Defaults to None.
            file_name (string, optional): File name that the produced MIDI file will
            be saved as. Defaults to None.
            get_stream (bool, optional): Whether the Music21 stream should also
            be returned. Defaults to True.

        Returns:
            int[]: The output melody represented as a list of ints.
            (optional) stream: The Music21 stream generated. Returned if get_stream is True.
        """        
        output = []
        x_data = np.array(x_data).reshape(
            1, sequence_length, 1).astype("float32") / (output_classes-1)
        for i in range(note_length):
            y = self.model.predict(x_data).ravel()
            if (not prime_melody):
                arg_y = self.filter_note_with_key(y, key)
            else:
                arg_y = np.argmax(y)
            output.append(arg_y)
            x = x_data.ravel().tolist()
            x.pop(0)
            x.append(arg_y / (output_classes-1))
            x_data = np.array(x).reshape(
                1, sequence_length, 1).astype("float32")

        notes_result = [self.converter.map_int_to_note(int_note, is_varied, note_duration) for int_note in output]
        stream_result = self.converter.create_song_from_ints(
            output, is_varied, note_duration, file_name)
        if get_stream:
            return notes_result, stream_result
        return notes_result
