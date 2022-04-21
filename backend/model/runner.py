import numpy as np
from model import Model
from converter import Converter

# with open(f'../data/x_train_all.npy', 'rb') as f:
#     X_train = np.load(f, allow_pickle=True)
# X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1).astype("float32")

_res_channel = 128
_skip_channel = 256
_stack_size = 2
_kernel_size = 2
_layer_size = 4
_output_classes = 120
_sequence_length = 50

# x = X_train[np.random.randint(0, X_train.shape[0])]
# x = x.tolist()
# print(x)

x = [np.random.randint(0, _output_classes) for _ in range(_sequence_length)]

model = Model(_res_channel, _skip_channel, _stack_size, _kernel_size, _layer_size, _output_classes, _sequence_length)
model.load("save_128_256_2_2_4_120_limit_all/weights_only.h5")
result = model.predict(x, 25, _sequence_length)

conv = Converter()

conv.create_song_from_ints(result)

for i, note in enumerate(result):
    print(f"index: {i}\nnote: {note}")
