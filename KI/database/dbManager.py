import mysql.connector


class DBManager:

    def __init__(self) -> None:
        print("database started")
        self.mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="himbeertorteDB",
            database="kundenzaehler"
        )
        self.cursor = self.mydb.cursor()

    def addToDB(self, amount):

        sql = ("INSERT INTO daten (kundenzahl)"
               "VALUES (%s)")
        val = (amount)
        self.cursor.execute(sql, val)

        self.mydb.commit()
