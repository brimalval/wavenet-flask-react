from wavenet import WaveNet
from tensorflow import keras
import numpy as np

key_of_c = (0, 10, 20, 25, 35, 45, 55, 60, 70, 80, 85, 95, 105, 115)


class Model:
    def __init__(self, residual_channel, skip_channel, stack_size, kernel_size, layer_size, output_classes,
                 sequence_length):
        self.model = WaveNet(residual_channel, skip_channel, stack_size, kernel_size, layer_size, output_classes,
                             sequence_length)
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

    @staticmethod
    def get_note_on_key(y, key=key_of_c):
        max_note_prob = 0
        max_note = key[0]
        for k in key:
            for i in range(5):
                if max_note_prob < y[k+i]:
                    max_note_prob = y[k+i]
                    max_note = k+i
        return max_note

    def predict(self, x_data, note_length, sequence_length):
        output = []
        x_data = np.array(x_data).reshape(1, sequence_length, 1).astype("float32") / 119
        for i in range(note_length):
            y = self.model.predict(x_data).ravel()
            arg_y = self.get_note_on_key(y)
            output.append(arg_y)
            x = x_data.ravel().tolist()
            x.pop(0)
            x.append(arg_y / 119)
            x_data = np.array(x).reshape(1, sequence_length, 1).astype("float32")
        return output
