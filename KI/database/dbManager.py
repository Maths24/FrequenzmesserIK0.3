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
               "VALUE (%s)")
        sql = f"INSERT INTO daten (kundenzahl) VALUE ({amount}"
        val = (amount)
        self.cursor.execute(sql)

        self.mydb.commit()
