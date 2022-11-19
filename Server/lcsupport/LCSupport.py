# This file contains a class to enable video livestreaming
# LCSupport stands for live camera support
import cv2
import threading


class cam():
    height = 100
    width = 100

    def __init__(self):
        print("Constructor of LCSupport")
        self.video = cv2.VideoCapture(0)
        (self.grabbed, self.frame) = self.video.read()

        threading.Thread(target=self.update, args=()).start()

    def __del__(self):
        print("camera output stopped")
        self.video.release()

    def get_frame(self, corY=100):
        image = self.frame
        self.width = self.frame.shape[1]
        cv2.line(image, (0, corY), (self.width, corY), (0, 0, 255), 3)

        _, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()

    def update(self):
        while True:
            (self.grabbed, self.frame) = self.video.read()
