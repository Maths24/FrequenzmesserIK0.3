import mysql.connector


class DBManager:

    def __init__(self) -> None:
        print("database started")

    def addToDB(self, amount):
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="himbeertorteDB",
            database="kundenzaehler"
        )
        cursor = mydb.cursor()

        sql = "INSERT INTO daten (kundenzahl) VALUES (%s)"
        val = (amount)
        cursor.execute(sql, val)

        mydb.commit()
