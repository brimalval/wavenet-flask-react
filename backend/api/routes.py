from flask import Blueprint, jsonify, request

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
	return jsonify(request.get_json())