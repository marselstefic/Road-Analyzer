import threading
import glob
import time
import cv2
import numpy as np
from deepface import DeepFace
from sklearn.model_selection import train_test_split

#Initialize face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

counter = 0
counter2 = 0

reference_imgs = []
for filename in glob.glob('reference_images/*.jpg'):  # load all reference images
    reference_imgs.append(cv2.imread(filename))

# Split reference images into training and testing sets
train_images, test_images = train_test_split(reference_imgs, test_size=0.2, random_state=42)

def check_face(frame):
    global face_match
    face_match = False
    for reference_img in train_images:
        try:
            if DeepFace.verify(reference_img, frame, model_name='VGG-Face')['verified']:
                face_match = True
                break  # if a match is found, no need to check the rest
        except ValueError:
            pass

    ret, frame = cap.read()

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if len(faces) > 1:  # if a face is detected
        start_time = time  # reset the start time
        face_detected = True
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

cv2.destroyAllWindows()
cap.release()
