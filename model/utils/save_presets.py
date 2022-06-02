import numpy as np

PATH = "../../presets/presets.npy"

presets = {

    1: [58, 103, 118, 68, 59, 118, 108, 94, 68, 93, 103, 83, 103, 108, 49, 83, 83, 93, 103, 58, 73, 83, 68,
          49, 83, 108, 84, 84, 49, 108, 47, 68, 84, 84, 103, 48, 58, 67, 67, 68, 57, 68, 73, 83, 59, 83, 73, 83,
          48, 49],
}


with open(PATH, 'wb') as f:
    np.save(f, presets)


with open(PATH, 'rb') as f:
    print(np.load(f, allow_pickle=True))