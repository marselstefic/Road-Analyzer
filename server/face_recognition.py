import os
import cv2
import glob
from deepface import DeepFace
from sklearn.model_selection import train_test_split
from flask import Flask, request
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Ustvarjanje objekta za zaznavanje obrazov s Haar kaskadnim klasifikatorjem
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Load all reference images
reference_imgs = [cv2.imread(filename) for filename in glob.glob('reference_images/*.jpg')]

# Razdelitev na trening in testing slike
train_images, test_images = train_test_split(reference_imgs, test_size=0.3, random_state=42)

# Load VGG-Face model
vggface_model = DeepFace.build_model('VGG-Face')

def verify_face(image):
    global vggface_model
    try:
        for reference_img in train_images:
            if DeepFace.verify(image, reference_img.copy(), model_name='VGG-Face')['verified']:
                return True  # if a match is found, no need to check the rest
    except ValueError:
        pass
    return False


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
