import threading
import glob
import cv2
import numpy as np
import os
from deepface import DeepFace
from sklearn.model_selection import train_test_split
import time


# Ustvarjanje objekta za zaznavanje obrazov s Haar kaskadnim klasifikatorjem
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

counter = 0
counter2 = 0

# Vnos imena mape preko konzole
folder_name = input("Vnesite uporabniško ime: ")

# Preverjanje ali mapa že obstaja
if os.path.exists(folder_name):
    # Load all reference images from the specified folder
    reference_imgs = [cv2.imread(filename) for filename in glob.glob(f'{folder_name}/*.jpg')]
else:
    os.makedirs(folder_name)
    frame_counter = 0  # Add a frame counter
    while counter < 30:
        ret, frame = cap.read()
        if ret:
            cv2.imshow('video', frame)
            if frame_counter % 5 == 0:  # Only save image every 5 frames
                cv2.imwrite(f'{folder_name}/img_{counter}.jpg', frame)
                counter += 1
            frame_counter += 1  # Always increment the frame counter

        key = cv2.waitKey(1)
        if key == ord('q'):  # quit if 'q' is pressed
            break

    # Load all reference images from the created folder
    reference_imgs = [cv2.imread(filename) for filename in glob.glob(f'{folder_name}/*.jpg')]

# Razdelitev na trening in testing slike
train_images, test_images = train_test_split(reference_imgs, test_size=0.3, random_state=42)

face_match = False
face_detected = False

# Load VGG-Face model
vggface_model = DeepFace.build_model('VGG-Face')

def check_face(frame):
    global face_match
    face_match = False
    for reference_img in train_images:
        try:
            if DeepFace.verify(frame, reference_img.copy(), model_name='VGG-Face')['verified']:
                face_match = True
                break  # if a match is found, no need to check the rest
        except ValueError:
            pass

start_time = None

while True:
    ret, frame = cap.read()

    if ret:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) > 0:  # if a face is detected
            face_detected = True
            if start_time is None:  # Start the timer when the face is detected for the first time
                start_time = time.time()
        else:
            face_detected = False

        if face_detected:
            if counter % 30 == 0:
                try:
                    threading.Thread(target=check_face, args=(frame.copy(),)).start()
                except ValueError:
                    pass
            counter += 1
            if face_match:
                counter2 += 1
                print("Successful verification!")
                break
        else:
            if start_time is not None and time.time() - start_time > 10:
                print("Unsuccessful verification!")
                break
        cv2.imshow('video', frame)

    key = cv2.waitKey(1)
    if key == ord('q'):
        break

cv2.destroyAllWindows()
cap.release()

# Save the learned model
vggface_model.save('vggface_model.h5')
