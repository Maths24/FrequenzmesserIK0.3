from django.shortcuts import render, redirect
from .models import Room
from django.contrib.auth.models import User
from .forms import RoomForm
from lcsupport import LCSupport
from django.views.decorators import gzip
from django.http import StreamingHttpResponse
from django.http import JsonResponse
from base import data
from base.dbcontroller import DBController
import json
from time import sleep
import cv2
# Create your views here.

# rooms = [
#    {'id': 1, 'name': 'Lets learn python!'},
#    {'id': 2, 'name': 'Design with me'},
#    {'id': 3, 'name': 'Frontend developer'},
# ]
# ---------------------Config---------------------

corY = 187


def read_config():
    try:
        with open('Settings.json') as file:
            data = json.load(file)
            settings = json.loads(data)
            print(settings)
            return settings
    except:
        print("Configfile not found")
        return "LoadingFailed"

# def change_config():
#    with open('Settings.json') as file:
#        data = json.load(file)
 #       settings = json.loads(data)

# ---------------------Seitenrendering---------------------


def landing(request):
    global updateCam
    updateCam = False
    d = data.Data()
    gesamtKundenzahl = gesamtZahlHeute()
    kundenInLaden = kundenzahlInLaden()
    vergleich = gesamtKundenzahl - vergleichVorwoche()
    # For testing
    #gesamtKundenzahl = 24
    #kundenInLaden = 24
    #vergleichVorwoche = 9
    return render(request, 'index.html', {'gesamtKundenzahl': gesamtKundenzahl, 'kundenInLaden': kundenInLaden, 'vergleichVorwoche': vergleich})


def settings(request):
    global corY
    global updateCam
    updateCam = False
    updateCam = True
    f = open('/home/pi/Skripte/FrequenzmesserIK0.3/Settings.json')
    print(type(f))
    rawdata = f.read()
    data = json.loads(rawdata)

    corY = data["pos"]
    print(corY)

    return render(request, 'einstellungen.html')


def dataanalysis(request):
    global updateCam
    updateCam = False
    d = [['Uhrzeit', 'Kundenzahl Schnitt', 'Kundenzahl'], ['9:00',  1, 1], ['10:00',  2, 3], [
        '11:00',  19, 16], ['12:00',  67, 89], ['13:00',  50, 45], ['14:00',  50, 0], ['15:00',  36, 0]]
    return render(request, 'datenanalyse.html', {'data': d})

# ---------------------API---------------------


def testapi(request):
    data = [['Uhrzeit', 'Kundenzahl Schnitt', 'Kundenzahl'], ['9:00',  1, 1], ['10:00',  2, 3], [
        '11:00',  19, 16], ['12:00',  67, 89], ['13:00',  50, 45], ['14:00',  50, 0], ['15:00',  36, 0]]
    #data = [['9:00',  1, 1], ['10:00',  2, 3], ['11:00',  17, 16], ['12:00',  7, 89], ['13:00',  0, 45]]

    return JsonResponse(data, safe=False)


