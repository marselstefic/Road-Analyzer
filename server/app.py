from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from flask_bcrypt import Bcrypt
import math

#MONGODB_URI = config('MONGODB_URI')
MONGODB_URI = 'mongodb://127.0.0.1/projekt'


app = Flask(__name__)
CORS(app)

# Set a secret key for session management
app.secret_key = 'gyes'


# MongoDB configuration
app.config['MONGODB_SETTINGS'] = {
    'db': 'projekt',
    'host': MONGODB_URI
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
    postedBy = db.StringField()

class User(db.Document):
    username = db.StringField(unique=True)
    email = db.StringField(unique=True)
    password = db.StringField()

class Quality(db.Document):
    value = db.FloatField()
    longitude = db.FloatField()
    latitude = db.FloatField()
    postedBy = db.StringField()

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



@app.route('/register', methods=['GET', 'POST'])
def register():

    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()  # load data as JSON
        else:  # form data
            data = request.form

        username = data['username']
        email = data['email']
        password = data['password']

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create a new user
        new_user = User(username=username, email=email, password=hashed_password)
        new_user.save()

        return redirect(url_for('get_all_data'))
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
            print("Stored username in session:", session['username'])  # Add this line for debugging
            return redirect(url_for('get_all_data'))
        else:
            return jsonify({'error': 'Invalid username or password'}), 401

    return render_template('login.html')

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return '', 200


@app.route('/', methods=['GET'])
def get_all_data():
    try:
        # Retrieve the quality data posted by the logged-in user
        quality_data = Quality.objects()

        print("Quality Data:", quality_data)  # Add this line for debugging

        # Compute the count of data points that fall in each range
        counts = {'0-3': 0, '3-7': 0, '7-10': 0}
        for data in quality_data:
            if 0 <= data.value < 3:
                counts['0-3'] += 1
            elif 3 <= data.value < 7:
                counts['3-7'] += 1
            elif 7 <= data.value <= 10:
                counts['7-10'] += 1

        return render_template('data.html', data=quality_data, counts=counts)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/mydata', methods=['GET'])
def get_my_data():
    try:
        # Retrieve the username of the logged-in user
        username = session.get('username')
        print("Retrieved username from session:", username)  # Add this line for debugging

        # Retrieve the quality data posted by the logged-in user
        quality_data = Quality.objects(postedBy=username)

        quality_data_json = []
        for quality in quality_data:
            quality_data_json.append({
                'value': quality.value,
                'longitude': quality.longitude,
                'latitude': quality.latitude,
                'postedBy': quality.postedBy
            })

        print("Quality Data:", quality_data_json)  # Add this line for debugging

        return render_template('mydata.html', data=quality_data_json)
    except Exception as e:
        return jsonify({'error': str(e)}), 500




    
@app.route('/data', methods=['POST'])
def add_data():
    try:
        data = request.get_json()
        processed_value = process_data(data)  # Process the sensor data

        # Create a new Quality object with processed data
        quality = Quality(
            value=processed_value,
            longitude=data.get('longitude'),
            latitude=data.get('latitude'),
            postedBy=data.get('postedBy')
        )
        quality.save()  # Save the Quality object to the database

        return jsonify({'message': 'Data saved successfully'}), 201
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0')