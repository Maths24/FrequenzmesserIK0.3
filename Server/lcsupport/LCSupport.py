# This file contains a class to enable video livestreaming
# LCSupport stands for live camera support
import cv2
import threading

counter = 0


class cam():
    height = 100
    width = 100

    def __init__(self):
        print("Constructor of LCSupport")
        self.video = cv2.VideoCapture(0)
        global counter
        counter += 1
        (self.grabbed, self.frame) = self.video.read()
        print(counter)
        threading.Thread(target=self.update, args=()).start()

    def __del__(self):
        print("camera output stopped")
        self.video.release()
        global counter
        counter -= 1

    def get_frame(self, corY=100):
        image = self.frame
        self.width = self.video.get(cv2.CAP_PROP_FRAME_WIDTH)

        cv2.line(image, (0, corY), (int(self.width), corY), (255, 151, 41), 3)

        _, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()

    def update(self):
        while True:
            (self.grabbed, self.frame) = self.video.read()
