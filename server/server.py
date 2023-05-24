from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from flask import Blueprint
from datetime import datetime 

app = Flask(__name__)
CORS(app)

# MongoDB configuration
app.config['MONGODB_SETTINGS'] = {
    'db': 'projekt',
    'host': 'mongodb://127.0.0.1/projekt'
}

db = MongoEngine(app)

# Models
class Data(db.Document):
    gyroX = db.FloatField()
    gyroY = db.FloatField()
    gyroZ = db.FloatField()
    accelerometerX = db.FloatField()
    accelerometerY = db.FloatField()
    accelerometerZ = db.FloatField()
    longitude = db.FloatField()
    latitude = db.FloatField()
    timestamp = db.DateTimeField()

# Routes
data_routes = Blueprint('data_routes', __name__)

@data_routes.route('/data', methods=['GET'])
def get_all_data():
    try:
        data = Data.objects().to_json()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@data_routes.route('/data', methods=['POST'])
def add_data():
    try:
        data = request.get_json()
        data['timestamp'] = datetime.fromtimestamp(data['timestamp'] / 1000.0)  # convert to datetime
        new_data = Data(**data)
        new_data.save()
        return jsonify({'message': 'Data saved successfully'}), 201
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500


app.register_blueprint(data_routes)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
