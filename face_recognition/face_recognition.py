import threading
import glob
import time
import cv2
import numpy as np
from deepface import DeepFace
from sklearn.model_selection import train_test_split

#Initialize face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
