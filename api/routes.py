from datetime import datetime
from flask import Blueprint, jsonify, request, current_app
from model.model import Model
import numpy as np
from model.converter import Converter

# from flask_api import status

api = Blueprint('api', __name__)

# Parameters for the model
res_channel = 128
skip_channel = 256
stack_size = 3
kernel_size = 2
layer_size = 3
output_classes = 120
sequence_length = 128
model = Model(res_channel, skip_channel, stack_size, kernel_size,
              layer_size, output_classes, sequence_length)
# Loading the weights of the model
model.load("model/last_trained/weights_only.h5")
converter = Converter()

DEFAULT_BPM = 120
# load song primers
with open(f'model/utils/songs_mapped_int.npy', 'rb') as f:
    song_primers = np.load(f, allow_pickle=True)[()]

# load song IDs by musical key
with open(f'model/utils/ids_on_key.npy', 'rb') as f:
    ids_on_key = np.load(f, allow_pickle=True)[()]

# Load the integer array equivalents of the MIDI presets
with open("presets/presets.npy", 'rb') as f:
    integer_presets = np.load(f, allow_pickle=True)[()]


@api.route('/predict', methods=['POST'])
def predict():
    # Take the request json
    data = request.get_json()
    print(data)
    # Get the data from the request
    key = data['key']
    length = data['noteCount'] if 'noteCount' in data else 25
    melody_count = data['melodyCount'] if 'melodyCount' in data else 1
    is_varied = data['variedRhythm']
    note_duration = data['noteDuration']
    prime_melodies = data['primeMelodies'] if 'primeMelodies' in data else None
    # Get the ID of the preset that the user requested, if it exists
    if data['preset'] >= 0:
        preset = integer_presets[data["preset"]]["melody"]
        key = integer_presets[data["preset"]]["key"]
    else:
        preset = None
    # Array of objects containing information about the generated melodies
    # that are relevant to the front-end
    results = []
    for i in range(melody_count):
        if prime_melodies:
            x = converter.select_primer_notes(key, song_primers, ids_on_key, sequence_length)
        else:
            x = converter.generate_random_notes(key, sequence_length)
        # Create unique file name for the prediction that includes the key, index, and date
        filename = f"{key}_{i}_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}"
        filename = filename.replace("#", "sharp")
        upload_path = f"{current_app.config['UPLOAD_FOLDER']}/{filename}"
        # Prediction will output the notes, the MIDI stream of the song, and similarity score
        # if applicable
        output = model.predict(x, length, sequence_length,
                               key, output_classes, is_varied, note_duration, upload_path, prime_melody=prime_melodies,
                               preset=preset)
        result = output["notes"]
        stream = output["stream"]
        similarity = output["similarity"] if "similarity" in output else None
        # Get quarterLengths of the stream
        quarter_lengths = stream.highestTime
        # Convert quarter lengths to seconds
        duration = (quarter_lengths / DEFAULT_BPM) * 60
        notes = [
            {
                "name": x.nameWithOctave,
                "duration": x.quarterLength,
            } for x in result
        ]
        if prime_melodies:
            names = [note['name'] for note in notes]
            scale = list(set(names))
            scale_order = {
                "C": 0,
                "C#": 1,
                "D": 2,
                "D#": 3,
                "E": 4,
                "F": 5,
                "F#": 6,
                "G": 7,
                "G#": 8,
                "A": 9,
                "A#": 10,
                "B": 11
            }
            # Sort by pitch
            scale.sort(key=lambda x: scale_order[x[0]] if x[1] != "#" else scale_order[x[:2]])
            # Sort by octave
            scale.sort(key=lambda x: x[-1])
        else:
            scale = converter.get_scale(key=key, notes_as_ints=False)

        results.append({
            "notes": notes,
            "path": upload_path + ".mid",
            "scale": scale,
            "duration": duration,
            "title": f"{key} Melody #{i + 1}",
            "similarity": similarity
        })
        if data['preset'] >= 0:
            results.sort(key=lambda x: -x["similarity"])
    return jsonify(results)


# Routes used for testing the API
@api.route('/')
def index():
    return {
        "message": "Hello World"
    }


@api.route('/<string:name>')
def name(name):
    return {
        "message": f"Hello {name}"
    }


@api.route("/post", methods=["POST"])
def post():
    if int(request.get_json()["tempo"]) == 123:
        resp = request.get_json()
        resp["message"] = "Arbitrary bad request number"
        return jsonify(resp), 400

    return jsonify(request.get_json())
