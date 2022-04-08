from flask import Blueprint, jsonify, request
from flask_api import status

api = Blueprint('api', __name__)

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
		return jsonify(resp), status.HTTP_400_BAD_REQUEST

	return jsonify(request.get_json())