def chart_ios(request):
    # data = [{"heute": [1, 2, 19, 67, 50, 50, 36],
    # "schnitt": [1, 3, 16, 89, 45, 50, 0], "uhrzeit": ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']}]
    data = [{"heute": [1, 2, 19, 67, 50, 50, 36],
            "schnitt": [1, 3, 16, 89, 45, 50, 0], "uhrzeit": ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']}]
    j = JsonResponse(data, safe=False)
    return j


def test(request, pk, pd):
    return JsonResponse([{"test": pk, "test2": pd}], safe=False)


def homedata(request):
    data = [{"kundengerade": 54, "kundengesamt": 41, "vergleich": -5}]
    jsonString = json.dumps(data, indent=4)
    j = JsonResponse(data, safe=False)
    print("Test ", j.content)
    return j


def get_config(request):
    try:
        with open('Settings.json') as file:
            data = [json.load(file)]
            print(data)
            j = JsonResponse(data, safe=False)
            return j
    except:
        print("Configfile not found")
        return JsonResponse([{"nothing": "found"}], safe=False)


def get_chartdata(request, start, end):
    data = chart_vonbis(start, end)
    r = request
    j = JsonResponse(data, safe=False, )
    return j


def get_chartdata2(request, start):
    data = chart_vonbis2(start)
    r = request
    j = JsonResponse(data, safe=False)
    return j


def get_date_of_first_entry(request):
    data = [{"frist": str(time_of_first_entry())}]
    j = JsonResponse(data, safe=False)
    return j


def move_line_up(request):
    global corY
    corY = corY - 10
    print("down")
    with open('/home/pi/Skripte/FrequenzmesserIK0.3/Settings.json') as f:
        data = json.load(f)
    data["pos"] = corY

    with open('/home/pi/Skripte/FrequenzmesserIK0.3/Settings.json', 'w') as f:
        json.dump(data, f)
    return livecamera(request)


def move_line_down(request):
    global corY
    corY = corY + 10
    print("down")
    with open('/home/pi/Skripte/FrequenzmesserIK0.3/Settings.json') as f:
        data = json.load(f)
    data["pos"] = corY

    with open('/home/pi/Skripte/FrequenzmesserIK0.3/Settings.json', 'w') as f:
        json.dump(data, f)
    return livecamera(request)


def deactivateFIK(day):
    with open('/home/pi/Skripte/FrequenzmesserIK0.3/Settings.json') as f:
        data = json.load(f)
    data["timestart"][day] = 9999

    with open('/home/pi/Skripte/FrequenzmesserIK0.3/Settings.json', 'w') as f:
        json.dump(data, f)
    return True


def updateFIK(day, start, end):
    with open('/home/pi/Skripte/FrequenzmesserIK0.3/Settings.json') as f:
        data = json.load(f)
    startI = start[0] + start[1] + start[3] + start[4]
    endI = end[0] + end[1] + end[3] + end[4]
    data["timestart"][day] = int(startI)
    data["timeend"][day] = int(endI)

    with open('/home/pi/Skripte/FrequenzmesserIK0.3/Settings.json', 'w') as f:
        json.dump(data, f)
    return True

# ---------------------Datenbankdaten aufbereiten---------------------


def time_of_first_entry():
    dbc = DBController()
    # Richtige Daten eintragen
    data = dbc.query(
        "SELECT column_name FROM table_name ORDER BY column_name ASC LIMIT 1;")
    return data[0][0]


def chart_vonbis(start, end):
    # SQL-Abfrage Monat in 'mm-dd-yyyy' Format
    dbc = DBController()
    print(start, end)
    # Richtige Daten eintragen
    data = dbc.query(
        f"select kundenzahl, DATE_FORMAT(Datum, '%H %i') from daten where Date(Datum) BETWEEN date(\"{start}\") AND date(\"{end}\")")
    print(data)
    #data = dbc.query(f"select kundenzahl, date(Datum) from daten ")
    return data


def chart_vonbis2(start=""):
    # SQL-Abfrage Monat in 'mm-dd-yyyy' Format
    dbc = DBController()
    # Richtige Daten eintragen

    data = dbc.query(
        f"select kundenzahl from daten where Datum BETWEEN {start[:9]} AND {start[10:]}")
    return data


def gesamtZahlHeute():
    dbc = DBController()
    # richtige Daten eintragen!!!!

    data = dbc.query(
        "select kundenzahl from daten where DATE(Datum) = curdate();")

    gesamtZahlKunden = 0
    letzterWert = 0

    for d in data:
        if (d[0] > letzterWert):
            gesamtZahlKunden += 1
        letzterWert = d[0]

    return gesamtZahlKunden


def kundenzahlInLaden():
    dbc = DBController()
    # richtige Daten eintragen!!!!
    data = dbc.query("select kundenzahl from daten ORDER BY id DESC LIMIT 1;")

    return data[0][0]


def vergleichVorwoche():
    dbc = DBController()
    # richtige Daten eintragen!!!!
    kundenzahlVorwocheData = dbc.query(
        "select kundenzahl from daten where Datum between curdate() - interval 7 day + '00:00:00' and now() - interval 7 day")
    gesamtZahlKundenVorwoche = 0
    letzterWert = 0

    for d in kundenzahlVorwocheData:
        if (d[0] > letzterWert):
            gesamtZahlKundenVorwoche += 1
        letzterWert = d[0]

    return gesamtZahlKundenVorwoche


# ---------------------Livecamera---------------------
cam = LCSupport.cam()
updateCam = False
# Starten des Livefeeds


@gzip.gzip_page
def livecamera(request):
    try:
        global cam
        #cam = LCSupport.cam()
        global updateCam
        updateCam = True
        print("camera started")
        return StreamingHttpResponse(generateFeed(cam), content_type="multipart/x-mixed-replace;boundary=frame")
    except Exception as e:
        print("Error: Camera did not load")
        print(e)
        pass
    return render(request, 'base/index.html')

# Beenden des Livefeeds


def stoplivecamera(request):
    global cam
    del cam
    global updateCam
    updateCam = False
    print("camera off")
    return JsonResponse([{}], safe=False)
# Live camera feed


def generateFeed(camera):
    print("generateFeed")
    global corY
    while updateCam:
        frame = camera.get_frame(corY)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        sleep(0.3)
    print("end generateFeed")


"""def home(request):
    rooms = Room.objects.all() 
    context = {'rooms': rooms}
    return render(request, 'base/home.html', context)
def room(request, pk):
    room = Room.objects.get(id=pk)
    context = {'room': room}
    return render(request, 'base/room.html', context)
def createRoom(request):
    form = RoomForm()
    if request.method == 'POST':
        form = RoomForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')
    context = {'form': form}
    return render(request, 'base/room_form.html', context) 
def updateRoom(request, pk):
    room = Room.objects.get(id=pk)
    form = RoomForm(instance=room)
    if request.method == 'POST':
        form = RoomForm(request.POST, instance=room)
        if form.is_valid():
            form.save()
            return redirect('home')
    context = {'form': form}
    return render(request, 'base/room_form.html', context)"""
