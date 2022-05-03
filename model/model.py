from model.wavenet import WaveNet
from tensorflow import keras
import numpy as np
from model.converters.converter import Converter


class Model:
    def __init__(self, residual_channel, skip_channel, stack_size, kernel_size, layer_size, output_classes,
                 sequence_length):
        self.model = WaveNet(residual_channel, skip_channel, stack_size, kernel_size, layer_size, output_classes,
                             sequence_length)
        self.converter = Converter()
        self.compile()

    def compile(self):
        self.model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss=keras.losses.SparseCategoricalCrossentropy(from_logits=False),
            metrics=["accuracy"]
        )
        print(self.model.model().summary())

    def load(self, directory):
        self.model.built = True
        self.model.load_weights(directory)

    def filter_note_with_key(self, y, key):
        key = self.converter.get_scale(key)
        max_note_prob = 0
        max_note = key[0]
        for k in key:
            for i in range(5):
                if max_note_prob < y[k + i]:
                    max_note_prob = y[k + i]
                    max_note = k + i
        return max_note

    def predict(self, x_data, note_length, sequence_length, output_classes, key, is_varied, note_duration=None, file_name=None, get_stream=False):
        note_count = 0
        output = []
        x_data = np.array(x_data).reshape(
            1, sequence_length, 1).astype("float32") / (output_classes - 1)
        while note_count < note_length:
            y = self.model.predict(x_data).ravel()
            arg_y = np.argmax(y)
            if arg_y >= 5:
                arg_y = self.filter_note_with_key(y, key)
                note_count += 1
            output.append(arg_y)
            x = x_data.ravel().tolist()
            x.pop(0)
            x.append(arg_y / (output_classes - 1))
            x_data = np.array(x).reshape(
                1, sequence_length, 1).astype("float32")

        note_result = [self.converter.map_int_to_music21_obj(
            int_note, is_varied, note_duration) for int_note in output]
        stream_result = self.converter.create_song_from_ints(
            output, is_varied, note_duration, file_name)

        if (get_stream):
            return note_result, stream_result
        return note_result
