from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from flask_bcrypt import Bcrypt

app = Flask(__name__)
CORS(app)

# Set a secret key for session management
app.secret_key = 'gyes'

# MongoDB configuration
app.config['MONGODB_SETTINGS'] = {
    'db': 'projekt',
    'host': 'mongodb://localhost/projekt'
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
    timestamp = db.DateTimeField()

class User(db.Document):
    username = db.StringField(unique=True)
    email = db.StringField(unique=True)
    password = db.StringField()

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
        data = list(Data.objects())
        return render_template('data.html', data=data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/data', methods=['POST'])
def add_data():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        data = request.get_json()
        new_data = Data(**data)
        new_data.save()
        return jsonify({'message': 'Data saved successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()