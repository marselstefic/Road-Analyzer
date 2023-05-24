from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from flask_bcrypt import Bcrypt
import math

app = Flask(__name__)
CORS(app)

# Set a secret key for session management
app.secret_key = 'gyes'

# MongoDB configuration
app.config['MONGODB_SETTINGS'] = {
    'db': 'projekt',
    'host': 'mongodb://127.0.0.1/projekt'
}

db = MongoEngine(app)
bcrypt = Bcrypt(app)

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
    used = db.BooleanField()

class User(db.Document):
    username = db.StringField(unique=True)
    email = db.StringField(unique=True)
    password = db.StringField()

class Quality(db.Document):
    value = db.FloatField()
    longitude = db.FloatField()
    latitude = db.FloatField()

# Algorithm for data processing
def process_data(data):
    normalized_gyroX = data['gyroX'] / 15
    normalized_gyroY = data['gyroY'] / 15
    normalized_gyroZ = data['gyroZ'] / 15
    normalized_accX = data['accelerometerX'] / 50
    normalized_accY = data['accelerometerY'] / 50
    normalized_accZ = data['accelerometerZ'] / 50
    magnitude = math.sqrt(
        normalized_gyroX**2 + normalized_gyroY**2 + normalized_gyroZ**2 +
        normalized_accX**2 + normalized_accY**2 + normalized_accZ**2
    )
    min_magnitude = 0
    max_magnitude = math.sqrt(1**2 + 1**2 + 1**2 + 1**2 + 1**2 + 1**2)
    scaled_value = (magnitude - min_magnitude) / (max_magnitude - min_magnitude) * 10

    return scaled_value

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        password2 = request.form['password2']

        if password != password2:
            return jsonify({'error': 'Passwords do not match'}), 400

        if User.objects(username=username):
            return jsonify({'error': 'Username already exists'}), 400

        if User.objects(email=email):
            return jsonify({'error': 'Email is already in use'}), 400

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create a new user
        new_user = User(username=username, email=email, password=hashed_password)
        new_user.save()

        return jsonify({'message': 'Registration successful'}), 201

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Retrieve the user from the database
        user = User.objects(username=username).first()

        # Check if the user exists and the password is correct
        if user and bcrypt.check_password_hash(user.password, password):
            session['username'] = username
            return redirect(url_for('index'))
        else:
            return jsonify({'error': 'Invalid username or password'}), 401

    return render_template('login.html')

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    if request.method == 'POST':
        session.pop('username', None)
        return redirect(url_for('index'))
    else:
        if 'username' in session:
            return render_template('logout.html')
        else:
            return redirect(url_for('index'))

@app.route('/data', methods=['GET'])
def get_all_data():
    try:
        # Retrieve all unused data
        data = Data.objects(used=False)

        # Process and save each data entry as Quality
        for entry in data:
            scaled_value = process_data(entry.to_mongo().to_dict())

            quality = Quality(
                value=scaled_value,
                longitude=entry.longitude,
                latitude=entry.latitude,
            )
            quality.save()

            # Set the 'used' flag of the Data object to True
            entry.update(used=True)

        # Retrieve all quality entries
        quality_data = Quality.objects()

        return render_template('data.html', data=quality_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
