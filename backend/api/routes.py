from datetime import datetime
from flask import Blueprint, jsonify, request, current_app
from model.model import Model
import numpy as np
from model.converter import Converter

# from flask_api import status

api = Blueprint('api', __name__)

res_channel = 128
skip_channel = 256
stack_size = 2
kernel_size = 2
layer_size = 4
output_classes = 120
sequence_length = 50
model = Model(res_channel, skip_channel, stack_size, kernel_size,
              layer_size, output_classes, sequence_length)
model.load("model/save_128_256_2_2_4_120_limit_all/weights_only.h5")


@api.route('/predict', methods=['POST'])
def predict():
    # Take the request json
    data = request.get_json()
    # Get the data from the request
    key = data['key']
    length = data['length'] if 'length' in data else 25
    melody_count = data['melodyCount'] if 'melodyCount' in data else 1

    results = []
    for i in range(melody_count):
        x = [np.random.randint(0, output_classes)
             for _ in range(sequence_length)]
        # Create unique file name for the prediction that includes the key, index, and date
        filename = f"{key}_{i}_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}"
        filename = filename.replace("#", "sharp")
        upload_path = f"{current_app.config['UPLOAD_FOLDER']}/{filename}"
        result = model.predict(x, length, sequence_length, key, upload_path)
        print("KEY", key)
        results.append({
            "notes": result,
            "path": upload_path + ".mid",
            "scale": Converter().get_scale(key=key, notes_as_ints=False)
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
