from flask import Blueprint, jsonify, request
from model.model import Model
import numpy as np

# from flask_api import status

api = Blueprint('api', __name__)

res_channel = 128
skip_channel = 256
stack_size = 2
kernel_size = 2
layer_size = 4
output_classes = 120
sequence_length = 50
model = Model(res_channel, skip_channel, stack_size, kernel_size, layer_size, output_classes, sequence_length)
model.load("model/save_128_256_2_2_4_120_limit_all/weights_only.h5")


@api.route('/predict/<string:key>/<int:length>/<int:melody_count>')
def predict(key, length, melody_count):
    results = []
    for i in range(melody_count):
        x = [np.random.randint(0, output_classes) for _ in range(sequence_length)]
        result = model.predict(x, length, sequence_length, key)
        results.append({"notes": result, "path": ""})
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
