import shutil
from flask import Flask, render_template, send_from_directory
from flask_apscheduler import APScheduler
from dotenv import load_dotenv
from api.routes import api
from converters import converters
import os

load_dotenv()
app = Flask(__name__, static_folder="./frontend/build/static",
            template_folder="./frontend/build")
app.url_map.converters['regex'] = converters.RegexConverter
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

# Set upload folder
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER') or 'uploads'

def clear_uploads():
    shutil.rmtree(app.config['UPLOAD_FOLDER'], ignore_errors=True)
    os.mkdir(app.config['UPLOAD_FOLDER'])

clear_uploads()
# Trigger job at 4 AM every day UTC+8
scheduler.add_job(id='clear_uploads', func=clear_uploads, trigger='cron', hour=4, timezone='Asia/Taipei')

# Redirect all requests to the React app's root
# React handles all the routing
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    return render_template("index.html")

# Routes for getting other public files
@app.route("/<regex(r'(.*?)\.(json|txt|png|ico|js)$'):file>", methods=["GET"])
def static_files(file):
	return send_from_directory(app.template_folder, file)

# Route for getting the model's predictions
@app.route("/uploads/<path:file>", methods=["GET"])
def uploads(file):
    # Get the file name from the file path
    file_name = file.split("/")[-1]
    print("file_name: ", file_name)
    print("file_path: ", os.path.join(app.config["UPLOAD_FOLDER"], file_name))
    return send_from_directory(app.config['UPLOAD_FOLDER'], file_name)

# API routes
app.register_blueprint(api, url_prefix="/api")

if __name__ == '__main__':
    app.run()
