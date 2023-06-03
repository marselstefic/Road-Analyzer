import threading
import glob
import time
import cv2
import numpy as np
import os
from deepface import DeepFace
from sklearn.model_selection import train_test_split

# Initialize face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

counter = 0
counter2 = 0

# create a directory to store the reference images
if not os.path.exists('reference_images'):
    os.makedirs('reference_images')

# If there are no images in the 'reference_images' directory, capture and save 20 frames from the webcam
if not glob.glob('reference_images/*.jpg'):
    while counter < 30:
        ret, frame = cap.read()
        if ret:
            cv2.imshow('video', frame)
            cv2.imwrite(f'reference_images/img_{counter}.jpg', frame)
            counter += 1

        key = cv2.waitKey(1)
        if key == ord('q'):  # quit if 'q' is pressed
            break

# load all reference images
reference_imgs = [cv2.imread(filename) for filename in glob.glob('reference_images/*.jpg')]

# Split reference images into training and testing sets
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

while True:
    ret, frame = cap.read()

    if ret:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) > 0:  # if a face is detected
            face_detected = True
            start_time = time.time()  # reset the start time
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
                print("The face matches the reference images!")

                if counter2 > 20:
                    cv2.putText(frame, "MATCH!", (20, 450), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)
                else:
                    cv2.putText(frame, "NO MATCH!", (20, 450), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)
            else:
                cv2.putText(frame, "NO MATCH!", (20, 450), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)
        else:
            cv2.putText(frame, "No Face Detected", (20, 450), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)

        cv2.imshow('video', frame)

    key = cv2.waitKey(1)
    if key == ord('q'):
        break

cv2.destroyAllWindows()
cap.release()

# Save the learned model
vggface_model.save('vggface_model.h5')