from datetime import datetime
from flask import Blueprint, jsonify, request, current_app
from model.model import Model
import numpy as np
from model.converters.converter import Converter

# from flask_api import status

api = Blueprint('api', __name__)

res_channel = 128
skip_channel = 256
stack_size = 2
kernel_size = 2
layer_size = 3
output_classes = 125
sequence_length = 50
model = Model(res_channel, skip_channel, stack_size, kernel_size,
              layer_size, output_classes, sequence_length)
model.load("model/version_1_with_rests_sl_50/weights_only.h5")
converter = Converter()

DEFAULT_TEMPO = 120


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

    results = []
    for i in range(melody_count):
        x = converter.generate_random_notes(key, sequence_length)
        # Create unique file name for the prediction that includes the key, index, and date
        filename = f"{key}_{i}_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}"
        filename = filename.replace("#", "sharp")
        upload_path = f"{current_app.config['UPLOAD_FOLDER']}/{filename}"
        result, stream = model.predict(x, length, sequence_length,
                                       output_classes, key, is_varied, note_duration, upload_path, get_stream=True)
        contents = []
        for r in result:
            if r.isNote:
                name = r.nameWithOctave
                contents.append({
                    'name': name,
                    'duration': r.quarterLength,
                })

        results.append({
            "notes": contents,
            "path": upload_path + ".mid",
            "scale": converter.get_scale(key=key, notes_as_ints=False),
            "duration": ((stream.highestTime + 1) / DEFAULT_TEMPO) * 60
        })
    return jsonify(results)


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
