import numpy as np
from model import Model
from converter import Converter

if __name__ == "__main__":
    res_channel = 128
    skip_channel = 256
    stack_size = 2
    kernel_size = 2
    layer_size = 4
    output_classes = 120
    sequence_length = 50

    x = [np.random.randint(0, output_classes) for _ in range(sequence_length)]

    model = Model(res_channel, skip_channel, stack_size, kernel_size, layer_size, output_classes, sequence_length)
    model.load("save_128_256_2_2_4_120_limit_all/weights_only.h5")
    result = model.predict(x, 40, sequence_length, key="Gmaj")

    conv = Converter()

    conv.create_song_from_ints(result)

    # for i, note in enumerate(result):
    #     print(f"index: {i}\nnote: {note}")
