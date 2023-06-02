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