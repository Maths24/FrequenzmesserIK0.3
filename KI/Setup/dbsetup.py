import mysql.connector

mydb = mysql.connector.connect (
    host = "localhost",
    user = "root",
    password = "himbeertorteDB",
    database="kundenzaehler"
)
print(mydb)



mycursor = mydb.cursor()

#mycursor.execute("CREATE TABLE daten (id INT AUTO_INCREMENT PRIMARY KEY, Datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP, kundenzahl INT)")
#mycursor.execute("SHOW COLUMNS FROM daten")

#sql = "INSERT INTO daten (kundenzahl) VALUES (i)"
for i in range(1,10):
    val = "INSERT INTO daten (kundenzahl) VALUES (" + str(i) + ")"

    mycursor.execute(val)

mydb.commit()
#for x in mycursor:
#    print(x)

